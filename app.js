@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@400;500;600;700&display=swap');

:root{
  --ink:#1F5C54;
  --ink-2:#3E7A70;
  --parchment:#FBF8F1;
  --parchment-2:#F3ECDA;
  --gold:#C79A4B;
  --gold-light:#E9CB8E;
  --rose:#A6524F;
  --line:rgba(31,92,84,0.14);
  --shadow:0 10px 30px rgba(31,92,84,0.10);
  --radius:14px;
  --serif:'Amiri', 'Georgia', serif;
  --sans:'Work Sans', -apple-system, sans-serif;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  font-family:var(--sans);
  color:var(--ink);
  background:var(--parchment);
  line-height:1.55;
}
img{max-width:100%;display:block;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
h1,h2,h3,h4{font-family:var(--serif);font-weight:700;margin:0 0 .5em;line-height:1.15;}
p{margin:0 0 1em;}
.container{max-width:1140px;margin:0 auto;padding:0 24px;}
.eyebrow{
  font-family:var(--sans);
  font-size:.72rem;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--gold);
  font-weight:600;
  display:flex;align-items:center;gap:10px;
  margin-bottom:.9em;
}
.eyebrow::before{content:'';width:22px;height:1px;background:var(--gold);display:inline-block;}

/* ---------- ornament (signature element) ---------- */
.ornament{width:34px;height:34px;flex:none;}
.ornament path{fill:var(--gold);}
.divider-star{display:flex;align-items:center;gap:14px;margin:2.5rem 0;}
.divider-star::before,.divider-star::after{content:'';flex:1;height:1px;background:var(--line);}

/* ---------- buttons ---------- */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:13px 26px;border-radius:999px;font-weight:600;font-size:.95rem;
  border:1px solid transparent;cursor:pointer;transition:.2s ease;
  font-family:var(--sans);
}
.btn.primary{background:var(--ink);color:#fff;}
.btn.primary:hover{background:var(--ink-2);}
.btn.gold{background:var(--gold);color:#fff;}
.btn.gold:hover{background:var(--gold-light);color:var(--ink);}
.btn.ghost{background:transparent;color:var(--ink);border-color:var(--line);}
.btn.ghost:hover{border-color:var(--ink);background:rgba(31,92,84,.05);}
.btn.block{width:100%;}
.btn.small{padding:9px 18px;font-size:.85rem;}

/* ---------- nav ---------- */
.nav{
  position:sticky;top:0;z-index:50;
  background:rgba(251,248,241,0.92);
  backdrop-filter:blur(8px);
  border-bottom:1px solid var(--line);
}
.nav-inner{
  max-width:1140px;margin:0 auto;padding:14px 24px;
  display:flex;align-items:center;justify-content:space-between;gap:20px;
}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--serif);font-weight:700;font-size:1.25rem;color:var(--ink);}
.brand .ornament{width:26px;height:26px;}
.nav-links{display:flex;align-items:center;gap:28px;}
.nav-links a{font-size:.92rem;font-weight:500;color:var(--ink);opacity:.85;}
.nav-links a:hover{opacity:1;}
.nav-links a.active{color:var(--gold);opacity:1;}
.nav-cta{display:flex;align-items:center;gap:10px;}
.nav-user{font-size:.85rem;font-weight:600;padding:8px 16px;border:1px solid var(--line);border-radius:999px;}
.nav-toggle{display:none;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--ink);}
@media(max-width:860px){
  .nav-links{
    position:fixed;inset:64px 0 0 0;background:var(--parchment);
    flex-direction:column;align-items:flex-start;padding:28px 24px;gap:22px;
    transform:translateX(100%);transition:.25s ease;
  }
  .nav-links.open{transform:translateX(0);}
  .nav-toggle{display:block;}
}

/* ---------- hero ---------- */
.hero{
  position:relative;overflow:hidden;
  padding:64px 0 56px;
  background:linear-gradient(180deg,#FFFDF8 0%,var(--parchment) 100%);
  border-bottom:1px solid var(--line);
}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;}
.hero h1{font-size:clamp(2rem,4.4vw,3.2rem);}
.hero h1 em{color:var(--gold);font-style:normal;}
.hero-sub{font-size:1.05rem;color:var(--ink-2);max-width:46ch;}
.hero-actions{display:flex;gap:14px;margin-top:1.6em;flex-wrap:wrap;}
.hero-trust{display:flex;gap:22px;margin-top:2.2em;flex-wrap:wrap;}
.hero-trust span{font-size:.85rem;font-weight:600;color:var(--ink-2);display:flex;align-items:center;gap:7px;}
.hero-trust span::before{content:'✓';color:var(--gold);font-weight:700;}
.hero-art{
  position:relative;
  background:linear-gradient(155deg,#EAF3F1 0%,var(--parchment-2) 55%,var(--gold-light) 140%);
  border-radius:22px;
  aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;
  box-shadow:var(--shadow);overflow:hidden;
  border:1px solid var(--line);
}
.hero-art svg{width:88%;height:88%;}
@media(max-width:860px){.hero-grid{grid-template-columns:1fr;}.hero-art{max-width:340px;margin:0 auto;}}

/* ---------- sections ---------- */
section{padding:64px 0;}
.section-head{max-width:640px;margin-bottom:2.6rem;}
.section-head.center{margin-left:auto;margin-right:auto;text-align:center;}
.section-head p{color:var(--ink-2);}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
@media(max-width:860px){.grid-3,.grid-4,.grid-2{grid-template-columns:1fr 1fr;}}
@media(max-width:560px){.grid-3,.grid-4,.grid-2{grid-template-columns:1fr;}}
.card{
  background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:26px;transition:.2s ease;
}
.card:hover{box-shadow:var(--shadow);transform:translateY(-3px);}
.step-card .step-no{font-family:var(--serif);font-size:1.6rem;color:var(--gold);margin-bottom:.3em;}
.stat-card{text-align:center;}
.stat-card .num{font-family:var(--serif);font-size:2.4rem;color:var(--ink);font-weight:700;}
.stat-card .label{font-size:.85rem;color:var(--ink-2);}
.course-card .tag{
  display:inline-block;font-size:.7rem;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;color:var(--gold);background:rgba(199,154,75,.14);
  padding:4px 10px;border-radius:999px;margin-bottom:12px;
}
.course-card h3{font-size:1.2rem;}
.course-card .price{font-weight:700;color:var(--ink);margin-top:10px;}

/* ---------- tutor cards ---------- */
.tutor-card{display:flex;flex-direction:column;gap:14px;}
.tutor-top{display:flex;gap:14px;align-items:center;}
.avatar{
  width:56px;height:56px;border-radius:50%;flex:none;
  background:var(--ink);color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--serif);font-weight:700;font-size:1.2rem;
  overflow:hidden;
}
.avatar img{width:100%;height:100%;object-fit:cover;}
.tutor-name{font-weight:700;font-size:1.02rem;}
.tutor-meta{font-size:.82rem;color:var(--ink-2);}
.stars{color:var(--gold);font-size:.85rem;}
.pill-row{display:flex;flex-wrap:wrap;gap:6px;}
.pill{font-size:.72rem;font-weight:600;padding:4px 10px;border-radius:999px;background:var(--parchment-2);color:var(--ink-2);}
.tutor-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:8px;border-top:1px solid var(--line);}
.tutor-price{font-weight:700;font-family:var(--serif);font-size:1.1rem;}
.tutor-price small{font-family:var(--sans);font-weight:500;font-size:.72rem;color:var(--ink-2);}
.filter-bar{
  display:flex;gap:12px;flex-wrap:wrap;align-items:center;
  background:#fff;border:1px solid var(--line);border-radius:999px;
  padding:8px;margin-bottom:2.2rem;
}
.filter-bar input,.filter-bar select{
  border:none;background:transparent;font-family:var(--sans);font-size:.9rem;
  padding:9px 14px;outline:none;color:var(--ink);
}
.filter-bar input{flex:1;min-width:160px;}
.filter-bar select{border-left:1px solid var(--line);}

/* ---------- band ---------- */
.band{background:var(--parchment-2);color:var(--ink);}
.band .eyebrow{color:var(--gold);}
.band .eyebrow::before{background:var(--gold);}
.band .section-head p{color:var(--ink-2);}
.band .card{background:#fff;border-color:var(--line);color:var(--ink);}

/* ---------- forms ---------- */
.form-shell{
  max-width:440px;margin:0 auto;background:#fff;border:1px solid var(--line);
  border-radius:var(--radius);padding:36px;box-shadow:var(--shadow);
}
.form-shell.wide{max-width:680px;}
.form-shell h2{font-size:1.5rem;text-align:center;}
.form-sub{text-align:center;color:var(--ink-2);font-size:.9rem;margin-bottom:1.8em;}
.field{margin-bottom:16px;}
.field label{display:block;font-size:.82rem;font-weight:600;margin-bottom:6px;color:var(--ink-2);}
.field .hint{font-size:.76rem;color:var(--ink-2);opacity:.8;margin-top:4px;}
.field input,.field select,.field textarea{
  width:100%;padding:11px 14px;border:1px solid var(--line);border-radius:9px;
  font-family:var(--sans);font-size:.94rem;background:var(--parchment);color:var(--ink);
  outline:none;
}
.field textarea{resize:vertical;min-height:90px;}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--gold);}
.role-toggle{display:flex;gap:10px;margin-bottom:20px;}
.role-toggle button{
  flex:1;padding:11px;border-radius:9px;border:1px solid var(--line);background:var(--parchment);
  font-weight:600;font-size:.88rem;cursor:pointer;color:var(--ink-2);
}
.role-toggle button.active{background:var(--ink);color:#fff;border-color:var(--ink);}
.form-foot{text-align:center;font-size:.86rem;color:var(--ink-2);margin-top:1.4em;}
.form-foot a{color:var(--gold);font-weight:600;}
.msg{padding:10px 14px;border-radius:9px;font-size:.85rem;margin-bottom:14px;display:none;}
.msg.error{background:rgba(166,82,79,.1);color:var(--rose);display:block;}
.msg.success{background:rgba(199,154,75,.14);color:#7a5a1e;display:block;}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
@media(max-width:560px){.field-row{grid-template-columns:1fr;}}

/* phone / country-code combo */
.phone-row{display:flex;gap:8px;}
.cc-picker{position:relative;flex:none;width:118px;}
.cc-btn{
  width:100%;display:flex;align-items:center;gap:6px;padding:11px 10px;
  border:1px solid var(--line);border-radius:9px;background:var(--parchment);
  cursor:pointer;font-size:.9rem;color:var(--ink);
}
.cc-btn .flag{font-size:1.1rem;}
.cc-btn .car{margin-left:auto;opacity:.6;font-size:.7rem;}
.cc-panel{
  position:absolute;top:calc(100% + 6px);left:0;width:280px;max-width:80vw;
  background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);
  z-index:40;display:none;overflow:hidden;
}
.cc-panel.open{display:block;}
.cc-search{width:100%;padding:11px 14px;border:none;border-bottom:1px solid var(--line);font-size:.9rem;outline:none;font-family:var(--sans);}
.cc-list{max-height:240px;overflow-y:auto;}
.cc-item{display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;font-size:.88rem;}
.cc-item:hover{background:var(--parchment-2);}
.cc-item .flag{font-size:1.1rem;}
.cc-item .dial{margin-left:auto;color:var(--ink-2);font-size:.82rem;}
.phone-row input[type=tel]{flex:1;}

/* chip multi-select (languages) */
.chip-box{
  display:flex;flex-wrap:wrap;gap:8px;padding:10px;border:1px solid var(--line);
  border-radius:9px;background:var(--parchment);cursor:text;
}
.chip-box input{flex:1;min-width:120px;border:none;background:transparent;outline:none;padding:6px 4px;font-family:var(--sans);font-size:.9rem;}
.chip{
  display:flex;align-items:center;gap:6px;background:var(--ink);color:#fff;
  font-size:.8rem;font-weight:600;padding:5px 8px 5px 12px;border-radius:999px;
}
.chip button{background:none;border:none;color:#fff;opacity:.75;cursor:pointer;font-size:.9rem;line-height:1;padding:0 2px;}
.chip button:hover{opacity:1;}
.chip-suggest{
  position:relative;
}
.chip-panel{
  position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid var(--line);
  border-radius:10px;box-shadow:var(--shadow);z-index:30;max-height:180px;overflow-y:auto;display:none;
}
.chip-panel.open{display:block;}
.chip-opt{padding:9px 14px;font-size:.88rem;cursor:pointer;}
.chip-opt:hover{background:var(--parchment-2);}

/* file upload */
.upload-box{
  border:1.5px dashed var(--line);border-radius:10px;padding:18px;text-align:center;
  background:var(--parchment);cursor:pointer;font-size:.86rem;color:var(--ink-2);
}
.upload-box:hover{border-color:var(--gold);}
.upload-box input{display:none;}
.upload-box .fname{margin-top:6px;font-weight:600;color:var(--ink);word-break:break-all;}
.pic-picker{display:flex;align-items:center;gap:16px;}
.pic-preview{
  width:76px;height:76px;border-radius:50%;background:var(--parchment-2);
  display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none;
  border:1px solid var(--line);color:var(--ink-2);font-size:.72rem;text-align:center;
}
.pic-preview img{width:100%;height:100%;object-fit:cover;}

/* $/currency input */
.price-row{display:flex;align-items:center;border:1px solid var(--line);border-radius:9px;background:var(--parchment);overflow:hidden;}
.price-row .sym{padding:11px 12px;font-weight:700;color:var(--ink-2);border-right:1px solid var(--line);}
.price-row input{border:none;background:transparent;flex:1;}
.price-row .per{padding:11px 12px;font-size:.82rem;color:var(--ink-2);white-space:nowrap;}

/* ---------- dashboard shell with sidebar ---------- */
.dash-shell{display:grid;grid-template-columns:230px 1fr;gap:32px;align-items:start;}
@media(max-width:860px){.dash-shell{grid-template-columns:1fr;}}
.side-nav{
  background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:18px;position:sticky;top:90px;
}
@media(max-width:860px){.side-nav{position:static;display:flex;overflow-x:auto;gap:6px;padding:10px;}}
.side-nav a{
  display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:9px;
  font-size:.9rem;font-weight:600;color:var(--ink-2);margin-bottom:4px;white-space:nowrap;
}
.side-nav a:hover{background:var(--parchment-2);color:var(--ink);}
.side-nav a.active{background:var(--ink);color:#fff;}
.profile-head{display:flex;gap:20px;align-items:center;flex-wrap:wrap;margin-bottom:1.6rem;}
.profile-head .avatar-lg{width:84px;height:84px;font-size:1.6rem;}
.profile-head h2{margin-bottom:.15em;}
.profile-head .role-tag{
  display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
  color:var(--gold);background:rgba(199,154,75,.14);padding:4px 10px;border-radius:999px;margin-top:6px;
}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
@media(max-width:560px){.info-grid{grid-template-columns:1fr;}}
.info-item .k{font-size:.76rem;color:var(--ink-2);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;}
.info-item .v{font-size:.95rem;font-weight:600;}
.audio-row{display:flex;align-items:center;gap:12px;padding:10px 0;}
.audio-row audio{flex:1;max-width:280px;}

/* ---------- misc pages ---------- */
.page-hero{padding:52px 0 40px;text-align:center;border-bottom:1px solid var(--line);}
.page-hero h1{font-size:clamp(1.8rem,4vw,2.6rem);}
.pricing-card{position:relative;}
.pricing-card.featured{border-color:var(--gold);box-shadow:var(--shadow);}
.pricing-card .badge{position:absolute;top:-12px;right:22px;background:var(--gold);color:#fff;font-size:.7rem;font-weight:700;padding:5px 12px;border-radius:999px;}
.pricing-card .amount{font-family:var(--serif);font-size:2.2rem;margin:.2em 0;}
.pricing-card .amount span{font-family:var(--sans);font-size:.9rem;font-weight:500;color:var(--ink-2);}
.pricing-card ul{margin:18px 0;}
.pricing-card li{font-size:.88rem;padding:6px 0;color:var(--ink-2);display:flex;gap:8px;}
.pricing-card li::before{content:'✓';color:var(--gold);font-weight:700;}
.faq-item{border-bottom:1px solid var(--line);padding:18px 0;}
.faq-q{font-weight:600;cursor:pointer;display:flex;justify-content:space-between;align-items:center;}
.faq-a{max-height:0;overflow:hidden;color:var(--ink-2);font-size:.92rem;transition:.25s ease;}
.faq-item.open .faq-a{max-height:200px;padding-top:10px;}
.faq-item.open .faq-q::after{transform:rotate(45deg);}
.faq-q::after{content:'+';font-size:1.3rem;color:var(--gold);transition:.2s;}
.avatar-lg{width:64px;height:64px;font-size:1.4rem;}
.dash-row{display:grid;grid-template-columns:2fr 1fr;gap:22px;}
@media(max-width:860px){.dash-row{grid-template-columns:1fr;}}
.req-item{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);gap:10px;flex-wrap:wrap;}
.req-item .badge-status{font-size:.72rem;font-weight:700;padding:4px 10px;border-radius:999px;}
.badge-status.pending{background:rgba(199,154,75,.16);color:#7a5a1e;}
.badge-status.accepted{background:rgba(31,92,84,.12);color:var(--ink);}
.badge-status.declined{background:rgba(166,82,79,.1);color:var(--rose);}
.modal-backdrop{position:fixed;inset:0;background:rgba(31,92,84,.5);display:none;align-items:center;justify-content:center;z-index:100;padding:20px;}
.modal-backdrop.open{display:flex;}
.modal{background:var(--parchment);border-radius:var(--radius);padding:30px;max-width:420px;width:100%;box-shadow:var(--shadow);}
.modal h3{margin-bottom:.3em;}
.modal-close{float:right;background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--ink-2);}
