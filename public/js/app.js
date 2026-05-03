/* ============================================================
   MOLI — app.js (No-Emoji Edition)
   ============================================================ */

// SVG icon helpers
const ICONS = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="m15 18-6-6 6-6"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

// ============================================================
// AUTOPLAY STATE
// ============================================================
let autoplayEnabled = JSON.parse(localStorage.getItem('moli_autoplay') || 'false');

function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  localStorage.setItem('moli_autoplay', JSON.stringify(autoplayEnabled));
  const btn = document.getElementById('autoplayBtn');
  const status = document.getElementById('autoplayStatus');
  if (btn) btn.classList.toggle('on', autoplayEnabled);
  if (status) { status.textContent = autoplayEnabled ? 'ON' : 'OFF'; status.classList.toggle('on', autoplayEnabled); }
}

// ============================================================
// FIREBASE AUTH
// ============================================================
function updateNavAuth(user) {
  const area = document.getElementById('navAuthArea');
  if (!area) return;
  if (user) {
    const avatar = user.photoURL
      ? `<img src="${esc(user.photoURL)}" alt="avatar" />`
      : (user.displayName ? user.displayName[0].toUpperCase() : ICONS.user);
    area.innerHTML = `<div class="nav-avatar" onclick="showPage('setting')">${avatar}</div>`;
  } else {
    area.innerHTML = `<button class="nav-login-btn" onclick="showPage('login')">MASUK</button>`;
  }
}

function renderSettingPage(user) {
  const wrap = document.getElementById('settingWrap');
  if (!wrap) return;
  if (!user) {
    wrap.innerHTML = `
      <div class="profile-card" style="text-align:center;padding:30px;">
        <div style="margin-bottom:12px;display:flex;justify-content:center;opacity:.4">${ICONS.user}</div>
        <div style="font-family:var(--font-ui);font-size:14px;font-weight:600;letter-spacing:1px;margin-bottom:6px;">Belum Login</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">Masuk untuk menyimpan progress dan profil kamu</div>
        <button class="login-submit-btn" style="max-width:200px;margin:0 auto;" onclick="showPage('login')">MASUK / DAFTAR</button>
      </div>
      <div class="setting-card" onclick="clearHistory()">
        <div class="setting-icon">${ICONS.trash}</div>
        <div class="setting-info"><div class="setting-title">Hapus Riwayat</div><div class="setting-desc">Bersihkan semua riwayat nonton</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-card">
        <div class="setting-icon">${ICONS.bolt}</div>
        <div class="setting-info"><div class="setting-title">Tentang Moli</div><div class="setting-desc">Dark Blue Neon Edition v3.0</div></div>
        <span class="setting-badge">v3.0</span>
      </div>
    `;
    return;
  }
  const savedName = localStorage.getItem('moli_displayname') || user.displayName || 'Moli User';
  const photoUrl = user.photoURL || '';
  const avatarHtml = photoUrl
    ? `<img src="${esc(photoUrl)}" alt="avatar" />`
    : (savedName ? savedName[0].toUpperCase() : ICONS.user);
  wrap.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar" id="profileAvatarEl">${avatarHtml}</div>
        <div class="profile-edit-btn" onclick="openEditProfileModal()" title="Edit profil">${ICONS.edit}</div>
      </div>
      <div class="profile-name" id="profileNameEl">${esc(savedName)}</div>
      <div class="profile-email">${esc(user.email || '')}</div>
      <div class="profile-sub">MEMBER MOLI</div>
    </div>
    <div class="setting-card" onclick="clearHistory()">
      <div class="setting-icon">${ICONS.trash}</div>
      <div class="setting-info"><div class="setting-title">Hapus Riwayat</div><div class="setting-desc">Bersihkan semua riwayat nonton</div></div>
      <span class="setting-arrow">›</span>
    </div>
    <div class="setting-card">
      <div class="setting-icon">${ICONS.bolt}</div>
      <div class="setting-info"><div class="setting-title">Tentang Moli</div><div class="setting-desc">Dark Blue Neon Edition v3.0</div></div>
      <span class="setting-badge">v3.0</span>
    </div>
    <div class="setting-card">
      <div class="setting-icon">${ICONS.book}</div>
      <div class="setting-info"><div class="setting-title">Sumber Data</div><div class="setting-desc">Anime Sub Indo — setiap hari</div></div>
      <span class="setting-badge on">ON</span>
    </div>
    <button class="logout-btn" onclick="doLogout()">${ICONS.power} KELUAR</button>
  `;
}

function openEditProfileModal() {
  const user = window._currentUser;
  const savedName = localStorage.getItem('moli_displayname') || (user ? user.displayName : '') || '';
  const savedPhoto = user ? (user.photoURL || '') : '';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'editProfileModal';
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-title">Edit Profil</div>
      <div class="modal-field"><label>Nama Tampilan</label><input type="text" id="editNameInput" value="${esc(savedName)}" placeholder="Nama kamu" /></div>
      <div class="modal-field"><label>URL Foto Profil (opsional)</label><input type="url" id="editPhotoInput" value="${esc(savedPhoto)}" placeholder="https://..." /></div>
      <div class="modal-actions">
        <button class="modal-cancel" onclick="closeEditModal()">BATAL</button>
        <button class="modal-save" onclick="saveProfile()">SIMPAN</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function closeEditModal() { const m = document.getElementById('editProfileModal'); if (m) m.remove(); }

async function saveProfile() {
  const nameVal = (document.getElementById('editNameInput') || {}).value || '';
  const photoVal = (document.getElementById('editPhotoInput') || {}).value || '';
  const user = window._currentUser;
  if (!nameVal.trim()) { showToast('Nama tidak boleh kosong!'); return; }
  try {
    if (user && window._fbUpdateProfile) {
      await window._fbUpdateProfile(user, { displayName: nameVal.trim(), photoURL: photoVal.trim() || null });
    }
    localStorage.setItem('moli_displayname', nameVal.trim());
    closeEditModal(); renderSettingPage(window._currentUser); updateNavAuth(window._currentUser);
    showToast('Profil diperbarui!');
  } catch(e) { showToast('Gagal update profil: ' + e.message); }
}

async function doEmailLogin() {
  const email = (document.getElementById('loginEmail') || {}).value || '';
  const pass = (document.getElementById('loginPassword') || {}).value || '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (!email || !pass) { if(errEl) errEl.textContent = 'Email dan password wajib diisi!'; return; }
  try { await window._fbSignInEmail(email, pass); showPage('home'); showToast('Berhasil masuk!'); }
  catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doRegister() {
  const name = (document.getElementById('regName') || {}).value || '';
  const email = (document.getElementById('regEmail') || {}).value || '';
  const pass = (document.getElementById('regPassword') || {}).value || '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (!name || !email || !pass) { if(errEl) errEl.textContent = 'Semua field wajib diisi!'; return; }
  try {
    const cred = await window._fbCreateUser(email, pass);
    await window._fbUpdateProfile(cred.user, { displayName: name });
    localStorage.setItem('moli_displayname', name);
    showPage('home'); showToast('Akun berhasil dibuat!');
  } catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doGoogleLogin() {
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  try { await window._fbGoogleSignIn(); showPage('home'); showToast('Berhasil masuk dengan Google!'); }
  catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doLogout() {
  try { await window._fbSignOut(); showToast('Berhasil keluar!'); showPage('home'); }
  catch(e) { showToast('Gagal keluar'); }
}

function getAuthError(code) {
  const map = {
    'auth/user-not-found': 'Akun tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/email-already-in-use': 'Email sudah terdaftar.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password terlalu lemah (min. 6 karakter).',
    'auth/popup-closed-by-user': 'Login Google dibatalkan.',
    'auth/network-request-failed': 'Koneksi gagal, coba lagi.',
  };
  return map[code] || 'Terjadi kesalahan. Coba lagi.';
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('tabLogin');
  const regTab = document.getElementById('tabRegister');
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (tab === 'login') {
    loginTab.classList.add('active'); regTab.classList.remove('active');
    formLogin.style.display = ''; formReg.style.display = 'none';
  } else {
    regTab.classList.add('active'); loginTab.classList.remove('active');
    formReg.style.display = ''; formLogin.style.display = 'none';
  }
}

// ============================================================
// INIT EVENTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  updateNavAuth(window._currentUser || null);
  renderSettingPage(window._currentUser || null);
});

// ============================================================
// HELPERS
// ============================================================
function focusSearch() {
  const inp = document.getElementById('navSearch');
  if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================================
// HISTORY (localStorage)
// ============================================================
const HISTORY_KEY = 'kmoli_history';
const PROGRESS_KEY = 'kmoli_progress';

function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } }
function saveHistory(list) { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); }
function getProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; } }
function saveProgress(data) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }

function addHistory(entry) {
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
  let list = getHistory();
  const idx = list.findIndex(h => h.epUrl === epUrl);
  if (idx >= 0) { list[idx].progress = prog[epUrl]; saveHistory(list); }
}
function getProgressFor(epUrl) { const prog = getProgress(); return prog[epUrl] || null; }
function formatTimeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// ============================================================
// PAGE ROUTER
// ============================================================
let currentPage = 'home';
let latestPage = 1;
let moviePage = 1;
const pages = ['home','login','latest','movie','top10','jadwal','search','detail','watch','history','setting'];
const PAGE_PATHS = { 'home':'/','login':'/login','latest':'/latest','movie':'/movie','top10':'/top10','jadwal':'/jadwal','search':'/search','detail':'/detail','watch':'/watch','history':'/history' };

function showPage(name, push = true, rawUrl = null, pathOverride = null) {
  pages.forEach(p => { const el = document.getElementById('page-'+p); if(el) el.classList.remove('active'); });
  const target = document.getElementById('page-'+name);
  if (target) target.classList.add('active');
  currentPage = name;
  if (push) { const path = pathOverride || PAGE_PATHS[name] || '/'; history.pushState({page:name,rawUrl}, '', path); }
  document.querySelectorAll('.bnav-item').forEach(btn => {
    const p = btn.getAttribute('data-bnav');
    let active = false;
    if (p==='home' && ['home','latest','search','detail','watch','top10'].includes(name)) active = true;
    if (p==='movie' && name==='movie') active = true;
    if (p==='jadwal' && name==='jadwal') active = true;
    if (p==='setting' && name==='setting') active = true;
    btn.classList.toggle('active', active);
  });
  if (name !== 'watch') stopProgressTracking();
  if (name === 'history') renderHistoryPage();
  if (name === 'latest' && !document.getElementById('latestGrid').children.length) loadLatest(1);
  if (name === 'movie' && !document.getElementById('movieGrid').children.length) loadMovie(1);
  if (name === 'top10' && !document.getElementById('top10List').children.length) loadTop10();
  if (name === 'jadwal' && !document.getElementById('jadwalContent').children.length) loadJadwal();
  if (name === 'setting') renderSettingPage(window._currentUser || null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
  const state = e.state;
  if (!state) { _routeFromPath(location.pathname, location.search); return; }
  _activatePage(state.page);
  _loadPageData(state.page, state.rawUrl);
});

function _activatePage(name) {
  pages.forEach(p => { const el = document.getElementById('page-'+p); if(el) el.classList.remove('active'); });
  const target = document.getElementById('page-'+name);
  if (target) target.classList.add('active');
  currentPage = name;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function _loadPageData(name, rawUrl) {
  if (name==='home') loadHome();
  else if (name==='latest') loadLatest(1, false);
  else if (name==='movie') loadMovie(1, false);
  else if (name==='top10') loadTop10(false);
  else if (name==='jadwal') loadJadwal(false);
  else if (name==='history') renderHistoryPage();
  else if (name==='detail' && rawUrl) loadDetail(rawUrl, false);
  else if (name==='watch' && rawUrl) loadWatch(rawUrl,'',currentAnimeUrl,currentAnimeTitle,currentAnimeImage,currentEpisodes,false);
  else { _activatePage('home'); loadHome(); }
}
function _routeFromPath(path, search) {
  const params = new URLSearchParams(search);
  if (path==='/'||path==='') { _activatePage('home'); loadHome(); }
  else if (path==='/latest') { _activatePage('latest'); loadLatest(1,false); }
  else if (path==='/movie') { _activatePage('movie'); loadMovie(1,false); }
  else if (path==='/top10') { _activatePage('top10'); loadTop10(false); }
  else if (path==='/jadwal') { _activatePage('jadwal'); loadJadwal(false); }
  else if (path==='/history') { _activatePage('history'); renderHistoryPage(); }
  else if (path==='/search') { _activatePage('search'); }
  else if (path==='/detail') { const u=params.get('url'); if(u){_activatePage('detail');loadDetail(u,false);}else{_activatePage('home');loadHome();} }
  else if (path==='/watch') { const u=params.get('url'); if(u){_activatePage('watch');loadWatch(u,'','','','','',false);}else{_activatePage('home');loadHome();} }
  else { _activatePage('home'); loadHome(); }
}

// ============================================================
// HOME SECTIONS
// ============================================================
const HOME_SECTIONS = [
  { title: 'EPISODE TERBARU', mode: 'latest' },
  { title: 'ISEKAI & FANTASY', queries: ['isekai','reincarnation','maou','tensei'] },
  { title: 'ACTION HITS', queries: ['kimetsu','jujutsu','bleach','hunter','shingeki'] },
  { title: 'ROMANCE & DRAMA', queries: ['love','kanojo','romance','heroine'] },
  { title: 'SCHOOL LIFE', queries: ['school','gakuen','classroom','koukou'] },
  { title: 'MAGIC & ADVENTURE', queries: ['magic','adventure','dragon','dungeon'] },
];

function removeDuplicates(arr, key) { return [...new Map(arr.map(item=>[item[key],item])).values()]; }

async function loadHome() {
  renderHomeHistory();
  const sectionsContainer = document.getElementById('homeSections');
  if (!sectionsContainer) return;
  sectionsContainer.innerHTML = '';
  HOME_SECTIONS.forEach(async (section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'home-section';
    sectionEl.innerHTML =
      '<div class="section-header">' +
        '<h2 class="section-title"><span class="section-title-dot"></span>' + section.title + '</h2>' +
        '<a href="#" class="see-all" onclick="showPage(\'latest\')">SEMUA ›</a>' +
      '</div>' +
      '<div class="hscroll-wrap"><div class="hscroll-inner hscroll-loading"><div class="loading-dots"><span></span><span></span><span></span></div></div></div>';
    sectionsContainer.appendChild(sectionEl);
    const scrollInner = sectionEl.querySelector('.hscroll-inner');
    try {
      let items = [];
      if (section.mode === 'latest') {
        const res = await fetch('/api/latest'); items = await res.json();
      } else {
        const results = await Promise.all(section.queries.map(q=>fetch('/api/search?q='+encodeURIComponent(q)).then(r=>r.json()).catch(()=>[])));
        results.forEach(list => { if(Array.isArray(list)) items=[...items,...list]; });
        items = removeDuplicates(items,'url');
      }
      if (!items.length) { scrollInner.innerHTML = '<div style="font-family:var(--font-ui);font-size:10px;color:var(--text-muted);padding:20px;letter-spacing:1px;">TIDAK ADA DATA</div>'; return; }
      scrollInner.classList.remove('hscroll-loading');
      scrollInner.innerHTML = items.slice(0,15).map(function(item) {
        const ep = item.episode ? ('EP '+item.episode) : (item.score ? item.score : '');
        const title = item.title.length > 24 ? item.title.substring(0,22)+'..' : item.title;
        return '<div class="hscroll-card" onclick="loadDetail(\''+esc(item.url)+'\')"><div class="hscroll-img-wrap"><img src="'+esc(item.image)+'" alt="'+esc(item.title)+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/120x170/0d1520/00b4ff?text=?\'"/>'+(ep?'<div class="hscroll-badge">'+ep+'</div>':'')+'</div><div class="hscroll-title">'+esc(title)+'</div></div>';
      }).join('');
    } catch(e) {
      scrollInner.innerHTML = '<div style="font-family:var(--font-ui);font-size:10px;color:var(--text-muted);padding:20px;letter-spacing:1px;">GAGAL MEMUAT</div>';
    }
  });
}

function renderHomeHistory() {
  const list = getHistory().slice(0,8);
  const sec = document.getElementById('homeHistorySection');
  if (!sec) return;
  if (!list.length) { sec.innerHTML = ''; return; }
  const prog = getProgress();
  sec.innerHTML = `<div class="continue-section"><div class="section-header"><h2 class="section-title"><span class="section-title-dot"></span>LANJUTKAN NONTON</h2><a href="#" class="see-all" onclick="showPage('history')">SEMUA ›</a></div><div class="continue-scroll"><div class="continue-inner">${list.map(h=>continueCardHtml(h,prog[h.epUrl])).join('')}</div></div></div>`;
}

function continueCardHtml(h, p) {
  const pct = p ? p.pct : 0;
  return `<div class="continue-card" onclick="loadWatch('${esc(h.epUrl)}','${esc(h.epTitle)}','${esc(h.animeUrl)}')"><div class="continue-thumb"><img src="${esc(h.image)}" alt="${esc(h.animeTitle)}" onerror="this.src='https://via.placeholder.com/140x85/0d1520/00b4ff?text=?'"/><div class="continue-ep-badge">${esc(h.epTitle.substring(0,12))}</div></div><div class="continue-progress"><div class="continue-progress-fill" style="width:${pct}%"></div></div><div class="continue-title">${esc(h.animeTitle)}</div></div>`;
}

function historyItemHtml(h, p) {
  const pct = p ? p.pct : 0;
  return `<div class="history-item" onclick="loadWatch('${esc(h.epUrl)}','${esc(h.epTitle)}','${esc(h.animeUrl)}')"><img class="history-thumb" src="${esc(h.image)}" alt="${esc(h.animeTitle)}" onerror="this.src='https://via.placeholder.com/44x62/0d1520/00b4ff?text=?'"/><div class="history-info"><div class="history-title">${esc(h.animeTitle)}</div><div class="history-ep">${esc(h.epTitle)}</div><div class="history-time">${formatTimeAgo(h.timestamp)}</div><div class="history-progress-bar"><div class="history-progress-fill" style="width:${pct}%"></div></div></div></div>`;
}

// ============================================================
// LATEST
// ============================================================
async function loadLatest(page=1, push=true) {
  latestPage = page;
  showPage('latest', push, null, page>1?`/latest?page=${page}`:'/latest');
  document.getElementById('latestGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/latest?page=${page}`);
    const data = await res.json();
    renderGrid('latestGrid', data);
    renderPagination('latestPagination', page, data.length>=10, (p)=>loadLatest(p));
  } catch(e) { document.getElementById('latestGrid').innerHTML = errorState('Gagal memuat episode terbaru.'); }
}

// ============================================================
// MOVIE
// ============================================================
// ============================================================
// CLIENT-SIDE SCRAPER HELPERS (pakai cors.caliph dari browser)
// ============================================================
const CPROXY = 'https://cors.caliph.my.id';
const SBASE  = 'https://v2.samehadaku.how';

async function clientFetchHtml(path) {
  const url = `${CPROXY}/${SBASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return new DOMParser().parseFromString(text, 'text/html');
}

function domQA(doc, selector) { return Array.from(doc.querySelectorAll(selector)); }
function domQ(el, selector) { return el.querySelector(selector); }
function domText(el, selector) { return domQ(el, selector)?.textContent?.trim() || ''; }
function domSrc(el) { return el?.getAttribute('src') || el?.getAttribute('data-src') || ''; }

// ============================================================
// MOVIE — client-side scraping
// ============================================================
async function loadMovie(page=1, push=true) {
  moviePage = page;
  showPage('movie', push, null, page>1?`/movie?page=${page}`:'/movie');
  document.getElementById('movieGrid').innerHTML = loadingState();
  try {
    const doc = await clientFetchHtml(`/anime-movie/page/${page}/`);
    const data = [];

    // Try multiple selectors for movie list
    const selectors = ['.animpost', '.bsx', '.bs', '.post-show ul li'];
    for (const sel of selectors) {
      const items = domQA(doc, sel);
      if (!items.length) continue;
      items.forEach(el => {
        const a = el.querySelector('a');
        const img = el.querySelector('img');
        const title = domText(el, '.data .title h2') || domText(el, '.tt') || domText(el, 'h2') || a?.getAttribute('title') || a?.textContent?.trim() || '';
        const url = a?.href || '';
        const image = domSrc(img);
        const score = domText(el, '.score') || domText(el, '.rating') || '';
        const status = domText(el, '.status') || domText(el, '.type') || '';
        if (title && url) data.push({ title, url, image, score, status });
      });
      if (data.length) break;
    }

    const hasNext = !!doc.querySelector('a[rel="next"], .next a, .nav-links .next');
    renderGrid('movieGrid', data);
    renderPagination('moviePagination', page, hasNext, (p)=>loadMovie(p));
  } catch(e) {
    console.error('loadMovie error:', e);
    document.getElementById('movieGrid').innerHTML = errorState('Gagal memuat anime movie.');
  }
}

// ============================================================
// TOP 10 — client-side scraping
// ============================================================
async function loadTop10(push=true) {
  if (push) showPage('top10', push, null, '/top10');
  const container = document.getElementById('top10List');
  container.innerHTML = loadingState();
  try {
    const doc = await clientFetchHtml('/top10/');
    const data = [];

    const selectors = ['.top-list li', '.toplist li', '.ranking li', 'ol li', '.animpost', '.bsx', '.post-show ul li'];
    for (const sel of selectors) {
      const items = domQA(doc, sel);
      if (!items.length) continue;
      items.forEach((el, i) => {
        const a = el.querySelector('a');
        const img = el.querySelector('img');
        const title = a?.getAttribute('title') || domText(el, 'h2') || domText(el, 'h3') || domText(el, '.title') || a?.textContent?.trim() || '';
        const url = a?.href || '';
        const image = domSrc(img);
        const rank = domText(el, '.rank') || domText(el, '.number') || String(i + 1);
        const score = domText(el, '.score') || domText(el, '.rating') || '';
        if (title && url) data.push({ rank, title, url, image, score });
      });
      if (data.length) break;
    }

    if (!data.length) { container.innerHTML = emptyState('TIDAK ADA DATA', 'Tidak ada data top 10.'); return; }
    container.innerHTML = `<div class="top10-list">${data.map((item, i) => `
      <div class="top10-item" onclick="loadDetail('${esc(item.url)}')">
        <div class="top10-rank ${i < 3 ? 'top10-rank-gold' : ''}">${i+1}</div>
        <div class="top10-thumb"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/60x85/0d1520/00b4ff?text=?'"/></div>
        <div class="top10-info">
          <div class="top10-title">${esc(item.title)}</div>
          ${item.score ? `<div class="top10-score">${ICONS.star} ${esc(item.score)}</div>` : ''}
        </div>
        <div class="top10-arrow">${ICONS.play}</div>
      </div>`).join('')}</div>`;
  } catch(e) {
    console.error('loadTop10 error:', e);
    container.innerHTML = errorState('Gagal memuat top 10.');
  }
}

// ============================================================
// JADWAL — client-side scraping dengan multi-selector robust
// ============================================================
async function loadJadwal(push=true) {
  if (push) showPage('jadwal', push, null, '/jadwal');
  const container = document.getElementById('jadwalContent');
  container.innerHTML = loadingState();

  const DAYS_ORDER = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];

  try {
    const doc = await clientFetchHtml('/jadwal-rilis/');
    const result = {};

    // --- Method 1: tab/day containers with data-day or id ---
    const dayContainers = domQA(doc, '[data-day], [id*="hari"], [id*="day"], [class*="day-"], [class*="hari-"]');
    dayContainers.forEach(el => {
      const raw = el.getAttribute('data-day') || el.id || el.className;
      const matched = DAYS_ORDER.find(d => raw.toLowerCase().includes(d.toLowerCase()));
      if (!matched) return;
      const animes = [];
      domQA(el, 'li, article, .anime-item, .schedule-item').forEach(item => {
        const a = item.querySelector('a');
        const img = item.querySelector('img');
        const title = a?.getAttribute('title') || domText(item, 'h2') || domText(item, 'h3') || domText(item, '.title') || a?.textContent?.trim() || '';
        const url = a?.href || '';
        const image = domSrc(img);
        const time = domText(item, '.time') || domText(item, '.clock') || domText(item, '[class*=time]') || '';
        const score = domText(item, '.score') || domText(item, '.rating') || '';
        if (title) animes.push({ title, url, image, time, score });
      });
      if (animes.length) result[matched] = animes;
    });

    // --- Method 2: heading (h2/h3) lalu list di bawahnya ---
    if (!Object.keys(result).length) {
      domQA(doc, 'h2, h3, h4, .day-title, .hari-title').forEach(h => {
        const hText = h.textContent.trim();
        const matched = DAYS_ORDER.find(d => hText.toLowerCase().includes(d.toLowerCase()));
        if (!matched) return;
        const animes = [];
        let sib = h.nextElementSibling;
        while (sib && !['H2','H3','H4'].includes(sib.tagName)) {
          domQA(sib, 'li, article, a, .anime').forEach(item => {
            const a = item.tagName === 'A' ? item : item.querySelector('a');
            const img = item.querySelector('img');
            const title = a?.getAttribute('title') || a?.textContent?.trim() || item.textContent?.trim() || '';
            const url = a?.href || '';
            const image = domSrc(img);
            const time = domText(item, '.time') || domText(item, '.clock') || '';
            const score = domText(item, '.score') || '';
            if (title && title.length > 2) animes.push({ title, url, image, time, score });
          });
          sib = sib.nextElementSibling;
        }
        if (animes.length) result[matched] = animes;
      });
    }

    // --- Method 3: tabel kolom per hari ---
    if (!Object.keys(result).length) {
      const table = doc.querySelector('table');
      if (table) {
        const headerCells = domQA(table, 'thead th, tr:first-child th, tr:first-child td');
        const colDay = headerCells.map(th => DAYS_ORDER.find(d => th.textContent.toLowerCase().includes(d.toLowerCase())) || null);
        domQA(table, 'tbody tr, tr:not(:first-child)').forEach(tr => {
          domQA(tr, 'td').forEach((td, ci) => {
            const day = colDay[ci]; if (!day) return;
            if (!result[day]) result[day] = [];
            domQA(td, 'a, li').forEach(item => {
              const a = item.tagName === 'A' ? item : item.querySelector('a');
              const title = a?.textContent?.trim() || item.textContent?.trim() || '';
              const url = a?.href || '';
              const img = item.querySelector('img');
              const image = domSrc(img);
              if (title.length > 2) result[day].push({ title, url, image, time: '', score: '' });
            });
          });
        });
      }
    }

    // --- Method 4: semua <li> yang ada waktu (fallback agresif) ---
    if (!Object.keys(result).length) {
      domQA(doc, 'li').forEach(li => {
        const timeEl = li.querySelector('.time, .clock, [class*=time]');
        if (!timeEl) return;
        const a = li.querySelector('a');
        const title = a?.textContent?.trim() || li.textContent?.trim() || '';
        const url = a?.href || '';
        const img = li.querySelector('img');
        const image = domSrc(img);
        const time = timeEl.textContent.trim();
        if (title.length > 2) {
          if (!result['Jadwal']) result['Jadwal'] = [];
          result['Jadwal'].push({ title, url, image, time, score: '' });
        }
      });
    }

    const keys = Object.keys(result);
    if (!keys.length) {
      container.innerHTML = emptyState('Jadwal Kosong', 'Data jadwal belum tersedia dari sumber.');
      return;
    }

    const orderedKeys = [...DAYS_ORDER.filter(d => keys.includes(d)), ...keys.filter(d => !DAYS_ORDER.includes(d))];

    container.innerHTML = `<div class="jadwal-wrap">${orderedKeys.map(day => `
      <div class="jadwal-day">
        <div class="jadwal-day-header">
          ${ICONS.calendar}
          <span>${esc(day)}</span>
          <span class="jadwal-count">${(result[day]||[]).length} anime</span>
        </div>
        <div class="jadwal-list">
          ${(result[day]||[]).map(anime => `
            <div class="jadwal-item" ${anime.url ? `onclick="loadDetail('${esc(anime.url)}')"` : ''}>
              ${anime.image ? `<img class="jadwal-thumb" src="${esc(anime.image)}" alt="${esc(anime.title)}" onerror="this.style.display='none'" loading="lazy"/>` : ''}
              <div class="jadwal-item-info">
                <span class="jadwal-title">${esc(anime.title)}</span>
                ${anime.score ? `<span class="jadwal-score">${ICONS.star} ${esc(anime.score)}</span>` : ''}
              </div>
              ${anime.time ? `<span class="jadwal-time">${esc(anime.time)}</span>` : ''}
            </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>`;

  } catch(e) {
    console.error('loadJadwal error:', e);
    container.innerHTML = errorState('Gagal memuat jadwal. Coba lagi.');
  }
}

// ============================================================
// SEARCH
// ============================================================
async function doSearch() {
  const q = document.getElementById('navSearch').value.trim();
  if (!q) return;
  showPage('search', true, null, `/search?q=${encodeURIComponent(q)}`);
  document.getElementById('searchDesc').textContent = `Hasil untuk: "${q}"`;
  document.getElementById('searchGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!data.length) { document.getElementById('searchGrid').innerHTML = emptyState('TIDAK DITEMUKAN', `Tidak ada anime dengan kata kunci "${q}"`); }
    else { renderGrid('searchGrid', data); }
  } catch(e) { document.getElementById('searchGrid').innerHTML = errorState('Pencarian gagal.'); }
}

// ============================================================
// DETAIL
// ============================================================
async function loadDetail(url, push=true) {
  showPage('detail', push, url, `/detail?url=${encodeURIComponent(url)}`);
  document.getElementById('detailContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat detail...</span></div>`;
  try {
    const res = await fetch(`/api/detail?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderDetail(data, url);
  } catch(e) { document.getElementById('detailContent').innerHTML = errorState('Gagal memuat detail anime.'); }
}

let _detailData = null;
let _detailUrl = '';

function renderDetail(data, url) {
  _detailData = data; _detailUrl = url;
  currentEpisodes = data.episodes || [];
  currentAnimeTitle = data.title || '';
  currentAnimeImage = data.image || '';
  currentAnimeUrl = url;
  const prog = getProgress();

  // Info badges: episode count, type, status, score
  const epCount = data.episodes?.length || data.info?.jumlah_episode || data.info?.episode || '';
  const type    = data.info?.tipe || data.info?.type || '';
  const status  = data.info?.status || '';
  const score   = data.info?.skor || data.info?.score || data.info?.rating || '';
  const studio  = data.info?.studio || '';
  const duration= data.info?.durasi || data.info?.duration || '';

  const badgesHtml = [
    epCount ? `<span class="di-badge">${ICONS.tv} ${esc(epCount)} Episode</span>` : '',
    type    ? `<span class="di-badge">${esc(type)}</span>` : '',
    status  ? `<span class="di-badge di-badge-status">${esc(status)}</span>` : '',
    score   ? `<span class="di-badge di-badge-score">${ICONS.star} ${esc(score)}</span>` : '',
  ].filter(Boolean).join('');

  // First episode for "Tonton Episode 1" button
  const firstEp = data.episodes?.[data.episodes.length - 1]; // eps usually desc order
  const lastWatched = Object.entries(prog).find(([k]) => data.episodes?.some(e => e.url === k));
  const watchBtnEp = lastWatched
    ? data.episodes.find(e => e.url === lastWatched[0])
    : firstEp;
  const watchBtnLabel = lastWatched ? 'Lanjutkan Menonton' : (firstEp ? `Tonton Episode 1` : 'Tonton');
  const watchBtnIdx = watchBtnEp ? data.episodes.indexOf(watchBtnEp) : 0;

  // Description — truncated with expand
  const desc = data.description || 'Tidak ada deskripsi.';
  const descShort = desc.length > 180 ? desc.substring(0, 180) + '...' : desc;
  const descHtml = desc.length > 180
    ? `<p class="di-desc" id="diDescText">${esc(descShort)}</p><button class="di-expand-btn" id="diExpandBtn" onclick="toggleDesc()">Selengkapnya</button>`
    : `<p class="di-desc">${esc(desc)}</p>`;

  // Episodes
  const epHtml = (data.episodes||[]).map((ep,i)=>{
    const p = prog[ep.url]; const pct = p ? p.pct : 0;
    return `<div class="di-ep-item" onclick="watchEpFromDetail(${i})">
      <div class="di-ep-num">${esc(ep.title.replace(/[^0-9]/g,'').slice(-3) || String(data.episodes.length - i))}</div>
      <div class="di-ep-info">
        <div class="di-ep-title">${esc(ep.title)}</div>
        <div class="di-ep-date">${esc(ep.date)}</div>
        ${pct>0?`<div class="di-ep-bar"><div class="di-ep-fill" style="width:${pct}%"></div></div>`:''}
      </div>
      <div class="di-ep-play">${ICONS.play}</div>
    </div>`;
  }).join('');

  document.getElementById('detailContent').innerHTML = `
    <div class="di-wrap">

      <!-- HERO BLUR BACKGROUND -->
      <div class="di-hero-bg" style="background-image:url('${esc(data.image)}')"></div>
      <div class="di-hero-overlay"></div>

      <!-- BACK BUTTON -->
      <button class="di-back-btn" onclick="history.go(-1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <!-- POSTER + INFO ROW -->
      <div class="di-header">
        <img class="di-poster" src="${esc(data.image)}" alt="${esc(data.title)}"
          onerror="this.src='https://via.placeholder.com/120x170/0d1520/00b4ff?text=?'" loading="lazy"/>
        <div class="di-header-info">
          <h1 class="di-title">${esc(data.title)}</h1>
          <div class="di-accent-line"></div>
          <div class="di-badges">${badgesHtml}</div>
          ${studio ? `<div class="di-studio">${esc(studio)}</div>` : ''}
          ${duration ? `<div class="di-duration">${esc(duration)}</div>` : ''}
        </div>
      </div>

      <!-- WATCH BUTTON -->
      ${watchBtnEp ? `<button class="di-watch-btn" onclick="watchEpFromDetail(${watchBtnIdx})">
        ${ICONS.play} ${esc(watchBtnLabel)}
      </button>` : ''}

      <!-- SINOPSIS -->
      <div class="di-section">
        <div class="di-section-title">SINOPSIS</div>
        <div class="di-accent-line"></div>
        ${descHtml}
      </div>

      <!-- DAFTAR EPISODE -->
      <div class="di-section">
        <div class="di-section-title-row">
          <div class="di-section-title">DAFTAR EPISODE</div>
          <span class="di-ep-count">${data.episodes?.length||0} Episode</span>
        </div>
        <div class="di-episode-list">
          ${epHtml || `<div class="empty-state"><p class="empty-title">BELUM ADA EPISODE</p></div>`}
        </div>
      </div>

    </div>`;

  // store desc for toggle
  window._detailDescFull = desc;
  window._detailDescShort = descShort;
  window._detailDescExpanded = false;
}
}

function toggleDesc() {
  const el = document.getElementById('diDescText');
  const btn = document.getElementById('diExpandBtn');
  if (!el || !btn) return;
  window._detailDescExpanded = !window._detailDescExpanded;
  el.textContent = window._detailDescExpanded ? window._detailDescFull : window._detailDescShort;
  btn.textContent = window._detailDescExpanded ? 'Sembunyikan' : 'Selengkapnya';
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

async function loadWatch(url, title, animeUrl, animeTitle, animeImage, episodes, push=true) {
  showPage('watch', push, url, `/watch?url=${encodeURIComponent(url)}`);
  currentAnimeUrl = animeUrl || currentAnimeUrl || '';
  currentAnimeTitle = animeTitle || currentAnimeTitle || '';
  currentAnimeImage = animeImage || currentAnimeImage || '';
  if (episodes && episodes.length) currentEpisodes = episodes;
  document.getElementById('watchContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat player...</span></div>`;
  try {
    const res = await fetch(`/api/watch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderWatch(data, url, title || data.title);
    addHistory({ epUrl:url, epTitle:title||data.title||'', animeUrl:animeUrl||data.animeLink||'', animeTitle:animeTitle||data.title||'', image:animeImage||'', timestamp:Date.now() });
  } catch(e) { document.getElementById('watchContent').innerHTML = errorState('Gagal memuat video player.'); }
}

let currentStreams = [];
let currentStreamIdx = 0;
let currentEpUrl = '';

function renderWatch(data, url, title) {
  currentWatchData = data; currentEpUrl = url;
  currentStreams = data.streams || []; currentStreamIdx = 0;
  if (progressInterval) clearInterval(progressInterval);

  const serverTabsHtml = currentStreams.map((s,i)=>`<button class="server-tab ${i===0?'active':''}" onclick="switchServer(${i},this)">${esc(s.server)}</button>`).join('');
  const dlHtml = (data.downloads||[]).map(group=>`<div class="dl-group"><div class="dl-quality">${ICONS.film} ${esc(group.quality)}</div><div class="dl-links">${(group.links||[]).map(l=>`<a class="dl-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.host)}</a>`).join('')}</div></div>`).join('');
  const videoHtml = currentStreams.length > 0
    ? `<iframe src="${esc(currentStreams[0].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`
    : `<div class="no-stream"><div class="no-stream-icon" style="display:flex;justify-content:center;opacity:.3">${ICONS.tv}</div><span>STREAM TIDAK TERSEDIA</span></div>`;
  const epListItems = currentEpisodes.length > 0
    ? currentEpisodes.map((ep,i)=>buildWatchEpItem(ep,url,i)).join('')
    : '<div style="padding:20px;font-family:var(--font-ui);font-size:10px;color:var(--text-muted);text-align:center;letter-spacing:1px;">BUKA DETAIL UNTUK LIST EP</div>';
  const prog = getProgressFor(url);
  const savedSec = prog ? prog.seconds : 0;
  const autoOn = autoplayEnabled;

  document.getElementById('watchContent').innerHTML = `
    <div class="watch-wrapper">
      <div class="watch-back-area">
        <button class="back-btn" onclick="${currentAnimeUrl?`loadDetail('${esc(currentAnimeUrl)}')`:' history.go(-1)'}">${ICONS.back}KEMBALI</button>
      </div>
      <div class="watch-title-area">
        <h2 class="watch-title">${ICONS.tv} ${esc(data.title||title)}</h2>
      </div>
      <div class="watch-video-area">
        <div class="video-container" id="videoContainer">${videoHtml}</div>
      </div>
      <div class="watch-autoplay-area">
        <div class="autoplay-toggle-row">
          <div class="autoplay-label">${ICONS.next}Auto Next Episode</div>
          <div class="autoplay-toggle-right">
            <span class="autoplay-status ${autoOn?'on':''}" id="autoplayStatus">${autoOn?'ON':'OFF'}</span>
            <button class="autoplay-btn ${autoOn?'on':''}" id="autoplayBtn" onclick="toggleAutoplay()"></button>
          </div>
        </div>
      </div>
      ${currentStreams.length>1?`<div class="watch-servers-area"><div class="server-label">SERVER:</div><div class="server-tabs">${serverTabsHtml}</div></div>`:'<div class="watch-servers-area"></div>'}
      <div class="watch-naveps-area">
        <div class="nav-eps">
          <button class="ep-nav-btn" onclick="navEp('${esc(data.prevEp)}','${esc(currentAnimeUrl)}')" ${!data.prevEp?'disabled':''}>${ICONS.prev} EP SEBELUMNYA</button>
          <button class="ep-nav-btn" onclick="navEp('${esc(data.nextEp)}','${esc(currentAnimeUrl)}')" ${!data.nextEp?'disabled':''}>EP SELANJUTNYA ${ICONS.next}</button>
        </div>
      </div>
      <div class="watch-eplist-area">
        <div class="watch-ep-panel">
          <div class="watch-ep-panel-header">${ICONS.list} DAFTAR EPISODE</div>
          <div class="watch-ep-list" id="watchEpList">${epListItems}</div>
        </div>
      </div>
      ${dlHtml?`<div class="watch-download-area"><div class="download-section"><div class="download-title">${ICONS.download} DOWNLOAD</div><div class="download-groups">${dlHtml}</div></div></div>`:''}
    </div>`;

  setTimeout(() => {
    const active = document.querySelector('.watch-ep-item.active');
    if (active) active.scrollIntoView({ block: 'center' });
  }, 200);

  window._nextEpUrl = data.nextEp || '';
  window._currentEpAnimeUrl = currentAnimeUrl;

  startProgressTracking(url, savedSec);
}

function watchEpFromDetail(idx) {
  const ep = currentEpisodes[idx]; if(!ep) return;
  loadWatch(ep.url, ep.title, currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function watchEpFromPanel(idx) {
  const ep = currentEpisodes[idx]; if(!ep) return;
  loadWatch(ep.url, ep.title, currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function buildWatchEpItem(ep, currentUrl, idx) {
  const prog = getProgressFor(ep.url); const pct = prog ? prog.pct : 0; const isActive = ep.url === currentUrl;
  return `<div class="watch-ep-item ${isActive?'active':''}" onclick="watchEpFromPanel(${idx})"><div class="watch-ep-item-title">${esc(ep.title)}</div>${pct>0?`<div class="watch-ep-progress-bar"><div class="watch-ep-progress-fill" style="width:${pct}%"></div></div>`:''}</div>`;
}
function navEp(epUrl, animeUrl) {
  if (!epUrl) return;
  loadWatch(epUrl, '', animeUrl||currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function switchServer(idx, btn) {
  if (!currentStreams[idx]) return;
  currentStreamIdx = idx;
  document.querySelectorAll('.server-tab').forEach((t,i)=>t.classList.toggle('active',i===idx));
  const container = document.getElementById('videoContainer');
  if (container) container.innerHTML = `<iframe src="${esc(currentStreams[idx].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`;
}

// ============================================================
// PROGRESS TRACKING + AUTOPLAY
// ============================================================
let trackedSeconds = 0;
const AUTOPLAY_THRESHOLD = 600;

function startProgressTracking(epUrl, startSec) {
  if (progressInterval) clearInterval(progressInterval);
  trackedSeconds = startSec || 0;
  _saveTrackedProgress(epUrl);
  progressInterval = setInterval(() => {
    if (!document.querySelector('#videoFrame')) return;
    trackedSeconds += 10;
    _saveTrackedProgress(epUrl);
    if (autoplayEnabled && trackedSeconds > 0 && trackedSeconds % AUTOPLAY_THRESHOLD === 0) {
      const nextUrl = window._nextEpUrl;
      if (nextUrl && currentPage === 'watch') {
        showToast('Lanjut ke episode berikutnya...');
        setTimeout(() => navEp(nextUrl, window._currentEpAnimeUrl || currentAnimeUrl), 1500);
      }
    }
  }, 10000);
}
function _saveTrackedProgress(epUrl) { updateProgress(epUrl, trackedSeconds, trackedSeconds + 600); }
function stopProgressTracking() { if (progressInterval) { clearInterval(progressInterval); progressInterval = null; } }

// ============================================================
// HISTORY PAGE
// ============================================================
function renderHistoryPage() {
  const list = getHistory(); const prog = getProgress();
  const container = document.getElementById('historyContent');
  if (!list.length) {
    container.innerHTML = `<div class="history-panel"><div class="history-header"><span>RIWAYAT NONTON</span></div><div class="history-list"><div class="history-empty">BELUM ADA RIWAYAT<br/><br/>Mulai nonton anime untuk muncul di sini!</div></div></div>`;
    return;
  }
  container.innerHTML = `<div class="history-panel"><div class="history-header"><span>${list.length} RIWAYAT NONTON</span><button class="history-clear-btn" onclick="clearHistory()">${ICONS.trash} HAPUS SEMUA</button></div><div class="history-list">${list.map(h=>historyItemHtml(h,prog[h.epUrl])).join('')}</div></div>`;
}

function clearHistory() {
  if (!confirm('Hapus semua riwayat?')) return;
  localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(PROGRESS_KEY);
  renderHistoryPage(); renderHomeHistory();
  showToast('Riwayat dihapus!');
}

// ============================================================
// RENDER HELPERS
// ============================================================
function renderGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!items || !items.length) { container.innerHTML = emptyState('BELUM ADA DATA', ''); return; }
  container.innerHTML = items.map(item=>animeCard(item)).join('');
}

function animeCard(item) {
  const onclick = `loadDetail('${esc(item.url)}')`;
  const epBadge = item.episode ? `<div class="card-ep-badge">EP ${esc(item.episode)}</div>` : '';
  const typeBadge = item.type ? `<div class="card-badge">${esc(item.type)}</div>` : '';
  const scoreMeta = item.score ? `<span class="card-score">${ICONS.star} ${esc(item.score)}</span>` : '';
  return `<div class="anime-card" onclick="${onclick}"><div class="card-img-wrap"><img class="card-img" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x224/0d1520/00b4ff?text=?'"/><div class="card-overlay"></div><div class="card-play">${ICONS.play}</div>${typeBadge}${epBadge}</div><div class="card-body"><div class="card-title">${esc(item.title)}</div><div class="card-meta">${scoreMeta}</div></div></div>`;
}

function renderPagination(containerId, current, hasNext, callback) {
  const container = document.getElementById(containerId); if(!container) return;
  let html = '';
  if (current > 1) html += `<button class="page-btn" onclick="(${callback.toString()})(${current-1})">◀</button>`;
  const start = Math.max(1, current-2);
  for (let i=start; i<=current+2; i++) {
    if (i===current) html += `<button class="page-btn active">${i}</button>`;
    else if (i>=1) html += `<button class="page-btn" onclick="(${callback.toString()})(${i})">${i}</button>`;
  }
  if (hasNext) html += `<button class="page-btn" onclick="(${callback.toString()})(${current+1})">▶</button>`;
  container.innerHTML = html;
}

// ============================================================
// UTILS
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function loadingState(msg='Memuat data...') { return `<div class="loading-wrap"><div class="spinner"></div><span>${msg}</span></div>`; }
function errorState(msg) { return `<div class="empty-state"><div class="empty-icon" style="display:flex;justify-content:center;opacity:.5">${ICONS.warn}</div><p class="empty-title">OOPS!</p><p>${msg}</p></div>`; }
function emptyState(title, msg) { return `<div class="empty-state" style="grid-column:1/-1"><p class="empty-title">${title}</p><p>${msg}</p></div>`; }

// ============================================================
// HERO SLIDER
// ============================================================
const HERO_SEARCHES = ['isekai','action','romance','fantasy','school','magic','adventure','shounen'];
let heroSlides = [], heroIdx = 0, heroTimer = null;

async function loadHeroSlider() {
  const shuffled = [...HERO_SEARCHES].sort(()=>Math.random()-0.5).slice(0,4);
  const results = await Promise.all(shuffled.map(async(q)=>{
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const list = await res.json();
      return (list||[]).filter(a=>a.image).sort(()=>Math.random()-0.5).slice(0,2);
    } catch { return []; }
  }));
  heroSlides = results.flat().filter(Boolean).sort(()=>Math.random()-0.5).slice(0,10);
  if (!heroSlides.length) {
    try { const res=await fetch('/api/latest'); const list=await res.json(); heroSlides=list.slice(0,8); } catch {}
  }
  if (!heroSlides.length) return;
  renderHeroSlides(); heroIdx=0; updateHeroContent(0); buildHeroDots(); startHeroTimer();
}

function renderHeroSlides() {
  const container = document.getElementById('heroSlides'); if(!container) return;
  container.innerHTML = heroSlides.map((s,i)=>`<div class="hero-slide-img${i===0?' active':''}" style="background-image:url('${esc(s.image)}')" data-idx="${i}"></div>`).join('');
}
function updateHeroContent(idx) {
  const s = heroSlides[idx]; if(!s) return;
  const title=document.getElementById('heroTitle');
  const btnWatch=document.getElementById('heroBtnWatch'); const btnDetail=document.getElementById('heroBtnDetail');
  if(title) title.textContent = s.title||'—';
  if(btnWatch) btnWatch.onclick = ()=>loadDetail(s.url);
  if(btnDetail) btnDetail.onclick = ()=>loadDetail(s.url);
  document.querySelectorAll('.hero-slide-img').forEach((el,i)=>el.classList.toggle('active',i===idx));
  document.querySelectorAll('#heroDots .dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
}
function buildHeroDots() {
  const dotsEl = document.getElementById('heroDots'); if(!dotsEl) return;
  dotsEl.innerHTML = heroSlides.map((_,i)=>`<span class="dot${i===0?' active':''}" onclick="heroGoTo(${i})"></span>`).join('');
}
function heroGoTo(idx) { heroIdx=idx; updateHeroContent(idx); resetHeroTimer(); }
function startHeroTimer() { heroTimer=setInterval(()=>{ heroIdx=(heroIdx+1)%heroSlides.length; updateHeroContent(heroIdx); },4500); }
function resetHeroTimer() { if(heroTimer) clearInterval(heroTimer); startHeroTimer(); }

document.addEventListener('DOMContentLoaded', ()=>{
  history.replaceState({page:_getPageFromPath(location.pathname,location.search),rawUrl:new URLSearchParams(location.search).get('url')},'',location.pathname+location.search);
  _routeFromPath(location.pathname, location.search);
  loadHeroSlider();
  updateNavAuth(window._currentUser||null);
  renderSettingPage(window._currentUser||null);
});

function _getPageFromPath(path, search) {
  if(path==='/'||path==='') return 'home';
  if(path==='/latest') return 'latest';
  if(path==='/movie') return 'movie';
  if(path==='/top10') return 'top10';
  if(path==='/jadwal') return 'jadwal';
  if(path==='/history') return 'history';
  if(path==='/search') return 'search';
  if(path==='/detail') return 'detail';
  if(path==='/watch') return 'watch';
  return 'home';
}
