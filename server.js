const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const BASE = 'https://v2.samehadaku.how';
const PROXY = 'https://cors.caliph.my.id';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function proxyUrl(url) {
  if (!url) return '';
  const full = url.startsWith('http') ? url : `${BASE}${url}`;
  return `${PROXY}/${full}`;
}

async function animeterbaru(page = 1) {
  const res = await axios.get(proxyUrl(`${BASE}/anime-terbaru/page/${page}/`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const data = [];
  $('.post-show ul li').each((_, e) => {
    const a = $(e).find('.dtla h2 a');
    data.push({
      title: a.text().trim(),
      url: a.attr('href') || '',
      image: $(e).find('.thumb img').attr('src') || $(e).find('.thumb img').attr('data-src') || '',
      episode: $(e).find('.dtla span:contains("Episode")').text().replace('Episode', '').trim(),
    });
  });
  return data;
}

async function searchAnime(query) {
  const res = await axios.get(proxyUrl(`${BASE}/?s=${encodeURIComponent(query)}`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const data = [];
  $('.animpost').each((_, e) => {
    data.push({
      title: $(e).find('.data .title h2').text().trim() || $(e).find('h2').text().trim(),
      image: $(e).find('.content-thumb img').attr('src') || $(e).find('img').attr('src') || '',
      type: $(e).find('.type').text().trim(),
      score: $(e).find('.score').text().trim(),
      url: $(e).find('a').attr('href') || '',
    });
  });
  return data;
}

async function detail(link) {
  const targetUrl = link.startsWith('http') ? link : `${BASE}${link}`;
  const res = await axios.get(`${PROXY}/${targetUrl}`, { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const episodes = [];
  $('.lstepsiode ul li').each((_, e) => {
    episodes.push({
      title: $(e).find('.epsleft .lchx a').text().trim(),
      url: $(e).find('.epsleft .lchx a').attr('href') || '',
      date: $(e).find('.epsleft .date').text().trim(),
    });
  });
  if (episodes.length === 0) {
    $('#episodelist li, .eplister li').each((_, e) => {
      const a = $(e).find('a');
      episodes.push({ title: a.text().trim(), url: a.attr('href') || '', date: $(e).find('.date').text().trim() });
    });
  }
  const info = {};
  $('.anim-senct .right-senc .spe span, .spe span, .infox .spe span').each((_, e) => {
    const t = $(e).text();
    if (t.includes(':')) {
      const idx = t.indexOf(':');
      const k = t.substring(0, idx).trim().toLowerCase().replace(/\s+/g, '_');
      const v = t.substring(idx + 1).trim();
      if (k && v) info[k] = v;
    }
  });
  return {
    title: $('h1.entry-title, h1').first().text().trim() || $('title').text().replace(/[-–].*Samehadaku.*/i, '').trim(),
    image: $('meta[property="og:image"]').attr('content') || $('.thumb img').attr('src') || '',
    description: $('.entry-content p').first().text().trim() || $('meta[name="description"]').attr('content') || '',
    episodes,
    info,
  };
}

async function watchEpisode(link) {
  const targetUrl = link.startsWith('http') ? link : `${BASE}${link}`;
  const res = await axios.get(`${PROXY}/${targetUrl}`, { headers, timeout: 20000 });
  const cookies = res.headers['set-cookie']?.map(v => v.split(';')[0]).join('; ') || '';
  const $ = cheerio.load(res.data);
  const streams = [];
  const serverItems = $('div#server > ul > li').toArray();
  for (const li of serverItems) {
    const div = $(li).find('div');
    const post = div.attr('data-post');
    const nume = div.attr('data-nume');
    const type = div.attr('data-type');
    const name = $(li).find('span').text().trim() || `Server ${streams.length + 1}`;
    if (!post) continue;
    const body = new URLSearchParams({ action: 'player_ajax', post, nume, type }).toString();
    try {
      const r = await axios.post(`${PROXY}/${BASE}/wp-admin/admin-ajax.php`, body, {
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookies, 'Referer': targetUrl, 'Origin': BASE },
        timeout: 15000,
      });
      const $$ = cheerio.load(r.data);
      const iframe = $$('iframe').attr('src') || $$('iframe').attr('data-src') || '';
      const cleanSrc = iframe.startsWith('//') ? 'https:' + iframe : iframe;
      if (cleanSrc) streams.push({ server: name, url: cleanSrc });
    } catch (e) { console.log('Server error:', name, e.message); }
  }
  if (streams.length === 0) {
    $('iframe').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const full = src.startsWith('//') ? 'https:' + src : src;
      if (full.startsWith('http')) streams.push({ server: 'Default', url: full });
    });
  }
  let prevEp = '', nextEp = '';
  $('.naveps a, .navpost a').each((_, el) => {
    const cls = $(el).attr('class') || '';
    const href = $(el).attr('href') || '';
    if (cls.includes('prev') || $(el).text().toLowerCase().includes('sebelum')) prevEp = href;
    if (cls.includes('next') || $(el).text().toLowerCase().includes('selanjut')) nextEp = href;
  });
  const downloads = [];
  $('.download ul li').each((_, el) => {
    const quality = $(el).find('strong, b').text().trim();
    const links = [];
    $(el).find('a').each((__, a) => {
      const host = $(a).text().trim();
      const href = $(a).attr('href') || '';
      if (host && href) links.push({ host, href });
    });
    if (links.length) downloads.push({ quality: quality || 'Download', links });
  });
  let animeLink = '';
  $('.breadcrumb a, .bchead a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href && href !== BASE && href !== BASE + '/') animeLink = href;
  });
  return {
    title: $('h1[itemprop="name"], h1.entry-title, h1').first().text().trim(),
    streams, prevEp, nextEp, animeLink, downloads,
  };
}

// TOP 10
async function top10() {
  const res = await axios.get(proxyUrl(`${BASE}/top10/`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const data = [];
  const selectors = ['.top-list li', '.toplist li', '.rank-list li', '.ranking li', 'ol li', '.post-show ul li', '.animpost'];
  for (const sel of selectors) {
    if ($(sel).length > 0) {
      $(sel).each((i, e) => {
        const a = $(e).find('a').first();
        const title = a.attr('title') || a.text().trim() || $(e).find('h2,h3,.title,.name').text().trim();
        const url = a.attr('href') || '';
        const image = $(e).find('img').attr('src') || $(e).find('img').attr('data-src') || '';
        const rank = $(e).find('.rank,.number,.num').text().trim() || String(i + 1);
        const score = $(e).find('.score,.rating,.vote').text().trim() || '';
        if (title && url) data.push({ rank: rank || String(i + 1), title, url, image, score });
      });
      if (data.length > 0) break;
    }
  }
  return data;
}

// ANIME MOVIE
async function animeMovie(page = 1) {
  const res = await axios.get(proxyUrl(`${BASE}/anime-movie/page/${page}/`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const data = [];
  const selectors = ['.animpost', '.bsx', '.post-show ul li', '.bs'];
  for (const sel of selectors) {
    if ($(sel).length > 0) {
      $(sel).each((_, e) => {
        const a = $(e).find('a').first();
        const title = $(e).find('.data .title h2, .tt, h2').first().text().trim() || a.attr('title') || '';
        const url = a.attr('href') || '';
        const image = $(e).find('img').attr('src') || $(e).find('img').attr('data-src') || '';
        const score = $(e).find('.score,.rating').text().trim() || '';
        const status = $(e).find('.status,.type').text().trim() || '';
        if (title && url) data.push({ title, url, image, score, status });
      });
      if (data.length > 0) break;
    }
  }
  const hasNext = $('a[rel="next"], .next a, .nav-links .next').length > 0;
  return { data, hasNext };
}

// JADWAL RILIS
async function jadwalRilis() {
  const res = await axios.get(proxyUrl(`${BASE}/jadwal-rilis/`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const schedule = {};
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  $('[class*="day"], [id*="day"], .schedule-day, .hari').each((_, dayEl) => {
    const dayName = $(dayEl).find('h2,h3,.day-name,.hari-name').first().text().trim();
    const animes = [];
    $(dayEl).find('li, .schedule-item, .anime-item').each((_, item) => {
      const a = $(item).find('a').first();
      const title = a.text().trim() || $(item).text().trim();
      const url = a.attr('href') || '';
      const time = $(item).find('.time,.jam').text().trim() || '';
      if (title) animes.push({ title, url, time });
    });
    if (dayName && animes.length) schedule[dayName] = animes;
  });

  if (Object.keys(schedule).length === 0) {
    $('h2, h3').each((_, hEl) => {
      const hText = $(hEl).text().trim();
      const matchedDay = days.find(d => hText.toLowerCase().includes(d.toLowerCase()));
      if (matchedDay) {
        const animes = [];
        $(hEl).nextAll('ul, ol').first().find('li').each((_, li) => {
          const a = $(li).find('a').first();
          const title = a.text().trim() || $(li).text().trim();
          const url = a.attr('href') || '';
          const time = $(li).find('.time,.jam').text().trim() || '';
          if (title) animes.push({ title, url, time });
        });
        if (animes.length) schedule[matchedDay] = animes;
      }
    });
  }

  if (Object.keys(schedule).length === 0) {
    $('table').first().find('tr').each((rowIdx, row) => {
      if (rowIdx === 0) return;
      $(row).find('td').each((colIdx, td) => {
        const day = days[colIdx];
        if (!day) return;
        if (!schedule[day]) schedule[day] = [];
        $(td).find('a, li').each((_, item) => {
          const a = $(item).is('a') ? $(item) : $(item).find('a').first();
          const title = a.text().trim() || $(item).text().trim();
          const url = a.attr('href') || '';
          if (title) schedule[day].push({ title, url, time: '' });
        });
      });
    });
  }

  return schedule;
}

// ROUTES
app.get('/api/latest', async (req, res) => {
  try { res.json(await animeterbaru(req.query.page || 1)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/search', async (req, res) => {
  try { res.json(await searchAnime(req.query.q || '')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/detail', async (req, res) => {
  try { res.json(await detail(req.query.url || '')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/watch', async (req, res) => {
  try { res.json(await watchEpisode(req.query.url || '')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/top10', async (req, res) => {
  try { res.json(await top10()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/movie', async (req, res) => {
  try { res.json(await animeMovie(req.query.page || 1)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/jadwal', async (req, res) => {
  try { res.json(await jadwalRilis()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/home', async (req, res) => {
  try {
    const [latest, topten] = await Promise.all([animeterbaru(1), top10()]);
    res.json({ latest, topten });
  } catch (e) { res.status(500).json({ error: e.message, latest: [], topten: [] }); }
});
app.get('/api/debug', async (req, res) => {
  try {
    const res2 = await axios.get(proxyUrl(`${BASE}/anime-terbaru/`), { headers, timeout: 20000 });
    const $ = cheerio.load(res2.data);
    res.json({ ok: true, size: res2.data.length, title: $('title').text(), postShowLi: $('.post-show ul li').length, animpost: $('.animpost').length });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

module.exports = app;
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Moli server running at http://localhost:${PORT}`));
}
