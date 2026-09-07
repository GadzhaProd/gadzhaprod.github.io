/* ═══════════════════════════════════════════════════════════════════════════
   SIGNAL FIELD — фоновое поле частиц.
   Это не декорация: состав цветов задаётся живыми данными Live Build Pulse,
   а выбор задачи в Build Radar меняет плотность и скорость потока.

   Публичный API:
     GadzhaField.setMix({build,review,ship,probe})  — доли сигналов, 0..1
     GadzhaField.setTempo(k)                        — множитель скорости
     GadzhaField.burst(kind)                        — всплеск сигнала
   ═══════════════════════════════════════════════════════════════════════════ */
window.GadzhaField = (function () {
  'use strict';

  var cv = document.getElementById('field');
  if (!cv || !cv.getContext) return { setMix: noop, setTempo: noop, burst: noop };
  var ctx = cv.getContext('2d', { alpha: true });
  if (!ctx) return { setMix: noop, setTempo: noop, burst: noop };

  function noop() {}

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var KINDS = ['build', 'review', 'ship', 'probe'];

  var COLORS = readColors();
  var mix = { build: 0.55, review: 0.18, ship: 0.14, probe: 0.13 };
  var tempo = 1;
  var targetTempo = 1;

  var W = 0, H = 0, dpr = 1;
  var parts = [];
  var gates = [];
  var flashes = [];
  var running = false;
  var rafId = 0;
  var lastT = 0;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    var out = {};
    KINDS.forEach(function (k) {
      /* ship = поставка (коралл), probe = поиск проблем (янтарь) —
         те же цвета, что у соответствующих режимов в Builder Stack */
      var name = k === 'build' ? '--c-build'
               : k === 'review' ? '--c-review'
               : k === 'ship' ? '--c-delivery' : '--c-discovery';
      out[k] = toRGB(cs.getPropertyValue(name).trim()) || [120, 200, 160];
    });
    return out;
  }

  function toRGB(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
  }

  function pickKind() {
    var total = 0, i;
    for (i = 0; i < KINDS.length; i++) total += mix[KINDS[i]] || 0;
    if (total <= 0) return 'build';
    var r = Math.random() * total;
    for (i = 0; i < KINDS.length; i++) {
      r -= mix[KINDS[i]] || 0;
      if (r <= 0) return KINDS[i];
    }
    return 'build';
  }

  /* плотность подстраивается под площадь экрана, но с жёстким потолком */
  function targetCount() {
    if (reduce.matches) return 0;
    return Math.max(38, Math.min(150, Math.round((W * H) / 17000)));
  }

  function makePart(seeded) {
    var lane = Math.random();
    return {
      x: seeded ? Math.random() * W : -Math.random() * 120 - 10,
      y: lane * H,
      drift: (Math.random() - 0.5) * 0.16,
      v: 0.22 + Math.random() * 0.85,
      len: 8 + Math.random() * 46,
      r: Math.random() < 0.12 ? 1.7 : 0.9,
      a: 0.14 + Math.random() * 0.4,
      kind: pickKind(),
      gate: -1
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    gates = [0.17, 0.37, 0.57, 0.77, 0.94].map(function (p) { return p * W; });

    var want = targetCount();
    while (parts.length > want) parts.pop();
    while (parts.length < want) parts.push(makePart(true));
  }

  function step(t) {
    rafId = 0;
    if (!running) return;

    var dt = Math.min(t - lastT || 16, 48);
    lastT = t;
    var k = dt / 16.67;

    tempo += (targetTempo - tempo) * 0.04;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    /* створы конвейера — едва заметные вертикали */
    ctx.strokeStyle = 'rgba(233,238,243,.028)';
    ctx.lineWidth = 1;
    for (var g = 0; g < gates.length; g++) {
      ctx.beginPath();
      ctx.moveTo(gates[g], H * 0.06);
      ctx.lineTo(gates[g], H * 0.94);
      ctx.stroke();
    }

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var prevX = p.x;
      p.x += p.v * tempo * k;
      p.y += p.drift * k;

      if (p.y < -20) p.y = H + 20;
      else if (p.y > H + 20) p.y = -20;

      /* пересечение створа — короткая вспышка «узла проверки» */
      for (var gi = 0; gi < gates.length; gi++) {
        if (prevX < gates[gi] && p.x >= gates[gi] && gi > p.gate) {
          p.gate = gi;
          if (flashes.length < 40 && Math.random() < 0.55) {
            flashes.push({ x: gates[gi], y: p.y, life: 1, kind: p.kind });
          }
          break;
        }
      }

      if (p.x - p.len > W) {
        parts[i] = makePart(false);
        continue;
      }

      var c = COLORS[p.kind];
      var tail = Math.max(0, p.x - p.len);
      var grad = ctx.createLinearGradient(tail, p.y, p.x, p.y);
      grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
      grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + p.a.toFixed(3) + ')');

      ctx.strokeStyle = grad;
      ctx.lineWidth = p.r;
      ctx.beginPath();
      ctx.moveTo(tail, p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.r > 1.4) {
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.min(1, p.a * 1.8).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, 6.2832);
        ctx.fill();
      }
    }

    for (var f = flashes.length - 1; f >= 0; f--) {
      var fl = flashes[f];
      fl.life -= 0.045 * k;
      if (fl.life <= 0) { flashes.splice(f, 1); continue; }
      var fc = COLORS[fl.kind];
      ctx.fillStyle = 'rgba(' + fc[0] + ',' + fc[1] + ',' + fc[2] + ',' + (fl.life * 0.5).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(fl.x, fl.y, (1 - fl.life) * 5 + 1, 0, 6.2832);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running || reduce.matches) return;
    running = true;
    lastT = performance.now();
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  /* статичный кадр для reduced-motion: поле есть, движения нет */
  function renderStatic() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 70; i++) {
      var kind = pickKind();
      var c = COLORS[kind];
      var x = Math.random() * W, y = Math.random() * H, len = 10 + Math.random() * 40;
      ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - len, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  var rTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rTimer);
    rTimer = setTimeout(function () {
      resize();
      if (reduce.matches) renderStatic();
    }, 180);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  function onMotionPref() {
    if (reduce.matches) { stop(); resize(); renderStatic(); }
    else { resize(); start(); }
  }
  if (reduce.addEventListener) reduce.addEventListener('change', onMotionPref);

  resize();
  if (reduce.matches) renderStatic(); else start();

  return {
    setMix: function (next) {
      if (!next) return;
      KINDS.forEach(function (k) {
        if (typeof next[k] === 'number' && isFinite(next[k])) mix[k] = Math.max(0, next[k]);
      });
      /* перекрашиваем часть потока, чтобы смена сигнала читалась сразу */
      for (var i = 0; i < parts.length; i += 2) parts[i].kind = pickKind();
      if (reduce.matches) renderStatic();
    },
    setTempo: function (k) {
      targetTempo = Math.max(0.4, Math.min(3, Number(k) || 1));
    },
    burst: function (kind) {
      if (reduce.matches || KINDS.indexOf(kind) < 0) return;
      for (var i = 0; i < 14; i++) {
        var p = makePart(false);
        p.kind = kind;
        p.v = 1.6 + Math.random() * 1.6;
        p.a = 0.35 + Math.random() * 0.35;
        p.y = Math.random() * H;
        parts.push(p);
      }
      /* возвращаем плотность к норме, чтобы всплеск не копился */
      setTimeout(function () {
        var want = targetCount();
        while (parts.length > want) parts.shift();
      }, 4200);
    }
  };
})();
