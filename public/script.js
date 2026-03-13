// =============================================
//  UVASA Donation Tracker · script.js
// =============================================

let donationHistory   = [];
let platformCounts    = { socialbuzz: 0, saweria: 0, bagibagi: 0 };
let lastDonationKey   = null;   // track last displayed so we don't flash duplicate

// ---- bootstrap ----
document.addEventListener('DOMContentLoaded', () => {
  loadHistoryFromStorage();
  fetchLatest();
  setInterval(fetchLatest, 3000);
});

// =============================================
//  FETCH
// =============================================
async function fetchLatest() {
  try {
    const res      = await fetch('/data');
    const donation = await res.json();

    if (!donation || !donation.platform || donation.amount == null) return;

    // unique key to detect NEW donation
    const key = `${donation.platform}|${donation.username}|${donation.amount}`;
    if (key === lastDonationKey) return;
    lastDonationKey = key;

    renderLatest(donation);
    addToHistory(donation);
    updateStats();
  } catch (e) {
    console.error('[UVASA] fetch error:', e);
  }
}

// =============================================
//  LATEST CARD
// =============================================
function renderLatest(d) {
  const empty   = document.getElementById('latestEmpty');
  const content = document.getElementById('latestContent');
  const card    = content.closest('.latest-card');

  empty.style.display   = 'none';
  content.style.display = 'block';

  const platformClass = (d.platform || 'unknown').toLowerCase();
  const platformLabel = {
    socialbuzz: 'SCOIALBUZZ',
    saweria:    'SAWERIA',
    bagibagi:   'BAGI - BAGI',
  }[platformClass] || d.platform;

  document.getElementById('latestPlatform').textContent  = platformLabel;
  document.getElementById('latestPlatform').className    = `latest-platform-tag ${platformClass}`;
  document.getElementById('latestAmount').textContent    = 'Rp ' + formatNum(d.amount);
  document.getElementById('latestName').textContent      = d.username || 'Anonymous';
  document.getElementById('latestTime').textContent      = new Date().toLocaleTimeString('id-ID');

  const msgEl = document.getElementById('latestMessage');
  if (d.message && d.message.trim()) {
    msgEl.textContent = `"${d.message}"`;
    msgEl.style.display = 'block';
  } else {
    msgEl.textContent   = '';
    msgEl.style.display = 'none';
  }

  // flash animation
  card.classList.remove('flash');
  void card.offsetWidth; // reflow
  card.classList.add('flash');
}

// =============================================
//  HISTORY
// =============================================
function addToHistory(d) {
  // deduplicate by key
  const key = `${d.platform}|${d.username}|${d.amount}`;
  if (donationHistory.some(h => h._key === key)) return;

  const entry = {
    ...d,
    _key:      key,
    _time:     new Date().toLocaleTimeString('id-ID'),
    _ts:       Date.now(),
  };

  donationHistory.unshift(entry);
  if (donationHistory.length > 100) donationHistory.pop();

  // platform count
  const p = (d.platform || '').toLowerCase();
  if (p in platformCounts) platformCounts[p]++;

  saveHistoryToStorage();
  renderHistory();
  renderPlatformCounts();
}

function renderHistory() {
  const list = document.getElementById('historyList');

  if (!donationHistory.length) {
    list.innerHTML = '<div class="history-empty">Belum ada riwayat donasi</div>';
    return;
  }

  list.innerHTML = donationHistory.map(item => {
    const p   = (item.platform || 'unknown').toLowerCase();
    const lbl = { socialbuzz: 'SocialBuzz', saweria: 'Saweria', bagibagi: 'BagiBagi' }[p] || p;
    const msg = item.message && item.message.trim()
      ? `<div class="hi-message">"${item.message}"</div>` : '';

    return `
      <div class="history-item">
        <div class="hi-platform ${p}"></div>
        <div class="hi-info">
          <div class="hi-donor">${escHtml(item.username || 'Anonymous')}</div>
          <div class="hi-meta">
            <span class="hi-platform-label ${p}">${lbl}</span>
            <span class="hi-time">${item._time}</span>
          </div>
          ${msg}
        </div>
        <div class="hi-amount">Rp ${formatNum(item.amount)}</div>
      </div>
    `;
  }).join('');
}

// =============================================
//  STATS
// =============================================
function updateStats() {
  if (!donationHistory.length) return;

  const amounts = donationHistory.map(h => Number(h.amount) || 0);
  const total   = amounts.reduce((a, b) => a + b, 0);
  const max     = Math.max(...amounts);
  const avg     = Math.round(total / amounts.length);

  document.getElementById('statTotal').textContent = 'Rp ' + formatNum(total);
  document.getElementById('statCount').textContent = `${amounts.length}×`;
  document.getElementById('statAvg').textContent   = 'Rp ' + formatNum(avg);
  document.getElementById('statMax').textContent   = 'Rp ' + formatNum(max);
}

function renderPlatformCounts() {
  document.getElementById('countSocialbuzz').textContent = platformCounts.socialbuzz;
  document.getElementById('countSaweria').textContent    = platformCounts.saweria;
  document.getElementById('countBagibagi').textContent   = platformCounts.bagibagi;
}

// =============================================
//  STORAGE
// =============================================
function saveHistoryToStorage() {
  try {
    localStorage.setItem('uvasa_history', JSON.stringify(donationHistory));
    localStorage.setItem('uvasa_counts',  JSON.stringify(platformCounts));
  } catch (e) {}
}

function loadHistoryFromStorage() {
  try {
    const h = localStorage.getItem('uvasa_history');
    const c = localStorage.getItem('uvasa_counts');
    if (h) donationHistory = JSON.parse(h);
    if (c) platformCounts  = { ...platformCounts, ...JSON.parse(c) };
  } catch (e) {}

  renderHistory();
  renderPlatformCounts();
  updateStats();

  // restore latest card if history exists
  if (donationHistory.length) {
    renderLatest(donationHistory[0]);
    // don't flash on restore, just set key
    const d = donationHistory[0];
    lastDonationKey = `${d.platform}|${d.username}|${d.amount}`;
    // remove flash that renderLatest added
    const card = document.querySelector('.latest-card');
    if (card) card.classList.remove('flash');
  }
}

function clearHistory() {
  if (!donationHistory.length) return;
  if (!confirm('Hapus semua riwayat donasi?')) return;

  donationHistory  = [];
  platformCounts   = { socialbuzz: 0, saweria: 0, bagibagi: 0 };
  lastDonationKey  = null;

  localStorage.removeItem('uvasa_history');
  localStorage.removeItem('uvasa_counts');

  renderHistory();
  renderPlatformCounts();
  updateStats();

  // reset latest card
  document.getElementById('latestEmpty').style.display   = 'flex';
  document.getElementById('latestContent').style.display = 'none';

  document.getElementById('statTotal').textContent = 'Rp 0';
  document.getElementById('statCount').textContent = '0×';
  document.getElementById('statAvg').textContent   = 'Rp 0';
  document.getElementById('statMax').textContent   = 'Rp 0';
}

// =============================================
//  UTILS
// =============================================
function formatNum(n) {
  return new Intl.NumberFormat('id-ID').format(Number(n) || 0);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}