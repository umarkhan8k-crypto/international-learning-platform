<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Profile — International Learning Platform</title>
<link rel="stylesheet" href="style.css">
</head>
<body data-page="Profile">
<div id="nav"></div>

<section style="padding:40px 0;">
  <div class="container">
    <div id="profileWrap"><p style="color:var(--ink-2);">Loading your profile...</p></div>
  </div>
</section>

<div id="footer"></div>
<script src="app.js"></script>
<script>
  const user = currentUser();
  if (!user){ location.href = 'login.html?next=profile.html'; }

  function field(label, value){
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) return '';
    const display = Array.isArray(value) ? value.join(', ') : value;
    return `<div class="field"><span class="field-label">${label}</span><span class="field-value">${display}</span></div>`;
  }

  function fieldFull(label, value){
    if (value === undefined || value === null || value === '') return '';
    return `<div class="field field-full"><span class="field-label">${label}</span><span class="field-value">${value}</span></div>`;
  }

  function statusPill(status){
    const map = { NONE:'No certificate submitted', PENDING:'Pending review', APPROVED:'Approved ✓', REJECTED:'Rejected — please re-upload a genuine certificate' };
    const color = status==='APPROVED' ? '#2e7d32' : status==='REJECTED' ? '#c0392b' : 'var(--ink-2)';
    return `<span style="color:${color};font-weight:600;">${map[status] || status}</span>`;
  }

  function isImageUrl(url){
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(url || '');
  }

  function sidebar(active){
    const isTutor = user.role === 'TUTOR';
    const findLink = isTutor
      ? `<a href="students.html" class="side-link ${active==='find'?'active':''}">Find Students</a>`
      : `<a href="tutors.html" class="side-link ${active==='find'?'active':''}">Find a Tutor</a>`;
    return `
      <aside class="profile-sidebar">
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

  // Checks whether this browser already has an active push subscription, and
  // colors the bell green + updates the button text if so — so the state is
  // correct on page load, not just right after the button is clicked.
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

  // Counts how many trial requests are waiting on THIS user's response
  // (i.e. requests they received, not ones they sent) and shows that count
  // as a small badge next to "Requests" in the sidebar.
  async function refreshRequestsBadge(){
    const badge = document.getElementById('requestsBadge');
    if (!badge) return;
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

  async function load(){
    const wrap = document.getElementById('profileWrap');
    try{
      const profile = await getMyProfile();
      const isTutor = user.role === 'TUTOR';
      const name = user.firstName + ' ' + user.lastName;

      let picHtml = profile && profile.pictureUrl
        ? `<img src="${profile.pictureUrl}" class="profile-avatar-img">`
        : `<div class="avatar avatar-lg">${initials(name)}</div>`;

      let fieldsHtml = '';
      let certHtml = '';
      let audioHtml = '';
      let bioHtml = '';

      if (!profile){
        wrap.innerHTML = `
          <div class="profile-layout">
            ${sidebar('profile')}
            <div class="profile-card">
              <p style="color:var(--ink-2);">You haven't completed your profile yet.</p>
              <a href="profile-setup.html" class="btn primary small">Complete your profile</a>
            </div>
          </div>`;
        refreshNotifButtonState();
        refreshRequestsBadge();
        refreshMessagesBadge();
        return;
      }

      if (isTutor){
        fieldsHtml = `
          ${field('Email', user.email)}
          ${field('Gender', profile.gender)}
          ${field('Country', profile.country)}
          ${field('Phone', profile.phone)}
          ${field('WhatsApp', profile.whatsapp)}
          ${field('Subjects', profile.subjects)}
          ${field('Teaches', profile.ageGroupsTaught)}
          ${field('Class platform', profile.platform)}
          ${field('Availability', profile.availability)}
          ${field('Experience', profile.experience)}
          ${field('Qualification', profile.qualification)}
          ${field('Languages', profile.languages)}
          ${field('Price', profile.price ? '$' + profile.price + ' / class' : '')}
          ${field('Listed publicly', profile.isListed ? 'Yes — students can find and book you ✓' : 'Not yet — complete every required field')}
        `;
        bioHtml = fieldFull('Bio', profile.bio);

        if (profile.certificationUrl){
          certHtml = `
            <div class="field-full" style="margin-top:8px;">
              <span class="field-label">Certification${profile.certificationType ? ' — ' + profile.certificationType : ''}</span>
              <div style="margin-top:8px;display:flex;align-items:center;gap:12px;">
                ${isImageUrl(profile.certificationUrl)
                  ? `<img src="${profile.certificationUrl}" style="width:160px;border-radius:8px;object-fit:cover;">`
                  : `<a href="${profile.certificationUrl}" target="_blank" class="btn ghost small">View certificate</a>`}
                ${statusPill(profile.certificationStatus)}
              </div>
            </div>`;
        }

        if (profile.audioSampleUrl){
          audioHtml = `
            <div class="field-full" style="margin-top:8px;">
              <span class="field-label">Recitation sample</span>
              <audio controls src="${profile.audioSampleUrl}" style="width:100%;margin-top:8px;"></audio>
            </div>`;
        }
      } else {
        fieldsHtml = `
          ${field('Email', user.email)}
          ${field('Gender', profile.gender)}
          ${field('Country', profile.country)}
          ${field('Age group', profile.ageGroup)}
          ${field('Phone', profile.phone)}
          ${field('WhatsApp', profile.whatsapp)}
          ${field('Wants to learn', profile.interests)}
          ${field('Languages', profile.languages)}
          ${field('Availability', profile.availability)}
        `;
        bioHtml = fieldFull('About', profile.bio);
      }

      wrap.innerHTML = `
        <div class="profile-layout">
          ${sidebar('profile')}

          <div class="profile-card">
            <div class="profile-header">
              ${picHtml}
              <div>
                <h2 style="margin:0 0 6px;">${name}</h2>
                <span class="role-badge">${isTutor ? 'TUTOR' : 'STUDENT'}</span>
              </div>
            </div>

            <div class="field-grid">
              ${fieldsHtml}
              ${bioHtml}
              ${certHtml}
              ${audioHtml}
            </div>

            <a href="profile-setup.html" class="btn primary small" style="margin-top:20px;">Edit profile</a>
          </div>
        </div>`;
      refreshNotifButtonState();
      refreshRequestsBadge();
      refreshMessagesBadge();
    }catch(err){
      wrap.innerHTML = `<p style="color:var(--rose,#c0392b);">Could not load your profile: ${err.message}</p>`;
    }
  }

  load();
</script>
<style>
  .profile-layout{ display:flex; gap:24px; align-items:flex-start; }
  .profile-sidebar{
    width:180px; flex-shrink:0; display:flex; flex-direction:column; gap:8px;
    border:1px solid var(--line,#eee); border-radius:10px; padding:12px; background:#fff;
  }
  .side-link{
    padding:10px 12px; border-radius:8px; text-decoration:none; color:var(--ink-2,#555);
    font-weight:500; font-size:.92rem;
  }
  .side-link:hover{ background:#f4f4f4; }
  .side-link.active{ background:var(--green,#1e7d43); color:#fff; }

  .profile-card{
    flex:1; min-width:0; border:1px solid var(--line,#eee); border-radius:12px;
    padding:24px; background:#fff;
  }
  .profile-header{ display:flex; align-items:center; gap:16px; margin-bottom:20px; }
  .profile-avatar-img{ width:64px; height:64px; border-radius:50%; object-fit:cover; }
  .role-badge{
    display:inline-block; background:var(--green,#1e7d43); color:#fff; font-size:.7rem;
    font-weight:700; letter-spacing:.04em; padding:2px 10px; border-radius:999px;
  }

  .field-grid{
    display:grid; grid-template-columns:1fr 1fr; gap:18px 32px;
    border-top:1px solid var(--line,#eee); padding-top:18px;
  }
  .field{ display:flex; flex-direction:column; gap:4px; }
  .field-full{ grid-column:1 / -1; display:flex; flex-direction:column; gap:4px; }
  .field-label{
    font-size:.72rem; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-2,#888);
  }
  .field-value{ font-size:.95rem; color:var(--ink,#222); }

  @media (max-width:720px){
    .profile-layout{ flex-direction:column; }
    .profile-sidebar{ width:100%; flex-direction:row; }
    .field-grid{ grid-template-columns:1fr; }
  }
</style>
</body>
</html>
