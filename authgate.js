/* ===== Auth Gate =====
   Blocks a protected page's content/features until the visitor
   (a) is logged in, AND (b) has a complete profile.

   HOW TO USE on any protected page (dashboard.html, tutors.html,
   students.html, requests.html, messages.html, profile.html):

   1. Add this script AFTER app.js:
        <script src="app.js"></script>
        <script src="authgate.js"></script>

   2. Wrap your page's existing init code (the part that renders the
      sidebar, fetches data, etc.) like this:

        requireAuthAndProfile().then(() => {
          // ...everything your page currently does on load...
        });

   If the visitor isn't logged in, a small overlay card appears
   (Create account / Log in toggle) right on top of the page — no
   navigation. After they register or log in, if their profile isn't
   complete yet they're sent to profile-setup.html (which returns them
   here afterwards via ?next=). Only once both are satisfied does the
   Promise resolve and your page's real init code runs.
*/

function currentPageUrl(){
  return location.pathname.split('/').pop() + location.search;
}

function redirectToProfileSetup(){
  location.href = 'profile-setup.html?next=' + encodeURIComponent(currentPageUrl());
}

function requireAuthAndProfile(){
  return new Promise((resolve) => {
    const user = currentUser();
    if (!user){
      showAuthGateOverlay(resolve);
      return;
    }
    getMyProfile().then(profile => {
      if (profile) resolve();
      else redirectToProfileSetup();
    }).catch(() => redirectToProfileSetup());
  });
}

function showAuthGateOverlay(onDone){
  const backdrop = document.createElement('div');
  backdrop.id = 'authGateBackdrop';
  backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';

  const card = document.createElement('div');
  card.style.cssText = 'background:#fff;border-radius:12px;max-width:380px;width:100%;padding:28px 24px;box-sizing:border-box;max-height:92vh;overflow:auto;';
  backdrop.appendChild(card);
  document.body.appendChild(backdrop);
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function closeOverlay(){
    document.body.removeChild(backdrop);
    document.body.style.overflow = prevOverflow;
  }

  let mode = 'register'; // or 'login'

  function render(){
    card.innerHTML = '';

    const title = document.createElement('h2');
    title.style.cssText = 'margin:0 0 4px;';
    title.textContent = mode === 'register' ? 'Create your account' : 'Welcome back';
    const sub = document.createElement('p');
    sub.style.cssText = 'color:var(--ink-2,#777);font-size:.9rem;margin:0 0 16px;';
    sub.textContent = mode === 'register' ? "Join as a student or a tutor — it's free." : 'Log in to continue.';
    card.appendChild(title); card.appendChild(sub);

    const msg = document.createElement('div');
    msg.style.cssText = 'display:none;padding:10px 12px;border-radius:8px;font-size:.85rem;margin-bottom:12px;background:#fdecea;color:#c0392b;';
    card.appendChild(msg);

    const form = document.createElement('form');
    let roleVal = 'STUDENT';

    if (mode === 'register'){
      const roleRow = document.createElement('div');
      roleRow.style.cssText = 'display:flex;gap:8px;margin-bottom:14px;';
      const bStu = document.createElement('button'); bStu.type = 'button'; bStu.textContent = "I'm a student";
      const bTut = document.createElement('button'); bTut.type = 'button'; bTut.textContent = "I'm a tutor";
      [bStu, bTut].forEach(b => { b.style.cssText = 'flex:1;padding:8px;border-radius:8px;border:1px solid var(--line,#ccc);background:#fff;cursor:pointer;font-size:.85rem;'; });
      function markActive(active, inactive){ active.style.fontWeight='700'; active.style.borderColor='var(--gold,#2e7d32)'; inactive.style.fontWeight='400'; inactive.style.borderColor='var(--line,#ccc)'; }
      markActive(bStu, bTut);
      bStu.addEventListener('click', () => { roleVal = 'STUDENT'; markActive(bStu, bTut); });
      bTut.addEventListener('click', () => { roleVal = 'TUTOR'; markActive(bTut, bStu); });
      roleRow.appendChild(bStu); roleRow.appendChild(bTut);
      form.appendChild(roleRow);

      const nameRow = document.createElement('div');
      nameRow.style.cssText = 'display:flex;gap:10px;';
      nameRow.innerHTML = `
        <div style="flex:1;"><label style="font-size:.85rem;">First name</label><input type="text" id="ag_firstName" required style="width:100%;padding:9px 10px;border:1px solid var(--line,#ccc);border-radius:8px;box-sizing:border-box;"></div>
        <div style="flex:1;"><label style="font-size:.85rem;">Last name</label><input type="text" id="ag_lastName" required style="width:100%;padding:9px 10px;border:1px solid var(--line,#ccc);border-radius:8px;box-sizing:border-box;"></div>`;
      form.appendChild(nameRow);
    }

    const emailField = document.createElement('div');
    emailField.style.cssText = 'margin-top:12px;';
    emailField.innerHTML = `<label style="font-size:.85rem;">Email</label><input type="email" id="ag_email" required style="width:100%;padding:9px 10px;border:1px solid var(--line,#ccc);border-radius:8px;box-sizing:border-box;">`;
    form.appendChild(emailField);

    const passField = document.createElement('div');
    passField.style.cssText = 'margin-top:12px;';
    passField.innerHTML = `<label style="font-size:.85rem;">Password</label><input type="password" id="ag_password" required ${mode === 'register' ? 'minlength="8"' : ''} style="width:100%;padding:9px 10px;border:1px solid var(--line,#ccc);border-radius:8px;box-sizing:border-box;">`;
    form.appendChild(passField);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = mode === 'register' ? 'Create account' : 'Log in';
    submitBtn.style.cssText = 'width:100%;margin-top:16px;padding:11px;border:none;border-radius:8px;background:var(--gold,#2e7d32);color:#fff;font-weight:700;cursor:pointer;';
    form.appendChild(submitBtn);

    card.appendChild(form);

    const foot = document.createElement('p');
    foot.style.cssText = 'text-align:center;font-size:.85rem;margin-top:14px;';
    foot.innerHTML = mode === 'register'
      ? `Already have an account? <a href="#" id="ag_toLogin">Log in</a>`
      : `Don't have an account? <a href="#" id="ag_toRegister">Register free</a>`;
    card.appendChild(foot);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button'; closeBtn.textContent = '← Back to home';
    closeBtn.style.cssText = 'display:block;margin:10px auto 0;background:none;border:none;color:var(--ink-2,#777);font-size:.82rem;cursor:pointer;padding:0;';
    closeBtn.addEventListener('click', () => { location.href = 'index.html'; });
    card.appendChild(closeBtn);

    const toLogin = document.getElementById('ag_toLogin');
    if (toLogin) toLogin.addEventListener('click', (e) => { e.preventDefault(); mode = 'login'; render(); });
    const toRegister = document.getElementById('ag_toRegister');
    if (toRegister) toRegister.addEventListener('click', (e) => { e.preventDefault(); mode = 'register'; render(); });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.style.display = 'none';
      submitBtn.disabled = true;
      try{
        if (mode === 'register'){
          await registerUser({
            firstName: document.getElementById('ag_firstName').value.trim(),
            lastName: document.getElementById('ag_lastName').value.trim(),
            email: document.getElementById('ag_email').value.trim().toLowerCase(),
            password: document.getElementById('ag_password').value,
            role: roleVal,
          });
          redirectToProfileSetup(); // brand new account -> always needs profile
        } else {
          await loginUser({
            email: document.getElementById('ag_email').value.trim().toLowerCase(),
            password: document.getElementById('ag_password').value,
          });
          const profile = await getMyProfile().catch(() => null);
          if (profile){
            closeOverlay();
            onDone();
          } else {
            redirectToProfileSetup();
          }
        }
      }catch(err){
        msg.style.display = 'block';
        msg.textContent = err.message;
        submitBtn.disabled = false;
      }
    });
  }

  render();
}
