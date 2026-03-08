/* ============================================================
   RAPINIME — app.js
   SPA Frontend Logic
   ============================================================ */

// ============================================================
// CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX - 11}px, ${e.clientY - 11}px)`;
  cursorTrail.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
});

document.addEventListener('mousedown', () => {
  cursor.style.transform += ' scale(0.8)';
});
document.addEventListener('mouseup', () => {
  cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
});

// ============================================================
// SAKURA PETALS
// ============================================================
const petalsContainer = document.getElementById('petalsContainer');
const petalSymbols = ['🌸', '🌺', '✿', '❀', '🌷'];

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.fontSize = (12 + Math.random() * 14) + 'px';
  const dur = 8 + Math.random() * 12;
  petal.style.animationDuration = dur + 's';
  petal.style.animationDelay = (-Math.random() * dur) + 's';
  petalsContainer.appendChild(petal);
}

for (let i = 0; i < 18; i++) createPetal();

// ============================================================
// NAVBAR SCROLL
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// Search on Enter
document.getElementById('navSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

// ============================================================
// MOBILE MENU
// ============================================================
function toggleMenu() {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  ham.classList.toggle('open');
  menu.classList.toggle('open');
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
// PAGE ROUTER
// ============================================================
let currentPage = 'home';
let latestPage = 1;
let genrePage = 1;
let currentGenreSlug = '';
let currentGenreName = '';

const pages = ['home', 'latest', 'search', 'genres', 'genre-detail', 'detail', 'watch'];

function showPage(name, pushState = true) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  currentPage = name;

  // Update nav active link
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
  document.getElementById('searchDesc').textContent = `Hasil pencarian untuk: "${q}"`;
  document.getElementById('searchGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!data.length) {
      document.getElementById('searchGrid').innerHTML = emptyState('😢', 'Tidak Ditemukan', `Tidak ada anime dengan kata kunci "${q}"`);
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
  genrePage = page;
  currentGenreSlug = slug;
  currentGenreName = name;
  showPage('genre-detail');
  document.getElementById('genreDetailTitle').innerHTML = `<span class="title-icon">🎭</span> ${name}`;
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
  document.getElementById('detailContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat detail anime...</span></div>`;
  try {
    const res = await fetch(`/api/detail?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderDetail(data, url);
  } catch (e) {
    document.getElementById('detailContent').innerHTML = errorState('Gagal memuat detail anime.');
  }
}

function renderDetail(data, url) {
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

  const epHtml = (data.episodes || []).map(ep => `
    <div class="ep-item" onclick="loadWatch('${esc(ep.url)}', '${esc(ep.title)}', '${esc(url)}')">
      <div class="ep-play-icon">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
      <div class="ep-info">
        <div class="ep-title">${esc(ep.title)}</div>
        <div class="ep-date">${esc(ep.date)}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-wrapper">
      <button class="back-btn" onclick="history.go(-1)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        Kembali
      </button>
      <div class="detail-hero">
        <div class="detail-poster">
          <img src="${esc(data.image)}" alt="${esc(data.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/220x320/1e1e28/e91e8c?text=No+Image'" />
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
        Daftar Episode
        <span class="ep-count">${data.episodes ? data.episodes.length : 0} Eps</span>
      </div>
      <div class="episode-list">
        ${epHtml || `<div class="empty-state"><span class="empty-icon">📭</span><p>Belum ada episode tersedia.</p></div>`}
      </div>
    </div>
  `;
}

// ============================================================
// WATCH
// ============================================================
async function loadWatch(url, title, animeUrl) {
  showPage('watch');
  document.getElementById('watchContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat player...</span></div>`;
  try {
    const res = await fetch(`/api/watch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderWatch(data, url, title || data.title, animeUrl);
  } catch (e) {
    document.getElementById('watchContent').innerHTML = errorState('Gagal memuat video player.');
  }
}

let currentStreams = [];
let currentStreamIdx = 0;

function renderWatch(data, url, title, animeUrl) {
  currentStreams = data.streams || [];
  currentStreamIdx = 0;

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
    : `<div class="no-stream"><div class="no-stream-icon">📡</div><span>Stream tidak tersedia</span><span style="font-size:12px;opacity:0.5">Coba server lain atau cek kembali nanti</span></div>`;

  document.getElementById('watchContent').innerHTML = `
    <div class="watch-wrapper">
      <button class="back-btn" onclick="${animeUrl ? `loadDetail('${esc(animeUrl)}')` : 'history.go(-1)'}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
        Kembali ke Detail
      </button>
      <h2 class="watch-title">📺 ${esc(data.title || title)}</h2>

      ${currentStreams.length > 1 ? `
        <div style="margin-bottom:12px;">
          <p style="font-size:12px;color:var(--white-muted);margin-bottom:8px;">Pilih Server:</p>
          <div class="server-tabs">${serverTabsHtml}</div>
        </div>
      ` : ''}

      <div class="video-container" id="videoContainer">
        ${videoHtml}
      </div>

      <div class="nav-eps">
        <button class="ep-nav-btn" onclick="loadWatch('${esc(data.prevEp)}', '', '${esc(animeUrl || data.animeLink || '')}')" ${!data.prevEp ? 'disabled' : ''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          Ep Sebelumnya
        </button>
        <button class="ep-nav-btn" onclick="loadWatch('${esc(data.nextEp)}', '', '${esc(animeUrl || data.animeLink || '')}')" ${!data.nextEp ? 'disabled' : ''}>
          Ep Selanjutnya
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      ${dlHtml ? `
        <div class="download-section">
          <div class="download-title">⬇️ Download Episode</div>
          <div class="download-groups">${dlHtml}</div>
        </div>
      ` : ''}
    </div>
  `;
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
// RENDER HELPERS
// ============================================================
function renderLatestGrid(containerId, items, isHome = false) {
  const container = document.getElementById(containerId);
  if (!items.length) {
    container.innerHTML = emptyState('🌸', 'Belum Ada Data', 'Data belum tersedia saat ini.');
    return;
  }
  const html = items.map(item => animeCard(item, 'latest')).join('');
  container.innerHTML = isHome ? html : html;
}

function renderSearchGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!items.length) {
    container.innerHTML = emptyState('🔍', 'Tidak Ditemukan', 'Tidak ada hasil yang cocok.');
    return;
  }
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
  if (!genres.length) {
    container.innerHTML = emptyState('🎭', 'Tidak Ada Genre', '');
    return;
  }
  container.innerHTML = genres.map(g => `
    <div class="genre-card" onclick="loadGenreDetail('${esc(g.slug)}', '${esc(g.name)}')">
      <div class="genre-name">${esc(g.name)}</div>
    </div>
  `).join('');
}

function animeCard(item, mode = 'detail') {
  const onclick = mode === 'latest'
    ? `loadDetail('${esc(item.url)}')`
    : `loadDetail('${esc(item.url)}')`;

  const epBadge = item.episode ? `<div class="card-ep-badge">Ep ${esc(item.episode)}</div>` : '';
  const typeBadge = item.type ? `<div class="card-badge">${esc(item.type)}</div>` : '';
  const scoreMeta = item.score ? `<span class="card-score">⭐ ${esc(item.score)}</span>` : '';

  return `
    <div class="anime-card" onclick="${onclick}">
      <div class="card-img-wrap">
        <img class="card-img" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"
          onerror="this.src='https://via.placeholder.com/160x224/1e1e28/e91e8c?text=No+Image'" />
        <div class="card-overlay"></div>
        <div class="card-play">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
        ${typeBadge}
        ${epBadge}
      </div>
      <div class="card-body">
        <div class="card-title">${esc(item.title)}</div>
        <div class="card-meta">
          ${scoreMeta}
        </div>
      </div>
    </div>
  `;
}

function renderPagination(containerId, current, hasNext, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '';
  if (current > 1) {
    html += `<button class="page-btn" onclick="(${callback.toString()})(${current - 1})">‹</button>`;
  }
  const start = Math.max(1, current - 2);
  const end = current + 2;
  for (let i = start; i <= end; i++) {
    if (i === current) {
      html += `<button class="page-btn active">${i}</button>`;
    } else if (i >= 1) {
      html += `<button class="page-btn" onclick="(${callback.toString()})(${i})">${i}</button>`;
    }
  }
  if (hasNext) {
    html += `<button class="page-btn" onclick="(${callback.toString()})(${current + 1})">›</button>`;
  }
  container.innerHTML = html;
}

// ============================================================
// UTILS
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadingState(msg = 'Memuat data...') {
  return `<div class="loading-wrap"><div class="spinner"></div><span>${msg}</span></div>`;
}

function errorState(msg) {
  return `<div class="empty-state"><span class="empty-icon">⚠️</span><p class="empty-title">Oops!</p><p>${msg}</p></div>`;
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

// Override showPage to trigger data loading
const _origShowPage = showPage;
window.showPage = function(name, push) {
  _origShowPage(name, push);
  if (name === 'latest' && !document.getElementById('latestGrid').children.length) {
    loadLatest(1);
  }
  if (name === 'genres' && !document.getElementById('genreGrid').children.length) {
    loadGenres();
  }
};
