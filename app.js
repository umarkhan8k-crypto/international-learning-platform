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
  const rawPath = location.pathname.split('/').pop() || 'index.html';
  const currentFile = rawPath.replace(/\.html$/, '') || 'index';
  const profilePages = ['profile','profile-setup'];
  const onProfilePage = profilePages.includes(currentFile);
  const cta = user
    ? `<a class="nav-user ${onProfilePage ? 'active' : ''}" href="profile.html">Your Profile</a>
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

  // Desktop shows cta inline next to links; mobile shows inside the sliding panel.
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
      <div class="foot-social">
        <a href="#" target="_blank" rel="noopener">Twitter</a>
        <a href="#" target="_blank" rel="noopener">Facebook</a>
        <a href="#" target="_blank" rel="noopener">Instagram</a>
      </div>
      <div class="foot-bottom">© 2026 International Learning Platform. All rights reserved.</div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav(document.body.dataset.page || '');
  renderFooter();
});
const COUNTRIES = [
{n:'Afghanistan',d:"93",f:"🇦🇫"},
{n:'Albania',d:"355",f:"🇦🇱"},
{n:'Algeria',d:"213",f:"🇩🇿"},
{n:'Andorra',d:"376",f:"🇦🇩"},
{n:'Angola',d:"244",f:"🇦🇴"},
{n:'Argentina',d:"54",f:"🇦🇷"},
{n:'Armenia',d:"374",f:"🇦🇲"},
{n:'Australia',d:"61",f:"🇦🇺"},
{n:'Austria',d:"43",f:"🇦🇹"},
{n:'Azerbaijan',d:"994",f:"🇦🇿"},
{n:'Bahamas',d:"1",f:"🇧🇸"},
{n:'Bahrain',d:"973",f:"🇧🇭"},
{n:'Bangladesh',d:"880",f:"🇧🇩"},
{n:'Barbados',d:"1",f:"🇧🇧"},
{n:'Belarus',d:"375",f:"🇧🇾"},
{n:'Belgium',d:"32",f:"🇧🇪"},
{n:'Belize',d:"501",f:"🇧🇿"},
{n:'Benin',d:"229",f:"🇧🇯"},
{n:'Bhutan',d:"975",f:"🇧🇹"},
{n:'Bolivia',d:"591",f:"🇧🇴"},
{n:'Bosnia and Herzegovina',d:"387",f:"🇧🇦"},
{n:'Botswana',d:"267",f:"🇧🇼"},
{n:'Brazil',d:"55",f:"🇧🇷"},
{n:'Brunei',d:"673",f:"🇧🇳"},
{n:'Bulgaria',d:"359",f:"🇧🇬"},
{n:'Burkina Faso',d:"226",f:"🇧🇫"},
{n:'Burundi',d:"257",f:"🇧🇮"},
{n:'Cambodia',d:"855",f:"🇰🇭"},
{n:'Cameroon',d:"237",f:"🇨🇲"},
{n:'Canada',d:"1",f:"🇨🇦"},
{n:'Cape Verde',d:"238",f:"🇨🇻"},
{n:'Central African Republic',d:"236",f:"🇨🇫"},
{n:'Chad',d:"235",f:"🇹🇩"},
{n:'Chile',d:"56",f:"🇨🇱"},
{n:'China',d:"86",f:"🇨🇳"},
{n:'Colombia',d:"57",f:"🇨🇴"},
{n:'Comoros',d:"269",f:"🇰🇲"},
{n:'Congo',d:"242",f:"🇨🇬"},
{n:'Costa Rica',d:"506",f:"🇨🇷"},
{n:'Croatia',d:"385",f:"🇭🇷"},
{n:'Cuba',d:"53",f:"🇨🇺"},
{n:'Cyprus',d:"357",f:"🇨🇾"},
{n:'Czech Republic',d:"420",f:"🇨🇿"},
{n:'DR Congo',d:"243",f:"🇨🇩"},
{n:'Denmark',d:"45",f:"🇩🇰"},
{n:'Djibouti',d:"253",f:"🇩🇯"},
{n:'Dominica',d:"1",f:"🇩🇲"},
{n:'Dominican Republic',d:"1",f:"🇩🇴"},
{n:'Ecuador',d:"593",f:"🇪🇨"},
{n:'Egypt',d:"20",f:"🇪🇬"},
{n:'El Salvador',d:"503",f:"🇸🇻"},
{n:'Equatorial Guinea',d:"240",f:"🇬🇶"},
{n:'Eritrea',d:"291",f:"🇪🇷"},
{n:'Estonia',d:"372",f:"🇪🇪"},
{n:'Eswatini',d:"268",f:"🇸🇿"},
{n:'Ethiopia',d:"251",f:"🇪🇹"},
{n:'Fiji',d:"679",f:"🇫🇯"},
{n:'Finland',d:"358",f:"🇫🇮"},
{n:'France',d:"33",f:"🇫🇷"},
{n:'Gabon',d:"241",f:"🇬🇦"},
{n:'Gambia',d:"220",f:"🇬🇲"},
{n:'Georgia',d:"995",f:"🇬🇪"},
{n:'Germany',d:"49",f:"🇩🇪"},
{n:'Ghana',d:"233",f:"🇬🇭"},
{n:'Greece',d:"30",f:"🇬🇷"},
{n:'Grenada',d:"1",f:"🇬🇩"},
{n:'Guatemala',d:"502",f:"🇬🇹"},
{n:'Guinea',d:"224",f:"🇬🇳"},
{n:'Guinea-Bissau',d:"245",f:"🇬🇼"},
{n:'Guyana',d:"592",f:"🇬🇾"},
{n:'Haiti',d:"509",f:"🇭🇹"},
{n:'Honduras',d:"504",f:"🇭🇳"},
{n:'Hungary',d:"36",f:"🇭🇺"},
{n:'Iceland',d:"354",f:"🇮🇸"},
{n:'India',d:"91",f:"🇮🇳"},
{n:'Indonesia',d:"62",f:"🇮🇩"},
{n:'Iran',d:"98",f:"🇮🇷"},
{n:'Iraq',d:"964",f:"🇮🇶"},
{n:'Ireland',d:"353",f:"🇮🇪"},
{n:'Israel',d:"972",f:"🇮🇱"},
{n:'Italy',d:"39",f:"🇮🇹"},
{n:'Ivory Coast',d:"225",f:"🇨🇮"},
{n:'Jamaica',d:"1",f:"🇯🇲"},
{n:'Japan',d:"81",f:"🇯🇵"},
{n:'Jordan',d:"962",f:"🇯🇴"},
{n:'Kazakhstan',d:"7",f:"🇰🇿"},
{n:'Kenya',d:"254",f:"🇰🇪"},
{n:'Kiribati',d:"686",f:"🇰🇮"},
{n:'Kosovo',d:"383",f:"🇽🇰"},
{n:'Kuwait',d:"965",f:"🇰🇼"},
{n:'Kyrgyzstan',d:"996",f:"🇰🇬"},
{n:'Laos',d:"856",f:"🇱🇦"},
{n:'Latvia',d:"371",f:"🇱🇻"},
{n:'Lebanon',d:"961",f:"🇱🇧"},
{n:'Lesotho',d:"266",f:"🇱🇸"},
{n:'Liberia',d:"231",f:"🇱🇷"},
{n:'Libya',d:"218",f:"🇱🇾"},
{n:'Liechtenstein',d:"423",f:"🇱🇮"},
{n:'Lithuania',d:"370",f:"🇱🇹"},
{n:'Luxembourg',d:"352",f:"🇱🇺"},
{n:'Madagascar',d:"261",f:"🇲🇬"},
{n:'Malawi',d:"265",f:"🇲🇼"},
{n:'Malaysia',d:"60",f:"🇲🇾"},
{n:'Maldives',d:"960",f:"🇲🇻"},
{n:'Mali',d:"223",f:"🇲🇱"},
{n:'Malta',d:"356",f:"🇲🇹"},
{n:'Marshall Islands',d:"692",f:"🇲🇭"},
{n:'Mauritania',d:"222",f:"🇲🇷"},
{n:'Mauritius',d:"230",f:"🇲🇺"},
{n:'Mexico',d:"52",f:"🇲🇽"},
{n:'Micronesia',d:"691",f:"🇫🇲"},
{n:'Moldova',d:"373",f:"🇲🇩"},
{n:'Monaco',d:"377",f:"🇲🇨"},
{n:'Mongolia',d:"976",f:"🇲🇳"},
{n:'Montenegro',d:"382",f:"🇲🇪"},
{n:'Morocco',d:"212",f:"🇲🇦"},
{n:'Mozambique',d:"258",f:"🇲🇿"},
{n:'Myanmar',d:"95",f:"🇲🇲"},
{n:'Namibia',d:"264",f:"🇳🇦"},
{n:'Nauru',d:"674",f:"🇳🇷"},
{n:'Nepal',d:"977",f:"🇳🇵"},
{n:'Netherlands',d:"31",f:"🇳🇱"},
{n:'New Zealand',d:"64",f:"🇳🇿"},
{n:'Nicaragua',d:"505",f:"🇳🇮"},
{n:'Niger',d:"227",f:"🇳🇪"},
{n:'Nigeria',d:"234",f:"🇳🇬"},
{n:'North Korea',d:"850",f:"🇰🇵"},
{n:'North Macedonia',d:"389",f:"🇲🇰"},
{n:'Norway',d:"47",f:"🇳🇴"},
{n:'Oman',d:"968",f:"🇴🇲"},
{n:'Pakistan',d:"92",f:"🇵🇰"},
{n:'Palau',d:"680",f:"🇵🇼"},
{n:'Palestine',d:"970",f:"🇵🇸"},
{n:'Panama',d:"507",f:"🇵🇦"},
{n:'Papua New Guinea',d:"675",f:"🇵🇬"},
{n:'Paraguay',d:"595",f:"🇵🇾"},
{n:'Peru',d:"51",f:"🇵🇪"},
{n:'Philippines',d:"63",f:"🇵🇭"},
{n:'Poland',d:"48",f:"🇵🇱"},
{n:'Portugal',d:"351",f:"🇵🇹"},
{n:'Qatar',d:"974",f:"🇶🇦"},
{n:'Romania',d:"40",f:"🇷🇴"},
{n:'Russia',d:"7",f:"🇷🇺"},
{n:'Rwanda',d:"250",f:"🇷🇼"},
{n:'Saint Kitts and Nevis',d:"1",f:"🇰🇳"},
{n:'Saint Lucia',d:"1",f:"🇱🇨"},
{n:'Saint Vincent and the Grenadines',d:"1",f:"🇻🇨"},
{n:'Samoa',d:"685",f:"🇼🇸"},
{n:'San Marino',d:"378",f:"🇸🇲"},
{n:'Sao Tome and Principe',d:"239",f:"🇸🇹"},
{n:'Saudi Arabia',d:"966",f:"🇸🇦"},
{n:'Senegal',d:"221",f:"🇸🇳"},
{n:'Serbia',d:"381",f:"🇷🇸"},
{n:'Seychelles',d:"248",f:"🇸🇨"},
{n:'Sierra Leone',d:"232",f:"🇸🇱"},
{n:'Singapore',d:"65",f:"🇸🇬"},
{n:'Slovakia',d:"421",f:"🇸🇰"},
{n:'Slovenia',d:"386",f:"🇸🇮"},
{n:'Solomon Islands',d:"677",f:"🇸🇧"},
{n:'Somalia',d:"252",f:"🇸🇴"},
{n:'South Africa',d:"27",f:"🇿🇦"},
{n:'South Korea',d:"82",f:"🇰🇷"},
{n:'South Sudan',d:"211",f:"🇸🇸"},
{n:'Spain',d:"34",f:"🇪🇸"},
{n:'Sri Lanka',d:"94",f:"🇱🇰"},
{n:'Sudan',d:"249",f:"🇸🇩"},
{n:'Suriname',d:"597",f:"🇸🇷"},
{n:'Sweden',d:"46",f:"🇸🇪"},
{n:'Switzerland',d:"41",f:"🇨🇭"},
{n:'Syria',d:"963",f:"🇸🇾"},
{n:'Taiwan',d:"886",f:"🇹🇼"},
{n:'Tajikistan',d:"992",f:"🇹🇯"},
{n:'Tanzania',d:"255",f:"🇹🇿"},
{n:'Thailand',d:"66",f:"🇹🇭"},
{n:'Timor-Leste',d:"670",f:"🇹🇱"},
{n:'Togo',d:"228",f:"🇹🇬"},
{n:'Tonga',d:"676",f:"🇹🇴"},
{n:'Trinidad and Tobago',d:"1",f:"🇹🇹"},
{n:'Tunisia',d:"216",f:"🇹🇳"},
{n:'Turkey',d:"90",f:"🇹🇷"},
{n:'Turkmenistan',d:"993",f:"🇹🇲"},
{n:'Tuvalu',d:"688",f:"🇹🇻"},
{n:'Uganda',d:"256",f:"🇺🇬"},
{n:'Ukraine',d:"380",f:"🇺🇦"},
{n:'United Arab Emirates',d:"971",f:"🇦🇪"},
{n:'United Kingdom',d:"44",f:"🇬🇧"},
{n:'United States',d:"1",f:"🇺🇸"},
{n:'Uruguay',d:"598",f:"🇺🇾"},
{n:'Uzbekistan',d:"998",f:"🇺🇿"},
{n:'Vanuatu',d:"678",f:"🇻🇺"},
{n:'Vatican City',d:"379",f:"🇻🇦"},
{n:'Venezuela',d:"58",f:"🇻🇪"},
{n:'Vietnam',d:"84",f:"🇻🇳"},
{n:'Yemen',d:"967",f:"🇾🇪"},
{n:'Zambia',d:"260",f:"🇿🇲"},
{n:'Zimbabwe',d:"263",f:"🇿🇼"}
];
/* ===================================================================
   Languages list
   =================================================================== */
const LANGUAGES = [
  'English','Urdu','Arabic','French','Spanish','Turkish','Bengali','Hindi',
  'Indonesian','Malay','Pashto','Persian (Farsi)','Somali','Swahili','Hausa',
  'Punjabi','Sindhi','Balochi','German','Russian','Chinese (Mandarin)','Portuguese',
  'Italian','Dutch','Rohingya','Amharic','Tamil','Bosnian','Albanian'
];

/* ===================================================================
   Profile storage
   =================================================================== */
function getProfile(email){
  const profiles = DB.read('ilp_profiles', {});
  return profiles[email] || null;
}
function saveProfile(email, data){
  const profiles = DB.read('ilp_profiles', {});
  profiles[email] = { ...(profiles[email] || {}), ...data };
  DB.write('ilp_profiles', profiles);
  return profiles[email];
}

/* ===================================================================
   File -> data URL helper
   =================================================================== */
function readFileAsDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ===================================================================
   Generic outside-click-closes helper
   =================================================================== */
function closeOnOutsideClick(panelEl, toggleEl, closeFn){
  function handler(e){
    if (!panelEl.contains(e.target) && !toggleEl.contains(e.target)){
      closeFn();
      document.removeEventListener('click', handler, true);
    }
  }
  document.addEventListener('click', handler, true);
}

/* ===================================================================
   Phone picker — flag + country code + number, with a searchable
   A-Z country dropdown.
   =================================================================== */
function initPhonePicker(mount, opts){
  opts = opts || {};
  let country = opts.defaultCountry
    ? COUNTRIES.find(c => c.n.toLowerCase() === String(opts.defaultCountry).toLowerCase())
    : null;
  if (!country) country = COUNTRIES.find(c => c.n === 'Pakistan') || COUNTRIES[0];

  mount.innerHTML = `
    <div class="phone-picker">
      <button type="button" class="phone-code-btn">
        <span class="pc-flag">${country.f}</span>
        <span class="pc-dial">+${country.d}</span>
        <span class="pc-caret">▾</span>
      </button>
      <input type="tel" class="phone-input phone-number" placeholder="e.g. 300 1234567" inputmode="tel">
      <div class="country-panel">
        <div class="country-search-wrap">
          <input type="text" class="country-search" placeholder="Search country...">
        </div>
        <div class="country-list"></div>
      </div>
    </div>`;

  const btn = mount.querySelector('.phone-code-btn');
  const panel = mount.querySelector('.country-panel');
  const searchInput = mount.querySelector('.country-search');
  const listEl = mount.querySelector('.country-list');
  const numberInput = mount.querySelector('.phone-number');
  const flagEl = mount.querySelector('.pc-flag');
  const dialEl = mount.querySelector('.pc-dial');

  function renderList(filter){
    const f = (filter || '').trim().toLowerCase();
    const items = COUNTRIES.filter(c => !f || c.n.toLowerCase().includes(f) || c.d.includes(f));
    listEl.innerHTML = items.map(c =>
      `<div class="country-opt" data-name="${c.n}">
         <span class="co-flag">${c.f}</span>
         <span class="co-name">${c.n}</span>
         <span class="co-dial">+${c.d}</span>
       </div>`).join('') || `<div class="country-empty">No matches</div>`;
  }

  function openPanel(){
    renderList('');
    panel.classList.add('open');
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 30);
    closeOnOutsideClick(panel, btn, closePanel);
  }
  function closePanel(){ panel.classList.remove('open'); }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  searchInput.addEventListener('input', () => renderList(searchInput.value));
  listEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.country-opt');
    if (!opt) return;
    const found = COUNTRIES.find(c => c.n === opt.dataset.name);
    if (found){
      country = found;
      flagEl.textContent = country.f;
      dialEl.textContent = '+' + country.d;
    }
    closePanel();
  });

  return {
    getFullNumber(){
      const num = numberInput.value.trim();
      if (!num) return '';
      return `+${country.d} ${num}`;
    },
    setCountryByName(name){
      if (!name) return;
      const found = COUNTRIES.find(c => c.n.toLowerCase() === String(name).toLowerCase());
      if (found){
        country = found;
        flagEl.textContent = country.f;
        dialEl.textContent = '+' + country.d;
      }
    },
  };
}

/* ===================================================================
   Country select — single value, searchable A-Z dropdown with flags.
   Used for the plain "Country" field.
   =================================================================== */
function initCountrySelect(mount, opts){
  opts = opts || {};
  let selected = opts.defaultValue
    ? COUNTRIES.find(c => c.n.toLowerCase() === String(opts.defaultValue).toLowerCase())
    : null;

  mount.innerHTML = `
    <div class="phone-picker">
      <button type="button" class="phone-code-btn" style="flex:1;justify-content:flex-start;">
        <span class="pc-flag cs-flag">${selected ? selected.f : '🌐'}</span>
        <span class="pc-dial cs-name" style="font-weight:500;">${selected ? selected.n : (opts.placeholder || 'Select your country')}</span>
        <span class="pc-caret" style="margin-inline-start:auto;">▾</span>
      </button>
      <div class="country-panel">
        <div class="country-search-wrap">
          <input type="text" class="country-search" placeholder="Search country...">
        </div>
        <div class="country-list"></div>
      </div>
    </div>`;

  const btn = mount.querySelector('.phone-code-btn');
  const panel = mount.querySelector('.country-panel');
  const searchInput = mount.querySelector('.country-search');
  const listEl = mount.querySelector('.country-list');
  const flagEl = mount.querySelector('.cs-flag');
  const nameEl = mount.querySelector('.cs-name');

  function renderList(filter){
    const f = (filter || '').trim().toLowerCase();
    const items = COUNTRIES.filter(c => !f || c.n.toLowerCase().includes(f));
    listEl.innerHTML = items.map(c =>
      `<div class="country-opt" data-name="${c.n}">
         <span class="co-flag">${c.f}</span>
         <span class="co-name">${c.n}</span>
       </div>`).join('') || `<div class="country-empty">No matches</div>`;
  }
  function openPanel(){
    renderList('');
    panel.classList.add('open');
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 30);
    closeOnOutsideClick(panel, btn, closePanel);
  }
  function closePanel(){ panel.classList.remove('open'); }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  searchInput.addEventListener('input', () => renderList(searchInput.value));
  listEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.country-opt');
    if (!opt) return;
    const found = COUNTRIES.find(c => c.n === opt.dataset.name);
    if (found){
      selected = found;
      flagEl.textContent = found.f;
      nameEl.textContent = found.n;
      nameEl.style.color = 'var(--ink)';
      if (opts.onChange) opts.onChange(found.n);
    }
    closePanel();
  });

  return {
    getValue(){ return selected ? selected.n : ''; },
    setValue(name){
      const found = COUNTRIES.find(c => c.n.toLowerCase() === String(name).toLowerCase());
      if (found){
        selected = found;
        flagEl.textContent = found.f;
        nameEl.textContent = found.n;
      }
    },
  };
}

/* ===================================================================
   Chip picker — free-text chips with autocomplete suggestions
   (used for "Languages you speak")
   =================================================================== */
function initChipPicker(mount, opts){
  opts = opts || {};
  const options = opts.options || [];
  let values = [];

  mount.innerHTML = `
    <div class="chip-box">
      <div class="chip-list"></div>
      <input type="text" class="chip-input" placeholder="${opts.placeholder || 'Type and press Enter...'}">
      <div class="chip-suggest"></div>
    </div>`;

  const chipList = mount.querySelector('.chip-list');
  const input = mount.querySelector('.chip-input');
  const suggestBox = mount.querySelector('.chip-suggest');

  function renderChips(){
    chipList.innerHTML = values.map((v, i) =>
      `<span class="chip">${v}<button type="button" data-i="${i}" aria-label="Remove">×</button></span>`).join('');
  }
  function addValue(v){
    v = v.trim();
    if (!v) return;
    if (values.some(x => x.toLowerCase() === v.toLowerCase())) { input.value = ''; hideSuggest(); return; }
    values.push(v);
    renderChips();
    input.value = '';
    hideSuggest();
  }
  function hideSuggest(){ suggestBox.classList.remove('open'); suggestBox.innerHTML = ''; }
  function showSuggest(filter){
    const f = filter.trim().toLowerCase();
    const matches = options.filter(o =>
      o.toLowerCase().includes(f) && !values.some(v => v.toLowerCase() === o.toLowerCase()));
    if (!f || !matches.length){ hideSuggest(); return; }
    suggestBox.innerHTML = matches.slice(0, 8).map(o => `<div class="chip-opt">${o}</div>`).join('');
    suggestBox.classList.add('open');
  }

  chipList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-i]');
    if (!btn) return;
    values.splice(Number(btn.dataset.i), 1);
    renderChips();
  });
  input.addEventListener('input', () => showSuggest(input.value));
  input.addEventListener('focus', () => { if (input.value) showSuggest(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ','){
      e.preventDefault();
      addValue(input.value);
    } else if (e.key === 'Backspace' && !input.value && values.length){
      values.pop();
      renderChips();
    }
  });
  suggestBox.addEventListener('click', (e) => {
    const opt = e.target.closest('.chip-opt');
    if (!opt) return;
    addValue(opt.textContent);
  });
  closeOnOutsideClick(suggestBox, input, hideSuggest);

  return {
    getValues(){ return values.slice(); },
    setValues(arr){ values = (arr || []).slice(); renderChips(); },
  };
}

/* ===================================================================
   Subject picker — closed checkbox dropdown; nothing shows until
   the box itself is clicked. Selected subjects render as chips
   in the closed box.
   =================================================================== */
function initSubjectPicker(mount, opts){
  opts = opts || {};
  const options = opts.options || [];
  let values = [];

  mount.innerHTML = `
    <div class="subject-picker">
      <button type="button" class="subject-box">
        <span class="subject-chip-list"><span class="subject-placeholder">${opts.placeholder || 'Tap to choose subjects'}</span></span>
        <span class="pc-caret">▾</span>
      </button>
      <div class="subject-panel">
        ${options.map(o => `
          <label class="subject-opt">
            <input type="checkbox" value="${o}">
            <span>${o}</span>
          </label>`).join('')}
      </div>
    </div>`;

  const box = mount.querySelector('.subject-box');
  const panel = mount.querySelector('.subject-panel');
  const chipListEl = mount.querySelector('.subject-chip-list');
  const checks = Array.from(mount.querySelectorAll('.subject-opt input'));

  function renderChips(){
    if (!values.length){
      chipListEl.innerHTML = `<span class="subject-placeholder">${opts.placeholder || 'Tap to choose subjects'}</span>`;
      return;
    }
    chipListEl.innerHTML = values.map(v => `<span class="chip">${v}</span>`).join('');
  }
  function openPanel(){ panel.classList.add('open'); closeOnOutsideClick(panel, box, closePanel); }
  function closePanel(){ panel.classList.remove('open'); }

  box.addEventListener('click', (e) => {
    e.stopPropagation();
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  checks.forEach(chk => {
    chk.addEventListener('change', () => {
      values = checks.filter(c => c.checked).map(c => c.value);
      renderChips();
    });
  });

  return {
    getValues(){ return values.slice(); },
    setValues(arr){
      values = (arr || []).slice();
      checks.forEach(c => { c.checked = values.includes(c.value); });
      renderChips();
    },
  };
}

/* ===================================================================
   Upload box helper — swaps the "tap to upload" prompt for a
   preview once a file is chosen (image thumbnail, or a filled
   file badge for non-image files). Works for photo / certificate /
   audio uploads alike.
   =================================================================== */
function initUploadBox(mount, opts){
  opts = opts || {}; // { accept, kind: 'image'|'file'|'audio', label, previewShape:'circle'|'rect' }
  const kind = opts.kind || 'file';
  mount.classList.add('upload-slot');
  mount.innerHTML = `
    <label class="upload-box">
      <input type="file" accept="${opts.accept || ''}">
      <span class="upload-prompt">${opts.label || 'Tap to upload'}</span>
    </label>
    <div class="upload-preview ${opts.previewShape === 'circle' ? 'circle' : ''}" style="display:none;">
      <div class="upload-preview-media"></div>
      <button type="button" class="upload-clear">Change</button>
    </div>
    <div class="upload-status"></div>
  `;
  const input = mount.querySelector('input[type=file]');
  const promptLabel = mount.querySelector('.upload-box');
  const preview = mount.querySelector('.upload-preview');
  const mediaEl = mount.querySelector('.upload-preview-media');
  const statusEl = mount.querySelector('.upload-status');
  let dataUrl = '';
  let fileName = '';

  function showPreview(){
    promptLabel.style.display = 'none';
    preview.style.display = 'flex';
    if (kind === 'image'){
      mediaEl.innerHTML = `<img src="${dataUrl}">`;
    } else if (kind === 'audio'){
      mediaEl.innerHTML = `<span class="upload-file-badge">🎙️ ${fileName}</span>`;
    } else {
      mediaEl.innerHTML = `<span class="upload-file-badge">📄 ${fileName}</span>`;
    }
  }
  function clear(){
    dataUrl = ''; fileName = '';
    input.value = '';
    promptLabel.style.display = 'flex';
    preview.style.display = 'none';
    mediaEl.innerHTML = '';
    if (opts.onClear) opts.onClear();
  }
  mount.querySelector('.upload-clear').addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    clear();
    setStatus('');
  });

  function setStatus(msg, type){
    statusEl.textContent = msg || '';
    statusEl.className = 'upload-status' + (type ? ' ' + type : '');
  }

  input.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    fileName = f.name;
    dataUrl = await readFileAsDataURL(f);
    showPreview();
    setStatus('');
    if (opts.onChange) opts.onChange(dataUrl, f);
  });

  return {
    getValue(){ return dataUrl; },
    getFileName(){ return fileName; },
    clear,
    setStatus,
  };
}

/* ===================================================================
   OCR text extraction — used to sanity-check uploaded certificates.
   Requires Tesseract.js to be included on the page (window.Tesseract).
   This is a best-effort keyword check, not a guarantee of authenticity.
   =================================================================== */
async function ocrExtractText(dataUrl){
  if (typeof Tesseract === 'undefined') return '';
  try{
    const result = await Tesseract.recognize(dataUrl, 'eng');
    return (result && result.data && result.data.text) ? result.data.text.toLowerCase() : '';
  }catch(e){
    console.error('OCR failed', e);
    return '';
  }
}

/* ===================================================================
   Read an audio file's duration (in seconds) before accepting it.
   =================================================================== */
function getAudioDuration(file){
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      const d = audio.duration;
      URL.revokeObjectURL(url);
      resolve(d);
    };
    audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read audio file')); };
    audio.src = url;
  });
}

/* ===================================================================
   Side navigation for account pages (profile / dashboard)
   =================================================================== */
function renderSideNav(mountId, active){
  const el = document.getElementById(mountId);
  if (!el) return;
  const user = currentUser();
  if (!user) return;
  const links = [
    ['dashboard.html','Dashboard'],
    ['profile.html','Profile'],
  ];
  el.innerHTML = links.map(([href,label]) =>
    `<a href="${href}" class="${active===label?'active':''}">${label}</a>`).join('') +
    `<a href="#" onclick="logout();return false;">Log out</a>`;
}
