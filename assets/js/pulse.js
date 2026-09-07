/* ═══════════════════════════════════════════════════════════════════════════
   LIVE BUILD PULSE — события публичных репозиториев GitHub, разложенные по
   четырём builder-режимам.

   Почему не общая лента /events: анонимному клиенту она отдаёт практически
   только PushEvent/CreateEvent — событий pull request и issues в ней нет,
   и три режима из четырёх всегда были бы нулевыми. Лента конкретных активных
   репозиториев даёт честное распределение по всем четырём типам.

   Лимит без авторизации — 60 запросов в час на IP, поэтому ответ кэшируется
   на 10 минут. Если API недоступен, включается локальный fallback-сигнал,
   и он подписан как офлайн.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REPOS = ['home-assistant/core', 'microsoft/vscode', 'rust-lang/rust'];
  var CACHE_KEY = 'gadzha.pulse.v3';
  var TTL = 10 * 60 * 1000;

  var MAP = {
    PushEvent: 'build',
    CommitCommentEvent: 'build',

    PullRequestEvent: 'review',
    PullRequestReviewEvent: 'review',
    PullRequestReviewCommentEvent: 'review',

    ReleaseEvent: 'ship',
    CreateEvent: 'ship',
    PublicEvent: 'ship',

    IssuesEvent: 'probe',
    IssueCommentEvent: 'probe'
  };

  var LABEL = {
    build: 'PUSH', review: 'REVIEW', ship: 'SHIP', probe: 'ISSUE', noise: 'MISC'
  };

  var stateEl = document.getElementById('pulseState');
  var barsEl  = document.getElementById('pulseBars');
  var feedEl  = document.getElementById('pulseFeed');
  var countEl = document.getElementById('pulseCount');
  var footEl  = document.getElementById('pulseFoot');
  var sigEl   = document.getElementById('footSig');

  if (!barsEl) return;

  var i18n = window.GadzhaI18N;
  function t(k) { return i18n ? i18n.t('pulse.' + k) : ''; }

  /* последний разобранный ответ — чтобы перерисовать секцию при смене языка,
     не дёргая API повторно */
  var last = null, lastNote = null;

  /* ── кэш ────────────────────────────────────────────────────────────── */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var box = JSON.parse(raw);
      if (!box || !box.t || Date.now() - box.t > TTL) return null;
      return box.d;
    } catch (e) { return null; }
  }

  function writeCache(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: d })); }
    catch (e) { /* приватный режим или переполнение — не критично */ }
  }

  /* ── разбор ─────────────────────────────────────────────────────────── */
  function digest(events) {
    var counts = { build: 0, review: 0, ship: 0, probe: 0, noise: 0 };

    events.sort(function (a, b) {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    var feed = [];
    for (var i = 0; i < events.length; i++) {
      var ev = events[i];
      if (!ev || typeof ev.type !== 'string') continue;
      var kind = MAP[ev.type] || 'noise';
      counts[kind]++;
      if (feed.length < 13 && kind !== 'noise') {
        feed.push({
          kind: kind,
          repo: (ev.repo && typeof ev.repo.name === 'string') ? ev.repo.name : '—',
          at: ev.created_at || null
        });
      }
    }

    /* знаменатель — только классифицированные события: четыре доли дают 100% */
    var classified = counts.build + counts.review + counts.ship + counts.probe;

    return {
      counts: counts,
      classified: classified || 1,
      fetched: events.length,
      feed: feed,
      live: true
    };
  }

  /* ── офлайн-сигнал: правдоподобный, но явно помеченный как локальный ── */
  function fallback() {
    var seed = Math.floor(Date.now() / TTL);
    function rnd(n) { var x = Math.sin(seed * 37 + n * 91) * 10000; return x - Math.floor(x); }
    var build  = 30 + Math.round(rnd(1) * 12);
    var review = 24 + Math.round(rnd(2) * 10);
    var probe  = 20 + Math.round(rnd(3) * 10);
    var ship   = Math.max(4, 100 - build - review - probe);
    return {
      counts: { build: build, review: review, ship: ship, probe: probe, noise: 0 },
      classified: build + review + ship + probe,
      fetched: 0, feed: [], live: false
    };
  }

  /* ── отрисовка ──────────────────────────────────────────────────────── */
  function renderBars(d) {
    var bars = barsEl.querySelectorAll('.pbar');
    for (var i = 0; i < bars.length; i++) {
      var kind = bars[i].getAttribute('data-kind');
      var n = d.counts[kind] || 0;
      var pct = Math.round((n / d.classified) * 100);
      var val = bars[i].querySelector('[data-val]');
      var fill = bars[i].querySelector('[data-fill]');
      if (val) val.textContent = n + ' · ' + pct + '%';
      if (fill) fill.style.width = Math.max(1.5, Math.min(100, pct)) + '%';
    }
  }

  function ago(iso) {
    if (!iso) return '';
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return Math.round(s) + t('agoS');
    if (s < 3600) return Math.round(s / 60) + t('agoM');
    if (s < 86400) return Math.round(s / 3600) + t('agoH');
    return Math.round(s / 86400) + t('agoD');
  }

  function renderFeed(d) {
    if (!feedEl) return;
    feedEl.textContent = '';

    if (!d.feed.length) {
      var li = document.createElement('li');
      li.setAttribute('data-kind', 'noise');
      var b0 = document.createElement('b');
      b0.textContent = 'OFFLINE';
      var s0 = document.createElement('span');
      s0.textContent = t('offlineFeed');
      li.appendChild(b0);
      li.appendChild(s0);
      feedEl.appendChild(li);
      return;
    }

    d.feed.forEach(function (it, i) {
      var li = document.createElement('li');
      li.setAttribute('data-kind', it.kind);
      li.style.animationDelay = (i * 45) + 'ms';

      var b = document.createElement('b');
      b.textContent = LABEL[it.kind];

      /* textContent, а не innerHTML: имена репозиториев — чужие данные */
      var s = document.createElement('span');
      s.textContent = it.repo;

      var t = document.createElement('b');
      t.style.marginLeft = 'auto';
      t.style.color = 'var(--ink-3)';
      t.textContent = ago(it.at);

      li.appendChild(b);
      li.appendChild(s);
      li.appendChild(t);
      feedEl.appendChild(li);
    });
  }

  function render(d, note) {
    last = d; lastNote = note;

    renderBars(d);
    renderFeed(d);

    if (countEl) countEl.textContent = d.live ? (d.classified + ' ' + t('events')) : 'FALLBACK';

    if (stateEl) {
      stateEl.textContent = '';
      var led = document.createElement('i');
      led.className = 'led' + (d.live ? '' : ' led--off');
      led.setAttribute('aria-hidden', 'true');
      var txt = document.createElement('span');
      txt.textContent = d.live ? (note === 'cached' ? t('cached') : t('live')) : t('offline');
      stateEl.appendChild(led);
      stateEl.appendChild(document.createTextNode(' '));
      stateEl.appendChild(txt);
      stateEl.style.color = d.live ? 'var(--c-build)' : 'var(--ink-3)';
    }

    if (sigEl) {
      var top = ['build', 'review', 'ship', 'probe'].reduce(function (a, k) {
        return d.counts[k] > d.counts[a] ? k : a;
      }, 'build');
      sigEl.textContent = 'signal: ' + top + ' · ' + Math.round((d.counts[top] / d.classified) * 100) + '%'
                        + (d.live ? '' : ' (offline)');
    }

    /* поле частиц окрашивается пропорционально живому сигналу,
       но только пока Build Radar не задал собственный режим */
    if (window.GadzhaField && !(window.GadzhaRadar && window.GadzhaRadar.isActive())) {
      var c = d.counts, sum = d.classified;
      window.GadzhaField.setMix({
        build: c.build / sum, review: c.review / sum,
        ship: c.ship / sum, probe: c.probe / sum
      });
    }
  }

  /* ── загрузка ───────────────────────────────────────────────────────── */
  function fetchRepo(repo) {
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);

    return fetch('https://api.github.com/repos/' + repo + '/events?per_page=100', {
      headers: { 'Accept': 'application/vnd.github+json' },
      signal: ctl ? ctl.signal : undefined
    })
      .then(function (r) {
        clearTimeout(timer);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) { return Array.isArray(j) ? j : []; })
      .catch(function () { clearTimeout(timer); return []; });   /* один упавший репозиторий не ломает секцию */
  }

  function load() {
    var cached = readCache();
    if (cached) {
      render(cached, 'cached');
      return;
    }

    Promise.all(REPOS.map(fetchRepo))
      .then(function (lists) {
        var all = [];
        lists.forEach(function (l) { all = all.concat(l); });
        if (!all.length) throw new Error('пустой ответ');

        var d = digest(all);
        if (d.classified < 4) throw new Error('недостаточно событий');

        writeCache(d);
        render(d, 'live');
      })
      .catch(function (err) {
        render(fallback());
        if (footEl) {
          var why = document.createElement('span');
          why.textContent = t('reason') + (err && err.message ? err.message : 'network');
          footEl.appendChild(why);
        }
      });
  }

  /* грузим, когда секция подходит к экрану — не тратим лимит впустую.
     Таймер-страховка: если наблюдатель не сработал (скрытая вкладка,
     нестандартный рендеринг), сигнал всё равно появится. */
  var started = false;
  function loadOnce() {
    if (started) return;
    started = true;
    load();
  }

  /* при смене языка перерисовываем уже полученные данные, не дёргая API */
  if (i18n) {
    i18n.onChange(function () {
      if (last) render(last, lastNote);
    });
  }

  var sec = document.getElementById('pulse');
  if ('IntersectionObserver' in window && sec) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        loadOnce();
      }
    }, { rootMargin: '360px 0px' });
    io.observe(sec);
    setTimeout(function () { io.disconnect(); loadOnce(); }, 9000);
  } else {
    loadOnce();
  }
})();
