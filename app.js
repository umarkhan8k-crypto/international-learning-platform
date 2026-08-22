/* ===== International Learning Platform — shared app logic (localStorage-backed) ===== */

const ORNAMENT = `<svg class="ornament" viewBox="0 0 100 100"><path d="M50 2 L61 39 L98 39 L68 61 L79 98 L50 75 L21 98 L32 61 L2 39 L39 39 Z"/></svg>`;

const DB = {
  read(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } },
  write(key, val){ localStorage.setItem(key, JSON.stringify(val)); },
};

/* ---------- seed tutors (first run only) ---------- */
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

function currentUser(){ return DB.read('ilp_current_user', null); }
function setCurrentUser(u){ DB.write('ilp_current_user', u); }
function logout(){ localStorage.removeItem('ilp_current_user'); location.href = 'index.html'; }
function initials(name){
  return (name||'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
}

/* ---------- profiles (tutor / student extended data) ---------- */
function getProfile(email){
  const profiles = DB.read('ilp_profiles', {});
  return profiles[email] || null;
}
function saveProfile(email, data){
  const profiles = DB.read('ilp_profiles', {});
  profiles[email] = Object.assign({}, profiles[email]||{}, data);
  DB.write('ilp_profiles', profiles);
  return profiles[email];
}

/* ---------- countries (name, ISO2, dial code) ---------- */
const COUNTRIES = [
["Afghanistan","AF","93"],["Albania","AL","355"],["Algeria","DZ","213"],["Andorra","AD","376"],
["Angola","AO","244"],["Argentina","AR","54"],["Armenia","AM","374"],["Australia","AU","61"],
["Austria","AT","43"],["Azerbaijan","AZ","994"],["Bahamas","BS","1"],["Bahrain","BH","973"],
["Bangladesh","BD","880"],["Barbados","BB","1"],["Belarus","BY","375"],["Belgium","BE","32"],
["Belize","BZ","501"],["Benin","BJ","229"],["Bhutan","BT","975"],["Bolivia","BO","591"],
["Bosnia and Herzegovina","BA","387"],["Botswana","BW","267"],["Brazil","BR","55"],["Brunei","BN","673"],
["Bulgaria","BG","359"],["Burkina Faso","BF","226"],["Burundi","BI","257"],["Cambodia","KH","855"],
["Cameroon","CM","237"],["Canada","CA","1"],["Chad","TD","235"],["Chile","CL","56"],
["China","CN","86"],["Colombia","CO","57"],["Comoros","KM","269"],["Congo (DRC)","CD","243"],
["Congo (Republic)","CG","242"],["Costa Rica","CR","506"],["Croatia","HR","385"],["Cuba","CU","53"],
["Cyprus","CY","357"],["Czechia","CZ","420"],["Denmark","DK","45"],["Djibouti","DJ","253"],
["Dominican Republic","DO","1"],["Ecuador","EC","593"],["Egypt","EG","20"],["El Salvador","SV","503"],
["Eritrea","ER","291"],["Estonia","EE","372"],["Eswatini","SZ","268"],["Ethiopia","ET","251"],
["Fiji","FJ","679"],["Finland","FI","358"],["France","FR","33"],["Gabon","GA","241"],
["Gambia","GM","220"],["Georgia","GE","995"],["Germany","DE","49"],["Ghana","GH","233"],
["Greece","GR","30"],["Guatemala","GT","502"],["Guinea","GN","224"],["Guyana","GY","592"],
["Haiti","HT","509"],["Honduras","HN","504"],["Hong Kong","HK","852"],["Hungary","HU","36"],
["Iceland","IS","354"],["India","IN","91"],["Indonesia","ID","62"],["Iran","IR","98"],
["Iraq","IQ","964"],["Ireland","IE","353"],["Israel","IL","972"],["Italy","IT","39"],
["Ivory Coast","CI","225"],["Jamaica","JM","1"],["Japan","JP","81"],["Jordan","JO","962"],
["Kazakhstan","KZ","7"],["Kenya","KE","254"],["Kosovo","XK","383"],["Kuwait","KW","965"],
["Kyrgyzstan","KG","996"],["Laos","LA","856"],["Latvia","LV","371"],["Lebanon","LB","961"],
["Lesotho","LS","266"],["Liberia","LR","231"],["Libya","LY","218"],["Liechtenstein","LI","423"],
["Lithuania","LT","370"],["Luxembourg","LU","352"],["Macau","MO","853"],["Madagascar","MG","261"],
["Malawi","MW","265"],["Malaysia","MY","60"],["Maldives","MV","960"],["Mali","ML","223"],
["Malta","MT","356"],["Mauritania","MR","222"],["Mauritius","MU","230"],["Mexico","MX","52"],
["Moldova","MD","373"],["Monaco","MC","377"],["Mongolia","MN","976"],["Montenegro","ME","382"],
["Morocco","MA","212"],["Mozambique","MZ","258"],["Myanmar","MM","95"],["Namibia","NA","264"],
["Nepal","NP","977"],["Netherlands","NL","31"],["New Zealand","NZ","64"],["Nicaragua","NI","505"],
["Niger","NE","227"],["Nigeria","NG","234"],["North Korea","KP","850"],["North Macedonia","MK","389"],
["Norway","NO","47"],["Oman","OM","968"],["Pakistan","PK","92"],["Palestine","PS","970"],
["Panama","PA","507"],["Papua New Guinea","PG","675"],["Paraguay","PY","595"],["Peru","PE","51"],
["Philippines","PH","63"],["Poland","PL","48"],["Portugal","PT","351"],["Qatar","QA","974"],
["Romania","RO","40"],["Russia","RU","7"],["Rwanda","RW","250"],["Saudi Arabia","SA","966"],
["Senegal","SN","221"],["Serbia","RS","381"],["Seychelles","SC","248"],["Sierra Leone","SL","232"],
["Singapore","SG","65"],["Slovakia","SK","421"],["Slovenia","SI","386"],["Somalia","SO","252"],
["South Africa","ZA","27"],["South Korea","KR","82"],["South Sudan","SS","211"],["Spain","ES","34"],
["Sri Lanka","LK","94"],["Sudan","SD","249"],["Suriname","SR","597"],["Sweden","SE","46"],
["Switzerland","CH","41"],["Syria","SY","963"],["Taiwan","TW","886"],["Tajikistan","TJ","992"],
["Tanzania","TZ","255"],["Thailand","TH","66"],["Togo","TG","228"],["Trinidad and Tobago","TT","1"],
["Tunisia","TN","216"],["Turkey","TR","90"],["Turkmenistan","TM","993"],["Uganda","UG","256"],
["Ukraine","UA","380"],["United Arab Emirates","AE","971"],["United Kingdom","GB","44"],
["United States","US","1"],["Uruguay","UY","598"],["Uzbekistan","UZ","998"],["Vanuatu","VU","678"],
["Venezuela","VE","58"],["Vietnam","VN","84"],["Yemen","YE","967"],["Zambia","ZM","260"],
["Zimbabwe","ZW","263"],
].map(([n,c,d])=>({n,c,d}));

function isoToFlag(iso2){
  if(!iso2) return '🏳️';
  return iso2.toUpperCase().replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

/* ---------- languages ---------- */
const LANGUAGES = [
  "Arabic","English","Urdu","French","Spanish","Turkish","Indonesian","Malay","Bengali","Hindi",
  "Persian (Farsi)","Pashto","Somali","Swahili","Hausa","Bosnian","Albanian","German","Dutch",
  "Portuguese","Italian","Russian","Chinese (Mandarin)","Japanese","Korean","Tamil","Punjabi",
  "Sindhi","Gujarati","Amharic","Rohingya","Uzbek","Kazakh","Azerbaijani","Kurdish","Berber (Amazigh)",
];

/* ---------- searchable country/dial-code picker ---------- */
/* Renders a phone-row with a country flag+code button + tel input inside container `mount`.
   Returns {getDialCode(), getPhone(), getFullNumber()} */
function initPhonePicker(mount, opts){
  opts = opts || {};
  const defaultIso = opts.defaultIso || 'PK';
  let selected = COUNTRIES.find(c=>c.c===defaultIso) || COUNTRIES[0];
  mount.innerHTML = `
    <div class="phone-row">
      <div class="cc-picker">
        <button type="button" class="cc-btn"><span class="flag"></span><span class="dialtxt"></span><span class="car">▾</span></button>
        <div class="cc-panel">
          <input type="text" class="cc-search" placeholder="Search country...">
          <div class="cc-list"></div>
        </div>
      </div>
      <input type="tel" class="cc-phone" placeholder="Phone number" inputmode="tel">
    </div>`;
  const btn = mount.querySelector('.cc-btn');
  const panel = mount.querySelector('.cc-panel');
  const search = mount.querySelector('.cc-search');
  const list = mount.querySelector('.cc-list');
  const flagEl = mount.querySelector('.flag');
  const dialEl = mount.querySelector('.dialtxt');
  const phoneInput = mount.querySelector('.cc-phone');

  function renderList(filter){
    const f = (filter||'').trim().toLowerCase();
    let items = COUNTRIES;
    if (f){
      items = COUNTRIES.filter(c => c.n.toLowerCase().startsWith(f) || c.n.toLowerCase().includes(f) || c.d.startsWith(f));
      items.sort((a,b)=>{
        const aStarts = a.n.toLowerCase().startsWith(f) ? 0 : 1;
        const bStarts = b.n.toLowerCase().startsWith(f) ? 0 : 1;
        return aStarts - bStarts;
      });
    }
    list.innerHTML = items.map(c=>`<div class="cc-item" data-iso="${c.c}"><span class="flag">${isoToFlag(c.c)}</span><span>${c.n}</span><span class="dial">+${c.d}</span></div>`).join('');
  }
  function selectCountry(iso){
    selected = COUNTRIES.find(c=>c.c===iso) || selected;
    flagEl.textContent = isoToFlag(selected.c);
    dialEl.textContent = '+'+selected.d;
    panel.classList.remove('open');
  }
  selectCountry(defaultIso);
  renderList('');
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); panel.classList.toggle('open'); if(panel.classList.contains('open')){ search.value=''; renderList(''); search.focus(); } });
  search.addEventListener('input', ()=> renderList(search.value));
  list.addEventListener('click', (e)=>{
    const item = e.target.closest('.cc-item');
    if(item) selectCountry(item.dataset.iso);
  });
  document.addEventListener('click', (e)=>{ if(!mount.contains(e.target)) panel.classList.remove('open'); });

  return {
    getDialCode: ()=> selected.d,
    getIso: ()=> selected.c,
    getPhone: ()=> phoneInput.value.trim(),
    getFullNumber: ()=> phoneInput.value.trim() ? `+${selected.d} ${phoneInput.value.trim()}` : '',
    setValue: (iso, phone)=>{ if(iso) selectCountry(iso); if(phone) phoneInput.value = phone; },
  };
}

/* ---------- chip-style multi-select for languages (pick from list OR type manually) ---------- */
function initChipPicker(mount, opts){
  opts = opts || {};
  const options = opts.options || [];
  let chips = (opts.initial || []).slice();
  mount.innerHTML = `
    <div class="chip-suggest">
      <div class="chip-box">
        <span class="chip-list"></span>
        <input type="text" class="chip-input" placeholder="${opts.placeholder||'Type or select...'}">
      </div>
      <div class="chip-panel"></div>
    </div>`;
  const chipList = mount.querySelector('.chip-list');
  const input = mount.querySelector('.chip-input');
  const panel = mount.querySelector('.chip-panel');

  function renderChips(){
    chipList.innerHTML = chips.map(v=>`<span class="chip">${v}<button type="button" data-v="${v}">✕</button></span>`).join('');
  }
  function addChip(v){
    v = v.trim();
    if(!v || chips.includes(v)) return;
    chips.push(v);
    renderChips();
    input.value='';
    panel.classList.remove('open');
  }
  function renderPanel(filter){
    const f = (filter||'').trim().toLowerCase();
    const items = options.filter(o => !chips.includes(o) && o.toLowerCase().includes(f));
    if(!items.length){ panel.classList.remove('open'); return; }
    panel.innerHTML = items.map(o=>`<div class="chip-opt" data-v="${o}">${o}</div>`).join('');
    panel.classList.add('open');
  }
  input.addEventListener('focus', ()=> renderPanel(input.value));
  input.addEventListener('input', ()=> renderPanel(input.value));
  input.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); addChip(input.value); }
  });
  panel.addEventListener('click', (e)=>{
    const item = e.target.closest('.chip-opt');
    if(item) addChip(item.dataset.v);
  });
  chipList.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(btn){ chips = chips.filter(v=>v!==btn.dataset.v); renderChips(); }
  });
  document.addEventListener('click', (e)=>{ if(!mount.contains(e.target)) panel.classList.remove('open'); });
  renderChips();

  return { getValues: ()=> chips.slice() };
}

/* ---------- file -> base64 helper (for picture / certificate / audio previews) ---------- */
function readFileAsDataURL(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
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
    ? `<a class="nav-user" href="profile.html">${initials(user.firstName+' '+user.lastName)} · Profile</a>
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

/* ---------- dashboard sidebar (used on profile / dashboard pages) ---------- */
function renderSideNav(mountId, active){
  const mount = document.getElementById(mountId);
  if(!mount) return;
  const user = currentUser();
  if(!user) return;
  const tutorLinks = [
    ['profile.html','Profile'],['dashboard.html','Dashboard'],
    ['find-students.html','Find Students'],['plans.html','Plans'],['notifications.html','Notifications'],
  ];
  const studentLinks = [
    ['profile.html','Profile'],['dashboard.html','Dashboard'],
    ['tutors.html','Find Tutors'],['schedule.html','Schedule'],['notifications.html','Notifications'],
  ];
  const links = user.role==='tutor' ? tutorLinks : studentLinks;
  mount.innerHTML = links.map(([href,label])=>
    `<a href="${href}" class="${active===label?'active':''}">${label}</a>`).join('');
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
  try { renderNav(document.body.dataset.page || ''); } catch(e){ console.error('renderNav failed:', e); }
  try { renderFooter(); } catch(e){ console.error('renderFooter failed:', e); }
});

