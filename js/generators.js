/* ============================================================
   generators.js — ตัวสร้างโจทย์เชิงคำนวณแบบสุ่ม
   ทุกตัวรับ rnd (ฟังก์ชันสุ่ม) และคืน {q, ch:[], a:index, e:''}
   ตัวเลขในโจทย์จะเปลี่ยนทุกครั้งที่สร้างใหม่
   ============================================================ */

/* ---------- helper ---------- */
const G = {
  int: (r, a, b) => a + Math.floor(r() * (b - a + 1)),
  pick: (r, arr) => arr[Math.floor(r() * arr.length)],
  shuffle(r, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  /* สร้างตัวเลือกตัวเลข 4 ตัวที่ไม่ซ้ำกัน โดยมี correct รวมอยู่ด้วย */
  numChoices(r, correct, jitter, fmt) {
    fmt = fmt || (v => String(v));
    const set = new Set([correct]);
    let guard = 0;
    while (set.size < 4 && guard++ < 200) {
      const cand = jitter(r);
      if (cand !== correct && cand >= 0) set.add(cand);
    }
    while (set.size < 4) set.add(correct + set.size * 7 + 1);
    const vals = G.shuffle(r, [...set]);
    return { ch: vals.map(fmt), a: vals.indexOf(correct) };
  },
  /* สร้างตัวเลือกข้อความ 4 ตัว โดย correct เป็นคำตอบถูก */
  textChoices(r, correct, wrongs) {
    const vals = G.shuffle(r, [correct, ...wrongs.slice(0, 3)]);
    return { ch: vals, a: vals.indexOf(correct) };
  },
  hex: v => '0x' + v.toString(16).toUpperCase(),
  /* ตัวเลขทศนิยม 2 ตำแหน่ง ตัดศูนย์ท้าย */
  fx: v => {
    const s = (Math.round(v * 100) / 100).toFixed(2);
    return s.replace(/\.?0+$/, '');
  },
};

/* ---------- การจำลองการแทนที่หน้า ---------- */
function simReplace(policy, refs, frames) {
  const mem = [];       // หน้าที่อยู่ในเฟรม
  const order = [];     // ลำดับสำหรับ FIFO (เข้าก่อนอยู่หน้า)
  const used = new Map(); // หน้า -> เวลาที่ใช้ล่าสุด (LRU)
  let hits = 0, misses = 0;
  const steps = [];

  for (let i = 0; i < refs.length; i++) {
    const p = refs[i];
    if (mem.includes(p)) {
      hits++;
      used.set(p, i);
      steps.push({ i, p, hit: true, evict: null, mem: mem.slice() });
      continue;
    }
    misses++;
    let evict = null;
    if (mem.length >= frames) {
      if (policy === 'FIFO') {
        evict = order.shift();
      } else if (policy === 'LRU') {
        let best = null, bestT = Infinity;
        for (const m of mem) {
          const t = used.has(m) ? used.get(m) : -1;
          if (t < bestT) { bestT = t; best = m; }
        }
        evict = best;
      } else { // MIN / OPT
        let best = null, bestNext = -1;
        for (const m of mem) {
          let next = Infinity;
          for (let j = i + 1; j < refs.length; j++) {
            if (refs[j] === m) { next = j; break; }
          }
          if (next > bestNext) { bestNext = next; best = m; }
        }
        evict = best;
      }
      mem.splice(mem.indexOf(evict), 1);
      const oi = order.indexOf(evict);
      if (oi >= 0) order.splice(oi, 1);
      used.delete(evict);
    }
    mem.push(p);
    order.push(p);
    used.set(p, i);
    steps.push({ i, p, hit: false, evict, mem: mem.slice() });
  }
  return { hits, misses, steps };
}

/* ---------- Max-Min Fairness ---------- */
function maxMin(demands, capacity) {
  const n = demands.length;
  const alloc = new Array(n).fill(0);
  const done = new Array(n).fill(false);
  let remain = capacity, left = n;
  const rounds = [];
  while (left > 0 && remain > 1e-9) {
    const share = remain / left;
    let changed = false;
    rounds.push({ share, remain, left });
    for (let i = 0; i < n; i++) {
      if (!done[i] && demands[i] <= share + 1e-9) {
        alloc[i] = demands[i];
        done[i] = true;
        remain -= demands[i];
        left--;
        changed = true;
      }
    }
    if (!changed) {
      for (let i = 0; i < n; i++) if (!done[i]) { alloc[i] = share; done[i] = true; }
      remain = 0; left = 0;
    }
  }
  return { alloc, rounds };
}

/* ============================================================
   รายการตัวสร้างโจทย์
   ============================================================ */
const GENERATORS = [

  /* ===== บทที่ 2: fork / process ===== */
  {
    id: 'G201', c: 3, gen(r) {
      const n = G.int(r, 2, 5);
      const total = Math.pow(2, n);
      const code = 'int main() {\n' + Array.from({ length: n }, () => '    fork();').join('\n') + '\n    return 0;\n}';
      const { ch, a } = G.numChoices(r, total, rr => G.pick(rr, [n, 2 * n, n + 1, Math.pow(2, n) - 1, Math.pow(2, n) + 1, Math.pow(2, n + 1)]));
      return {
        q: `โปรแกรมต่อไปนี้เรียก fork() ทั้งหมด ${n} ครั้งติดต่อกัน (สมมติว่า fork สำเร็จทุกครั้ง)\n\n<pre>${code}</pre>\n\nเมื่อโปรแกรมทำงานจนจบ จะมีโปรเซสทั้งหมดกี่โปรเซส (รวมโปรเซสต้นฉบับ)`,
        ch, a,
        e: `fork() สร้างสำเนาของโปรเซสปัจจุบัน ดังนั้นทุกครั้งที่เรียก จำนวนโปรเซสจะเพิ่มเป็น 2 เท่า\nเริ่มจาก 1 โปรเซส → หลัง fork ครั้งที่ 1 ได้ 2 → ครั้งที่ 2 ได้ 4 → ...\nเรียก ${n} ครั้ง จึงได้ 2^${n} = ${total} โปรเซส (ถ้าถามเฉพาะโปรเซส "ใหม่" จะเท่ากับ ${total - 1})`
      };
    }
  },

  {
    id: 'G202', c: 3, gen(r) {
      const n = G.int(r, 2, 4);
      const total = Math.pow(2, n) - 1;
      const { ch, a } = G.numChoices(r, total, rr => G.pick(rr, [n, Math.pow(2, n), Math.pow(2, n) + 1, 2 * n, n + 1, Math.pow(2, n - 1)]));
      return {
        q: `หากโปรแกรมหนึ่งเรียก fork() ติดต่อกัน ${n} ครั้ง จะมีโปรเซส "ใหม่" ถูกสร้างขึ้นกี่โปรเซส (ไม่นับโปรเซสต้นฉบับ)`,
        ch, a,
        e: `หลังเรียก fork ${n} ครั้ง จะมีโปรเซสทั้งหมด 2^${n} = ${Math.pow(2, n)} โปรเซส\nในจำนวนนี้มีโปรเซสต้นฉบับ 1 ตัว ดังนั้นโปรเซสใหม่ = 2^${n} − 1 = ${total} โปรเซส`
      };
    }
  },

  /* ===== บทที่ 5: Semaphore ===== */
  {
    id: 'G501', c: 5, gen(r) {
      const init = G.int(r, 1, 4);
      const len = G.int(r, 5, 8);
      const ops = [];
      for (let i = 0; i < len; i++) ops.push(r() < 0.55 ? 'P' : 'V');
      let val = init, waiters = 0;
      for (const o of ops) {
        if (o === 'P') { if (val > 0) val--; else waiters++; }
        else { if (waiters > 0) waiters--; else val++; }
      }
      const { ch, a } = G.numChoices(r, val, rr => G.int(rr, 0, init + len));
      return {
        q: `เซมาฟอร์ตัวหนึ่งถูกกำหนดค่าเริ่มต้นเป็น <b>${init}</b> จากนั้นมีการเรียกการดำเนินการตามลำดับต่อไปนี้ (ทำทีละตัวจนครบ)\n\n<pre>${ops.join(' → ')}</pre>\n\nค่าของเซมาฟอร์หลังจบลำดับนี้เป็นเท่าใด`,
        ch, a,
        e: `เซมาฟอร์มีค่าเป็นจำนวนเต็มไม่ติดลบ\n• P() รออย่าง atomic ให้ค่า > 0 แล้วจึงลดค่าลง — ถ้าค่าเป็น 0 อยู่แล้ว ผู้เรียกจะกลายเป็นผู้รอ (waiter) และค่ายังคงเป็น 0\n• V() เพิ่มค่าอย่าง atomic — แต่ถ้ามีผู้รออยู่ จะปลุกผู้รอแทนการเพิ่มค่า\n\nไล่ตามลำดับ ${ops.join(' ')} จากค่าเริ่มต้น ${init} จะได้ค่าสุดท้าย = <b>${val}</b> และมีผู้รอคงเหลือ ${waiters} ราย`
      };
    }
  },

  /* ===== บทที่ 6: FIFO vs SJF ===== */
  {
    id: 'G601', c: 6, gen(r) {
      const n = G.int(r, 4, 5);
      const long = G.pick(r, [80, 100, 120, 150]);
      const shorts = Array.from({ length: n - 1 }, () => G.pick(r, [10, 20, 30]));
      const lens = [long, ...shorts];
      let t = 0; const fin = lens.map(L => (t += L));
      const avg = fin.reduce((a, b) => a + b, 0) / n;
      const { ch, a } = G.numChoices(r, Math.round(avg * 100) / 100,
        rr => Math.round((avg * G.pick(rr, [0.6, 0.75, 1.2, 1.4, 0.5]) ) * 100) / 100,
        v => G.fx(v));
      return {
        q: `งาน ${n} งานมาถึงพร้อมกันที่เวลา 0 ตามลำดับต่อไปนี้ และตัวจัดตารางเวลาใช้นโยบาย <b>FIFO</b>\n\n<pre>${lens.map((L, i) => `งานที่ ${i + 1}: ใช้เวลา ${L}`).join('\n')}</pre>\n\nเวลาตอบสนองเฉลี่ย (average response time) เท่ากับเท่าใด`,
        ch, a,
        e: `FIFO รันตามลำดับที่มาถึงจนกว่าจะเสร็จ เวลาที่แต่ละงานเสร็จจึงเป็นผลรวมสะสม\n${lens.map((L, i) => `งานที่ ${i + 1} เสร็จที่เวลา ${fin[i]}`).join('\n')}\n\nเฉลี่ย = (${fin.join(' + ')}) / ${n} = ${fin.reduce((a, b) => a + b, 0)} / ${n} = <b>${G.fx(avg)}</b>\n\nสังเกตว่างานยาวมาก่อน ทำให้งานสั้นทุกงานต้องรอ — นี่คือภาระงานที่ FIFO ทำได้แย่เป็นพิเศษ`
      };
    }
  },

  {
    id: 'G602', c: 6, gen(r) {
      const n = G.int(r, 4, 5);
      const long = G.pick(r, [80, 100, 120, 150]);
      const shorts = Array.from({ length: n - 1 }, () => G.pick(r, [10, 20, 30, 40]));
      const lens = [long, ...shorts];
      const sorted = lens.slice().sort((x, y) => x - y);
      let t = 0; const fin = sorted.map(L => (t += L));
      const avg = fin.reduce((a, b) => a + b, 0) / n;
      const { ch, a } = G.numChoices(r, Math.round(avg * 100) / 100,
        rr => Math.round(avg * G.pick(rr, [1.5, 2.2, 0.6, 2.8, 1.2]) * 100) / 100,
        v => G.fx(v));
      return {
        q: `งาน ${n} งานมาถึงพร้อมกันที่เวลา 0 โดยใช้เวลาทำงานดังนี้\n\n<pre>${lens.map((L, i) => `งานที่ ${i + 1}: ใช้เวลา ${L}`).join('\n')}</pre>\n\nหากใช้นโยบาย <b>SJF (Shortest Job First)</b> เวลาตอบสนองเฉลี่ยเท่ากับเท่าใด`,
        ch, a,
        e: `SJF เลือกงานที่มีปริมาณงานคงเหลือน้อยที่สุดก่อนเสมอ จึงเรียงลำดับการรันเป็น ${sorted.join(', ')}\n${sorted.map((L, i) => `งานใช้เวลา ${L} เสร็จที่เวลา ${fin[i]}`).join('\n')}\n\nเฉลี่ย = (${fin.join(' + ')}) / ${n} = ${fin.reduce((a, b) => a + b, 0)} / ${n} = <b>${G.fx(avg)}</b>\n\nSJF ให้ average response time ที่ดีที่สุดเมื่อพิจารณาเฉพาะโปรเซสเซอร์ แต่แย่ที่สุดในแง่ความแปรปรวน (งานยาวต้องรอจนท้ายสุด)`
      };
    }
  },

  {
    id: 'G603', c: 6, gen(r) {
      const n = G.int(r, 4, 6);
      const L = G.pick(r, [4, 5, 6, 8]);
      const q = G.pick(r, [1, 2]);
      const m = L / q;
      if (!Number.isInteger(m)) return GENERATORS[5].gen(r);
      const fifoFin = Array.from({ length: n }, (_, i) => (i + 1) * L);
      const fifoAvg = fifoFin.reduce((a, b) => a + b, 0) / n;
      const rrFin = Array.from({ length: n }, (_, i) => (m - 1) * n * q + (i + 1) * q);
      const rrAvg = rrFin.reduce((a, b) => a + b, 0) / n;
      const { ch, a } = G.numChoices(r, Math.round(rrAvg * 100) / 100,
        rr => Math.round(rrAvg * G.pick(rr, [0.6, 0.8, 1.15, 1.3]) * 100) / 100,
        v => G.fx(v));
      return {
        q: `งาน ${n} งานมาถึงพร้อมกันที่เวลา 0 แต่ละงานใช้เวลา <b>${L}</b> หน่วยเท่ากันทุกงาน ตัวจัดตารางเวลาใช้ <b>Round Robin</b> ด้วย time slice = <b>${q}</b> หน่วย (สมมติว่าการสลับบริบทไม่มีค่าใช้จ่าย)\n\nเวลาตอบสนองเฉลี่ยเท่ากับเท่าใด`,
        ch, a,
        e: `แต่ละงานต้องได้ time slice ทั้งหมด ${m} รอบ (${L} ÷ ${q} = ${m})\nในรอบที่ ${m} (รอบสุดท้าย) งานต่าง ๆ จะทยอยเสร็จเรียงกันไป\nเวลาที่งานที่ i เสร็จ = (${m} − 1) × ${n} × ${q} + i × ${q}\nได้ ${rrFin.join(', ')}\n\nเฉลี่ย = ${rrFin.reduce((a, b) => a + b, 0)} / ${n} = <b>${G.fx(rrAvg)}</b>\n\nเทียบกับ FIFO ซึ่งได้ ${G.fx(fifoAvg)} — เมื่องานมีขนาดเท่ากัน Round Robin จะให้ average response time ที่แย่กว่า เพราะทุกงานไปเสร็จพร้อม ๆ กันตอนท้าย`
      };
    }
  },

  {
    id: 'G604', c: 6, gen(r) {
      const lv = G.int(r, 1, 4);
      const base = G.pick(r, [10, 15, 20]);
      const slice = base * Math.pow(2, lv - 1);
      const { ch, a } = G.numChoices(r, slice, rr => base * Math.pow(2, G.int(rr, 0, 4)));
      return {
        q: `ระบบใช้ <b>Multi-level Feedback Queue (MFQ)</b> โดยคิวลำดับความสำคัญที่ 1 มี time slice = <b>${base} ms</b> และ time slice จะเพิ่มเป็นสองเท่าในทุก ๆ ระดับที่ลดต่ำลง\n\nงานหนึ่งใช้ time slice จนหมดไปแล้ว ${lv - 1} ครั้ง ขณะนี้มันอยู่ในคิวระดับที่ ${lv} ซึ่งมี time slice เท่าใด`,
        ch, a,
        e: `ใน MFQ งานเริ่มต้นที่คิวลำดับความสำคัญสูงสุด (ระดับ 1) และตกลงหนึ่งระดับทุกครั้งที่ใช้ time slice จนหมด\nคิวลำดับความสำคัญสูงมี time slice สั้น ส่วนคิวลำดับความสำคัญต่ำมี time slice ยาว\n\nระดับ 1 = ${base} ms → ระดับ 2 = ${base * 2} ms → ระดับ 3 = ${base * 4} ms → ระดับ 4 = ${base * 8} ms\nดังนั้นระดับที่ ${lv} มี time slice = ${base} × 2^${lv - 1} = <b>${slice} ms</b>`
      };
    }
  },

  {
    id: 'G605', c: 6, gen(r) {
      const cap = G.pick(r, [100, 120, 150, 200]);
      const n = 4;
      const eq = cap / n;
      const small1 = Math.round(eq * G.pick(r, [0.2, 0.3, 0.4]));
      const small2 = Math.round(eq * G.pick(r, [0.5, 0.6]));
      const demands = [small1, small2, cap, cap];
      const { alloc } = maxMin(demands, cap);
      const target = alloc[2];
      const { ch, a } = G.numChoices(r, Math.round(target * 100) / 100,
        rr => Math.round(G.pick(rr, [eq, cap / 2, cap / 3, target * 1.25, target * 0.8]) * 100) / 100,
        v => G.fx(v));
      return {
        q: `ระบบมีซีพียูให้จัดสรรทั้งหมด <b>${cap}</b> หน่วย และมีงาน 4 งานที่มีความต้องการดังนี้\n\n<pre>งาน A ต้องการ ${small1}\nงาน B ต้องการ ${small2}\nงาน C ต้องการ ${cap} (ใช้ได้ไม่จำกัด)\nงาน D ต้องการ ${cap} (ใช้ได้ไม่จำกัด)</pre>\n\nตามหลัก <b>Max-Min Fairness</b> งาน C จะได้รับการจัดสรรเท่าใด`,
        ch, a,
        e: `Max-Min Fairness: ทำให้การจัดสรรที่น้อยที่สุดมีค่ามากที่สุด\n\nรอบที่ 1 — ส่วนแบ่งเท่า ๆ กัน = ${cap} ÷ 4 = ${G.fx(eq)}\nงาน A ต้องการ ${small1} ซึ่งน้อยกว่า ${G.fx(eq)} จึงได้ ${small1} ตามต้องการ\nงาน B ต้องการ ${small2} ซึ่งน้อยกว่า ${G.fx(eq)} จึงได้ ${small2} ตามต้องการ\n\nรอบที่ 2 — เหลือ ${cap} − ${small1} − ${small2} = ${cap - small1 - small2} แบ่งให้งาน C และ D ที่ยังต้องการมากกว่าส่วนแบ่ง\nแบ่งเท่ากัน = ${cap - small1 - small2} ÷ 2 = <b>${G.fx(target)}</b>\n\nหลักการคือ ถ้างานใดต้องการน้อยกว่าส่วนแบ่งเท่า ๆ กัน ให้จัดงานที่เล็กที่สุดก่อน แล้วแบ่งเวลาที่เหลือด้วยวิธีเดียวกันซ้ำ`
      };
    }
  },

  {
    id: 'G606', c: 6, gen(r) {
      const n = 4;
      const long = G.pick(r, [90, 100, 120]);
      const shorts = Array.from({ length: n - 1 }, () => G.pick(r, [10, 20, 30]));
      const lens = [long, ...shorts];
      let t = 0; const fifo = lens.map(L => (t += L));
      const fifoAvg = fifo.reduce((a, b) => a + b, 0) / n;
      const sorted = lens.slice().sort((x, y) => x - y);
      t = 0; const sjf = sorted.map(L => (t += L));
      const sjfAvg = sjf.reduce((a, b) => a + b, 0) / n;
      const diff = Math.round((fifoAvg - sjfAvg) * 100) / 100;
      const { ch, a } = G.numChoices(r, diff,
        rr => Math.round(diff * G.pick(rr, [0.5, 1.5, 2, 0.25]) * 100) / 100,
        v => G.fx(v));
      return {
        q: `งาน 4 งานมาถึงพร้อมกันที่เวลา 0 ใช้เวลาทำงาน ${lens.join(', ')} ตามลำดับ\n\nเวลาตอบสนองเฉลี่ยของ <b>FIFO</b> มากกว่าของ <b>SJF</b> อยู่เท่าใด`,
        ch, a,
        e: `FIFO (ตามลำดับที่มา ${lens.join(', ')}): เสร็จที่ ${fifo.join(', ')} → เฉลี่ย ${G.fx(fifoAvg)}\nSJF (เรียงจากสั้นไปยาว ${sorted.join(', ')}): เสร็จที่ ${sjf.join(', ')} → เฉลี่ย ${G.fx(sjfAvg)}\n\nผลต่าง = ${G.fx(fifoAvg)} − ${G.fx(sjfAvg)} = <b>${G.fx(diff)}</b>\n\nยิ่งงานมีขนาดแตกต่างกันมากและงานยาวมาถึงก่อน FIFO ก็ยิ่งแย่กว่า SJF มากขึ้น`
      };
    }
  },

  /* ===== บทที่ 7: Segmentation ===== */
  {
    id: 'G701', c: 7, gen(r) {
      const names = ['code', 'data', 'heap', 'stack'];
      const starts = [0x4000, 0x0000, 0x3000, 0x2000];
      const lens = [0x700, 0x500, 0x400, 0x1000];
      const seg = G.int(r, 0, 3);
      const off = G.int(r, 0x20, (lens[seg] - 0x20)) & ~0x3;
      const va = (seg << 12) | off;
      const pa = starts[seg] + off;
      const { ch, a } = G.numChoices(r, pa,
        rr => G.pick(rr, [va, off, starts[seg], starts[G.int(rr, 0, 3)] + off, pa + 0x1000, (seg << 12) + starts[seg]]),
        G.hex);
      return {
        q: `ระบบใช้ <b>Segmentation</b> โดยที่อยู่เสมือนมี 14 บิต แบ่งเป็น <b>หมายเลข segment 2 บิตบน</b> และ <b>offset 12 บิตล่าง</b> ตารางของ segment เป็นดังนี้\n\n<pre>segment            start     length\n0 (code)           0x4000    0x700\n1 (data)           0x0000    0x500\n2 (heap)           0x3000    0x400\n3 (stack)          0x2000    0x1000</pre>\n\nที่อยู่เสมือน <b>${G.hex(va)}</b> จะถูกแปลเป็นที่อยู่จริงใด`,
        ch, a,
        e: `แยกที่อยู่เสมือน ${G.hex(va)} ออกเป็นสองส่วน\n• หมายเลข segment = 2 บิตบน = ${seg} (${names[seg]})\n• offset = 12 บิตล่าง = ${G.hex(off)}\n\nตรวจขอบเขตก่อน: offset ${G.hex(off)} &lt; length ${G.hex(lens[seg])} จึงไม่เกินขอบเขต ไม่เกิด exception\n\nที่อยู่จริง = start + offset = ${G.hex(starts[seg])} + ${G.hex(off)} = <b>${G.hex(pa)}</b>`
      };
    }
  },

  {
    id: 'G702', c: 7, gen(r) {
      const names = ['code', 'data', 'heap', 'stack'];
      const lens = [0x700, 0x500, 0x400, 0x1000];
      const seg = G.pick(r, [0, 1, 2]);
      const off = lens[seg] + G.int(r, 0x10, 0x300);
      const va = (seg << 12) | off;
      const { ch, a } = G.textChoices(r,
        `เกิด exception เพราะ offset เกินค่า bound ของ segment`,
        [`แปลเป็นที่อยู่จริงได้ตามปกติ โดยไม่มีข้อผิดพลาด`,
         `ระบบจะขยาย segment ให้ใหญ่ขึ้นโดยอัตโนมัติ`,
         `ระบบจะวนกลับไปใช้ offset 0 ของ segment เดิม`]);
      return {
        q: `ระบบใช้ <b>Segmentation</b> ที่อยู่เสมือน 14 บิต แบ่งเป็นหมายเลข segment 2 บิตบน และ offset 12 บิตล่าง โดยมีตารางดังนี้\n\n<pre>segment            start     length\n0 (code)           0x4000    0x700\n1 (data)           0x0000    0x500\n2 (heap)           0x3000    0x400\n3 (stack)          0x2000    0x1000</pre>\n\nเมื่อโปรเซสอ้างถึงที่อยู่เสมือน <b>${G.hex(va)}</b> จะเกิดอะไรขึ้น`,
        ch, a,
        e: `แยก ${G.hex(va)} ได้ segment = ${seg} (${names[seg]}) และ offset = ${G.hex(off)}\n\nsegment ${seg} มี length (bound) = ${G.hex(lens[seg])} แต่ offset ที่อ้างถึงคือ ${G.hex(off)} ซึ่ง <b>มากกว่าหรือเท่ากับ bound</b>\n\nในการแปลที่อยู่แบบ segmentation ฮาร์ดแวร์จะเปรียบเทียบ offset กับ bound เสมอ ถ้าเกินก็จะ <b>Raise Exception</b> เพื่อป้องกันไม่ให้โปรเซสเข้าถึงหน่วยความจำนอกขอบเขตของตัวเอง นี่คือกลไก memory protection ที่ได้จากการแปลที่อยู่`
      };
    }
  },

  /* ===== บทที่ 7: Paging ===== */
  {
    id: 'G703', c: 7, gen(r) {
      const k = G.pick(r, [10, 11, 12]);   // page size = 2^k
      const size = Math.pow(2, k);
      const vpn = G.int(r, 2, 9);
      const off = G.int(r, 1, size - 1);
      const va = vpn * size + off;
      const { ch, a } = G.numChoices(r, vpn, rr => G.int(rr, 0, 20));
      return {
        q: `ระบบใช้ <b>Paging</b> โดยหน้ามีขนาด <b>${size} ไบต์</b> (2^${k})\n\nที่อยู่เสมือน <b>${va}</b> อยู่ในหน้าเสมือน (virtual page number) หมายเลขใด`,
        ch, a,
        e: `หน้าขนาด ${size} ไบต์ = 2^${k} จึงใช้ <b>${k} บิตล่าง</b> เป็น offset และบิตที่เหลือด้านบนเป็นหมายเลขหน้า\n\nหมายเลขหน้า = ⌊ที่อยู่ ÷ ขนาดหน้า⌋ = ⌊${va} ÷ ${size}⌋ = <b>${vpn}</b>\noffset = ${va} mod ${size} = ${off}\n\nตรวจทาน: ${vpn} × ${size} + ${off} = ${va} ✓`
      };
    }
  },

  {
    id: 'G704', c: 7, gen(r) {
      const k = G.pick(r, [10, 11, 12]);
      const size = Math.pow(2, k);
      const vpn = G.int(r, 0, 5);
      const frames = [];
      for (let i = 0; i <= 5; i++) frames.push(G.int(r, 1, 15));
      const off = G.int(r, 1, size - 1);
      const va = vpn * size + off;
      const pa = frames[vpn] * size + off;
      const { ch, a } = G.numChoices(r, pa,
        rr => G.pick(rr, [va, frames[vpn] * size, vpn * size + off, frames[G.int(rr, 0, 5)] * size + off, pa + size]));
      return {
        q: `ระบบใช้ <b>Paging</b> หน้าขนาด <b>${size} ไบต์</b> และตารางหน้าของโปรเซสหนึ่งเป็นดังนี้\n\n<pre>Virtual Page   →   Page Frame\n${frames.map((f, i) => `      ${i}        →       ${f}`).join('\n')}</pre>\n\nที่อยู่เสมือน <b>${va}</b> จะถูกแปลเป็นที่อยู่จริงใด`,
        ch, a,
        e: `ขั้นที่ 1 — แยกที่อยู่เสมือน\nหมายเลขหน้า = ⌊${va} ÷ ${size}⌋ = ${vpn}\noffset = ${va} mod ${size} = ${off}\n\nขั้นที่ 2 — ค้นตารางหน้า\nหน้าเสมือน ${vpn} แมปไปยัง frame หมายเลข ${frames[vpn]}\n\nขั้นที่ 3 — ประกอบที่อยู่จริง\nที่อยู่จริง = frame × ขนาดหน้า + offset = ${frames[vpn]} × ${size} + ${off} = <b>${pa}</b>\n\nสังเกตว่า <b>offset ไม่เคยถูกแปล</b> มันถูกส่งผ่านไปตรง ๆ มีเพียงหมายเลขหน้าเท่านั้นที่ถูกแทนที่ด้วยหมายเลข frame`
      };
    }
  },

  {
    id: 'G705', c: 7, gen(r) {
      const bits = G.pick(r, [32, 24, 20, 16]);
      const k = G.pick(r, [10, 11, 12, 13]);
      const entries = Math.pow(2, bits - k);
      const size = Math.pow(2, k);
      const fmt = v => v >= 1048576 ? (v / 1048576) + 'M entries'
                    : v >= 1024 ? (v / 1024) + 'K entries' : v + ' entries';
      const { ch, a } = G.numChoices(r, entries,
        rr => Math.pow(2, G.int(rr, bits - k - 3, bits - k + 3)), fmt);
      return {
        q: `ระบบมีที่อยู่เสมือนขนาด <b>${bits} บิต</b> และใช้หน้าขนาด <b>${size >= 1024 ? (size / 1024) + ' KB' : size + ' ไบต์'}</b> (2^${k})\n\nตารางหน้าแบบชั้นเดียว (single-level page table) ของหนึ่งโปรเซสจะต้องมีกี่รายการ (entries)`,
        ch, a,
        e: `ที่อยู่เสมือน ${bits} บิต ถูกแบ่งเป็น\n• offset = ${k} บิตล่าง (เพราะหน้ามีขนาด 2^${k})\n• หมายเลขหน้า = ${bits} − ${k} = ${bits - k} บิตบน\n\nจำนวนรายการในตารางหน้า = จำนวนหน้าเสมือนทั้งหมด = 2^${bits - k} = <b>${fmt(entries)}</b>\n\nนี่คือเหตุผลที่สไลด์ชี้ว่าระบบ 32 บิตกับหน้า 4KB ต้องการตารางถึงราว 500K entries ต่อโปรเซส จึงต้องใช้ <b>Multi-level Translation</b> ที่จัดสรรเฉพาะรายการที่ใช้งานจริง`
      };
    }
  },

  {
    id: 'G706', c: 7, gen(r) {
      const tlb = G.pick(r, [1, 2]);
      const pt = G.pick(r, [50, 80, 100, 120]);
      const missPct = G.pick(r, [2, 5, 10, 20]);
      const cost = tlb + (missPct / 100) * pt;
      const { ch, a } = G.numChoices(r, Math.round(cost * 100) / 100,
        rr => Math.round(G.pick(rr, [tlb + pt, pt * missPct / 100, tlb * pt, tlb + pt * missPct]) * 100) / 100,
        v => G.fx(v) + ' ns');
      return {
        q: `ระบบหนึ่งมีค่าใช้จ่ายในการค้น TLB = <b>${tlb} ns</b> ค่าใช้จ่ายในการไล่ค้นตารางหน้า = <b>${pt} ns</b> และอัตราการเกิด TLB miss = <b>${missPct}%</b>\n\nค่าใช้จ่ายเฉลี่ยในการแปลที่อยู่ (cost of translation) เท่ากับเท่าใด`,
        ch, a,
        e: `สไลด์ให้สูตรไว้ตรง ๆ ว่า\n<b>Cost of translation = Cost of TLB lookup + Prob(TLB miss) × cost of page table lookup</b>\n\nแทนค่า = ${tlb} + (${missPct}/100) × ${pt}\n= ${tlb} + ${G.fx(missPct / 100 * pt)}\n= <b>${G.fx(cost)} ns</b>\n\nสังเกตว่าค่าค้น TLB ต้องจ่ายทุกครั้ง ส่วนค่าไล่ตารางหน้าจ่ายเฉพาะเมื่อ miss จึงคูณด้วยความน่าจะเป็น`
      };
    }
  },

  {
    id: 'G707', c: 7, gen(r) {
      const i1 = G.pick(r, [8, 9, 10]);
      const i2 = G.pick(r, [8, 9, 10]);
      const k = G.pick(r, [10, 12]);
      const total = G.pick(r, [32, 36, 40]);
      const i3 = total - i1 - i2 - k;
      if (i3 < 2) return GENERATORS[14].gen(r);
      const { ch, a } = G.numChoices(r, i3, rr => G.int(rr, 2, 16));
      return {
        q: `ระบบใช้ <b>Multi-level Paging 3 ระดับ</b> โดยที่อยู่เสมือนมีขนาด <b>${total} บิต</b> ถูกแบ่งเป็น Index 1, Index 2, Index 3 และ Offset\n\nถ้า Index 1 ใช้ ${i1} บิต, Index 2 ใช้ ${i2} บิต และหน้ามีขนาด 2^${k} ไบต์ แล้ว Index 3 ใช้กี่บิต`,
        ch, a,
        e: `ใน Multi-level Paging ที่อยู่เสมือนถูกแบ่งเป็น Index 1 | Index 2 | Index 3 | Offset ซึ่งรวมกันต้องเท่ากับความกว้างของที่อยู่เสมือนพอดี\n\nOffset ถูกกำหนดโดยขนาดหน้า: หน้าขนาด 2^${k} ไบต์ → offset = ${k} บิต\n\nIndex 3 = ${total} − ${i1} − ${i2} − ${k} = <b>${i3} บิต</b>\n\nแต่ละ Index ใช้เป็นดัชนีเข้าตารางหนึ่งระดับ ข้อดีคือจัดสรรและเติมเฉพาะรายการที่ใช้งานจริง แต่ต้องแลกกับการค้นหาสองครั้งขึ้นไปต่อการอ้างหน่วยความจำ`
      };
    }
  },

  /* ===== บทที่ 8: การแทนที่หน้า ===== */
  {
    id: 'G801', c: 8, gen(r) {
      const frames = G.int(r, 3, 4);
      const pool = ['A', 'B', 'C', 'D', 'E'].slice(0, G.int(r, 4, 5));
      const refs = Array.from({ length: G.int(r, 11, 13) }, () => G.pick(r, pool));
      const res = simReplace('FIFO', refs, frames);
      const { ch, a } = G.numChoices(r, res.misses, rr => G.int(rr, 2, refs.length));
      return {
        q: `ระบบมีเฟรมว่าง <b>${frames} เฟรม</b> (ตอนเริ่มต้นว่างทั้งหมด) และมีลำดับการอ้างถึงหน้าดังนี้\n\n<pre>${refs.join('  ')}</pre>\n\nหากใช้นโยบายแทนที่แบบ <b>FIFO</b> จะเกิด cache miss (page fault) ทั้งหมดกี่ครั้ง`,
        ch, a,
        e: `FIFO แทนที่รายการที่อยู่ในแคชมานานที่สุด (เข้าก่อนออกก่อน)\n\n${res.steps.map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict} ออก)` : ''}   เฟรม: [${s.mem.join(' ')}]`).join('\n')}\n\nรวม MISS = <b>${res.misses}</b> ครั้ง และ HIT = ${res.hits} ครั้ง\n\nหมายเหตุ: ${frames} ครั้งแรกที่เป็น miss คือ compulsory miss ซึ่งเลี่ยงไม่ได้เพราะแคชเริ่มต้นว่าง`
      };
    }
  },

  {
    id: 'G802', c: 8, gen(r) {
      const frames = G.int(r, 3, 4);
      const pool = ['A', 'B', 'C', 'D', 'E'].slice(0, G.int(r, 4, 5));
      const refs = Array.from({ length: G.int(r, 11, 13) }, () => G.pick(r, pool));
      const res = simReplace('LRU', refs, frames);
      const { ch, a } = G.numChoices(r, res.hits, rr => G.int(rr, 0, refs.length - 2));
      return {
        q: `ระบบมีเฟรมว่าง <b>${frames} เฟรม</b> (ตอนเริ่มต้นว่างทั้งหมด) และมีลำดับการอ้างถึงหน้าดังนี้\n\n<pre>${refs.join('  ')}</pre>\n\nหากใช้นโยบายแทนที่แบบ <b>LRU</b> จะเกิด cache hit ทั้งหมดกี่ครั้ง`,
        ch, a,
        e: `LRU แทนที่รายการที่ไม่ได้ถูกใช้มานานที่สุดในอดีต\n\n${res.steps.map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict} ออก เพราะไม่ได้ใช้มานานสุด)` : ''}   เฟรม: [${s.mem.join(' ')}]`).join('\n')}\n\nรวม HIT = <b>${res.hits}</b> ครั้ง และ MISS = ${res.misses} ครั้ง\n\nLRU เป็น approximation ของ MIN ที่ใช้ได้จริง เพราะมันอาศัยอดีตมาทำนายอนาคต ซึ่งได้ผลดีกับโปรแกรมที่มี temporal locality`
      };
    }
  },

  {
    id: 'G803', c: 8, gen(r) {
      const frames = G.int(r, 3, 4);
      const pool = ['A', 'B', 'C', 'D', 'E'].slice(0, G.int(r, 4, 5));
      const refs = Array.from({ length: G.int(r, 11, 13) }, () => G.pick(r, pool));
      const min = simReplace('MIN', refs, frames);
      const lru = simReplace('LRU', refs, frames);
      const { ch, a } = G.numChoices(r, min.misses, rr => G.pick(rr, [lru.misses, min.misses + 1, min.misses + 2, min.misses - 1, G.int(rr, 3, refs.length)]));
      return {
        q: `ระบบมีเฟรมว่าง <b>${frames} เฟรม</b> (ตอนเริ่มต้นว่างทั้งหมด) และมีลำดับการอ้างถึงหน้าดังนี้\n\n<pre>${refs.join('  ')}</pre>\n\nหากใช้นโยบายแทนที่แบบ <b>MIN (OPT)</b> จะเกิด cache miss อย่างน้อยที่สุดกี่ครั้ง`,
        ch, a,
        e: `MIN แทนที่รายการที่จะไม่ถูกใช้ไปอีกนานที่สุดในอนาคต จึงเป็นนโยบายที่ดีที่สุดเท่าที่เป็นไปได้ (optimal)\n\n${min.steps.map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict} ออก เพราะจะถูกใช้ช้าที่สุด)` : ''}   เฟรม: [${s.mem.join(' ')}]`).join('\n')}\n\nรวม MISS = <b>${min.misses}</b> ครั้ง (เทียบกับ LRU ซึ่งได้ ${lru.misses} ครั้ง)\n\nMIN ใช้จริงไม่ได้เพราะต้องรู้อนาคต แต่ใช้เป็นเกณฑ์วัดว่านโยบายอื่นดีแค่ไหน`
      };
    }
  },

  {
    id: 'G804', c: 8, gen(r) {
      const frames = 3;
      const pool = ['A', 'B', 'C', 'D', 'E'];
      const refs = Array.from({ length: G.int(r, 10, 12) }, () => G.pick(r, pool));
      const policy = G.pick(r, ['FIFO', 'LRU']);
      const res = simReplace(policy, refs, frames);
      const evictSteps = res.steps.filter(s => s.evict);
      if (!evictSteps.length) return GENERATORS[18].gen(r);
      const target = evictSteps[0];
      const { ch, a } = G.textChoices(r, target.evict, pool.filter(p => p !== target.evict));
      const prev = res.steps[target.i - 1];
      return {
        q: `ระบบมีเฟรมว่าง <b>${frames} เฟรม</b> (ตอนเริ่มต้นว่างทั้งหมด) และใช้นโยบายแทนที่แบบ <b>${policy}</b> โดยมีลำดับการอ้างถึงหน้าดังนี้\n\n<pre>${refs.join('  ')}</pre>\n\nหน้าใดเป็นหน้าแรกที่ถูกไล่ออกจากเฟรม`,
        ch, a,
        e: `ไล่ลำดับการอ้างถึงทีละตัว\n\n${res.steps.slice(0, target.i + 1).map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict} ออก)` : ''}   เฟรม: [${s.mem.join(' ')}]`).join('\n')}\n\nการไล่ออกครั้งแรกเกิดที่การอ้างถึงหน้า ${target.p} เมื่อเฟรมเต็มแล้ว โดยก่อนหน้านั้นเฟรมมี [${prev ? prev.mem.join(' ') : ''}]\n\n${policy === 'FIFO'
          ? `นโยบาย FIFO เลือกหน้าที่เข้ามาในเฟรมก่อนใครเพื่อนเป็นตัวถูกไล่ออก จึงได้ <b>${target.evict}</b>`
          : `นโยบาย LRU เลือกหน้าที่ไม่ได้ถูกใช้มานานที่สุดเป็นตัวถูกไล่ออก จึงได้ <b>${target.evict}</b>`}`
      };
    }
  },

  {
    id: 'G805', c: 8, gen(r) {
      const hitCost = G.pick(r, [1, 2, 4]);
      const missCost = G.pick(r, [100, 120, 200]);
      const hitRate = G.pick(r, [80, 90, 95, 75]);
      const eat = (hitRate / 100) * hitCost + (1 - hitRate / 100) * missCost;
      const { ch, a } = G.numChoices(r, Math.round(eat * 100) / 100,
        rr => Math.round(G.pick(rr, [hitCost + missCost, missCost * hitRate / 100, (hitCost + missCost) / 2, eat * 1.5, eat * 0.5]) * 100) / 100,
        v => G.fx(v) + ' ns');
      return {
        q: `แคชตัวหนึ่งมีค่าใช้จ่ายเมื่อ hit = <b>${hitCost} ns</b> และเมื่อ miss ต้องไปอ่านจากชั้นถัดไปด้วยค่าใช้จ่าย <b>${missCost} ns</b> โดยมี hit rate = <b>${hitRate}%</b>\n\nเวลาเข้าถึงเฉลี่ย (effective access time) เท่ากับเท่าใด`,
        ch, a,
        e: `เวลาเข้าถึงเฉลี่ย = (hit rate × ค่าใช้จ่ายเมื่อ hit) + (miss rate × ค่าใช้จ่ายเมื่อ miss)\n\nmiss rate = 100% − ${hitRate}% = ${100 - hitRate}%\n\n= (${hitRate}/100 × ${hitCost}) + (${100 - hitRate}/100 × ${missCost})\n= ${G.fx(hitRate / 100 * hitCost)} + ${G.fx((1 - hitRate / 100) * missCost)}\n= <b>${G.fx(eat)} ns</b>\n\nสังเกตว่าแม้ hit rate จะสูงถึง ${hitRate}% แต่ค่าใช้จ่ายเมื่อ miss ที่สูงมากก็ยังครอบงำเวลาเฉลี่ยอยู่ดี — นี่คือเหตุผลที่การลด miss สำคัญกว่าการลดค่าใช้จ่ายตอน hit`
      };
    }
  },

  {
    id: 'G806', c: 8, gen(r) {
      /* Belady's anomaly: ใช้ลำดับอ้างอิงคลาสสิกจากสไลด์ */
      const refs = ['A', 'B', 'C', 'D', 'A', 'B', 'E', 'A', 'B', 'C', 'D', 'E'];
      const f3 = simReplace('FIFO', refs, 3);
      const f4 = simReplace('FIFO', refs, 4);
      const { ch, a } = G.textChoices(r,
        `${f3.hits} hit เมื่อใช้ 3 เฟรม และ ${f4.hits} hit เมื่อใช้ 4 เฟรม — เพิ่มเฟรมแล้ว hit กลับลดลง`,
        [`${f3.hits} hit เมื่อใช้ 3 เฟรม และ ${f3.hits + 2} hit เมื่อใช้ 4 เฟรม — เพิ่มเฟรมแล้ว hit เพิ่มขึ้น`,
         `${f4.hits} hit เมื่อใช้ 3 เฟรม และ ${f4.hits} hit เมื่อใช้ 4 เฟรม — เพิ่มเฟรมแล้วไม่มีผล`,
         `${f3.hits + 1} hit เมื่อใช้ 3 เฟรม และ ${f3.hits + 3} hit เมื่อใช้ 4 เฟรม — เพิ่มเฟรมแล้ว hit เพิ่มขึ้นมาก`]);
      return {
        q: `พิจารณาลำดับการอ้างถึงหน้าต่อไปนี้ภายใต้นโยบาย <b>FIFO</b>\n\n<pre>${refs.join('  ')}</pre>\n\nผลลัพธ์เมื่อเปรียบเทียบการใช้ 3 เฟรมกับ 4 เฟรมเป็นอย่างไร และปรากฏการณ์นี้เรียกว่าอะไร`,
        ch, a,
        e: `<b>FIFO 3 เฟรม</b>\n${f3.steps.map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict})` : ''}   [${s.mem.join(' ')}]`).join('\n')}\nรวม HIT = ${f3.hits}\n\n<b>FIFO 4 เฟรม</b>\n${f4.steps.map(s => `อ้าง ${s.p} → ${s.hit ? 'HIT ' : 'MISS'}${s.evict ? ` (ไล่ ${s.evict})` : ''}   [${s.mem.join(' ')}]`).join('\n')}\nรวม HIT = ${f4.hits}\n\nการเพิ่มจำนวนเฟรมจาก 3 เป็น 4 กลับทำให้ hit <b>ลดลง</b> จาก ${f3.hits} เหลือ ${f4.hits}\nปรากฏการณ์นี้เรียกว่า <b>Belady’s Anomaly</b> (Cache↑ แต่ Hit↓) ซึ่งเกิดขึ้นได้กับนโยบาย FIFO แต่ไม่เกิดกับ LRU หรือ MIN`
      };
    }
  },

  {
    id: 'G807', c: 8, gen(r) {
      const frames = G.int(r, 3, 4);
      const pool = ['A', 'B', 'C', 'D', 'E'];
      const refs = Array.from({ length: 12 }, () => G.pick(r, pool));
      const fi = simReplace('FIFO', refs, frames);
      const lr = simReplace('LRU', refs, frames);
      const mn = simReplace('MIN', refs, frames);
      const best = Math.min(fi.misses, lr.misses, mn.misses);
      const correct = 'MIN (OPT)';
      const { ch, a } = G.textChoices(r, correct, ['FIFO', 'LRU', 'LFU']);
      return {
        q: `สำหรับลำดับการอ้างถึงหน้าต่อไปนี้บนระบบที่มี <b>${frames} เฟรม</b>\n\n<pre>${refs.join('  ')}</pre>\n\nนโยบายแทนที่ใดที่<b>รับประกันได้เสมอ</b>ว่าจะให้จำนวน cache miss น้อยที่สุดเท่าที่เป็นไปได้`,
        ch, a,
        e: `ผลการจำลองบนลำดับนี้\n• FIFO → MISS ${fi.misses} ครั้ง\n• LRU → MISS ${lr.misses} ครั้ง\n• MIN (OPT) → MISS ${mn.misses} ครั้ง\n\nจำนวน miss ที่น้อยที่สุดคือ ${best} ครั้ง (บนลำดับนี้นโยบายอื่นอาจบังเอิญเท่ากันได้ แต่ไม่รับประกัน)\n\nคำตอบคือ <b>MIN</b> เสมอ ไม่ว่าลำดับการอ้างถึงจะเป็นอย่างไร เพราะ MIN เลือกไล่หน้าที่จะถูกใช้ช้าที่สุดในอนาคตออก ซึ่งพิสูจน์ได้ว่า optimal ด้วยวิธี exchange argument: ถ้าไล่หน้าที่จะถูกใช้เร็วกว่าออก ก็จะทำให้เกิด cache miss เร็วขึ้น\n\nอย่างไรก็ตาม MIN ใช้จริงไม่ได้เพราะต้องรู้อนาคต จึงใช้ LRU เป็นตัวประมาณแทน`
      };
    }
  },

  /* ===== บทที่ 4: เธรด ===== */
  {
    id: 'G401', c: 4, gen(r) {
      const n = G.int(r, 4, 10);
      const { ch, a } = G.numChoices(r, n + 1, rr => G.pick(rr, [n, n - 1, 2 * n, n + 2]));
      return {
        q: `โปรแกรมหนึ่งมีเธรดหลัก (main thread) และเรียก thread_create() ทั้งหมด <b>${n}</b> ครั้งในลูป โดยยังไม่มีเธรดใดจบการทำงาน\n\nณ ขณะนั้นมีเธรดทั้งหมดกี่เธรดในโปรเซสนี้`,
        ch, a,
        e: `thread_create() สร้างเธรดใหม่หนึ่งตัวต่อการเรียกหนึ่งครั้ง (ไม่ใช่การคัดลอกเธรดเหมือน fork ที่คัดลอกทั้งโปรเซส)\n\nเธรดหลัก 1 ตัว + เธรดที่สร้างใหม่ ${n} ตัว = <b>${n + 1}</b> เธรด\n\nเธรดทั้ง ${n + 1} ตัวนี้ใช้ Code, Global Variables และ Heap ร่วมกัน แต่แต่ละตัวมี TCB และสแต็กเป็นของตัวเอง`
      };
    }
  },

  {
    id: 'G402', c: 4, gen(r) {
      const n = G.int(r, 5, 10);
      const k = G.int(r, 2, n - 1);
      const { ch, a } = G.textChoices(r,
        `สูงสุด ${n} เธรด และต่ำสุด 1 เธรด`,
        [`สูงสุด ${k} เธรด และต่ำสุด 1 เธรด`,
         `สูงสุด ${n} เธรด และต่ำสุด ${k} เธรด`,
         `สูงสุดและต่ำสุดเท่ากันคือ ${n} เธรด`]);
      return {
        q: `โปรแกรมคล้าย threadHello สร้างเธรดลูก <b>${n}</b> ตัวด้วยลูป thread_create แล้วจึงวน thread_join ทีละตัว โดยเธรดลูกแต่ละตัวพิมพ์ข้อความแล้วเรียก thread_exit\n\nขณะที่เธรดลูกตัวที่ ${k} กำลังพิมพ์ข้อความ จำนวนเธรดลูกที่ยังทำงานอยู่อาจเป็นเท่าใดได้บ้าง (สูงสุดและต่ำสุด)`,
        ch, a,
        e: `ตารางเวลาของเธรดเป็นแบบ <b>non-deterministic</b> ดังนั้นต้องคิดทั้งสองกรณีสุดขั้ว\n\n<b>กรณีสูงสุด:</b> เธรดหลักสร้างเธรดครบทั้ง ${n} ตัวก่อน โดยยังไม่มีเธรดลูกตัวใดได้รันเลย จากนั้นเธรดลูกจึงเริ่มทำงาน ขณะที่ตัวที่ ${k} พิมพ์ อาจมีเธรดลูกที่ยังไม่จบอยู่ครบทั้ง ${n} ตัว\n\n<b>กรณีต่ำสุด:</b> เธรดลูกแต่ละตัวถูกสร้างแล้วได้รันจนจบทันทีก่อนที่เธรดถัดไปจะถูกสร้าง ดังนั้นขณะที่ตัวที่ ${k} พิมพ์ จะมีเธรดลูกที่ยังทำงานอยู่เพียง 1 ตัวเท่านั้น คือตัวมันเอง\n\nนี่คือเหตุผลที่สไลด์ย้ำว่าโปรแกรมต้องถูกออกแบบให้ทำงานถูกต้องกับ "ทุกตารางเวลาที่เป็นไปได้"`
      };
    }
  },

  /* ===== บทที่ 2: interrupt ===== */
  {
    id: 'G203', c: 2, gen(r) {
      const cases = [
        { ev: 'โปรแกรมผู้ใช้หารจำนวนเต็มด้วยศูนย์', ans: 'Exception', why: 'เกิดจากพฤติกรรมของโปรแกรมที่ไม่คาดคิด จึงเป็น Exception' },
        { ev: 'ตัวจับเวลาของฮาร์ดแวร์ส่งสัญญาณครบรอบ', ans: 'Interrupt', why: 'ถูกกระตุ้นโดยเหตุการณ์ในฮาร์ดแวร์ (timer) จึงเป็น Interrupt' },
        { ev: 'การ์ดเครือข่ายได้รับแพ็กเก็ตเข้ามา', ans: 'Interrupt', why: 'ถูกกระตุ้นโดยอุปกรณ์ I/O จึงเป็น Interrupt' },
        { ev: 'โปรแกรมเรียก read() เพื่ออ่านไฟล์', ans: 'System call', why: 'เป็นคำขอจากโปรแกรมให้เคอร์เนลทำงานแทน จึงเป็น System call' },
        { ev: 'โปรแกรมเรียก fork() เพื่อสร้างโปรเซสใหม่', ans: 'System call', why: 'เป็นคำขอจากโปรแกรมให้เคอร์เนลทำงานแทน จึงเป็น System call' },
        { ev: 'โปรแกรมผู้ใช้พยายามรันคำสั่งที่มีสิทธิ์พิเศษ', ans: 'Exception', why: 'เป็นพฤติกรรมที่ไม่ได้รับอนุญาตหรือมุ่งร้าย จึงเกิด Exception' },
        { ev: 'โปรแกรมอ้างถึงหน้าที่ถูกทำเครื่องหมายว่า invalid ในตารางหน้า', ans: 'Exception', why: 'Page fault เป็น exception ชนิดหนึ่งที่เกิดจากการอ้างถึงที่ไม่ valid' },
        { ev: 'ดิสก์แจ้งว่าการถ่ายโอนข้อมูลแบบ DMA เสร็จสิ้นแล้ว', ans: 'Interrupt', why: 'เป็นสัญญาณจากอุปกรณ์ I/O จึงเป็น Interrupt' },
      ];
      const c = G.pick(r, cases);
      const { ch, a } = G.textChoices(r, c.ans,
        ['Interrupt', 'Exception', 'System call', 'User-level upcall'].filter(x => x !== c.ans));
      return {
        q: `เหตุการณ์ต่อไปนี้ทำให้เกิดการเปลี่ยนจาก user mode ไป kernel mode ด้วยกลไกใด\n\n<b>"${c.ev}"</b>`,
        ch, a,
        e: `การเปลี่ยนจาก user mode ไป kernel mode เกิดได้ 3 ทางเท่านั้น\n• <b>Interrupt</b> — ถูกกระตุ้นโดยเหตุการณ์ในฮาร์ดแวร์ เช่น timer และอุปกรณ์ I/O\n• <b>Exception</b> — ถูกกระตุ้นโดยพฤติกรรมของโปรแกรมที่ไม่คาดคิดหรือมุ่งร้าย\n• <b>System call</b> — คำขอจากโปรแกรมให้เคอร์เนลทำงานบางอย่างแทน\n\nกรณีนี้: ${c.why}\n\n(ส่วน User-level upcall เป็นการเปลี่ยนทิศทางตรงกันข้าม คือจาก kernel ไปแจ้งโปรแกรมผู้ใช้)`
      };
    }
  },

  {
    id: 'G204', c: 2, gen(r) {
      const cases = [
        { ins: 'การบวกเลขจำนวนเต็มสองตัว', ans: 'Non-privileged', why: 'สไลด์ระบุว่าคำสั่งที่ไม่มีสิทธิ์พิเศษได้แก่ + − × ÷ และ if' },
        { ins: 'คำสั่งเงื่อนไข if', ans: 'Non-privileged', why: 'สไลด์ระบุว่าคำสั่งที่ไม่มีสิทธิ์พิเศษได้แก่ + − × ÷ และ if' },
        { ins: 'การเขียนข้อมูลลงดิสก์เซกเตอร์ใดก็ได้โดยตรง', ans: 'Privileged', why: 'เป็นการเข้าถึงฮาร์ดแวร์โดยตรง ทำได้เฉพาะใน kernel mode' },
        { ins: 'คำสั่ง CLI เพื่อปิด interrupt', ans: 'Privileged', why: 'การควบคุมการเปิดปิด interrupt เป็นสิทธิ์ของเคอร์เนลเท่านั้น' },
        { ins: 'คำสั่ง STI เพื่อเปิด interrupt', ans: 'Privileged', why: 'การควบคุมการเปิดปิด interrupt เป็นสิทธิ์ของเคอร์เนลเท่านั้น' },
        { ins: 'การแก้ไขรีจิสเตอร์ที่ชี้ไปยังจุดเริ่มต้นของตารางหน้า', ans: 'Privileged', why: 'ถ้าโปรแกรมผู้ใช้แก้ไขได้ ก็จะทำลายการป้องกันหน่วยความจำทั้งหมด' },
        { ins: 'การคูณเลขทศนิยม', ans: 'Non-privileged', why: 'เป็นการคำนวณทั่วไปที่ไม่แตะฮาร์ดแวร์โดยตรง' },
        { ins: 'การอ่านข้อมูลจากอุปกรณ์ I/O ใดก็ได้โดยตรง', ans: 'Privileged', why: 'สิทธิ์เต็มของฮาร์ดแวร์ในการเข้าถึงอุปกรณ์ I/O เป็นของ kernel mode เท่านั้น' },
      ];
      const c = G.pick(r, cases);
      const correct = c.ans === 'Privileged'
        ? 'เป็นคำสั่งที่มีสิทธิ์พิเศษ (Privileged) ใช้ได้เฉพาะใน kernel mode'
        : 'เป็นคำสั่งที่ไม่มีสิทธิ์พิเศษ (Non-privileged) โปรแกรมผู้ใช้เรียกได้';
      const other = c.ans === 'Privileged'
        ? 'เป็นคำสั่งที่ไม่มีสิทธิ์พิเศษ (Non-privileged) โปรแกรมผู้ใช้เรียกได้'
        : 'เป็นคำสั่งที่มีสิทธิ์พิเศษ (Privileged) ใช้ได้เฉพาะใน kernel mode';
      const { ch, a } = G.textChoices(r, correct,
        [other, 'เป็นคำสั่งที่ใช้ได้เฉพาะตอนระบบกำลังบูตเท่านั้น', 'เป็นคำสั่งที่ต้องเรียกผ่าน DMA เสมอ']);
      return {
        q: `การดำเนินการต่อไปนี้จัดเป็นคำสั่งประเภทใด\n\n<b>"${c.ins}"</b>`,
        ch, a,
        e: `${c.why}\n\nหลักการแบ่ง:\n• <b>Privileged instruction</b> — คำสั่งที่เกี่ยวข้องโดยตรงกับฮาร์ดแวร์ มีให้ใช้เฉพาะเคอร์เนล ไม่มีให้โค้ดของผู้ใช้\n• <b>Non-privileged instruction</b> — คำสั่งทั่วไป เช่น + − × ÷ และ if\n\nถ้าโปรแกรมผู้ใช้พยายามรันคำสั่งที่มีสิทธิ์พิเศษ ฮาร์ดแวร์จะเกิด <b>exception</b> แล้วถ่ายโอนการควบคุมเข้าสู่เคอร์เนลทันที`
      };
    }
  },
];
