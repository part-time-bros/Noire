/* ============================================================
   NOIRE Admin — Auth Guard + Role Management (ES Module)
   TwinWaves Digital
   ============================================================ */

import {
  auth, onAuthStateChanged, signOut,
  getUserDoc, getPendingCount,
} from './admin-firebase.js';

const ROLES = { SUPER: 'super_admin', ADMIN: 'admin', VIEW: 'view_only' };

const DEFAULT_PERMS = {
  super_admin: { bookings:true, clients:true, team:true, services:true, availability:true, content:true, reports:true, settings:true },
  admin:       { bookings:true, clients:true, team:false, services:false, availability:true, content:false, reports:false, settings:false },
  view_only:   { bookings:true, clients:false, team:false, services:false, availability:false, content:false, reports:false, settings:false },
};

let _user=null, _role=null, _perms={}, _userDoc=null;

/* Call at top of every protected page */
async function init(requiredPermission) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.replace('../login.html'); return; }
      try {
        const ud = await getUserDoc(user.uid);
        if (!ud || !ud.isActive) {
          await signOut(auth);
          window.location.replace('../login.html?error=inactive');
          return;
        }
        _user=user; _userDoc=ud;
        _role = ud.role || ROLES.VIEW;
        _perms = Object.assign({}, DEFAULT_PERMS[_role]||DEFAULT_PERMS.view_only, ud.permissions||{});

        if (requiredPermission && !_perms[requiredPermission]) {
          window.location.replace('dashboard.html?error=noperm'); return;
        }
        _populateUI();
        resolve({ user, userDoc:ud, role:_role, permissions:_perms });
      } catch(e) { console.error(e); window.location.replace('../login.html?error=auth'); }
    });
  });
}

function _populateUI() {
  const name = _userDoc.displayName || _user.email.split('@')[0];
  const roleLabel = _role===ROLES.SUPER?'Super Admin':_role===ROLES.ADMIN?'Admin':'View Only';
  document.querySelectorAll('[data-user-name]').forEach(el => el.textContent=name);
  document.querySelectorAll('[data-user-role]').forEach(el => el.textContent=roleLabel);
  document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent=name.charAt(0).toUpperCase());
  document.querySelectorAll('[data-requires-perm]').forEach(el => {
    if (!_perms[el.getAttribute('data-requires-perm')]) el.style.display='none';
  });
  document.querySelectorAll('[data-requires-super]').forEach(el => {
    if (_role!==ROLES.SUPER) el.style.display='none';
  });
  _updatePendingBadge();
}

async function _updatePendingBadge() {
  try {
    const count = await getPendingCount();
    document.querySelectorAll('.sidebar__link-badge[data-pending]').forEach(b => {
      b.textContent=count; b.style.display=count>0?'flex':'none';
    });
    const bell = document.querySelector('.topbar__notif-badge');
    if (bell) bell.style.display=count>0?'block':'none';
  } catch(e) {}
}

async function doSignOut() {
  await signOut(auth);
  window.location.replace('../login.html');
}

const can     = p => !!_perms[p];
const isSuper = () => _role===ROLES.SUPER;
const isAdmin = () => _role===ROLES.ADMIN||_role===ROLES.SUPER;
const getUID  = () => _user?_user.uid:null;
const getRole = () => _role;
const getUDoc = () => _userDoc;

export { init, doSignOut, can, isSuper, isAdmin, getUID, getRole, getUDoc, ROLES };
