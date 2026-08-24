/* ===== International Learning Platform — shared app logic (API-backed) ===== */

const API_BASE = 'https://ilp-backend-production-77a4.up.railway.app/api';

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

/* ---------- old localStorage helper (still used by courses/tutors/pricing pages for now) ---------- */
const DB = {
  read(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  write(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
};

/* ---------- seed tutors (first run only) — will be replaced by /api/tutors later ---------- */
function seedTutors(){
  if (DB.read('ilp_tutors', null)) return;
  const tutors = [
    { id:'t1', name:'Ustadh Ahmad Rahman', gender:'Male', subjects:['Hifz','Tajweed'], languages:['English','Urdu'], country:'Egypt', rating:5.0, reviews:142, price:8, exp:'7 years', bio:'Al-Azhar certified hafiz specializing in Hifz for kids and adults.' },
    { id:'t2', name:'Ustadha Maryam Siddiqui', gender:'Female', subjects:['Qaida','Recitation'], languages:['English','Urdu'], country:'Pakistan', rating:4.9, reviews:98, price:7, exp:'5 years', bio:'Patient, kid-friendly teacher for Noorani Qaida and beginner recitation.' },
    { id:'t3', name:'Ustadh Bilal Hassan', gender:'Male', subjects:['Recitation','Arabic'], languages:['English','Arabic'], country:'Jordan', rating:4.8, reviews:76, price:9, exp:'6 years', bio:'Native Arabic speaker teaching Quranic Arabic grammar and reading.' },
    { id:'t4', name:'Ustadha Aisha Noor', gender:'Female', subjects:['Hifz','Tajweed'], languages:['English'], country:'UK', rating:5.0, reviews:210, price:11, exp:'9 years', bio:'Ijazah-holder guiding full Quran memorization journeys for adults.' },
    { id:'t5', name:'Ustadh Younus Khan', gender:'Male', subjects:['Tajweed','Recitation'], languages:['English','Urdu'], country:'Pakistan', rating:4.7, reviews:64, price:6, exp:'4 years', bio:'Focused, structured Tajweed correction classes for all levels.' },
    { id:'t6', name:'Ustadha Sara Idris', gender:'Female', subjects:['Arabic','Qaida'], languages:['English','Arabic'], country:'Morocco', rating:4.9, reviews:120, price:8, exp:'6 years', bio:'Makes Arabic grammar simple with a conversational teaching style.' },
  ];
  DB.write('ilp_tutors', tutors);
}
seedTutors();

/* ---------- auth (now backed by the real API) ---------- */
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
