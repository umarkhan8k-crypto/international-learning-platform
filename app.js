/* ===== International Learning Platform — shared app logic (API-backed) ===== */

const API_BASE = 'https://ilp-backend-production-77a4.up.railway.app/api';
const LANGUAGES = ['English','Urdu','Arabic','French','Spanish','Turkish','Indonesian','Bengali','Hindi','Malay','Somali','Swahili'];

const ORNAMENT = `<svg class="ornament" viewBox="0 0 100 100"><path d="M50 2 L61 39 L98 39 L68 61 L79 98 L50 75 L21 98 L32 61 L2 39 L39 39 Z"/></svg>`;

/* ---------- API helper ---------- */
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('ilp_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || (data.errors && data.errors[0] && data.errors[0].msg) || 'Something went wrong.';
    throw new Error(message);
  }
  return data;
}

async function apiUpload(file, kind) {
  const token = localStorage.getItem('ilp_token');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/upload?kind=${kind}`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed.');
  return data.url;
}

/* ---------- old localStorage helper (still used by courses/pricing pages for now) ---------- */
const DB = {
  read(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  write(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
};

/* ---------- auth ---------- */
function currentUser(){ try{ const v = localStorage.getItem('ilp_user'); return v ? JSON.parse(v) : null; }catch(e){ return null; } }
function setCurrentUser(u){ localStorage.setItem('ilp_user', JSON.stringify(u)); }
function setToken(t){ localStorage.setItem('ilp_token', t); }
function logout(){ localStorage.removeItem('ilp_token'); localStorage.removeItem('ilp_user'); location.href = 'index.html'; }

async function loginUser({ email, password }){
  const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(data.token);
  setCurrentUser(data.user);
  return data.user;
}

async function registerUser({ firstName, lastName, email, password, role }){
  const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ firstName, lastName, email, password, role }) });
  setToken(data.token);
  setCurrentUser(data.user);
  return data.user;
}

function initials(name){
  return name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

/* ---------- tutors / trial requests / profile ---------- */
async function fetchTutors(query = {}){
  const params = new URLSearchParams(query).toString();
  return apiRequest('/tutors' + (params ? '?' + params : ''));
}

async function createTrialRequestApi({ tutorId, preferredTime }){
  return apiRequest('/trial-requests', { method: 'POST', body: JSON.stringify({ tutorId, preferredTime }) });
}

async function fetchMyTrialRequests(){
  return apiRequest('/trial-requests/mine');
}

async function updateTrialRequestStatus(id, status){
  return apiRequest('/trial-requests/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
}

async function getMyProfile(){
  return apiRequest('/profile/me');
}

async function saveProfile(_email, data){
  const payload = { ...data };
  if ('picture' in payload){ payload.pictureUrl = payload.picture; delete payload.picture; }
  if ('ageGroups' in payload){ payload.ageGroupsTaught = payload.ageGroups; delete payload.ageGroups; }
  if ('certification' in payload){ payload.certificationUrl = payload.certification; delete payload.certification; }
  if ('audioSample' in payload){ payload.audioSampleUrl = payload.audioSample; delete payload.audioSample; }
  return apiRequest('/profile/me', { method: 'PUT', body: JSON.stringify(payload) });
}

/* ---------- form widgets used by profile-setup.html ---------- */
const COUNTRIES = ['Pakistan','India','Bangladesh','Egypt','Saudi Arabia','UAE','UK','USA','Canada','Turkey','Indonesia','Malaysia','Morocco','Jordan','Nigeria','South Africa','Australia','Germany','France','Other'];

function initCountrySelect(mount, opts={}){
  const sel = document.createElement('select');
  sel.innerHTML = `<option value="">${opts.placeholder||'Select country'}</option>` +
    COUNTRIES.map(c=>`<option value="${c}">${c}</option>`).join('');
  mount.appendChild(sel);
  return { getValue: () => sel.value, setValue: (v) => sel.value = v };
}

function initPhonePicker(mount){
  const input = document.createElement('input');
  input.type = 'tel';
  input.placeholder = 'e.g. +92 300 1234567';
  mount.appendChild(input);
  return { getFullNumber: () => input.value.trim(), setValue: (v) => input.value = v };
}

function initChipPicker(mount, opts={}){
  const wrap = document.createElement('div'); wrap.className = 'chip-picker';
  const input = document.createElement('input');
  input.type = 'text'; input.placeholder = opts.placeholder || 'Type and press Enter';
  const list = document.createElement('datalist'); list.id = 'dl_' + Math.random().toString(36).slice(2);
  (opts.options||[]).forEach(o=>{ const op=document.createElement('option'); op.value=o; list.appendChild(op); });
  input.setAttribute('list', list.id);
  const chipsEl = document.createElement('div'); chipsEl.className = 'chips-row'; chipsEl.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;';
  let values = [];
  function render(){
    chipsEl.innerHTML = values.map((v,i)=>`<span class="pill" style="cursor:pointer;" data-i="${i}">${v} ✕</span>`).join('');
    chipsEl.querySelectorAll('.pill').forEach(p=>p.addEventListener('click', ()=>{
      values.splice(Number(p.dataset.i),1); render();
    }));
  }
  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      const v = input.value.trim();
      if (v && !values.includes(v)){ values.push(v); render(); }
      input.value = '';
    }
  });
  wrap.appendChild(input); wrap.appendChild(list); wrap.appendChild(chipsEl);
  mount.appendChild(wrap);
  return { getValues: () => values, setValues: (v) => { values = v||[]; render(); } };
}

function initSubjectPicker(mount, opts={}){
  const wrap = document.createElement('div'); wrap.style.cssText='display:flex;flex-wrap:wrap;gap:8px;';
  (opts.options||[]).forEach(o=>{
    const label = document.createElement('label');
    label.style.cssText = 'border:1px solid var(--line);padding:6px 12px;border-radius:20px;cursor:pointer;font-size:.85rem;';
    label.innerHTML = `<input type="checkbox" value="${o}" style="margin-right:4px;">${o}`;
    wrap.appendChild(label);
  });
  mount.appendChild(wrap);
  return {
    getValues: () => Array.from(wrap.querySelectorAll('input:checked')).map(i=>i.value),
    setValues: (vals) => { wrap.querySelectorAll('input').forEach(i=>{ i.checked = (vals||[]).includes(i.value); }); },
  };
}

function initUploadBox(mount, opts={}){
  const wrap = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'file'; input.accept = opts.accept || '*/*';
  const label = document.createElement('div'); label.textContent = opts.label || 'Tap to upload'; label.style.cssText='font-size:.85rem;color:var(--ink-2);margin-bottom:6px;';
  const status = document.createElement('div'); status.style.cssText='font-size:.8rem;margin-top:6px;';
  const preview = document.createElement('div'); preview.style.cssText='margin-top:8px;';
  wrap.appendChild(label); wrap.appendChild(input); wrap.appendChild(preview); wrap.appendChild(status);
  mount.appendChild(wrap);

  let currentUrl = '';

  function setStatus(text, type){
    status.textContent = text || '';
    status.style.color = type==='error' ? 'var(--rose,#c0392b)' : type==='success' ? 'var(--gold,#2e7d32)' : 'var(--ink-2)';
  }

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    preview.innerHTML = '';
    if (opts.kind === 'image'){
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.cssText = `max-width:120px;border-radius:${opts.previewShape==='circle'?'50%':'8px'};display:block;`;
      preview.appendChild(img);
    } else if (opts.kind === 'audio'){
      const audio = document.createElement('audio');
      audio.controls = true; audio.src = URL.createObjectURL(file);
      preview.appendChild(audio);
    }
    setStatus('Uploading...', 'checking');
    try{
      const url = await apiUpload(file, opts.kind || 'image');
      currentUrl = url;
      if (opts.onChange) await opts.onChange(url, file);
    }catch(err){
      setStatus('Upload failed: ' + err.message, 'error');
      currentUrl = '';
      if (opts.onClear) opts.onClear();
    }
  });

  return {
    getValue: () => currentUrl,
    setStatus,
    clear: () => { input.value = ''; preview.innerHTML = ''; currentUrl = ''; setStatus(''); },
  };
}

async function ocrExtractText(url){
  try{
    if (typeof Tesseract === 'undefined') return null;
    const result = await Tesseract.recognize(url, 'eng');
    return (result.data.text || '').toLowerCase();
  }catch(err){ return null; }
}

function getAudioDuration(file){
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => { URL.revokeObjectURL(audio.src); resolve(audio.duration); };
    audio.onerror = () => reject(new Error('Could not read audio.'));
    audio.src = URL.createObjectURL(file);
  });
}

/* ---------- nav + footer ---------- */
function renderNav(active){
  const nav = document.getElementById('nav');
  if (!nav) return;
  const user = currentUser();
  const links = [
    ['index.html','Home'],['courses.html','Courses'],['tutors.html','Find Tutors'],
    ['pricing.html','Pricing'],['about.html','About'],
  ];
  const linkHtml = links.map(([href,label]) =>
    `<a href="${href}" class="${active===label?'active':''}">${label}</a>`).join('');

  const cta = user
    ? `<a class="nav-user" href="dashboard.html">${initials(user.firstName+' '+user.lastName)} · Dashboard</a>
       <button class="btn ghost small" onclick="logout()">Log out</button>`
    : `<a class="btn ghost small" href="login.html">Login</a>
       <a class="btn primary small" href="register.html">Register</a>`;

  nav.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="index.html">${ORNAMENT}International Learning Platform</a>
      <nav class="nav-links" id="navLinks">${linkHtml}<span class="nav-cta" style="display:flex;gap:10px;margin-top:8px;">${cta}</span></nav>
      <div class="nav-cta" style="display:none" id="navCtaDesktop">${cta}</div>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
    </div>`;

  const mq = window.matchMedia('(min-width:861px)');
  function layoutCta(){
    const panel = document.getElementById('navLinks');
    const desktopSlot = document.getElementById('navCtaDesktop');
    const inlineCta = panel.querySelector('.nav-cta');
    if (mq.matches){
      desktopSlot.style.display = 'flex';
      desktopSlot.style.gap = '10px';
      desktopSlot.style.alignItems = 'center';
      if (inlineCta) inlineCta.style.display = 'none';
    } else {
      desktopSlot.style.display = 'none';
      if (inlineCta) inlineCta.style.display = 'flex';
    }
  }
  layoutCta();
  mq.addEventListener('change', layoutCta);
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

function renderFooter(){
  const foot = document.getElementById('footer');
  if (!foot) return;
  foot.innerHTML = `
    <div class="container">
      <div class="foot-grid">
        <div>
          <div class="foot-brand">International Learning Platform</div>
          <p style="font-size:.88rem;max-width:34ch;">Live, 1-to-1 online Quran classes with qualified tutors — Hifz, Tajweed, Recitation and Arabic, for every age.</p>
        </div>
        <div>
          <h4>Learn</h4>
          <a href="courses.html">Courses</a>
          <a href="tutors.html">Tutors</a>
          <a href="pricing.html">Pricing</a>
        </div>
        <div>
          <h4>Platform</h4>
          <a href="about.html">About us</a>
          <a href="tutors.html">Become a tutor</a>
        </div>
        <div>
          <h4>Account</h4>
          <a href="login.html">Login</a>
          <a href="register.html">Register</a>
        </div>
      </div>
      <div class="foot-bottom">© 2026 International Learning Platform. All rights reserved.</div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav(document.body.dataset.page || '');
  renderFooter();
});
