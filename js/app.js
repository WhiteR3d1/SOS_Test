/* ============================================================
   app.js — เครื่องสร้างข้อสอบและส่วนติดต่อผู้ใช้
   ============================================================ */

const QUESTIONS_PER_EXAM = 110;

const CHAPTERS = {
  1: 'Introduction',
  2: 'The Kernel Abstraction',
  3: 'The Process & Programming Interface',
  4: 'Concurrency',
  5: 'Synchronization',
  6: 'Scheduling',
  7: 'Address Translation',
  8: 'Virtual Memory',
};

/* จำนวนข้อต่อบท รวมกันได้ 110 */
const QUOTA = { 1: 10, 2: 16, 3: 14, 4: 14, 5: 13, 6: 15, 7: 15, 8: 13 };

/* ---------- ตัวสุ่มแบบมี seed (mulberry32) ---------- */
function makeRng(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const shuffle = (r, arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

/* ============================================================
   ตัวสร้างคำถามจากคลังนิยาม
   ============================================================ */
function conceptQuestion(con, r) {
  const sameCh = CONCEPTS.filter(x => x.c === con.c && x.id !== con.id);
  const others = CONCEPTS.filter(x => x.c !== con.c);
  let foils = shuffle(r, sameCh).slice(0, 3);
  if (foils.length < 3) foils = foils.concat(shuffle(r, others).slice(0, 3 - foils.length));

  const dir = r() < 0.5 ? 'term2def' : 'def2term';
  let q, correct, opts;

  if (dir === 'term2def') {
    q = `ข้อใดคือความหมายของ <b>${con.t}</b>`;
    correct = con.d;
    opts = shuffle(r, [con.d, ...foils.map(f => f.d)]);
  } else {
    q = `ข้อความต่อไปนี้ตรงกับคำศัพท์ใดมากที่สุด\n\n<i>"${con.d}"</i>`;
    correct = con.t;
    opts = shuffle(r, [con.t, ...foils.map(f => f.t)]);
  }

  const e = `<b>${con.t}</b> — ${con.d}\n\nตัวเลือกอื่นคือ:\n` +
    foils.map(f => `• <b>${f.t}</b> — ${f.d}`).join('\n');

  return { q, ch: opts, a: opts.indexOf(correct), e, c: con.c, topic: CHAPTERS[con.c] };
}

function groupQuestion(g, r, variant) {
  let q, opts, correct;

  if (variant === 'not' && g.foils.length >= 1 && g.members.length >= 3) {
    const mems = shuffle(r, g.members).slice(0, 3);
    correct = pick(r, g.foils);
    opts = shuffle(r, [...mems, correct]);
    q = `ข้อใด<b>ไม่ใช่</b> ${g.title}`;
  } else {
    correct = pick(r, g.members);
    const fo = shuffle(r, g.foils).slice(0, 3);
    opts = shuffle(r, [correct, ...fo]);
    q = `ข้อใดจัดอยู่ใน ${g.title}`;
  }

  const e = `<b>${g.title}</b> ประกอบด้วย:\n` +
    g.members.map(m => `• ${m}`).join('\n') +
    `\n\nส่วนตัวเลือกที่ไม่ได้อยู่ในกลุ่มนี้ เป็นแนวคิดจากหัวข้ออื่นหรือไม่เกี่ยวข้องกับหัวข้อนี้`;

  return { q, ch: opts, a: opts.indexOf(correct), e, c: g.c, topic: CHAPTERS[g.c] };
}

function mcqQuestion(m, r) {
  const correct = m.ch[m.a];
  const opts = shuffle(r, m.ch);
  return { q: m.q, ch: opts, a: opts.indexOf(correct), e: m.e, c: m.c, topic: CHAPTERS[m.c] };
}

function genQuestion(g, r) {
  const out = g.gen(r);
  return { q: out.q, ch: out.ch, a: out.a, e: out.e, c: g.c, topic: CHAPTERS[g.c] };
}

/* ============================================================
   สร้างชุดข้อสอบ
   ============================================================ */
function buildCandidates(ch) {
  const list = [];
  CONCEPTS.filter(c => c.c === ch).forEach(c => list.push({ key: 'C:' + c.id, kind: 'concept', src: c }));
  GROUPS.filter(g => g.c === ch).forEach(g => {
    /* รูปแบบ "ข้อใดไม่ใช่" ต้องใช้สมาชิกถูก 3 ตัว จึงใช้ได้เฉพาะกลุ่มที่มีสมาชิกพอ */
    if (g.members.length >= 3) list.push({ key: 'G:' + g.id + ':not', kind: 'group', src: g, variant: 'not' });
    list.push({ key: 'G:' + g.id + ':is', kind: 'group', src: g, variant: 'is' });
  });
  MCQ.filter(m => m.c === ch).forEach(m => list.push({ key: 'M:' + m.id, kind: 'mcq', src: m }));
  GENERATORS.filter(g => g.c === ch).forEach(g => list.push({ key: 'X:' + g.id, kind: 'gen', src: g }));
  return list;
}

function buildExam(seed, recent) {
  const r = makeRng(seed);
  const used = new Set();
  const out = [];
  /* rank = ออกล่าสุดเมื่อกี่รอบที่แล้ว (เลขน้อย = เพิ่งออก) ส่วนข้อที่ไม่เคยออกเลยได้คะแนนสูงสุด */
  const NEVER = 1e9;
  const rank = new Map();
  (recent || []).forEach((k, i) => { if (!rank.has(k)) rank.set(k, i); });
  const score = k => (rank.has(k) ? rank.get(k) : NEVER);

  for (const chStr of Object.keys(QUOTA)) {
    const ch = Number(chStr);
    const need = QUOTA[ch];
    let cands = shuffle(r, buildCandidates(ch));

    /* เรียงให้ข้อที่ไม่เคยออกมาก่อน ตามด้วยข้อที่ออกนานที่สุดแล้ว
       (sort เสถียร จึงยังคงลำดับสุ่มภายในกลุ่มที่คะแนนเท่ากัน) */
    cands.sort((a, b) => score(b.key) - score(a.key));

    const chosen = [];
    for (const cd of cands) {
      if (chosen.length >= need) break;
      if (used.has(cd.key)) continue;
      used.add(cd.key);
      chosen.push(cd);
    }
    /* ถ้ายังไม่พอ ให้ใช้ตัวสร้างโจทย์ซ้ำได้ เพราะมันสุ่มตัวเลขใหม่ทุกครั้ง */
    const gens = GENERATORS.filter(g => g.c === ch);
    let n = 0;
    while (chosen.length < need) {
      const g = gens.length ? gens[n % gens.length] : pick(r, GENERATORS);
      chosen.push({ key: 'X:' + g.id + ':r' + n, kind: 'gen', src: g });
      n++;
    }

    for (const cd of chosen) {
      let item;
      try {
        if (cd.kind === 'concept') item = conceptQuestion(cd.src, r);
        else if (cd.kind === 'group') item = groupQuestion(cd.src, r, cd.variant);
        else if (cd.kind === 'mcq') item = mcqQuestion(cd.src, r);
        else item = genQuestion(cd.src, r);
      } catch (err) {
        item = conceptQuestion(pick(r, CONCEPTS.filter(c => c.c === ch)), r);
      }
      item.key = cd.key;
      out.push(item);
    }
  }

  const final = shuffle(r, out).slice(0, QUESTIONS_PER_EXAM);
  final.forEach((q, i) => { q.n = i + 1; });
  return final;
}

/* ============================================================
   สถานะและการเก็บข้อมูล
   ============================================================ */
const LS_STATE = 'sos_quiz_state_v1';
const LS_RECENT = 'sos_quiz_recent_v1';
const LS_HISTORY = 'sos_quiz_history_v1';

let state = null;   // {seed, questions, answers, flags, idx, startedAt, elapsed, mode, submitted}
let timerId = null;

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

/* รายการข้อที่เคยออก เรียงจากที่เพิ่งออกล่าสุดไปหาที่ออกนานแล้ว */
function loadRecent() {
  try { const a = JSON.parse(localStorage.getItem(LS_RECENT) || '[]'); return Array.isArray(a) ? a : []; }
  catch { return []; }
}
function saveRecent(keys) {
  const fresh = new Set(keys);
  const merged = [...keys, ...loadRecent().filter(k => !fresh.has(k))];
  try { localStorage.setItem(LS_RECENT, JSON.stringify(merged.slice(0, 500))); } catch {}
}
function saveState() {
  if (!state) return;
  try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch {}
}
function clearState() {
  try { localStorage.removeItem(LS_STATE); } catch {}
}
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]'); }
  catch { return []; }
}
function pushHistory(rec) {
  const h = loadHistory();
  h.unshift(rec);
  try { localStorage.setItem(LS_HISTORY, JSON.stringify(h.slice(0, 20))); } catch {}
}

/* ============================================================
   เริ่มข้อสอบ
   ============================================================ */
function startExam(mode) {
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
  const recent = loadRecent();
  const questions = buildExam(seed, recent);
  saveRecent(questions.map(q => q.key.replace(/:r\d+$/, '')));

  state = {
    seed,
    questions,
    answers: new Array(questions.length).fill(null),
    flags: new Array(questions.length).fill(false),
    idx: 0,
    startedAt: Date.now(),
    elapsed: 0,
    mode,                 // 'exam' = ตรวจตอนท้าย, 'practice' = เฉลยทันที
    submitted: false,
  };
  saveState();
  showQuiz();
  startTimer();
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (!state || state.submitted) return;
    state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    const el = $('#timer');
    if (el) el.textContent = fmtTime(state.elapsed);
  }, 1000);
}
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

const fmtTime = s => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(x).padStart(2, '0');
};

/* ============================================================
   การแสดงผล
   ============================================================ */
function show(screen) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === screen));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ---------- หน้าเริ่มต้น ---------- */
function renderHome() {
  const hist = loadHistory();
  const box = $('#historyBox');
  if (!hist.length) {
    box.innerHTML = '<p class="muted">ยังไม่มีประวัติการทำข้อสอบ</p>';
  } else {
    box.innerHTML = `<table class="hist">
      <thead><tr><th>ครั้งที่</th><th>วันที่</th><th>คะแนน</th><th>ร้อยละ</th><th>เวลาที่ใช้</th></tr></thead>
      <tbody>${hist.map((h, i) => `<tr>
        <td>${hist.length - i}</td>
        <td>${new Date(h.at).toLocaleString('th-TH')}</td>
        <td>${h.score} / ${h.total}</td>
        <td><b class="${h.pct >= 80 ? 'good' : h.pct >= 50 ? 'mid' : 'bad'}">${h.pct}%</b></td>
        <td>${fmtTime(h.time)}</td>
      </tr>`).join('')}</tbody></table>`;
  }

  const resume = localStorage.getItem(LS_STATE);
  const rb = $('#resumeBox');
  if (resume) {
    try {
      const s = JSON.parse(resume);
      if (s && !s.submitted && s.questions && s.questions.length) {
        const done = s.answers.filter(a => a !== null).length;
        rb.style.display = '';
        rb.innerHTML = `<div class="resume-inner">
          <div><b>มีข้อสอบที่ทำค้างไว้</b><br><span class="muted">ตอบไปแล้ว ${done} / ${s.questions.length} ข้อ · ใช้เวลาไป ${fmtTime(s.elapsed || 0)}</span></div>
          <div class="row">
            <button class="btn" id="btnResume">ทำต่อ</button>
            <button class="btn ghost" id="btnDiscard">ทิ้งแล้วเริ่มใหม่</button>
          </div></div>`;
        $('#btnResume').onclick = () => {
          state = s;
          state.startedAt = Date.now() - (state.elapsed || 0) * 1000;
          showQuiz(); startTimer();
        };
        $('#btnDiscard').onclick = () => { clearState(); renderHome(); };
        return;
      }
    } catch {}
  }
  rb.style.display = 'none';
}

/* ---------- หน้าทำข้อสอบ ---------- */
function showQuiz() {
  show('quiz');
  renderPalette();
  renderQuestion();
}

function renderPalette() {
  const p = $('#palette');
  p.innerHTML = state.questions.map((q, i) => {
    const answered = state.answers[i] !== null;
    const cls = ['pbtn'];
    if (i === state.idx) cls.push('cur');
    if (answered) cls.push('done');
    if (state.flags[i]) cls.push('flag');
    return `<button class="${cls.join(' ')}" data-i="${i}" title="ข้อ ${i + 1} · ${q.topic}">${i + 1}</button>`;
  }).join('');
  p.querySelectorAll('.pbtn').forEach(b => {
    b.onclick = () => { state.idx = +b.dataset.i; renderQuestion(); renderPalette(); saveState(); };
  });
  const done = state.answers.filter(a => a !== null).length;
  $('#progressText').textContent = `ตอบแล้ว ${done} / ${state.questions.length} ข้อ`;
  $('#progressFill').style.width = (done / state.questions.length * 100) + '%';
}

function renderQuestion() {
  const i = state.idx;
  const q = state.questions[i];
  const ansIdx = state.answers[i];
  const revealed = state.mode === 'practice' && ansIdx !== null;

  $('#qNum').textContent = `ข้อ ${i + 1} / ${state.questions.length}`;
  $('#qTopic').textContent = `บทที่ ${q.c} · ${q.topic}`;
  $('#qText').innerHTML = q.q;
  $('#btnFlag').classList.toggle('on', state.flags[i]);
  $('#btnFlag').textContent = state.flags[i] ? '★ ทำเครื่องหมายไว้' : '☆ ทำเครื่องหมาย';

  const letters = ['ก', 'ข', 'ค', 'ง'];
  $('#choices').innerHTML = q.ch.map((c, k) => {
    const cls = ['choice'];
    if (ansIdx === k) cls.push('sel');
    if (revealed) {
      if (k === q.a) cls.push('correct');
      else if (k === ansIdx) cls.push('wrong');
    }
    return `<button class="${cls.join(' ')}" data-k="${k}" ${revealed ? 'disabled' : ''}>
      <span class="letter">${letters[k]}</span><span class="ctext">${c}</span></button>`;
  }).join('');

  $('#choices').querySelectorAll('.choice').forEach(b => {
    b.onclick = () => {
      state.answers[i] = +b.dataset.k;
      saveState();
      renderQuestion();
      renderPalette();
    };
  });

  const ex = $('#explain');
  if (revealed) {
    const ok = ansIdx === q.a;
    ex.style.display = '';
    ex.className = 'explain ' + (ok ? 'ok' : 'no');
    ex.innerHTML = `<div class="verdict">${ok ? '✓ ถูกต้อง' : '✗ ไม่ถูกต้อง — คำตอบที่ถูกคือข้อ ' + letters[q.a]}</div>
      <div class="exbody">${q.e}</div>`;
  } else {
    ex.style.display = 'none';
  }

  $('#btnPrev').disabled = i === 0;
  $('#btnNext').disabled = i === state.questions.length - 1;
}

/* ---------- ส่งคำตอบ ---------- */
function submitExam() {
  const unanswered = state.answers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`ยังเหลืออีก ${unanswered} ข้อที่ยังไม่ได้ตอบ\nต้องการส่งคำตอบเลยหรือไม่?`)) return;
  }
  state.submitted = true;
  stopTimer();
  const score = state.questions.reduce((s, q, i) => s + (state.answers[i] === q.a ? 1 : 0), 0);
  const pct = Math.round(score / state.questions.length * 100);
  pushHistory({ at: Date.now(), score, total: state.questions.length, pct, time: state.elapsed });
  clearState();
  renderResult(score, pct);
}

function renderResult(score, pct) {
  show('result');
  $('#scoreBig').textContent = `${score} / ${state.questions.length}`;
  $('#scorePct').textContent = pct + '%';
  $('#scorePct').className = 'pct ' + (pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'bad');
  $('#scoreTime').textContent = 'ใช้เวลา ' + fmtTime(state.elapsed);

  const grade = pct >= 80 ? 'ดีมาก — เข้าใจเนื้อหาแน่น'
    : pct >= 65 ? 'ดี — ยังมีบางหัวข้อที่ควรทบทวน'
    : pct >= 50 ? 'พอใช้ — ควรกลับไปอ่านหัวข้อที่ตอบผิด'
    : 'ควรทบทวนใหม่ทั้งหมด';
  $('#scoreGrade').textContent = grade;

  /* สรุปรายบท */
  const by = {};
  state.questions.forEach((q, i) => {
    by[q.c] = by[q.c] || { ok: 0, total: 0 };
    by[q.c].total++;
    if (state.answers[i] === q.a) by[q.c].ok++;
  });
  $('#byChapter').innerHTML = Object.keys(by).sort((a, b) => a - b).map(c => {
    const d = by[c], p = Math.round(d.ok / d.total * 100);
    return `<div class="chrow">
      <div class="chname">บทที่ ${c} · ${CHAPTERS[c]}</div>
      <div class="chbar"><div class="chfill ${p >= 80 ? 'good' : p >= 50 ? 'mid' : 'bad'}" style="width:${p}%"></div></div>
      <div class="chscore">${d.ok}/${d.total} <span class="muted">(${p}%)</span></div>
    </div>`;
  }).join('');

  renderReview('all');
  $$('.filterbtn').forEach(b => {
    b.onclick = () => {
      $$('.filterbtn').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      renderReview(b.dataset.f);
    };
  });
}

function renderReview(filter) {
  const letters = ['ก', 'ข', 'ค', 'ง'];
  const items = state.questions.map((q, i) => ({ q, i, ans: state.answers[i] }))
    .filter(({ q, ans }) => filter === 'all'
      || (filter === 'wrong' && ans !== null && ans !== q.a)
      || (filter === 'right' && ans === q.a)
      || (filter === 'skip' && ans === null));

  if (!items.length) {
    $('#review').innerHTML = '<p class="muted" style="padding:24px">ไม่มีข้อในหมวดนี้</p>';
    return;
  }

  $('#review').innerHTML = items.map(({ q, i, ans }) => {
    const ok = ans === q.a;
    const status = ans === null ? 'skip' : ok ? 'ok' : 'no';
    const label = ans === null ? 'ไม่ได้ตอบ' : ok ? 'ถูก' : 'ผิด';
    return `<article class="rev ${status}">
      <header><span class="rnum">ข้อ ${i + 1}</span>
        <span class="rtopic">บทที่ ${q.c} · ${q.topic}</span>
        <span class="rstat ${status}">${label}</span></header>
      <div class="rq">${q.q}</div>
      <ol class="ropts">${q.ch.map((c, k) => {
        const cls = [];
        if (k === q.a) cls.push('rc');
        if (k === ans && k !== q.a) cls.push('rw');
        return `<li class="${cls.join(' ')}"><span class="letter">${letters[k]}</span>${c}
          ${k === q.a ? '<span class="tag tc">เฉลย</span>' : ''}
          ${k === ans && k !== q.a ? '<span class="tag tw">คุณตอบ</span>' : ''}</li>`;
      }).join('')}</ol>
      <div class="rex"><b>คำอธิบาย</b>\n${q.e}</div>
    </article>`;
  }).join('');
}

/* ============================================================
   เหตุการณ์
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderHome();

  $('#btnStartExam').onclick = () => startExam('exam');
  $('#btnStartPractice').onclick = () => startExam('practice');

  $('#btnPrev').onclick = () => { if (state.idx > 0) { state.idx--; renderQuestion(); renderPalette(); saveState(); } };
  $('#btnNext').onclick = () => { if (state.idx < state.questions.length - 1) { state.idx++; renderQuestion(); renderPalette(); saveState(); } };
  $('#btnFlag').onclick = () => { state.flags[state.idx] = !state.flags[state.idx]; renderQuestion(); renderPalette(); saveState(); };
  $('#btnSubmit').onclick = submitExam;
  $('#btnQuit').onclick = () => {
    if (confirm('ออกจากข้อสอบชุดนี้?\nความคืบหน้าจะถูกเก็บไว้ให้ทำต่อภายหลัง')) {
      stopTimer(); saveState(); show('home'); renderHome();
    }
  };

  $('#btnAgain').onclick = () => { show('home'); renderHome(); };
  $('#btnAgain2').onclick = () => startExam(state ? state.mode : 'exam');

  $('#btnTheme').onclick = () => {
    const root = document.documentElement;
    const now = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', now);
    try { localStorage.setItem('sos_theme', now); } catch {}
  };
  const savedTheme = (() => { try { return localStorage.getItem('sos_theme'); } catch { return null; } })();
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  /* คีย์ลัด */
  document.addEventListener('keydown', e => {
    if (!state || state.submitted || !$('#quiz').classList.contains('active')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (['1', '2', '3', '4'].includes(e.key)) {
      const k = +e.key - 1;
      if (k < state.questions[state.idx].ch.length) {
        if (state.mode === 'practice' && state.answers[state.idx] !== null) return;
        state.answers[state.idx] = k; saveState(); renderQuestion(); renderPalette();
      }
    } else if (e.key === 'ArrowLeft') { $('#btnPrev').click(); }
    else if (e.key === 'ArrowRight' || e.key === 'Enter') { $('#btnNext').click(); }
    else if (e.key.toLowerCase() === 'f') { $('#btnFlag').click(); }
  });
});
