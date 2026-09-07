/* ═══════════════════════════════════════════════════════════════════════════
   Оркестровка страницы: состояние навигации, появление секций, прицел в hero,
   холостой ход конвейера.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── год в подвале ──────────────────────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ── навигация: фон появляется после скролла ────────────────────────── */
  var nav = document.getElementById('nav');
  if (nav) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('is-stuck', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── появление блоков при прокрутке ─────────────────────────────────── */
  var targets = document.querySelectorAll(
    '.sec__head, .method__lead, .swap, .mode, .intake li, .case, .radar__pick, .radar__out, .pulse, .cta, .pull'
  );

  if (!reduce && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el, i) {
      /* лёгкая лесенка внутри одной группы карточек */
      el.style.transitionDelay = ((i % 4) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* ── прицел, следующий за курсором в hero ───────────────────────────── */
  var hero = document.querySelector('.hero');
  var reticle = document.getElementById('reticle');
  if (hero && reticle && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var rx = 0, ry = 0, pending = false;

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      rx = e.clientX - r.left;
      ry = e.clientY - r.top;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        reticle.style.setProperty('--rx', rx + 'px');
        reticle.style.setProperty('--ry', ry + 'px');
        pending = false;
      });
    }, { passive: true });

    hero.addEventListener('pointerenter', function () { reticle.classList.add('on'); });
    hero.addEventListener('pointerleave', function () { reticle.classList.remove('on'); });
  }

  /* ── холостой ход конвейера: станции подсвечиваются по кругу,
        пока в Build Radar не выбран конкретный тип задачи ─────────────── */
  var stations = Array.prototype.slice.call(document.querySelectorAll('.stn'));
  if (stations.length && !reduce) {
    var idx = 0;
    setInterval(function () {
      if (window.GadzhaRadar && window.GadzhaRadar.isActive()) return;
      if (document.hidden) return;
      stations.forEach(function (s, i) { s.classList.toggle('hot', i === idx); });
      idx = (idx + 1) % stations.length;
    }, 1300);
  }

  /* ── якорные ссылки с учётом фиксированной шапки ────────────────────── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* Здесь жил обработчик наведения на карточки .mode — он подкрашивал поле частиц.
     Блок «Четыре этапа» снят, карточек больше нет, селектор возвращал пусто. */
})();
