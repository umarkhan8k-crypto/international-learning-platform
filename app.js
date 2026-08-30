/* ===== International Learning Platform — shared app logic (API-backed) ===== */

const API_BASE = 'https://ilp-backend-production-77a4.up.railway.app/api';

/* ---------- sound cues (generated tones — no audio files needed) ---------- */
let __audioCtx = null;
function playTone(freqs, stepDuration = 0.14){
  try{
    if (!__audioCtx) __audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (__audioCtx.state === 'suspended') __audioCtx.resume();
    const now = __audioCtx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = __audioCtx.createOscillator();
      const gain = __audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * stepDuration;
      const end = start + stepDuration;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain); gain.connect(__audioCtx.destination);
      osc.start(start); osc.stop(end);
    });
  }catch(err){ /* audio not supported/blocked — silently skip */ }
}
function playMessageSound(){ playTone([880, 1108]); }          // message sent / received
function playNotificationSound(){ playTone([660, 880, 1108]); } // generic new-notification chime
function playAcceptSound(){ playTone([523, 659, 784]); }        // request accepted / completed
function playDeclineSound(){ playTone([392, 311]); }            // request declined
function playRequestSentSound(){ playTone([784, 988]); }        // trial request successfully sent

const ORNAMENT = `<svg class="ornament" viewBox="0 0 100 100"><path d="M50 2 L61 39 L98 39 L68 61 L79 98 L50 75 L21 98 L32 61 L2 39 L39 39 Z"/></svg>`;

/* ---------- countries (name, iso2, dial code) ---------- */
const COUNTRIES = [
['Afghanistan','AF','+93'],['Albania','AL','+355'],['Algeria','DZ','+213'],['Andorra','AD','+376'],['Angola','AO','+244'],
['Argentina','AR','+54'],['Armenia','AM','+374'],['Australia','AU','+61'],['Austria','AT','+43'],['Azerbaijan','AZ','+994'],
['Bahamas','BS','+1'],['Bahrain','BH','+973'],['Bangladesh','BD','+880'],['Barbados','BB','+1'],['Belarus','BY','+375'],
['Belgium','BE','+32'],['Belize','BZ','+501'],['Benin','BJ','+229'],['Bhutan','BT','+975'],['Bolivia','BO','+591'],
['Bosnia and Herzegovina','BA','+387'],['Botswana','BW','+267'],['Brazil','BR','+55'],['Brunei','BN','+673'],['Bulgaria','BG','+359'],
['Burkina Faso','BF','+226'],['Burundi','BI','+257'],['Cambodia','KH','+855'],['Cameroon','CM','+237'],['Canada','CA','+1'],
['Cape Verde','CV','+238'],['Central African Republic','CF','+236'],['Chad','TD','+235'],['Chile','CL','+56'],['China','CN','+86'],
['Colombia','CO','+57'],['Comoros','KM','+269'],['Congo','CG','+242'],['Costa Rica','CR','+506'],['Croatia','HR','+385'],
['Cuba','CU','+53'],['Cyprus','CY','+357'],['Czech Republic','CZ','+420'],['Denmark','DK','+45'],['Djibouti','DJ','+253'],
['Dominica','DM','+1'],['Dominican Republic','DO','+1'],['DR Congo','CD','+243'],['Ecuador','EC','+593'],['Egypt','EG','+20'],
['El Salvador','SV','+503'],['Equatorial Guinea','GQ','+240'],['Eritrea','ER','+291'],['Estonia','EE','+372'],['Eswatini','SZ','+268'],
['Ethiopia','ET','+251'],['Fiji','FJ','+679'],['Finland','FI','+358'],['France','FR','+33'],['Gabon','GA','+241'],
['Gambia','GM','+220'],['Georgia','GE','+995'],['Germany','DE','+49'],['Ghana','GH','+233'],['Greece','GR','+30'],
['Grenada','GD','+1'],['Guatemala','GT','+502'],['Guinea','GN','+224'],['Guinea-Bissau','GW','+245'],['Guyana','GY','+592'],
['Haiti','HT','+509'],['Honduras','HN','+504'],['Hungary','HU','+36'],['Iceland','IS','+354'],['India','IN','+91'],
['Indonesia','ID','+62'],['Iran','IR','+98'],['Iraq','IQ','+964'],['Ireland','IE','+353'],['Israel','IL','+972'],
['Italy','IT','+39'],['Ivory Coast','CI','+225'],['Jamaica','JM','+1'],['Japan','JP','+81'],['Jordan','JO','+962'],
['Kazakhstan','KZ','+7'],['Kenya','KE','+254'],['Kiribati','KI','+686'],['Kuwait','KW','+965'],['Kyrgyzstan','KG','+996'],
['Laos','LA','+856'],['Latvia','LV','+371'],['Lebanon','LB','+961'],['Lesotho','LS','+266'],['Liberia','LR','+231'],
['Libya','LY','+218'],['Liechtenstein','LI','+423'],['Lithuania','LT','+370'],['Luxembourg','LU','+352'],['Madagascar','MG','+261'],
['Malawi','MW','+265'],['Malaysia','MY','+60'],['Maldives','MV','+960'],['Mali','ML','+223'],['Malta','MT','+356'],
['Mauritania','MR','+222'],['Mauritius','MU','+230'],['Mexico','MX','+52'],['Moldova','MD','+373'],['Monaco','MC','+377'],
['Mongolia','MN','+976'],['Montenegro','ME','+382'],['Morocco','MA','+212'],['Mozambique','MZ','+258'],['Myanmar','MM','+95'],
['Namibia','NA','+264'],['Nauru','NR','+674'],['Nepal','NP','+977'],['Netherlands','NL','+31'],['New Zealand','NZ','+64'],
['Nicaragua','NI','+505'],['Niger','NE','+227'],['Nigeria','NG','+234'],['North Korea','KP','+850'],['North Macedonia','MK','+389'],
['Norway','NO','+47'],['Oman','OM','+968'],['Pakistan','PK','+92'],['Palau','PW','+680'],['Palestine','PS','+970'],
['Panama','PA','+507'],['Papua New Guinea','PG','+675'],['Paraguay','PY','+595'],['Peru','PE','+51'],['Philippines','PH','+63'],
['Poland','PL','+48'],['Portugal','PT','+351'],['Qatar','QA','+974'],['Romania','RO','+40'],['Russia','RU','+7'],
['Rwanda','RW','+250'],['Saint Lucia','LC','+1'],['Samoa','WS','+685'],['San Marino','SM','+378'],['Saudi Arabia','SA','+966'],
['Senegal','SN','+221'],['Serbia','RS','+381'],['Seychelles','SC','+248'],['Sierra Leone','SL','+232'],['Singapore','SG','+65'],
['Slovakia','SK','+421'],['Slovenia','SI','+386'],['Solomon Islands','SB','+677'],['Somalia','SO','+252'],['South Africa','ZA','+27'],
['South Korea','KR','+82'],['South Sudan','SS','+211'],['Spain','ES','+34'],['Sri Lanka','LK','+94'],['Sudan','SD','+249'],
['Suriname','SR','+597'],['Sweden','SE','+46'],['Switzerland','CH','+41'],['Syria','SY','+963'],['Taiwan','TW','+886'],
['Tajikistan','TJ','+992'],['Tanzania','TZ','+255'],['Thailand','TH','+66'],['Timor-Leste','TL','+670'],['Togo','TG','+228'],
['Tonga','TO','+676'],['Trinidad and Tobago','TT','+1'],['Tunisia','TN','+216'],['Turkey','TR','+90'],['Turkmenistan','TM','+993'],
['Tuvalu','TV','+688'],['Uganda','UG','+256'],['Ukraine','UA','+380'],['United Arab Emirates','AE','+971'],['United Kingdom','GB','+44'],
['United States','US','+1'],['Uruguay','UY','+598'],['Uzbekistan','UZ','+998'],['Vanuatu','VU','+678'],['Vatican City','VA','+379'],
['Venezuela','VE','+58'],['Vietnam','VN','+84'],['Yemen','YE','+967'],['Zambia','ZM','+260'],['Zimbabwe','ZW','+263'],
].map(([name,code,dial])=>({name,code,dial})).sort((a,b)=>a.name.localeCompare(b.name));

function flagEmoji(iso2){
  if (!iso2) return '';
  return iso2.toUpperCase().replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

/* ---------- languages ---------- */
const LANGUAGES = [
'English','Urdu','Arabic','French','Spanish','Turkish','Indonesian','Bengali','Hindi','Malay','Somali','Swahili',
'Persian (Farsi)','Pashto','Punjabi','Sindhi','Balochi','Kurdish','Hausa','Yoruba','Igbo','Amharic','Tigrinya','Wolof',
'Fulani','Portuguese','German','Italian','Russian','Ukrainian','Polish','Dutch','Greek','Hebrew','Mandarin Chinese',
'Cantonese','Japanese','Korean','Vietnamese','Thai','Filipino (Tagalog)','Burmese','Khmer','Lao','Nepali','Sinhala',
'Tamil','Telugu','Marathi','Gujarati','Kannada','Malayalam','Odia','Assamese','Uzbek','Kazakh','Tajik','Azerbaijani',
'Albanian','Bosnian','Serbian','Croatian','Bulgarian','Romanian','Hungarian','Czech','Slovak','Finnish','Swedish',
'Norwegian','Danish','Icelandic',
].sort();

/* ---------- searchable dropdown builder (used for country / phone code / language pickers) ---------- */
function buildSearchDropdown(mount, opts){
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;';
  const box = document.createElement('div');
  box.tabIndex = 0;
  box.style.cssText = 'border:1px solid var(--line,#ccc);border-radius:8px;padding:10px 12px;cursor:pointer;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:8px;box-sizing:border-box;';
  const boxLabel = document.createElement('span');
  boxLabel.style.cssText = 'color:var(--ink-2,#888);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
  boxLabel.textContent = opts.placeholder || 'Select';
  const caret = document.createElement('span'); caret.textContent = '▾'; caret.style.color = 'var(--ink-2,#888)';
  box.appendChild(boxLabel); box.appendChild(caret);

  const panel = document.createElement('div');
  panel.style.cssText = 'display:none;position:fixed;z-index:9999;background:#fff;border:1px solid var(--line,#ccc);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.15);overflow:auto;box-sizing:border-box;';
  const searchWrap = document.createElement('div');
  searchWrap.style.cssText = 'padding:8px;position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line,#eee);';
  const search = document.createElement('input');
  search.type = 'text'; search.placeholder = 'Type to search...';
  search.style.cssText = 'width:100%;padding:8px;border:1px solid var(--line,#ccc);border-radius:6px;box-sizing:border-box;';
  searchWrap.appendChild(search);
  const list = document.createElement('div');
  panel.appendChild(searchWrap); panel.appendChild(list);

  wrap.appendChild(box);
  document.body.appendChild(panel);
  mount.appendChild(wrap);

  let selected = opts.single ? '' : [];

  function updateBoxLabel(){
    if (opts.single){
      const item = opts.items.find(i => i.id === selected);
      boxLabel.textContent = item ? item.label : (opts.placeholder || 'Select');
      boxLabel.style.color = item ? 'var(--ink,#111)' : 'var(--ink-2,#888)';
    } else {
      boxLabel.textContent = selected.length ? selected.length + ' selected' : (opts.placeholder || 'Select');
      boxLabel.style.color = selected.length ? 'var(--ink,#111)' : 'var(--ink-2,#888)';
    }
  }

  function renderList(filter){
    const f = (filter || '').toLowerCase();
    const filtered = opts.items.filter(i => i.label.toLowerCase().includes(f));
    list.innerHTML = '';
    filtered.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'padding:9px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:normal;word-break:break-word;';
      row.addEventListener('mouseenter', () => row.style.background = 'var(--bg-2,#f4f4f4)');
      row.addEventListener('mouseleave', () => row.style.background = '');
      if (opts.single){
        row.textContent = item.label;
        if (selected === item.id) row.style.fontWeight = '700';
        row.addEventListener('click', () => {
          selected = item.id;
          updateBoxLabel();
          closePanel();
          if (opts.onChange) opts.onChange(selected);
        });
      } else {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = selected.includes(item.id);
        const span = document.createElement('span'); span.textContent = item.label;
        row.appendChild(cb); row.appendChild(span);
        row.addEventListener('click', (e) => {
          if (e.target !== cb) cb.checked = !cb.checked;
          if (cb.checked){ if (!selected.includes(item.id)) selected.push(item.id); }
          else { selected = selected.filter(v => v !== item.id); }
          updateBoxLabel();
          if (opts.onChange) opts.onChange(selected.slice());
        });
      }
      list.appendChild(row);
    });
    if (!filtered.length){
      const none = document.createElement('div');
      none.style.cssText = 'padding:10px 12px;color:var(--ink-2,#888);font-size:.85rem;';
      none.textContent = 'No matches.';
      list.appendChild(none);
    }
  }

  function positionPanel(){
    const margin = 8;
    const rect = box.getBoundingClientRect();
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const panelWidth = Math.max(180, Math.min(rect.width, vw - margin * 2));
    let left = rect.left;
    if (left + panelWidth > vw - margin) left = vw - margin - panelWidth;
    if (left < margin) left = margin;
    let top = rect.bottom + 4;
    let maxHeight = Math.min(260, vh - top - margin);
    if (maxHeight < 140){
      top = Math.max(margin, rect.top - 4 - Math.min(260, rect.top - margin * 2));
      maxHeight = Math.min(260, rect.top - margin - 4);
    }
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.width = panelWidth + 'px';
    panel.style.maxHeight = Math.max(120, maxHeight) + 'px';
  }

  function openPanel(){
    positionPanel();
    panel.style.display = 'block';
    search.value = '';
    renderList('');
    search.focus();
    setTimeout(() => { document.addEventListener('click', outsideClick); }, 0);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    if (window.visualViewport){
      window.visualViewport.addEventListener('resize', onScrollOrResize);
      window.visualViewport.addEventListener('scroll', onScrollOrResize);
    }
  }
  function closePanel(){
    panel.style.display = 'none';
    document.removeEventListener('click', outsideClick);
    window.removeEventListener('scroll', onScrollOrResize, true);
    window.removeEventListener('resize', onScrollOrResize);
    if (window.visualViewport){
      window.visualViewport.removeEventListener('resize', onScrollOrResize);
      window.visualViewport.removeEventListener('scroll', onScrollOrResize);
    }
  }
  function onScrollOrResize(){
    if (panel.style.display === 'block') positionPanel();
  }
  function outsideClick(e){ if (!wrap.contains(e.target) && !panel.contains(e.target)) closePanel(); }

  box.addEventListener('click', () => { panel.style.display === 'block' ? closePanel() : openPanel(); });
  search.addEventListener('input', () => renderList(search.value));
  search.addEventListener('click', (e) => e.stopPropagation());

  updateBoxLabel();

  if (opts.single){
    return {
      getValue: () => selected,
      setValue: (v) => { selected = v || ''; updateBoxLabel(); },
    };
  }
  return {
    getValues: () => selected.slice(),
    setValues: (v) => { selected = v || []; updateBoxLabel(); },
  };
}

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

/* ---------- tutors / students / trial requests / profile / stats ---------- */
async function fetchTutors(query = {}){
  const params = new URLSearchParams(query).toString();
  return apiRequest('/tutors' + (params ? '?' + params : ''));
}

async function fetchStudents(query = {}){
  const params = new URLSearchParams(query).toString();
  return apiRequest('/students' + (params ? '?' + params : ''));
}

async function getPublicTutorProfile(userId){
  const data = await apiRequest('/tutors/' + userId);
  return data.tutor;
}
async function getPublicStudentProfile(userId){
  const data = await apiRequest('/students/' + userId);
  return data.student;
}

async function createTrialRequestApi({ tutorId, preferredTime }){
  return apiRequest('/trial-requests', { method: 'POST', body: JSON.stringify({ tutorId, preferredTime }) });
}

async function createTutorRequestApi({ studentId, preferredTime }){
  return apiRequest('/trial-requests/from-tutor', { method: 'POST', body: JSON.stringify({ studentId, preferredTime }) });
}

async function fetchMyTrialRequests(){
  return apiRequest('/trial-requests/mine');
}

async function getUnreadMessageCount(){
  const data = await apiRequest('/messages/unread-count');
  return data.count;
}

async function updateTrialRequestStatus(id, status){
  return apiRequest('/trial-requests/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
}

async function getMyProfile(){
  const data = await apiRequest('/profile/me');
  return data.profile;
}

async function fetchStats(){
  return apiRequest('/stats');
}

/* ---------- push notifications ---------- */
function urlBase64ToUint8Array(base64String){
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function enablePushNotifications(){
  if (!('serviceWorker' in navigator) || !('PushManager' in window)){
    throw new Error('Push notifications are not supported in this browser.');
  }
  const registration = await navigator.serviceWorker.register('sw.js');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted'){
    throw new Error('Notification permission was not granted.');
  }
  const { publicKey } = await apiRequest('/push/vapid-public-key');
  if (!publicKey){
    throw new Error('Notifications are not configured on the server yet.');
  }
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription){
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  await apiRequest('/push/subscribe', { method: 'POST', body: JSON.stringify(subscription.toJSON()) });
  return true;
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
function initCountrySelect(mount, opts={}){
  const items = COUNTRIES.map(c => ({ id: c.name, label: `${flagEmoji(c.code)} ${c.name}` }));
  return buildSearchDropdown(mount, { items, single: true, placeholder: opts.placeholder || 'Select country' });
}

function initPhonePicker(mount){
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;gap:8px;';
  const codeMount = document.createElement('div'); codeMount.style.cssText = 'width:135px;flex-shrink:0;';
  const numberInput = document.createElement('input');
  numberInput.type = 'tel'; numberInput.placeholder = 'Phone number';
  numberInput.style.cssText = 'flex:1;padding:10px 12px;border:1px solid var(--line,#ccc);border-radius:8px;box-sizing:border-box;';
  wrap.appendChild(codeMount); wrap.appendChild(numberInput);
  mount.appendChild(wrap);

  const items = COUNTRIES.map(c => ({ id: c.dial, label: `${flagEmoji(c.code)} ${c.dial}` }));
  const dd = buildSearchDropdown(codeMount, { items, single: true, placeholder: 'Code' });
  const allDials = [...new Set(COUNTRIES.map(c=>c.dial))].sort((a,b)=>b.length-a.length);

  return {
    getFullNumber: () => {
      const code = dd.getValue();
      const num = numberInput.value.trim();
      return num && code ? `${code} ${num}` : (num || '');
    },
    setFullNumber: (full) => {
      if (!full) return;
      const v = full.trim();
      const matchCode = allDials.find(d => v.startsWith(d + ' ') || v === d);
      if (matchCode){
        dd.setValue(matchCode);
        numberInput.value = v.slice(matchCode.length).trim();
      } else {
        numberInput.value = v;
      }
    },
  };
}

function initChipPicker(mount, opts={}){
  const container = document.createElement('div');
  const dropdownMount = document.createElement('div');
  const chipsEl = document.createElement('div');
  chipsEl.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;';
  container.appendChild(dropdownMount);
  container.appendChild(chipsEl);
  mount.appendChild(container);

  const items = (opts.options || []).map(o => ({ id: o, label: o }));

  function renderChips(values){
    chipsEl.innerHTML = values.map(v => `<span class="pill" style="cursor:pointer;" data-v="${v}">${v} ✕</span>`).join('');
    chipsEl.querySelectorAll('.pill').forEach(p => {
      p.addEventListener('click', () => {
        const v = p.dataset.v;
        const newVals = dd.getValues().filter(x => x !== v);
        dd.setValues(newVals);
        renderChips(newVals);
      });
    });
  }

  const dd = buildSearchDropdown(dropdownMount, {
    items, single: false, placeholder: opts.placeholder || 'Tap to select — you can pick more than one',
    onChange: (vals) => renderChips(vals),
  });

  return {
    getValues: () => dd.getValues(),
    setValues: (v) => { dd.setValues(v || []); renderChips(v || []); },
  };
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
    status.style.fontWeight = type==='error' ? '700' : '400';
  }

  function showPreview(url){
    preview.innerHTML = '';
    const previewInner = document.createElement('div');
    previewInner.style.cssText = 'position:relative;display:inline-block;';
    if (opts.kind === 'image'){
      const img = document.createElement('img');
      img.src = url;
      img.style.cssText = `max-width:120px;border-radius:${opts.previewShape==='circle'?'50%':'8px'};display:block;`;
      previewInner.appendChild(img);
    } else if (opts.kind === 'audio'){
      const audio = document.createElement('audio');
      audio.controls = true; audio.src = url;
      previewInner.appendChild(audio);
    }
    if (opts.removable){
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = '✕';
      removeBtn.title = 'Remove';
      removeBtn.setAttribute('aria-label', 'Remove file');
      removeBtn.style.cssText = 'position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;border:none;background:#c0392b;color:#fff;font-size:12px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 1px 3px rgba(0,0,0,.3);';
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        preview.innerHTML = '';
        currentUrl = '';
        setStatus('');
        if (opts.onRemove) opts.onRemove();
      });
      previewInner.appendChild(removeBtn);
    }
    preview.appendChild(previewInner);
  }

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    showPreview(URL.createObjectURL(file));
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
    clear: () => { input.value = ''; preview.innerHTML = ''; currentUrl = ''; },
    setExisting: (url) => {
      if (!url) return;
      currentUrl = url;
      showPreview(url);
      setStatus('Current file — choose a new one only if you want to replace it.', 'success');
    },
  };
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

  const profileActive = active === 'Profile';
  const cta = user
    ? `<a class="btn ${profileActive?'primary':'ghost'} small" href="profile.html">Profile</a>
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

/* =====================================================================
   Shared profile-area sidebar — used by dashboard.html, profile.html,
   requests.html, etc. so every page shows the same links (including
   Messages and Notifications) instead of each page hand-rolling its own.
   ===================================================================== */
function sidebarHtml(active){
  const user = currentUser();
  if (!user) return '';
  const isTutor = user.role === 'TUTOR';
  const findLink = isTutor
    ? `<a href="students.html" class="side-link ${active==='find'?'active':''}">Find Students</a>`
    : `<a href="tutors.html" class="side-link ${active==='find'?'active':''}">Find a Tutor</a>`;
  return `
    <aside class="profile-sidebar" id="dashSidebar">
      <a href="dashboard.html" class="side-link ${active==='dashboard'?'active':''}">Dashboard</a>
      <a href="profile.html" class="side-link ${active==='profile'?'active':''}">Profile</a>
      ${findLink}
      <a href="requests.html" class="side-link ${active==='requests'?'active':''}" style="display:flex;align-items:center;justify-content:space-between;">
        <span>Requests</span>
        <span id="requestsBadge" style="display:none;background:#c0392b;color:#fff;font-size:.72rem;font-weight:700;border-radius:999px;padding:1px 7px;min-width:18px;text-align:center;"></span>
      </a>
      <a href="requests.html" class="side-link" style="display:flex;align-items:center;justify-content:space-between;">
        <span>Messages</span>
        <span id="messagesBadge" style="display:none;background:#c0392b;color:#fff;font-size:.72rem;font-weight:700;border-radius:999px;padding:1px 7px;min-width:18px;text-align:center;"></span>
      </a>
      <button class="side-link" id="notifBtn" style="border:none;background:none;text-align:left;cursor:pointer;width:100%;font:inherit;color:var(--ink-2,#555);display:flex;align-items:center;gap:6px;" onclick="handleEnableNotifications(this)"><span id="notifBell">🔴</span><span id="notifLabel" style="color:#c0392b;font-weight:600;">Notifications off</span></button>
      <a href="#" class="side-link" onclick="logout();return false;">Log out</a>
    </aside>`;
}

// Colors the bell green + updates the label if this browser already has an
// active push subscription — so state is correct on load, not just after
// the button is clicked.
async function refreshNotifButtonState(){
  const bell = document.getElementById('notifBell');
  const label = document.getElementById('notifLabel');
  if (!bell || !label) return;
  try{
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = registration ? await registration.pushManager.getSubscription() : null;
    if (subscription && Notification.permission === 'granted'){
      bell.textContent = '🟢';
      label.textContent = 'Notifications on';
      label.style.color = '#1e7d43';
    }
  }catch(err){ /* ignore — button just stays in its default (off) state */ }
}

// Counts trial requests waiting on THIS user's response and shows that
// count as a badge next to "Requests".
async function refreshRequestsBadge(){
  const badge = document.getElementById('requestsBadge');
  const user = currentUser();
  if (!badge || !user) return;
  try{
    const isTutor = user.role === 'TUTOR';
    const { requests } = await fetchMyTrialRequests();
    const pendingForMe = requests.filter(r => {
      const iAmReceiver = r.initiatedBy === 'TUTOR' ? !isTutor : isTutor;
      return r.status === 'PENDING' && iAmReceiver;
    }).length;
    if (pendingForMe > 0){
      badge.textContent = pendingForMe;
      badge.style.display = 'inline-block';
    }
  }catch(err){ /* ignore — badge just stays hidden */ }
}

async function refreshMessagesBadge(){
  const badge = document.getElementById('messagesBadge');
  if (!badge) return;
  try{
    const count = await getUnreadMessageCount();
    if (count > 0){
      badge.textContent = count;
      badge.style.display = 'inline-block';
    }
  }catch(err){ /* ignore — badge just stays hidden */ }
}

async function handleEnableNotifications(btn){
  btn.disabled = true;
  const bell = document.getElementById('notifBell');
  const label = document.getElementById('notifLabel');
  try{
    await enablePushNotifications();
    if (bell) bell.textContent = '🟢';
    if (label){ label.textContent = 'Notifications on'; label.style.color = '#1e7d43'; }
  }catch(err){
    alert(err.message);
    btn.disabled = false;
  }
}

// Call this once, right after injecting sidebarHtml() into the page, to
// wire up the notification bell state and the two unread-count badges.
function initSidebarWidgets(){
  refreshNotifButtonState();
  refreshRequestsBadge();
  refreshMessagesBadge();
}

// If sw.js posts a message back to the page when a push notification
// arrives (see sw.js), play a chime here — this only fires while this
// tab is open; when the tab/site is closed the OS's own notification
// sound plays instead.
if ('serviceWorker' in navigator){
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'push-received'){
      playNotificationSound();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav(document.body.dataset.page || '');
  renderFooter();
});
