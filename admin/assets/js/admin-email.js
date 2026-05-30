/* ============================================================
   NOIRE Admin — Email Triggers (ES Module)
   TwinWaves Digital
   ============================================================ */

import { getSettings, formatDisplayDate } from './admin-firebase.js';

let _cfg = null;
async function _config() {
  if (_cfg) return _cfg;
  const s = await getSettings();
  _cfg = s.emailjs || {};
  return _cfg;
}

async function sendConfirmation(booking) {
  const cfg = await _config();
  if (!cfg.publicKey||!cfg.serviceId||!cfg.confirmTemplateId) {
    console.warn('EmailJS not configured'); return { skipped:true };
  }
  if (typeof emailjs==='undefined') return { error:'EmailJS not loaded' };
  emailjs.init(cfg.publicKey);
  return emailjs.send(cfg.serviceId, cfg.confirmTemplateId, {
    to_email:      booking.client.email,
    guest_name:    booking.client.name,
    phone:         booking.client.phone,
    service:       booking.service,
    date:          formatDisplayDate(booking.date),
    time:          booking.slot,
    artist:        booking.staffName||'Our team',
    salon_name:    'NOIRE',
    salon_address: '42 Pali Hill, Bandra West, Mumbai 400 050',
    salon_phone:   '+91 22 3456 7890',
  });
}

async function sendCancellation(booking, reason) {
  const cfg = await _config();
  if (!cfg.publicKey||!cfg.serviceId||!cfg.cancelTemplateId) {
    console.warn('EmailJS not configured'); return { skipped:true };
  }
  if (typeof emailjs==='undefined') return { error:'EmailJS not loaded' };
  emailjs.init(cfg.publicKey);
  return emailjs.send(cfg.serviceId, cfg.cancelTemplateId, {
    to_email:   booking.client.email,
    guest_name: booking.client.name,
    service:    booking.service,
    date:       formatDisplayDate(booking.date),
    time:       booking.slot,
    reason:     reason||'Please contact us to reschedule.',
    salon_phone:'+91 22 3456 7890',
  });
}

export { sendConfirmation, sendCancellation };
