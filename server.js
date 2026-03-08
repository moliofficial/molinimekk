const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

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

// ============================================================
// SCRAPER FUNCTIONS
// ============================================================

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
      episodes.push({
        title: a.text().trim(),
        url: a.attr('href') || '',
        date: $(e).find('.date').text().trim(),
      });
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

  const genres = [];
  $('a[href*="/genres/"], a[href*="/genre/"]').each((_, e) => {
    const name = $(e).text().trim();
    const href = $(e).attr('href') || '';
    if (name && !genres.find(g => g.name === name)) genres.push({ name, href });
  });

  return {
    title: $('h1.entry-title, h1').first().text().trim() || $('title').text().replace(/[-–].*Samehadaku.*/i, '').trim(),
    image: $('meta[property="og:image"]').attr('content') || $('.thumb img').attr('src') || '',
    description: $('.entry-content p').first().text().trim() || $('meta[name="description"]').attr('content') || '',
    episodes,
    genres,
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
      const r = await axios.post(
        `${PROXY}/${BASE}/wp-admin/admin-ajax.php`,
        body,
        {
          headers: {
            ...headers,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies,
            'Referer': targetUrl,
            'Origin': BASE,
          },
          timeout: 15000,
        }
      );
      const $$ = cheerio.load(r.data);
      const iframe = $$('iframe').attr('src') || $$('iframe').attr('data-src') || '';
      const cleanSrc = iframe.startsWith('//') ? 'https:' + iframe : iframe;
      if (cleanSrc) streams.push({ server: name, url: cleanSrc });
    } catch (e) {
      console.log('Server error:', name, e.message);
    }
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
    streams,
    prevEp,
    nextEp,
    animeLink,
    downloads,
  };
}

async function genreList() {
  const res = await axios.get(proxyUrl(BASE), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const genres = [];
  $('a[href*="/genres/"]').each((_, el) => {
    const name = $(el).text().trim();
    const href = $(el).attr('href') || '';
    const slug = href.replace(/.*\/genres\//, '').replace(/\/$/, '');
    if (name && slug && name.length < 40 && !genres.find(g => g.slug === slug)) {
      genres.push({ name, slug, href });
    }
  });
  return genres;
}

async function genrePage(slug, page = 1) {
  const res = await axios.get(proxyUrl(`${BASE}/genres/${slug}/page/${page}/`), { headers, timeout: 20000 });
  const $ = cheerio.load(res.data);
  const animes = [];
  $('.animpost, .bsx, .bs').each((_, e) => {
    const title = $(e).find('.data .title h2, .tt, h2').first().text().trim() || $(e).find('a').attr('title') || '';
    const link  = $(e).find('a').first().attr('href') || '';
    const image = $(e).find('img').attr('src') || $(e).find('img').attr('data-src') || '';
    const episode = $(e).find('.epx, .ep, .episode').text().trim() || '';
    if (title && link) animes.push({ title, url: link, image, episode });
  });
  const hasNext = $('a[rel="next"], .next a').length > 0;
  return { animes, hasNext };
}

// ============================================================
// ROUTES
// ============================================================

app.get('/api/latest', async (req, res) => {
  try {
    const data = await animeterbaru(req.query.page || 1);
    res.json(data);
  } catch (e) {
    console.error('latest:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const data = await searchAnime(req.query.q || '');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/detail', async (req, res) => {
  try {
    const data = await detail(req.query.url || '');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/watch', async (req, res) => {
  try {
    const data = await watchEpisode(req.query.url || '');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/genres', async (req, res) => {
  try {
    const genres = await genreList();
    res.json({ genres });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/genre/:slug', async (req, res) => {
  try {
    const data = await genrePage(req.params.slug, req.query.page || 1);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/home', async (req, res) => {
  try {
    const [latest, genres] = await Promise.all([
      animeterbaru(1),
      genreList(),
    ]);
    res.json({ latest, genres });
  } catch (e) {
    res.status(500).json({ error: e.message, latest: [], genres: [] });
  }
});

app.get('/api/debug', async (req, res) => {
  try {
    const res2 = await axios.get(proxyUrl(`${BASE}/anime-terbaru/`), { headers, timeout: 20000 });
    const $ = cheerio.load(res2.data);
    res.json({
      ok: true,
      size: res2.data.length,
      title: $('title').text(),
      postShowLi: $('.post-show ul li').length,
      animpost: $('.animpost').length,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('*', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🌸 Rapinime server jalan di http://localhost:${PORT}`));
}
