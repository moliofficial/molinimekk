/* ============================================================
   KMOLI — app.js (Minecraft Style + Riwayat + Episode Panel)
   ============================================================ */

// ============================================================
// NAVBAR SCROLL
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});
document.getElementById('navSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================================
// RIWAYAT NONTON (localStorage)
// ============================================================
const HISTORY_KEY = 'kmoli_history';
const PROGRESS_KEY = 'kmoli_progress';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function addHistory(entry) {
  // entry: { epUrl, epTitle, animeUrl, animeTitle, image, timestamp, progress, duration }
  let list = getHistory();
  list = list.filter(h => h.epUrl !== entry.epUrl);
  list.unshift(entry);
  if (list.length > 50) list = list.slice(0, 50);
  saveHistory(list);
}

function updateProgress(epUrl, seconds, duration) {
  const prog = getProgress();
  prog[epUrl] = { seconds, duration, pct: duration > 0 ? Math.min(100, Math.round(seconds / duration * 100)) : 0 };
  saveProgress(prog);
  // Update history progress too
  let list = getHistory();
  const idx = list.findIndex(h => h.epUrl === epUrl);
  if (idx >= 0) {
    list[idx].progress = prog[epUrl];
    saveHistory(list);
  }
}

function getProgressFor(epUrl) {
  const prog = getProgress();
  return prog[epUrl] || null;
}

function formatSeconds(sec) {
  if (!sec || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTimeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

// ============================================================
// PAGE ROUTER
// ============================================================
let currentPage = 'home';
let latestPage = 1;
let _genrePage = 1;
let currentGenreSlug = '';
let currentGenreName = '';

const pages = ['home', 'latest', 'search', 'genres', 'genre-detail', 'detail', 'watch', 'history'];

function showPage(name, pushState = true) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  currentPage = name;
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// HOME
// ============================================================
async function loadHome() {
  try {
    const res = await fetch('/api/home');
    const data = await res.json();
    renderLatestGrid('homeLatestGrid', data.latest || [], true);
    renderGenreChips('homeGenreChips', data.genres || []);
  } catch (e) {
    document.getElementById('homeLatestGrid').innerHTML = errorState('Gagal memuat data home.');
  }
  renderHomeHistory();
}

function renderHomeHistory() {
  const list = getHistory().slice(0, 6);
  const sec = document.getElementById('homeHistorySection');
  if (!sec) return;
  if (!list.length) { sec.innerHTML = ''; return; }
  const prog = getProgress();
  sec.innerHTML = `
    <div class="section" style="padding-top:0">
      <div class="section-header">
        <h2 class="section-title"><span class="title-icon">📖</span>LANJUTKAN NONTON</h2>
        <a href="#" class="see-all" onclick="showPage('history')">LIHAT SEMUA →</a>
      </div>
      <div class="history-panel">
        <div class="history-list">
          ${list.map(h => historyItemHtml(h, prog[h.epUrl])).join('')}
        </div>
      </div>
    </div>
  `;
}

function historyItemHtml(h, p) {
  const pct = p ? p.pct : 0;
  const timeStr = p && p.seconds ? formatSeconds(p.seconds) : '';
  return `
    <div class="history-item" onclick="loadWatch('${esc(h.epUrl)}','${esc(h.epTitle)}','${esc(h.animeUrl)}')">
      <img class="history-thumb" src="${esc(h.image)}" alt="${esc(h.animeTitle)}" onerror="this.src='https://via.placeholder.com/44x62/1a1a1a/5aac27?text=?'" />
      <div class="history-info">
        <div class="history-title">${esc(h.animeTitle)}</div>
        <div class="history-ep">${esc(h.epTitle)}</div>
        <div class="history-time">${timeStr ? `⏱ ${timeStr}` : ''} ${formatTimeAgo(h.timestamp)}</div>
        <div class="history-progress-bar"><div class="history-progress-fill" style="width:${pct}%"></div></div>
      </div>
    </div>
  `;
}

// ============================================================
// LATEST
// ============================================================
async function loadLatest(page = 1) {
  latestPage = page;
  showPage('latest');
  document.getElementById('latestGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/latest?page=${page}`);
    const data = await res.json();
    renderLatestGrid('latestGrid', data);
    renderPagination('latestPagination', page, data.length >= 10, (p) => loadLatest(p));
  } catch (e) {
    document.getElementById('latestGrid').innerHTML = errorState('Gagal memuat episode terbaru.');
  }
}

// ============================================================
// SEARCH
// ============================================================
async function doSearch() {
  const q = document.getElementById('navSearch').value.trim();
  if (!q) return;
  showPage('search');
  document.getElementById('searchDesc').textContent = `Hasil untuk: "${q}"`;
  document.getElementById('searchGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!data.length) {
      document.getElementById('searchGrid').innerHTML = emptyState('❓', 'TIDAK DITEMUKAN', `Tidak ada anime dengan kata kunci "${q}"`);
    } else {
      renderSearchGrid('searchGrid', data);
    }
  } catch (e) {
    document.getElementById('searchGrid').innerHTML = errorState('Pencarian gagal.');
  }
}

// ============================================================
// GENRES
// ============================================================
async function loadGenres() {
  showPage('genres');
  document.getElementById('genreGrid').innerHTML = `<div class="loading-wrap"><div class="spinner"></div><span>Memuat genre...</span></div>`;
  try {
    const res = await fetch('/api/genres');
    const data = await res.json();
    renderGenreGrid(data.genres || []);
  } catch (e) {
    document.getElementById('genreGrid').innerHTML = errorState('Gagal memuat genre.');
  }
}

async function loadGenreDetail(slug, name, page = 1) {
  _genrePage = page;
  currentGenreSlug = slug;
  currentGenreName = name;
  showPage('genre-detail');
  document.getElementById('genreDetailTitle').innerHTML = `<span class="title-icon">📦</span>${name}`;
  document.getElementById('genreDetailGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/genre/${slug}?page=${page}`);
    const data = await res.json();
    renderSearchGrid('genreDetailGrid', data.animes || []);
    renderPagination('genreDetailPagination', page, data.hasNext, (p) => loadGenreDetail(slug, name, p));
  } catch (e) {
    document.getElementById('genreDetailGrid').innerHTML = errorState('Gagal memuat genre.');
  }
}

// ============================================================
// DETAIL
// ============================================================
async function loadDetail(url) {
  showPage('detail');
  document.getElementById('detailContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat detail...</span></div>`;
  try {
    const res = await fetch(`/api/detail?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderDetail(data, url);
  } catch (e) {
    document.getElementById('detailContent').innerHTML = errorState('Gagal memuat detail anime.');
  }
}

function renderDetail(data, url) {
  const prog = getProgress();
  const genreTags = (data.genres || []).map(g => {
    const slug = g.href ? g.href.replace(/.*\/genres\//, '').replace(/\/$/, '') : '';
    return `<span class="genre-tag" onclick="loadGenreDetail('${slug}', '${esc(g.name)}')">${esc(g.name)}</span>`;
  }).join('');

  const metaHtml = Object.entries(data.info || {}).slice(0, 8).map(([k, v]) => `
    <div class="meta-item">
      <div class="meta-key">${esc(k.replace(/_/g,' '))}</div>
      <div class="meta-val">${esc(v)}</div>
    </div>
  `).join('');

  const epHtml = (data.episodes || []).map(ep => {
    const p = prog[ep.url];
    const pct = p ? p.pct : 0;
    const timeStr = p && p.seconds ? ` ⏱${formatSeconds(p.seconds)}` : '';
    return `
      <div class="ep-item" onclick="loadWatch('${esc(ep.url)}', '${esc(ep.title)}', '${esc(url)}', ${JSON.stringify(esc(data.title))}, ${JSON.stringify(esc(data.image))}, ${JSON.stringify(data.episodes || [])})">
        <div class="ep-play-icon">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div class="ep-info">
          <div class="ep-title">${esc(ep.title)}${timeStr ? `<span style="font-size:11px;color:var(--mc-gold);margin-left:6px;">${timeStr}</span>` : ''}</div>
          <div class="ep-date">${esc(ep.date)}</div>
          ${pct > 0 ? `<div class="watch-ep-progress-bar"><div class="watch-ep-progress-fill" style="width:${pct}%"></div></div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-wrapper">
      <button class="back-btn" onclick="history.go(-1)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        KEMBALI
      </button>
      <div class="detail-hero">
        <div class="detail-poster">
          <img src="${esc(data.image)}" alt="${esc(data.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x280/1a1a1a/5aac27?text=?'" />
        </div>
        <div class="detail-info">
          <h1 class="detail-title">${esc(data.title)}</h1>
          <div class="detail-genres">${genreTags}</div>
          <p class="detail-desc">${esc(data.description || 'Tidak ada deskripsi.')}</p>
          <div class="detail-meta-grid">${metaHtml}</div>
        </div>
      </div>
      <div class="glow-line"></div>
      <br/>
      <div class="ep-section-title">
        <span class="title-icon">📺</span>
        DAFTAR EPISODE
        <span class="ep-count">${data.episodes ? data.episodes.length : 0} EPS</span>
      </div>
      <div class="episode-list">
        ${epHtml || `<div class="empty-state"><span class="empty-icon">📭</span><p class="empty-title">BELUM ADA EPISODE</p></div>`}
      </div>
    </div>
  `;
}

// ============================================================
// WATCH
// ============================================================
let currentWatchData = null;
let currentAnimeUrl = '';
let currentAnimeTitle = '';
let currentAnimeImage = '';
let currentEpisodes = [];
let progressInterval = null;

async function loadWatch(url, title, animeUrl, animeTitle, animeImage, episodes) {
  showPage('watch');
  currentAnimeUrl = animeUrl || '';
  currentAnimeTitle = animeTitle || '';
  currentAnimeImage = animeImage || '';
  currentEpisodes = episodes || [];
  document.getElementById('watchContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat player...</span></div>`;
  try {
    const res = await fetch(`/api/watch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderWatch(data, url, title || data.title);
    // Add to history
    addHistory({
      epUrl: url,
      epTitle: title || data.title || '',
      animeUrl: animeUrl || data.animeLink || '',
      animeTitle: animeTitle || data.title || '',
      image: animeImage || '',
      timestamp: Date.now(),
    });
  } catch (e) {
    document.getElementById('watchContent').innerHTML = errorState('Gagal memuat video player.');
  }
}

let currentStreams = [];
let currentStreamIdx = 0;
let currentEpUrl = '';

function renderWatch(data, url, title) {
  currentWatchData = data;
  currentEpUrl = url;
  currentStreams = data.streams || [];
  currentStreamIdx = 0;
  if (progressInterval) clearInterval(progressInterval);

  const serverTabsHtml = currentStreams.map((s, i) => `
    <button class="server-tab ${i===0?'active':''}" onclick="switchServer(${i}, this)">${esc(s.server)}</button>
  `).join('');

  const dlHtml = (data.downloads || []).map(group => `
    <div class="dl-group">
      <div class="dl-quality">🎬 ${esc(group.quality)}</div>
      <div class="dl-links">
        ${(group.links || []).map(l => `<a class="dl-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.host)}</a>`).join('')}
      </div>
    </div>
  `).join('');

  const videoHtml = currentStreams.length > 0
    ? `<iframe src="${esc(currentStreams[0].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`
    : `<div class="no-stream"><div class="no-stream-icon">📡</div><span>STREAM TIDAK TERSEDIA</span><span style="font-size:12px;opacity:0.5">Coba server lain</span></div>`;

  // Build episode list from currentEpisodes or fallback
  const epListItems = currentEpisodes.length > 0
    ? currentEpisodes.map(ep => buildWatchEpItem(ep, url)).join('')
    : '<div style="padding:20px;font-family:var(--font-pixel);font-size:8px;color:var(--mc-stone);text-shadow:1px 1px 0 #000;text-align:center;">BUKA DETAIL<br/>UNTUK LIST EP</div>';

  const prog = getProgressFor(url);
  const savedSec = prog ? prog.seconds : 0;

  document.getElementById('watchContent').innerHTML = `
    <div class="watch-wrapper">
      <div class="watch-back-area">
        <button class="back-btn" onclick="${currentAnimeUrl ? `loadDetail('${esc(currentAnimeUrl)}')` : 'history.go(-1)'}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          KEMBALI
        </button>
      </div>

      <div class="watch-title-area">
        <h2 class="watch-title">📺 ${esc(data.title || title)}</h2>
      </div>

      <div class="watch-video-area">
        <div class="video-container" id="videoContainer">
          ${videoHtml}
        </div>
      </div>

      ${currentStreams.length > 1 ? `
        <div class="watch-servers-area">
          <p style="font-family:var(--font-pixel);font-size:7px;color:var(--mc-gray);margin-bottom:7px;text-shadow:1px 1px 0 #000;">SERVER:</p>
          <div class="server-tabs">${serverTabsHtml}</div>
        </div>
      ` : '<div class="watch-servers-area"></div>'}

      <div class="watch-naveps-area">
        <div class="nav-eps">
          <button class="ep-nav-btn" onclick="navEp('${esc(data.prevEp)}', '${esc(currentAnimeUrl)}')" ${!data.prevEp ? 'disabled' : ''}>
            ◀ EP SEBELUMNYA
          </button>
          <button class="ep-nav-btn" onclick="navEp('${esc(data.nextEp)}', '${esc(currentAnimeUrl)}')" ${!data.nextEp ? 'disabled' : ''}>
            EP SELANJUTNYA ▶
          </button>
        </div>
      </div>

      <div class="watch-eplist-area">
        <div class="watch-ep-panel">
          <div class="watch-ep-panel-header">📋 DAFTAR EPISODE</div>
          <div class="watch-ep-list" id="watchEpList">
            ${epListItems}
          </div>
        </div>
      </div>

      ${dlHtml ? `
        <div class="watch-download-area">
          <div class="download-section">
            <div class="download-title">⬇️ DOWNLOAD EPISODE</div>
            <div class="download-groups">${dlHtml}</div>
          </div>
        </div>
      ` : '<div class="watch-download-area"></div>'}
    </div>
  `;

  // Scroll active ep into view
  setTimeout(() => {
    const active = document.querySelector('.watch-ep-item.active');
    if (active) active.scrollIntoView({ block: 'center' });
  }, 200);

  // Auto-save progress every 5s via postMessage from iframe
  startProgressTracking(url, savedSec);
}

function buildWatchEpItem(ep, currentUrl) {
  const prog = getProgressFor(ep.url);
  const pct = prog ? prog.pct : 0;
  const timeStr = prog && prog.seconds ? ` ⏱${formatSeconds(prog.seconds)}` : '';
  const isActive = ep.url === currentUrl || esc(ep.url) === esc(currentUrl);
  return `
    <div class="watch-ep-item ${isActive ? 'active' : ''}" 
         onclick="loadWatch('${esc(ep.url)}', '${esc(ep.title)}', '${esc(currentAnimeUrl)}', ${JSON.stringify(esc(currentAnimeTitle))}, ${JSON.stringify(esc(currentAnimeImage))}, currentEpisodes)">
      <div class="watch-ep-item-title">${esc(ep.title)}${timeStr ? `<span style="color:var(--mc-gold);font-size:11px;"> ${timeStr}</span>` : ''}</div>
      ${pct > 0 ? `<div class="watch-ep-progress-bar"><div class="watch-ep-progress-fill" style="width:${pct}%"></div></div>` : ''}
    </div>
  `;
}

function navEp(epUrl, animeUrl) {
  if (!epUrl) return;
  loadWatch(epUrl, '', animeUrl || currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}

function switchServer(idx, btn) {
  if (!currentStreams[idx]) return;
  currentStreamIdx = idx;
  document.querySelectorAll('.server-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  const container = document.getElementById('videoContainer');
  if (container) {
    container.innerHTML = `<iframe src="${esc(currentStreams[idx].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`;
  }
}

// ============================================================
// PROGRESS TRACKING
// ============================================================
let _progressSec = 0;
let _progressDur = 0;

function startProgressTracking(epUrl, startSec) {
  if (progressInterval) clearInterval(progressInterval);
  _progressSec = startSec || 0;
  _progressDur = 0;

  // Since iframe cross-origin, we track elapsed time as approximation
  let lastSave = Date.now();
  progressInterval = setInterval(() => {
    if (document.querySelector('#videoFrame')) {
      _progressSec += 5;
      updateProgress(epUrl, _progressSec, _progressDur > 0 ? _progressDur : _progressSec + 300);
    }
  }, 5000);

  // Also listen for postMessage from player (some players send time)
  window.onmessage = (e) => {
    try {
      const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (d && typeof d.currentTime === 'number') {
        _progressSec = d.currentTime;
        if (d.duration) _progressDur = d.duration;
        updateProgress(epUrl, _progressSec, _progressDur);
      }
    } catch {}
  };
}

// ============================================================
// HISTORY PAGE
// ============================================================
function renderHistoryPage() {
  const list = getHistory();
  const prog = getProgress();
  const container = document.getElementById('historyContent');
  if (!list.length) {
    container.innerHTML = `
      <div class="history-panel">
        <div class="history-header">
          <span>📖 RIWAYAT NONTON</span>
        </div>
        <div class="history-list">
          <div class="history-empty">BELUM ADA RIWAYAT<br/><br/>Mulai nonton anime<br/>untuk muncul di sini!</div>
        </div>
      </div>`;
    return;
  }
  container.innerHTML = `
    <div class="history-panel">
      <div class="history-header">
        <span>📖 ${list.length} RIWAYAT NONTON</span>
        <button class="history-clear-btn" onclick="clearHistory()">🗑 HAPUS SEMUA</button>
      </div>
      <div class="history-list">
        ${list.map(h => historyItemHtml(h, prog[h.epUrl])).join('')}
      </div>
    </div>`;
}

function clearHistory() {
  if (!confirm('Hapus semua riwayat?')) return;
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(PROGRESS_KEY);
  renderHistoryPage();
  renderHomeHistory();
  showToast('⛏ Riwayat dihapus!');
}

// ============================================================
// RENDER HELPERS
// ============================================================
function renderLatestGrid(containerId, items, isHome = false) {
  const container = document.getElementById(containerId);
  if (!items.length) { container.innerHTML = emptyState('📦', 'BELUM ADA DATA', 'Data belum tersedia saat ini.'); return; }
  container.innerHTML = items.map(item => animeCard(item, 'latest')).join('');
}

function renderSearchGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!items.length) { container.innerHTML = emptyState('🔍', 'TIDAK DITEMUKAN', ''); return; }
  container.innerHTML = items.map(item => animeCard(item, 'detail')).join('');
}

function renderGenreChips(containerId, genres) {
  const container = document.getElementById(containerId);
  if (!genres.length) { container.innerHTML = ''; return; }
  container.innerHTML = genres.slice(0, 20).map(g => `
    <div class="genre-chip" onclick="loadGenreDetail('${esc(g.slug)}', '${esc(g.name)}')">${esc(g.name)}</div>
  `).join('');
}

function renderGenreGrid(genres) {
  const container = document.getElementById('genreGrid');
  if (!genres.length) { container.innerHTML = emptyState('📦', 'TIDAK ADA GENRE', ''); return; }
  container.innerHTML = genres.map(g => `
    <div class="genre-card" onclick="loadGenreDetail('${esc(g.slug)}', '${esc(g.name)}')">
      <div class="genre-name">${esc(g.name)}</div>
    </div>
  `).join('');
}

function animeCard(item, mode = 'detail') {
  const onclick = `loadDetail('${esc(item.url)}')`;
  const epBadge = item.episode ? `<div class="card-ep-badge">EP ${esc(item.episode)}</div>` : '';
  const typeBadge = item.type ? `<div class="card-badge">${esc(item.type)}</div>` : '';
  const scoreMeta = item.score ? `<span class="card-score">⭐ ${esc(item.score)}</span>` : '';
  return `
    <div class="anime-card" onclick="${onclick}">
      <div class="card-img-wrap">
        <img class="card-img" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"
          onerror="this.src='https://via.placeholder.com/160x224/1a1a1a/5aac27?text=?'" />
        <div class="card-overlay"></div>
        <div class="card-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        ${typeBadge}
        ${epBadge}
      </div>
      <div class="card-body">
        <div class="card-title">${esc(item.title)}</div>
        <div class="card-meta">${scoreMeta}</div>
      </div>
    </div>
  `;
}

function renderPagination(containerId, current, hasNext, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '';
  if (current > 1) html += `<button class="page-btn" onclick="(${callback.toString()})(${current - 1})">◀</button>`;
  const start = Math.max(1, current - 2);
  const end = current + 2;
  for (let i = start; i <= end; i++) {
    if (i === current) html += `<button class="page-btn active">${i}</button>`;
    else if (i >= 1) html += `<button class="page-btn" onclick="(${callback.toString()})(${i})">${i}</button>`;
  }
  if (hasNext) html += `<button class="page-btn" onclick="(${callback.toString()})(${current + 1})">▶</button>`;
  container.innerHTML = html;
}

// ============================================================
// UTILS
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function loadingState(msg = 'Memuat data...') {
  return `<div class="loading-wrap"><div class="spinner"></div><span>${msg}</span></div>`;
}
function errorState(msg) {
  return `<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">OOPS!</p><p>${msg}</p></div>`;
}
function emptyState(icon, title, msg) {
  return `<div class="empty-state" style="grid-column:1/-1"><span class="empty-icon">${icon}</span><p class="empty-title">${title}</p><p>${msg}</p></div>`;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadHome();
});

const _origShowPage = showPage;
window.showPage = function(name, push) {
  _origShowPage(name, push);
  if (name === 'latest' && !document.getElementById('latestGrid').children.length) loadLatest(1);
  if (name === 'genres' && !document.getElementById('genreGrid').children.length) loadGenres();
  if (name === 'history') renderHistoryPage();
};
