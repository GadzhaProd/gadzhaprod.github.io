/* ═══════════════════════════════════════════════════════════════════════════
   BUILD RADAR — как я разбираю задачу.
   Выбор типа работы перестраивает конвейер в hero и меняет состав поля частиц.

   Тексты разборов живут в i18n.js (GadzhaI18N.tasks()) — здесь только логика
   и поведение поля частиц, не зависящее от языка.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* поведение поля для каждого типа работы: доли сигналов и скорость потока */
  var FIELD = {
    proto:   { mix: { build: .46, review: .20, ship: .12, probe: .22 }, tempo: 1.25 },
    landing: { mix: { build: .50, review: .26, ship: .16, probe: .08 }, tempo: 1.50 },
    tool:    { mix: { build: .40, review: .22, ship: .14, probe: .24 }, tempo: 0.95 },
    feature: { mix: { build: .38, review: .38, ship: .14, probe: .10 }, tempo: 1.05 },
    auto:    { mix: { build: .42, review: .16, ship: .24, probe: .18 }, tempo: 1.15 },
    adopt:   { mix: { build: .34, review: .24, ship: .18, probe: .24 }, tempo: 0.9 }
  };

  /* состояние поля до любого выбора — см. field.js */
  var FIELD_IDLE = { mix: { build: .55, review: .18, ship: .14, probe: .13 }, tempo: 1 };

  var picks    = Array.prototype.slice.call(document.querySelectorAll('.pick'));
  var body     = document.getElementById('radarBody');
  var empty    = document.getElementById('radarEmpty');
  var state    = document.getElementById('radarState');
  var resetBtn = document.getElementById('radarReset');
  var readout  = document.getElementById('cockpitReadout');
  var ckState  = document.getElementById('cockpitState');
  var stations = Array.prototype.slice.call(document.querySelectorAll('.stn'));

  if (!picks.length || !body || !window.GadzhaI18N) return;

  var i18n = window.GadzhaI18N;

  var out = {
    title:    document.getElementById('radarTitle'),
    product:  document.getElementById('rProduct'),
    quality:  document.getElementById('rQuality'),
    infra:    document.getElementById('rInfra'),
    delivery: document.getElementById('rDelivery'),
    risk:     document.getElementById('rRisk'),
    first:    document.getElementById('rFirst'),
    horizon:  document.getElementById('rHorizon')
  };

  var current = null;

  /* заполняет панель и конвейер данными выбранного типа работы */
  function render(key, animate) {
    var t = i18n.tasks()[key];
    if (!t) return;

    out.title.textContent    = t.title;
    out.product.textContent  = t.product;
    out.quality.textContent  = t.quality;
    out.infra.textContent    = t.infra;
    out.delivery.textContent = t.delivery;
    out.risk.textContent     = t.risk;
    out.first.textContent    = t.first;
    out.horizon.textContent  = t.horizon;

    if (empty) empty.hidden = true;
    body.hidden = false;

    if (animate) {
      body.classList.remove('fade-swap');
      void body.offsetWidth;            /* перезапуск анимации */
      body.classList.add('fade-swap');
    }

    /* без toLowerCase: он ломал аббревиатуры («внедрение ai в процесс») */
    if (state) state.textContent = i18n.t('radar.stateActive') + t.title;
    if (ckState) ckState.textContent = i18n.t('cockpit.active') + t.title;

    /* конвейер в hero перестраивается под выбранный тип работы */
    stations.forEach(function (el, i) {
      var desc = el.querySelector('.stn__desc');
      if (desc && t.stations[i]) desc.textContent = t.stations[i];
      if (animate) {
        el.classList.remove('hot');
        setTimeout(function () { el.classList.add('hot'); }, 90 * i);
      } else {
        el.classList.add('hot');
      }
    });

    if (readout) {
      readout.innerHTML = '';
      var rows = [
        [i18n.t('cockpit.rowRisk'),   t.risk],
        [i18n.t('cockpit.rowOutput'), t.first],
        [i18n.t('cockpit.rowTerm'),   t.term]
      ];
      rows.forEach(function (r, i) {
        var p = document.createElement('p');
        p.className = 'cockpit__line';
        p.style.animationDelay = (animate ? i * 90 + 120 : 0) + 'ms';
        var b = document.createElement('b');
        b.textContent = r[0];
        var s = document.createElement('span');
        s.textContent = r[1];
        p.appendChild(b);
        p.appendChild(s);
        readout.appendChild(p);
      });
    }
  }

  /* возврат к пустому состоянию: без него сравнить два сценария нельзя */
  function clear(focusFirst) {
    if (!current) return;
    current = null;

    picks.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });

    body.hidden = true;
    if (empty) empty.hidden = false;
    if (resetBtn) resetBtn.hidden = true;
    if (state) state.textContent = i18n.t('radar.state');
    if (ckState) ckState.textContent = i18n.t('cockpit.idle');

    /* этапы возвращаются к подписям по умолчанию из словаря */
    stations.forEach(function (el) {
      el.classList.remove('hot');
      var desc = el.querySelector('.stn__desc');
      if (!desc) return;
      var key = desc.getAttribute('data-i18n');
      if (key) desc.textContent = i18n.t(key);
    });

    if (readout) {
      readout.innerHTML = '';
      var p = document.createElement('p');
      p.className = 'mono cockpit__hint';
      /* значение приходит из нашего словаря, внешних данных здесь нет */
      p.innerHTML = i18n.t('cockpit.hint');
      readout.appendChild(p);
    }

    if (window.GadzhaField) {
      window.GadzhaField.setMix(FIELD_IDLE.mix);
      window.GadzhaField.setTempo(FIELD_IDLE.tempo);
    }

    if (focusFirst && picks[0]) picks[0].focus();
  }

  function select(key, focusPanel) {
    if (!i18n.tasks()[key] || key === current) return;
    current = key;

    picks.forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.key === key));
    });

    if (resetBtn) resetBtn.hidden = false;

    render(key, true);

    var f = FIELD[key];
    if (f && window.GadzhaField) {
      window.GadzhaField.setMix(f.mix);
      window.GadzhaField.setTempo(f.tempo);
      window.GadzhaField.burst('build');
    }

    if (focusPanel) {
      var panel = document.getElementById('radarOut');
      if (panel) panel.focus({ preventScroll: true });
    }
  }

  picks.forEach(function (btn, i) {
    btn.addEventListener('click', function () { select(btn.dataset.key, false); });

    /* стрелки переключают вкладки — как ожидается от role="tablist";
       Escape возвращает к пустому состоянию */
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); clear(true); return; }
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = picks[(i + dir + picks.length) % picks.length];
      next.focus();
      select(next.dataset.key, false);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () { clear(true); });
  }

  /* при смене языка перерисовываем уже открытый разбор: иначе движок i18n
     вернёт станциям конвейера значения по умолчанию, а панель останется
     на прежнем языке */
  i18n.onChange(function () {
    if (current) render(current, false);
  });

  window.GadzhaRadar = {
    select: select,
    clear: clear,
    isActive: function () { return !!current; }
  };
})();
