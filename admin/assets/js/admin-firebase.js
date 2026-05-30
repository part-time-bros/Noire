/* ============================================================
   NOIRE Admin — Firebase v12 Modular Init + Firestore Helpers
   TwinWaves Digital
   ============================================================ */

import { initializeApp }                          from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword,
         signOut, onAuthStateChanged }            from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js';
import { getFirestore, collection, doc,
         getDoc, getDocs, setDoc, updateDoc,
         addDoc, deleteDoc, query, where,
         orderBy, limit, serverTimestamp,
         onSnapshot, getCountFromServer }         from 'https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js';

/* ── CONFIG ───────────────────────────────────────────────── */
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyADt_lHMeCFX0oJMiYfPFN-GyDWwQAkyL4",
  authDomain:        "noiresalon.firebaseapp.com",
  projectId:         "noiresalon",
  storageBucket:     "noiresalon.firebasestorage.app",
  messagingSenderId: "733973205524",
  appId:             "1:733973205524:web:bed29895b0d14665190d01"
};

const app  = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ── COLLECTION NAMES ─────────────────────────────────────── */
const COL = {
  users:        'users',
  bookings:     'bookings',
  clients:      'clients',
  services:     'services',
  availability: 'availability',
  notifications:'notifications',
};
const SETTINGS_DOC    = () => doc(db, 'settings', 'config');
const SITE_CONTENT_DOC= () => doc(db, 'settings', 'site_content');

/* ══════════════════════════════════════════════════════════
   USER HELPERS
   ══════════════════════════════════════════════════════════ */
async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, COL.users, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
async function getAllUsers() {
  const snap = await getDocs(query(collection(db, COL.users), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function createUserDoc(uid, data) {
  return setDoc(doc(db, COL.users, uid), { ...data, createdAt: serverTimestamp(), isActive: true });
}
async function updateUserDoc(uid, data) {
  return updateDoc(doc(db, COL.users, uid), data);
}

/* ══════════════════════════════════════════════════════════
   BOOKING HELPERS
   ══════════════════════════════════════════════════════════ */
async function getBookings(filters = {}) {
  let q = collection(db, COL.bookings);
  const constraints = [];
  if (filters.status)  constraints.push(where('status', '==', filters.status));
  if (filters.date)    constraints.push(where('date',   '==', filters.date));
  if (filters.staffId) constraints.push(where('staffId','==', filters.staffId));
  constraints.push(orderBy('date', 'desc'));
  if (filters.limit)   constraints.push(limit(filters.limit));
  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function getBookingById(id) {
  const snap = await getDoc(doc(db, COL.bookings, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
async function createBooking(data) {
  return addDoc(collection(db, COL.bookings), { ...data, createdAt: serverTimestamp() });
}
async function updateBooking(id, data) {
  return updateDoc(doc(db, COL.bookings, id), data);
}
async function confirmBooking(id, adminUid) {
  return updateDoc(doc(db, COL.bookings, id), {
    status: 'confirmed', confirmedAt: serverTimestamp(), confirmedBy: adminUid,
  });
}
async function cancelBooking(id, reason, adminUid) {
  return updateDoc(doc(db, COL.bookings, id), {
    status: 'cancelled', cancelledAt: serverTimestamp(),
    cancelledBy: adminUid, cancelReason: reason || '',
  });
}
async function getTodayBookings() {
  const snap = await getDocs(
    query(collection(db, COL.bookings), where('date','==', getTodayString()), orderBy('slot','asc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function getPendingBookings(lim = 20) {
  const snap = await getDocs(
    query(collection(db, COL.bookings), where('status','==','pending'), orderBy('createdAt','desc'), limit(lim))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function getPendingCount() {
  const snap = await getCountFromServer(
    query(collection(db, COL.bookings), where('status','==','pending'))
  );
  return snap.data().count;
}
async function getBookedSlotsForDate(dateStr) {
  const snap = await getDocs(
    query(collection(db, COL.bookings),
      where('date','==', dateStr),
      where('status','in',['pending','confirmed']))
  );
  const counts = {};
  snap.docs.forEach(d => { const s = d.data().slot; counts[s] = (counts[s]||0)+1; });
  return counts;
}
function listenToPending(cb) {
  return onSnapshot(
    query(collection(db, COL.bookings), where('status','==','pending'), orderBy('createdAt','desc'), limit(20)),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  );
}

/* ══════════════════════════════════════════════════════════
   SETTINGS / AVAILABILITY
   ══════════════════════════════════════════════════════════ */
async function getSettings() {
  const snap = await getDoc(SETTINGS_DOC());
  return snap.exists() ? snap.data() : getDefaultSettings();
}
async function saveSettings(data) {
  return setDoc(SETTINGS_DOC(), data, { merge: true });
}
function getDefaultSettings() {
  return {
    salonName: 'NOIRE', maxPerSlot: 3, slotDuration: 45,
    workingHours: {
      mon: { isOpen:false, open:'10:00', close:'20:00' },
      tue: { isOpen:true,  open:'10:00', close:'20:00' },
      wed: { isOpen:true,  open:'10:00', close:'20:00' },
      thu: { isOpen:true,  open:'10:00', close:'20:00' },
      fri: { isOpen:true,  open:'10:00', close:'20:00' },
      sat: { isOpen:true,  open:'09:00', close:'21:00' },
      sun: { isOpen:true,  open:'10:00', close:'19:00' },
    },
    emailjs: { publicKey:'', serviceId:'', confirmTemplateId:'', cancelTemplateId:'' },
    contact:  { address:'42 Pali Hill, Bandra West, Mumbai 400 050', phone:'+91 22 3456 7890', email:'hello@noire.in', whatsapp:'+912234567890' },
    artists:  [],
  };
}
async function getSiteContent() {
  const snap = await getDoc(SITE_CONTENT_DOC());
  return snap.exists() ? snap.data() : {};
}
async function saveSiteContent(data) {
  return setDoc(SITE_CONTENT_DOC(), data, { merge: true });
}
async function blockDate(dateStr, reason) {
  return setDoc(doc(db, COL.availability, dateStr),
    { isBlocked:true, blockReason: reason||'', blockedAt: serverTimestamp() }, { merge:true });
}
async function unblockDate(dateStr) {
  return updateDoc(doc(db, COL.availability, dateStr), { isBlocked:false, blockReason:'' });
}
async function getBlockedDates() {
  const snap = await getDocs(query(collection(db, COL.availability), where('isBlocked','==',true)));
  return snap.docs.map(d => ({ date: d.id, ...d.data() }));
}
async function getAvailabilityDoc(dateStr) {
  const snap = await getDoc(doc(db, COL.availability, dateStr));
  return snap.exists() ? snap.data() : null;
}
async function setSlotBlocked(dateStr, slot, blocked) {
  const data = {}; data[`slotOverrides.${slot.replace(/[^a-zA-Z0-9]/g,'_')}`] = blocked ? 'blocked' : 'open';
  return setDoc(doc(db, COL.availability, dateStr), data, { merge:true });
}

/* ══════════════════════════════════════════════════════════
   CLIENT HELPERS
   ══════════════════════════════════════════════════════════ */
async function getClients() {
  const snap = await getDocs(query(collection(db, COL.clients), orderBy('createdAt','desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function findOrCreateClient(clientData) {
  const snap = await getDocs(
    query(collection(db, COL.clients), where('phone','==', clientData.phone), limit(1))
  );
  if (!snap.empty) return snap.docs[0].id;
  const ref = await addDoc(collection(db, COL.clients), {
    ...clientData, totalVisits:0, totalSpend:0, tags:[], createdAt: serverTimestamp(),
  });
  return ref.id;
}
async function updateClient(id, data) {
  return updateDoc(doc(db, COL.clients, id), data);
}

/* ══════════════════════════════════════════════════════════
   SERVICES (live from DB)
   ══════════════════════════════════════════════════════════ */
async function getServices() {
  const snap = await getDocs(query(collection(db, COL.services), orderBy('displayOrder','asc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function saveService(id, data) {
  if (id) return setDoc(doc(db, COL.services, id), data, { merge:true });
  return addDoc(collection(db, COL.services), { ...data, createdAt: serverTimestamp() });
}
async function deleteService(id) {
  return deleteDoc(doc(db, COL.services, id));
}

/* ══════════════════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════════════════ */
function generateSlots(openTime, closeTime, durationMin) {
  const slots = [];
  const [oH, oM] = openTime.split(':').map(Number);
  const [cH, cM] = closeTime.split(':').map(Number);
  let cur = oH*60+oM, end = cH*60+cM;
  while (cur + durationMin <= end) {
    const h=Math.floor(cur/60), m=cur%60, p=h>=12?'PM':'AM';
    const dh=h>12?h-12:(h===0?12:h);
    slots.push(`${dh}:${String(m).padStart(2,'0')} ${p}`);
    cur += durationMin;
  }
  return slots;
}
function getTodayString() {
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const [y,m,d]=dateStr.split('-').map(Number);
  return new Date(y,m-1,d).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
}
function isDateInPast(dateStr) {
  const t=new Date(); t.setHours(0,0,0,0);
  const [y,m,d]=dateStr.split('-').map(Number);
  return new Date(y,m-1,d)<t;
}

/* ── EXPORTS ──────────────────────────────────────────────── */
export {
  auth, db,
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  getUserDoc, getAllUsers, createUserDoc, updateUserDoc,
  getBookings, getBookingById, createBooking, updateBooking,
  confirmBooking, cancelBooking, getTodayBookings,
  getPendingBookings, getPendingCount, getBookedSlotsForDate, listenToPending,
  getSettings, saveSettings, getDefaultSettings, getSiteContent, saveSiteContent,
  blockDate, unblockDate, getBlockedDates, getAvailabilityDoc, setSlotBlocked,
  getClients, findOrCreateClient, updateClient,
  getServices, saveService, deleteService,
  generateSlots, getTodayString, formatDisplayDate, isDateInPast,
};
