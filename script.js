/* ==========================================================
   Kashmir Hub - script.js
   Needs data.js to be loaded first (see index.html).
   ========================================================== */

const $ = s => document.querySelector(s);
const tel = p => 'tel:' + p.replace(/[^0-9+]/g, '');

/* ---------- Saved items (favourites / packing) ---------- */
let favs = [], packed = [];
try {
  favs = JSON.parse(localStorage.getItem('favs') || '[]');
  packed = JSON.parse(localStorage.getItem('packed') || '[]');
} catch (e) {}
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} };

/* ==========================================================
   1. Page content
   ========================================================== */
$('#slides').innerHTML = hero.map((u, i) => `<div class="slide${i ? '' : ' on'}" style="background-image:url('${u + H}')"></div>`).join('');

const ticks = helplines.map(h => `<span>${h.n}: <a href="${tel(h.p)}">${h.p}</a></span>`).join('');
$('#tick').innerHTML = ticks + ticks;
$('#fe').innerHTML = helplines.slice(0, 4).map(h => `<li>${h.n}: <a href="${tel(h.p)}">${h.p}</a></li>`).join('');
$('#ecs').innerHTML = helplines.map(h => `<div class="ec"><div><strong>${h.n}</strong><br><small>${h.s}</small></div><a class="${h.r ? 'r' : ''}" href="${tel(h.p)}"><i class="fa-solid fa-phone"></i> ${h.p}</a></div>`).join('');

$('#featured').innerHTML = featured.map(f => `<article class="card"><div class="imgw"><img loading="lazy" src="${f.i + Q}" alt="${f.n}"><span class="tag">${f.t}</span></div><div class="cb"><h3>${f.n}</h3><p>${f.d}</p><button class="btn" data-g="${f.n}">Explore guide <i class="fa-solid fa-arrow-right"></i></button></div></article>`).join('');

const tcard = p => `<article class="card" id="p-${p.n.split(' ')[0].toLowerCase()}"><div class="imgw"><img loading="lazy" src="${p.i + Q}" alt="${p.n}"><span class="tag">${p.t}</span><button class="hrt" data-fav="${p.n}" aria-label="Save ${p.n}"><i class="${favs.includes(p.n) ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button></div><div class="cb"><h3>${p.n}</h3><p>${p.d}</p><div class="cf"><span>Best season: ${p.s}</span><b>${p.k}</b></div><button class="btn" data-g="${p.n}">Full guide <i class="fa-solid fa-arrow-right"></i></button></div></article>`;

$('#dgrid').innerHTML = districts.map((d, i) => `<button class="card dc" data-d="${i}"><div class="cb"><div class="row" style="align-items:center"><span class="num">${i + 1}</span><i class="fa-solid fa-chevron-right" style="color:var(--muted)"></i></div><h3>${d.n}</h3><small style="color:var(--muted)">Capital: ${d.c}</small><p>${d.d}</p><div class="cf"><span>Pop: ${d.p}</span><b>View details</b></div></div></button>`).join('');

$('#hd').insertAdjacentHTML('beforeend', [...new Set(hospitals.map(h => h.d))].map(d => `<option>${d}</option>`).join(''));

/* ==========================================================
   2. Hospitals directory
   ========================================================== */
let lvl = '';
function renderH() {
  const q = $('#hq').value.trim().toLowerCase(), d = $('#hd').value;
  const r = hospitals.filter(h => (!lvl || h.l === lvl) && (!d || h.d === d) && (h.n + h.d + h.f).toLowerCase().includes(q));
  $('#count').textContent = r.length + (r.length === 1 ? ' hospital' : ' hospitals') + ' found';
  $('#hb').innerHTML = r.length
    ? r.map(h => `<tr><td><strong><i class="fa-solid fa-hospital" style="color:var(--moss)"></i> ${h.n}</strong></td><td>${h.d}</td><td><span class="lv ${h.l}">${h.l}</span></td><td>${h.f}</td><td>${h.phone ? `<a class="call" href="${tel(h.phone)}"><i class="fa-solid fa-phone"></i> ${h.phone}</a>` : `<span class="nop">Number not yet verified<br><a href="tel:1122">Emergency? Call 1122</a></span>`}</td></tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px">No hospitals match your search. Try a different name or district.</td></tr>';
}
['#hq', '#hd'].forEach(s => $(s).addEventListener('input', renderH));
$('#hl').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  lvl = b.dataset.l;
  document.querySelectorAll('#hl button').forEach(x => x.classList.toggle('on', x === b));
  renderH();
});
renderH();

/* ==========================================================
   3. Views / navigation
   ========================================================== */
const views = ['home', 'districts', 'hospitals', 'tourism', 'firstaid', 'contact'];
function show(v, push) {
  if (!views.includes(v)) v = 'home';
  document.querySelectorAll('.view').forEach(e => e.classList.toggle('on', e.id === 'view-' + v));
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('#nav').classList.remove('open');
  $('#burger').setAttribute('aria-expanded', 'false');
  if (push && location.hash !== '#' + v) history.pushState(null, '', '#' + v);
  window.scrollTo({ top: 0 });
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-g]');
  if (g) { openG(places.find(p => p.n === g.dataset.g)); return }
  const b = e.target.closest('[data-v]');
  if (b) { show(b.dataset.v, true); return }
  const d = e.target.closest('[data-d]');
  if (d) openD(districts[+d.dataset.d]);
});
window.addEventListener('popstate', () => show(location.hash.slice(1)));
$('#burger').onclick = () => {
  const o = $('#nav').classList.toggle('open');
  $('#burger').setAttribute('aria-expanded', o);
};
show(location.hash.slice(1));

/* ==========================================================
   4. Home search
   ========================================================== */
$('#hs').addEventListener('submit', e => {
  e.preventDefault();
  const q = $('#q').value.trim().toLowerCase();
  if (!q) { $('#msg').textContent = 'Type a hospital, district or valley name to search.'; return }
  $('#msg').textContent = '';
  const d = districts.find(x => (x.n + x.c).toLowerCase().includes(q));
  if (d) { show('districts', true); openD(d); return }
  const p = places.find(x => x.n.toLowerCase().includes(q));
  if (p) {
    show('tourism', true);
    const el = document.getElementById('p-' + p.n.split(' ')[0].toLowerCase());
    el && el.scrollIntoView({ block: 'center' });
    return;
  }
  if (hospitals.some(h => (h.n + h.d + h.f).toLowerCase().includes(q))) {
    show('hospitals', true);
    $('#hq').value = q;
    renderH();
    return;
  }
  $('#msg').textContent = 'No match for "' + $('#q').value.trim() + '". Try a district, hospital or valley name.';
});

/* ==========================================================
   5. District modal
   ========================================================== */
let last;
function openD(d) {
  last = document.activeElement;
  $('.mb').classList.remove('wide');
  $('#mc').innerHTML = `<h3 id="mt">${d.n}</h3><p style="color:var(--muted);font-size:14px">District headquarters: <strong style="color:var(--ink)">${d.c}</strong></p><p style="margin-top:12px">${d.d}</p><div class="kv"><div><span>Estimated population</span><strong>${d.p}</strong></div><div><span>Primary languages</span><strong>${d.l}</strong></div><div><span>Main healthcare</span><strong>${d.h}</strong></div></div><button class="btn" id="mclose">Close profile</button>`;
  $('#modal').classList.add('on');
  $('#mx').focus();
  $('#mclose').onclick = closeM;
}
function closeM() {
  $('#modal').classList.remove('on');
  last && last.focus();
}
$('#mx').onclick = closeM;
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeM() });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM() });

/* ==========================================================
   6. Feedback form
   Set an endpoint (e.g. a Formspree URL) to receive submissions.
   ========================================================== */
const FORM_ENDPOINT = '';
$('#ff').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, ok = $('#ok');
  try {
    if (FORM_ENDPOINT) {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(f) });
      if (!r.ok) throw 0;
    }
    ok.style.color = 'var(--moss)';
    ok.textContent = 'Thank you. Your feedback has been sent to the AJK facilitation team.';
    f.reset();
  } catch {
    ok.style.color = 'var(--alert)';
    ok.textContent = 'Could not send. Please try again or call the helpline.';
  }
});

/* ==========================================================
   7. Destination quiz
   ========================================================== */
let qa = [];
function quiz() {
  const s = qa.length, box = $('#qa');
  $('#qp').style.width = (s / qs.length * 100) + '%';
  if (s < qs.length) {
    box.innerHTML = `<div class="qq">${qs[s].q}</div><div class="opts">${qs[s].o.map(o => `<button data-a="${o[1]}"><i class="fa-solid ${ic[o[1]]}"></i>${o[0]}</button>`).join('')}</div>${s ? '<button class="qb" id="qback">&larr; Back</button>' : ''}`;
    return;
  }
  const [t, se, ef] = qa;
  const r = places.map(p => {
    const m = meta[p.n], why = [];
    let sc = 0;
    if (m[0].includes(t)) { sc += 3; why.push(lab[t]) }
    if (se === 'any') sc += 1;
    else if (m[1].includes(se)) { sc += 2; why.push(lab[se]) }
    if (m[2] === ef) { sc += 2; why.push(lab[ef]) }
    else if (ef === 'adv') sc += 1;
    return { p, sc, why };
  }).sort((a, b) => b.sc - a.sc).slice(0, 3);
  box.innerHTML = `<div class="qq">Your top matches</div><div class="res">${r.map(x => `<article class="card"><img loading="lazy" src="${x.p.i + Q}" alt="${x.p.n}"><div class="cb"><h3>${x.p.n}</h3><small style="color:var(--muted)">${x.p.t}</small><div class="why">${x.why.join(' &bull; ') || 'A popular all-round pick'}</div><button class="btn" data-g="${x.p.n}">Full guide <i class="fa-solid fa-arrow-right"></i></button></div></article>`).join('')}</div><button class="qb" id="qre">Start again</button>`;
}
$('#qa').addEventListener('click', e => {
  const a = e.target.closest('[data-a]');
  if (a) { qa.push(a.dataset.a); quiz(); return }
  if (e.target.id === 'qback') { qa.pop(); quiz() }
  if (e.target.id === 'qre') { qa = []; quiz() }
});
quiz();

/* ==========================================================
   8. Place guide (with nearest healthcare)
   ========================================================== */
function openG(p) {
  last = document.activeElement;
  const reg = p.t.split(' •')[0], dist = reg === 'Neelum Valley' ? 'Neelum District' : reg;
  const first = ['Sharda Village & Ruins', 'Taobat Village'].includes(p.n) ? 'THQ' : 'DHQ';
  const hs = hospitals.filter(h => h.d === dist).sort((a, b) => (b.l === first) - (a.l === first));
  $('.mb').classList.add('wide');
  $('#mc').innerHTML = `<div class="gimg"><img src="${p.i + Q}" alt="${p.n}"><span class="tag">${p.t}</span></div><div class="gb"><h3 id="mt">${p.n}</h3><p>${p.d}</p><div class="facts"><div><small>Best season</small><b>${p.s}</b></div><div><small>Highlight</small><b>${p.k}</b></div><div><small>District</small><b>${dist}</b></div></div>${guideExtra(p, dist)}<h4 class="gh"><i class="fa-solid fa-hospital"></i> Nearest healthcare</h4>${hs.map(h => `<div class="hrow"><div><strong>${h.n}</strong><br><small>${h.l} &bull; ${h.f}</small></div>${h.phone ? `<a class="call" href="${tel(h.phone)}">${h.phone}</a>` : '<span class="nop">Number not yet verified</span>'}<a class="mp" target="_blank" rel="noopener" href="${gm(h.n + ', ' + h.d + ', Azad Kashmir')}"><i class="fa-solid fa-location-dot"></i> Map</a></div>`).join('')}<p class="nop" style="margin-top:8px">Distances vary by road and weather. Mobile signal can be weak in high valleys, so save 1122 before you travel.</p><div class="gact"><a class="btn sosb" href="tel:1122"><i class="fa-solid fa-phone-volume"></i> Call Rescue 1122</a><button class="btn alt" data-fav="${p.n}">${favBtn(p.n)}</button><a class="btn alt" target="_blank" rel="noopener" href="${wa(p.n + ' (' + p.t + '): ' + p.d.split('.')[0])}"><i class="fa-brands fa-whatsapp"></i> Share</a><button class="btn alt" data-print="g"><i class="fa-solid fa-print"></i> Save as PDF</button><button class="btn alt" id="gclose">Close guide</button></div></div>`;
  $('#modal').classList.add('on');
  $('#mx').focus();
  $('#gclose').onclick = closeM;
}

/* ==========================================================
   9. Hero stats + header shadow
   ========================================================== */
const st = [[districts.length, 'Districts'], [hospitals.length, 'Hospitals listed'], [places.length, 'Destinations'], ['24/7', 'Rescue 1122']];
$('#stats').innerHTML = st.map(s => `<div><b data-n="${s[0]}">${s[0]}</b><span>${s[1]}</span></div>`).join('');
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  document.querySelectorAll('#stats b').forEach(b => {
    const n = +b.dataset.n;
    if (!n) return;
    const t0 = performance.now();
    (function f(t) {
      const k = Math.min((t - t0) / 1200, 1);
      b.textContent = Math.round(n * k);
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  });
}
addEventListener('scroll', () => $('header').classList.toggle('sc', scrollY > 10), { passive: true });

/* ==========================================================
   10. Chat assistant (answers from the data on this site)
   ========================================================== */
const bad = ['lake', 'valley', 'village', 'ruins', 'gali', 'fort'];
const pk = p => p.n.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !bad.includes(w));
const hl = a => a.map(h => `<div class="bh"><b>${h.n}</b><br><small>${h.l} &bull; ${h.f}</small><br>${h.phone ? `<a href="${tel(h.phone)}">${h.phone}</a>` : '<small>Number not yet verified</small>'}</div>`).join('');
const sos = '<br><a class="bsos" href="tel:1122"><i class="fa-solid fa-phone"></i> Call Rescue 1122</a>';
const near = p => {
  const r = p.t.split(' •')[0], d = r === 'Neelum Valley' ? 'Neelum District' : r, f = ['Sharda Village & Ruins', 'Taobat Village'].includes(p.n) ? 'THQ' : 'DHQ';
  return hospitals.filter(h => h.d === d).sort((a, b) => (b.l === f) - (a.l === f));
};
const line = h => `<b>${h.n}</b>: <a href="${tel(h.p)}">${h.p}</a>`;

function ans(q) {
  const L = q.toLowerCase(), has = (...w) => w.some(x => L.includes(x));
  const d = districts.find(x => L.includes(x.n.split(' ')[0].toLowerCase()) || L.includes(x.c.toLowerCase()));
  const p = places.find(x => pk(x).some(w => L.includes(w)));
  if (has('hospital', 'dhq', 'thq', 'doctor', 'medical', 'aspatal', 'clinic')) {
    if (p) return `Hospitals near <b>${p.n}</b>:` + hl(near(p)) + '<small>Distances vary by road and weather.</small>' + sos;
    if (d) { const k = d.n.split(' ')[0].toLowerCase(); return `Hospitals in <b>${d.n}</b>:` + hl(hospitals.filter(h => h.d.toLowerCase().startsWith(k))) + sos }
    return 'Tell me a district or place and I will list its hospitals, for example <button class="btn mini" data-q="Hospitals in Bagh">Bagh</button><button class="btn mini" data-q="Hospitals in Mirpur">Mirpur</button><button class="btn mini" data-q="Hospitals in Kotli">Kotli</button>' + sos;
  }
  if (has('tourist police', 'tourism police', 'police')) return line(helplines[1]) + '<br>' + line(helplines[4]);
  if (has('traffic')) return line(helplines[4]);
  if (has('sdma', 'disaster', 'landslide', 'weather')) return line(helplines[2]);
  if (has('health dep')) return line(helplines[3]);
  if (has('emergency', 'ambulance', 'rescue', '1122', 'urgent', 'accident', 'madad', 'helpline', 'contact', 'phone')) return 'Emergency and helpline numbers:<br>' + helplines.map(line).join('<br>') + sos;
  if (has('first aid', 'firstaid', 'cpr', 'bleeding', 'burn', 'altitude sickness', 'snake', 'choking', 'hypothermia', 'fracture', 'tabi', 'zakhm')) return 'Open the First Aid guide for step-by-step help. In a life-threatening emergency call 1122 first.<br><button class="btn mini" data-v="firstaid">Open First Aid guide</button>' + sos;
  if (has('road', 'route', 'jeep', 'highway', '4x4')) return 'I do not give road status because it changes quickly. Please check <a href="https://sdma.pk" target="_blank" rel="noopener">sdma.pk</a> or call Tourist Police on <a href="tel:1422">1422</a> before you travel.';
  if (p) return `<b>${p.n}</b> (${p.t})<br>${p.d}<br>Best season: ${p.s}.<br><button class="btn mini" data-g="${p.n}">Open full guide</button><button class="btn mini alt" data-q="Hospitals near ${p.n}">Nearest hospital</button>`;
  if (d) return `<b>${d.n}</b><br>Capital: ${d.c}. Population: ${d.p}.<br>Languages: ${d.l}.<br>Main healthcare: ${d.h}.<br>${d.d}<br><button class="btn mini" data-q="Hospitals in ${d.n.split(' ')[0]}">Show hospitals</button>`;
  if (has('season', 'best time', 'when', 'mausam', 'winter', 'summer', 'kab')) return 'Most alpine valleys and lakes (Neelum Valley, Ratti Gali, Shounter, Taobat) are best from June to September. Banjosa Lake and Ganga Choti suit year-round visits. Ramkot Fort is best from October to April.';
  if (has('recommend', 'suggest', 'where should', 'plan', 'trip', 'jagah', 'ghoom')) return 'Try the <b>Find your perfect destination</b> quiz on the Home page. Answer 3 questions and get your top 3 places.<br><button class="btn mini" data-v="home">Go to quiz</button>';
  if (has('district')) return 'AJK has 10 districts: ' + districts.map(x => x.n).join(', ') + '. Ask me about any of them.';
  if (has('place', 'destination', 'visit', 'tour', 'valley', 'lake')) return 'Popular places: ' + places.map(x => `<button class="btn mini" data-g="${x.n}">${x.n}</button>`).join('');
  if (has('hi', 'hello', 'salam', 'hey')) return 'Hello! Ask me about hospitals, districts, tourist places or emergency numbers.';
  if (has('thank', 'shukriya')) return 'You are welcome. Stay safe, and remember 1122 for emergencies.';
  return 'I can help with hospitals, districts, tourist places, best season and emergency numbers. Try one of the buttons below.' + sos;
}
function say(h, w) {
  const m = document.createElement('div');
  m.className = 'm ' + w;
  m.innerHTML = h;
  $('#bm').appendChild(m);
  $('#bm').scrollTop = 1e9;
  return m;
}
function ask(q) {
  q = q.trim();
  if (!q) return;
  const u = say('', 'u');
  u.textContent = q;
  const t = say('<i></i><i></i><i></i>', 'b dots');
  setTimeout(() => { t.remove(); say(ans(q), 'b') }, 450);
}

/* Draggable assistant bubble */
const bot = $('#bot');
let dg = null, moved = false;
function clamp() {
  const r = bot.getBoundingClientRect(),
    x = Math.min(Math.max(8, r.left), Math.max(8, innerWidth - r.width - 8)),
    y = Math.min(Math.max(8, r.top), Math.max(8, innerHeight - r.height - 8));
  Object.assign(bot.style, { left: x + 'px', top: y + 'px', right: 'auto', bottom: 'auto' });
}
function tg(o) {
  bot.classList.toggle('open', o);
  requestAnimationFrame(clamp);
  if (o) $('#bi').focus();
}
addEventListener('pointerdown', e => {
  const h = e.target.closest('#bl,.chd');
  if (!h || (h.classList.contains('chd') && e.target.closest('button'))) return;
  const r = bot.getBoundingClientRect();
  dg = { dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY };
});
addEventListener('pointermove', e => {
  if (!dg) return;
  if (Math.abs(e.clientX - dg.sx) + Math.abs(e.clientY - dg.sy) > 5) moved = true;
  if (!moved) return;
  bot.style.left = (e.clientX - dg.dx) + 'px';
  bot.style.top = (e.clientY - dg.dy) + 'px';
  bot.style.right = bot.style.bottom = 'auto';
  clamp();
});
addEventListener('pointerup', () => { dg = null; setTimeout(() => moved = false, 0) });
addEventListener('resize', clamp);
$('#bl').onclick = () => { if (!moved) tg(true) };
$('#bx').onclick = () => tg(false);
$('#bf').onsubmit = e => {
  e.preventDefault();
  const i = $('#bi');
  ask(i.value);
  i.value = '';
};
$('#bc').innerHTML = ['Emergency numbers', 'Hospitals in Muzaffarabad', 'Best time to visit', 'Plan my trip', 'Ratti Gali Lake', 'List districts'].map(c => `<button data-q="${c}">${c}</button>`).join('');
document.addEventListener('click', e => {
  const c = e.target.closest('[data-q]');
  if (c) ask(c.dataset.q);
});
say('Assalam o Alaikum! I am the Kashmir Hub assistant. Ask me about hospitals, districts, tourist places or emergency numbers. In a life-threatening emergency, call 1122 first.', 'b');

/* ==========================================================
   12. Tourism: filters, favourites, planner, packing, directory, sharing
   ========================================================== */
const favBtn = n => favs.includes(n) ? '<i class="fa-solid fa-heart"></i> Saved' : '<i class="fa-regular fa-heart"></i> Save';
const gm = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const wa = t => 'https://wa.me/?text=' + encodeURIComponent(t + ' - Explore more on Kashmir Hub: ' + location.href.split('#')[0]);

function guideExtra(p) {
  const m = meta[p.n], q = p.n + ', Azad Kashmir';
  return `<h4 class="gh"><i class="fa-solid fa-route"></i> Plan your visit</h4><div class="facts"><div><small>Access</small><b>${acc[p.n] || 'Route details not yet verified'}</b></div><div><small>Difficulty</small><b>${m[2] === 'easy' ? 'Easy access' : 'Adventure route'}</b></div><div><small>From Islamabad</small><b>Live distance and time in Google Maps</b></div><div><small>Stay, food &amp; permits</small><b>Not yet verified. Ask Tourist Police 1422</b></div></div><div class="mapw"><iframe loading="lazy" title="Map of ${p.n}" src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed"></iframe></div><a class="btn mini" target="_blank" rel="noopener" href="${gm(q)}"><i class="fa-solid fa-location-arrow"></i> Open in Google Maps</a> <a class="btn mini alt" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&origin=Islamabad&destination=${encodeURIComponent(q)}&travelmode=driving"><i class="fa-solid fa-route"></i> Distance from Islamabad</a>`;
}

const dist0 = p => {
  const r = p.t.split(' \u2022')[0];
  return r === 'Neelum Valley' ? 'Neelum District' : r;
};
let onlyFav = false;
function renderT() {
  const q = $('#tq').value.trim().toLowerCase(), d = $('#td').value, s = $('#ts').value, e = $('#te').value;
  const r = places.filter(p => {
    const m = meta[p.n];
    return (!q || (p.n + p.t + p.d).toLowerCase().includes(q)) && (!d || dist0(p) === d) && (!s || m[1].includes(s)) && (!e || m[2] === e) && (!onlyFav || favs.includes(p.n));
  });
  $('#tcount').textContent = r.length + ' of ' + places.length + ' destinations';
  $('#tgrid').innerHTML = r.length ? r.map(tcard).join('') : '<p class="note">No destinations match. Try removing a filter.</p>';
  $('#fc').textContent = favs.length;
}
$('#td').insertAdjacentHTML('beforeend', [...new Set(places.map(dist0))].map(d => `<option>${d}</option>`).join(''));
['#tq', '#td', '#ts', '#te'].forEach(s => $(s).addEventListener('input', renderT));
$('#surp').onclick = () => openG(places[Math.random() * places.length | 0]);
$('#favt').onclick = function () {
  onlyFav = !onlyFav;
  this.classList.toggle('on', onlyFav);
  renderT();
};
renderT();

document.addEventListener('click', e => {
  const j = e.target.closest('[data-j]');
  if (j) { document.getElementById(j.dataset.j).scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  const f = e.target.closest('[data-fav]');
  if (!f) return;
  const n = f.dataset.fav, i = favs.indexOf(n);
  i < 0 ? favs.push(n) : favs.splice(i, 1);
  store('favs', favs);
  document.querySelectorAll('[data-fav]').forEach(b => {
    if (b.dataset.fav === n) b.innerHTML = b.classList.contains('hrt') ? `<i class="${favs.includes(n) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>` : favBtn(n);
  });
  $('#fc').textContent = favs.length;
  if (onlyFav) renderT();
});

/* ---------- Trip planner ---------- */
let pd = 2;
function renderP() {
  const [t, l] = plans[pd], ps = l.map(n => places.find(p => p.n === n));
  $('#pout').innerHTML = `<h4 style="font:700 20px 'Source Serif 4',serif;margin-bottom:10px">${t} (${pd} days)</h4>` + ps.map((p, i) => `<div class="pd" style="animation-delay:${i * .1}s"><img loading="lazy" src="${p.i + Q}" alt="${p.n}"><div><span class="dn">Day ${i + 1}</span><b>${p.n}</b><small>${p.t} &bull; Best season: ${p.s}</small><br><button class="btn mini" data-g="${p.n}">Open guide</button></div></div>`).join('') + `<div class="gact"><a class="btn" target="_blank" rel="noopener" href="${wa(t + ' (' + pd + ' days): ' + l.map((n, i) => 'Day ' + (i + 1) + ' ' + n).join(', '))}"><i class="fa-brands fa-whatsapp"></i> Share plan</a><button class="btn alt" data-print="plan"><i class="fa-solid fa-print"></i> Save plan as PDF</button></div>`;
}
$('#pdays').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  pd = +b.dataset.p;
  document.querySelectorAll('#pdays button').forEach(x => x.classList.toggle('on', x === b));
  renderP();
});
renderP();

/* ---------- Packing list ---------- */
$('#plist').innerHTML = pack.map((x, i) => `<label><input type="checkbox" data-k="${i}" ${packed.includes(i) ? 'checked' : ''}><span>${x}</span></label>`).join('');
function upPack() {
  const n = packed.length, p = Math.round(n / pack.length * 100);
  $('#pk').style.width = p + '%';
  $('#pkm').textContent = p === 100 ? 'You are ready for Kashmir! Safe travels.' : p >= 50 ? 'Almost ready. ' + (pack.length - n) + ' items to go.' : p > 0 ? 'Good start. Keep packing.' : 'Tick items as you pack.';
}
$('#plist').addEventListener('change', e => {
  const k = +e.target.dataset.k;
  e.target.checked ? packed.push(k) : packed.splice(packed.indexOf(k), 1);
  store('packed', packed);
  upPack();
});
upPack();

/* ---------- Hotels / guides / jeeps directory ---------- */
function renderDir(t) {
  const a = directory[t], one = t.toLowerCase().replace(/s$/, ''), msg = 'Assalam o Alaikum, I would like to list my ' + one + ' service on Kashmir Hub.\nName:\nDistrict:\nPhone:';
  $('#dout').innerHTML = (a.length ? a.map(x => `<div class="ec"><div><strong>${x.n}</strong><br><small>${x.d}</small></div><a href="${tel(x.p)}"><i class="fa-solid fa-phone"></i> ${x.p}</a></div>`).join('') : '') + `<div class="empty"><i class="fa-brands fa-whatsapp"></i>${a.length ? '' : '<p>Verified listings are being collected. Only numbers we have checked are listed here, to protect travellers from fake listings.</p>'}<p>Run a hotel, guide or jeep service? Send your details on WhatsApp and we will verify and list it.</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/923492432301?text=${encodeURIComponent(msg)}"><i class="fa-brands fa-whatsapp"></i> List your service on WhatsApp</a></div>`;
}
$('#dtabs').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  document.querySelectorAll('#dtabs button').forEach(x => x.classList.toggle('on', x === b));
  renderDir(b.dataset.t);
});
renderDir('Hotels');

/* ---------- Print / save as PDF ---------- */
const pa = document.createElement('div');
pa.id = 'pa';
document.body.appendChild(pa);
const guideBody = p => {
  const dist = dist0(p);
  return `<div class="gimg"><img src="${p.i + Q}" alt="${p.n}"><span class="tag">${p.t}</span></div><div class="gb"><h3>${p.n}</h3><p>${p.d}</p><div class="facts"><div><small>Best season</small><b>${p.s}</b></div><div><small>Highlight</small><b>${p.k}</b></div><div><small>District</small><b>${dist}</b></div></div>${guideExtra(p, dist)}<h4 class="gh"><i class="fa-solid fa-hospital"></i> Nearest healthcare</h4>${near(p).map(h => `<div class="hrow"><div><strong>${h.n}</strong><br><small>${h.l} &bull; ${h.f}</small></div>${h.phone ? `<a class="call" href="${tel(h.phone)}">${h.phone}</a>` : '<span class="nop">Number not yet verified</span>'}</div>`).join('')}<p class="nop" style="margin-top:8px">Distances vary by road and weather. In an emergency call Rescue 1122.</p></div>`;
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-print]');
  if (!b) return;
  if (b.dataset.print === 'g') pa.innerHTML = $('#mc').innerHTML;
  else {
    // trip plan: print the full guide of every place, one place per page
    const [t, l] = plans[pd];
    pa.innerHTML = `<h2 class="ptitle">${t} (${pd} days)</h2>` + l.map((n, i) =>
      `<section class="pg"><div class="dn">Day ${i + 1}</div>${guideBody(places.find(x => x.n === n))}</section>`).join('');
  }
  document.body.classList.add('pr');
  // load every image first, then open the print dialog (waits at most 2 seconds)
  const imgs = [...pa.querySelectorAll('img')].map(i => {
    i.loading = 'eager';
    return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; });
  });
  Promise.race([Promise.all(imgs), new Promise(r => setTimeout(r, 2000))]).then(() => print());
});
addEventListener('afterprint', () => document.body.classList.remove('pr'));

/* ==========================================================
   13. Urdu language switch
   (translates interface text; place and hospital data stay in English)
   UR and RX are defined in data.js
   ========================================================== */
const orig = new WeakMap();
let lang = 'en';
const trk = k => {
  if (UR[k]) return UR[k];
  for (const [r, s] of RX) if (r.test(k)) return k.replace(r, s);
};
function walk(root) {
  if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while (n = w.nextNode()) {
    const pn = n.parentNode.nodeName;
    if (pn === 'SCRIPT' || pn === 'STYLE') continue;
    const o = orig.has(n) ? orig.get(n) : n.nodeValue, k = o.trim();
    if (lang === 'ur') {
      const t = trk(k);
      if (t) {
        if (!orig.has(n)) orig.set(n, o);
        n.nodeValue = ' ' + t + ' ';
      }
    } else if (orig.has(n)) {
      n.nodeValue = orig.get(n);
      orig.delete(n);
    }
  }
  if (root.querySelectorAll) {
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e => ['placeholder', 'aria-label', 'title'].forEach(a => {
      const v = e.getAttribute(a);
      if (v === null) return;
      const k = '_o' + a, o = e[k] !== undefined ? e[k] : v;
      if (lang === 'ur') {
        const t = trk(o);
        if (t) { e[k] = o; e.setAttribute(a, t) }
      } else if (e[k] !== undefined) {
        e.setAttribute(a, e[k]);
        delete e[k];
      }
    }));
  }
}
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
  $('#lang').textContent = l === 'ur' ? 'English' : '\u0627\u0631\u062f\u0648';
  walk(document.body);
  try { localStorage.setItem('lang', l) } catch (e) {}
}
$('#lang').onclick = () => setLang(lang === 'ur' ? 'en' : 'ur');
new MutationObserver(m => {
  if (lang !== 'ur') return;
  m.forEach(x => x.addedNodes.forEach(n => walk(n.nodeType === 1 ? n : n.parentNode)));
}).observe(document.body, { childList: true, subtree: true });
try { if (localStorage.getItem('lang') === 'ur') setLang('ur') } catch (e) {}

/* ==========================================================
   14. Hero carousel
   ========================================================== */
const sl = document.querySelectorAll('.slide');
let c = 0;
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  setInterval(() => {
    sl[c].classList.remove('on');
    c = (c + 1) % sl.length;
    sl[c].classList.add('on');
  }, 5000);
}


/* ==========================================================
   Gallery, photo viewer and home planner buttons
   ========================================================== */
const lb = $('#lb');
let gi = 0;
$('#gallery').innerHTML = places.map((p, i) =>
  `<button data-gi="${i}" aria-label="View ${p.n}"><img loading="lazy" src="${p.i + Q}" alt="${p.n}"><span>${p.n}</span></button>`).join('');
function showG(i) {
  gi = (i + places.length) % places.length;
  const p = places[gi];
  $('#lbi').src = p.i + Q;
  $('#lbi').alt = p.n;
  $('#lbc').innerHTML = `<b>${p.n}</b><small>${p.t}</small>`;
  $('#lbg').dataset.g = p.n;
  lb.classList.add('on');
}
$('#gallery').addEventListener('click', e => { const b = e.target.closest('[data-gi]'); if (b) showG(+b.dataset.gi); });
$('#lbp').onclick = () => showG(gi - 1);
$('#lbn').onclick = () => showG(gi + 1);
$('#lbx').onclick = () => lb.classList.remove('on');
$('#lbg').addEventListener('click', () => lb.classList.remove('on'));
lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('on'); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') lb.classList.remove('on');
  if (e.key === 'ArrowLeft') showG(gi - 1);
  if (e.key === 'ArrowRight') showG(gi + 1);
});
let tx = 0;
lb.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) showG(gi + (dx < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('click', e => {
  const b = e.target.closest('[data-plan]');
  if (!b) return;
  show('tourism', true);
  pd = +b.dataset.plan;
  document.querySelectorAll('#pdays button').forEach(x => x.classList.toggle('on', x.dataset.p === b.dataset.plan));
  renderP();
  setTimeout(() => $('#plan').scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
});

/* Gallery arrows (the strip also scrolls by swipe or mouse wheel) */
const gStep = d => $('#gallery').scrollBy({ left: d * (document.documentElement.dir === 'rtl' ? -1 : 1) * 300, behavior: 'smooth' });
$('#gprev').onclick = () => gStep(-1);
$('#gnext').onclick = () => gStep(1);
