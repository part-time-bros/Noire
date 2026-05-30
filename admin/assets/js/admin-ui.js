/* ============================================================
   NOIRE Admin — UI Utilities (ES Module)
   No Firebase dependency — pure DOM helpers
   TwinWaves Digital
   ============================================================ */

/* ── SIDEBAR ──────────────────────────────────────────────── */
function initSidebar() {
  const toggle  = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle||!sidebar) return;
  toggle.addEventListener('click', () => {
    const open = sidebar.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target)&&!toggle.contains(e.target)) {
      sidebar.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow='';
    }
  });
  const cur = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar__link').forEach(l => {
    if (l.getAttribute('href')===cur) l.classList.add('active');
  });
  const dateEl = document.querySelector('.topbar__date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
}

/* ── TOAST ────────────────────────────────────────────────── */
let _tc = null;
function _container() {
  if (!_tc) { _tc=document.createElement('div'); _tc.className='toast-container'; document.body.appendChild(_tc); }
  return _tc;
}
function toast(title, message='', type='info', duration=4000) {
  const icons={success:'✓',error:'✕',info:'◆'};
  const el=document.createElement('div');
  el.className=`toast toast--${type}`;
  el.setAttribute('role','alert');
  el.innerHTML=`<span class="toast__icon">${icons[type]||'◆'}</span><div class="toast__body"><div class="toast__title">${title}</div>${message?`<div class="toast__msg">${message}</div>`:''}</div>`;
  _container().appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('show')));
  setTimeout(()=>{el.classList.remove('show');el.addEventListener('transitionend',()=>el.remove(),{once:true});},duration);
}
const success = (t,m) => toast(t,m,'success');
const error   = (t,m) => toast(t,m,'error');
const info    = (t,m) => toast(t,m,'info');

/* ── CONFIRM ──────────────────────────────────────────────── */
function confirm(message, onConfirm, opts={}) {
  let ov=document.getElementById('_noireConfirm');
  if (!ov) {
    ov=document.createElement('div'); ov.id='_noireConfirm'; ov.className='modal-overlay';
    ov.innerHTML=`<div class="modal" style="max-width:400px;"><div class="modal__header"><div class="modal__title" id="_ctitle">Confirm</div><button class="modal__close" id="_cclose" aria-label="Cancel"></button></div><div class="modal__body"><p id="_cmsg" style="font-size:.9375rem;color:var(--warm-dim);line-height:1.6;"></p><div id="_cinputWrap" style="display:none;margin-top:var(--sp-lg);"><label class="form-label" id="_clabel">Reason</label><input class="form-input" id="_cinput" type="text"/></div></div><div class="modal__footer"><button class="btn btn--outline" id="_ccancel">Cancel</button><button class="btn btn--primary" id="_cok">Confirm</button></div></div>`;
    document.body.appendChild(ov);
    ['_cclose','_ccancel'].forEach(id=>document.getElementById(id).addEventListener('click',_closeConfirm));
    ov.addEventListener('click',e=>{if(e.target===ov)_closeConfirm();});
  }
  document.getElementById('_cmsg').textContent=message;
  if (opts.title) document.getElementById('_ctitle').textContent=opts.title;
  const okBtn=document.getElementById('_cok');
  okBtn.className=`btn ${opts.danger?'btn--danger':'btn--primary'}`;
  okBtn.textContent=opts.confirmLabel||'Confirm';
  const wrap=document.getElementById('_cinputWrap');
  wrap.style.display=opts.input?'block':'none';
  if (opts.input&&opts.inputLabel) document.getElementById('_clabel').textContent=opts.inputLabel;
  const newOk=okBtn.cloneNode(true);
  okBtn.replaceWith(newOk);
  newOk.addEventListener('click',()=>{
    const v=document.getElementById('_cinput').value.trim();
    if(typeof onConfirm==='function') onConfirm(v||null);
    _closeConfirm();
  });
  ov.classList.add('open'); document.body.style.overflow='hidden';
}
function _closeConfirm() {
  const ov=document.getElementById('_noireConfirm');
  if(ov){ov.classList.remove('open');document.body.style.overflow='';}
}

/* ── MODAL HELPERS ────────────────────────────────────────── */
const openModal  = id => { const el=document.getElementById(id); if(el){el.classList.add('open');document.body.style.overflow='hidden';} };
const closeModal = id => { const el=document.getElementById(id); if(el){el.classList.remove('open');document.body.style.overflow='';} };

function initModalClosers() {
  document.querySelectorAll('.modal__close,[data-close-modal]').forEach(btn=>{
    btn.addEventListener('click',()=>{ const ov=btn.closest('.modal-overlay'); if(ov){ov.classList.remove('open');document.body.style.overflow='';} });
  });
  document.querySelectorAll('.modal-overlay').forEach(ov=>{
    ov.addEventListener('click',e=>{ if(e.target===ov){ov.classList.remove('open');document.body.style.overflow='';} });
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(o=>{o.classList.remove('open');document.body.style.overflow='';});
  });
}

/* ── LOADING ──────────────────────────────────────────────── */
function setLoading(selector, on) {
  const el=document.querySelector(selector); if(!el) return;
  if(on){el.style.position='relative';const ov=document.createElement('div');ov.className='loading-overlay';ov.dataset.loading='';ov.innerHTML='<div class="spinner"></div>';el.appendChild(ov);}
  else{const ov=el.querySelector('[data-loading]');if(ov)ov.remove();}
}
function setBtnLoading(btn, on) {
  if(!btn) return;
  if(on){btn.disabled=true;btn.dataset.origText=btn.textContent;btn.innerHTML='<span class="spinner" style="width:14px;height:14px;border-width:1.5px;"></span>';}
  else{btn.disabled=false;btn.textContent=btn.dataset.origText||'Submit';}
}

/* ── EMPTY STATE ──────────────────────────────────────────── */
function renderEmpty(selector, title, sub, icon='◇') {
  const el=document.querySelector(selector); if(!el) return;
  el.innerHTML=`<div class="empty-state"><div class="empty-state__icon">${icon}</div><div class="empty-state__title">${title}</div><p class="empty-state__sub">${sub}</p></div>`;
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{ initSidebar(); initModalClosers(); });

export { toast, success, error, info, confirm, openModal, closeModal, initModalClosers, setLoading, setBtnLoading, renderEmpty };
