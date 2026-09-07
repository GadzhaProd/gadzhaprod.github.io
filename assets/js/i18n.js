/* ═══════════════════════════════════════════════════════════════════════════
   I18N — вся копия сайта в одном месте, разметка одна на оба языка.

   В HTML:
     data-i18n="ключ"        → подставляется как текст
     data-i18n-html="ключ"   → как HTML (только для строк с <br>, <em>, <a>)
     data-i18n-aria="ключ"   → в aria-label

   Значения берутся ТОЛЬКО из этого словаря, поэтому innerHTML здесь безопасен.
   Данные из сети (имена репозиториев в Pulse) вставляются через textContent —
   см. pulse.js.

   Язык определяется в таком порядке: ?lang= в адресе → localStorage →
   язык браузера → английский.

   Публичный API:
     GadzhaI18N.lang            — текущий язык ('ru' | 'en')
     GadzhaI18N.t(key)          — строка по ключу
     GadzhaI18N.tasks()         — разборы Build Radar на текущем языке
     GadzhaI18N.set(lang)       — переключить
     GadzhaI18N.onChange(fn)    — подписка (radar.js и pulse.js перерисовываются)
   ═══════════════════════════════════════════════════════════════════════════ */
window.GadzhaI18N = (function () {
  'use strict';

  var DICT = {

  /* ═══════════════════════════ РУССКИЙ ═══════════════════════════════════ */
  ru: {
    meta: {
      title: 'Gadzha — AI Product Builder: автоматизации, внутренние сервисы и AI-прототипы',
      description: 'Собираю автоматизации, внутренние сервисы и AI-прототипы для небольших компаний и продуктовых команд. Чётко ограниченная первая версия: разбор процесса, рабочий результат и честные ограничения — без ТЗ и без найма в штат.',
      ogTitle: 'Gadzha — AI Product Builder',
      ogDescription: 'Собираю автоматизации, внутренние сервисы и AI-прототипы.',
      ogLocale: 'ru_RU'
    },

    a11y: {
      skip: 'Перейти к содержимому',
      home: 'Gadzha — на главную',
      sections: 'Разделы страницы',
      scroll: 'Пролистать дальше',
      taskType: 'Сценарии работы',
      langGroup: 'Язык страницы'
    },

    nav: {
      intake: 'С чем прийти',
      services: 'Что собираю',
      radar: 'Разбор задачи',
      proof: 'Что собрал',
      status: 'беру задачи',
      cta: 'Описать задачу',
      ctaShort: 'Написать'
    },

    hero: {
      kicker1: 'AI PRODUCT BUILDER',
      ctaNote: 'Для старта годится задача в любом виде — хоть голосовым сообщением.',
      h1: 'Собираю <em>автоматизации, внутренние сервисы и AI-прототипы</em>.',
      lede: 'Для небольших компаний и продуктовых команд. Разбираю процесс, собираю первую рабочую версию и называю её ограничения — без ТЗ и без найма в штат.',
      ctaPrimary: 'Описать процесс или идею',
      ctaGhost: 'Посмотреть сценарии работы',
      metaBuiltLabel: 'собрано',
      metaBuilt: 'веб-интерфейсы · AI-инструменты · торговый индикатор · продуктовые спеки',
      metaFormatLabel: 'формат',
      metaFormat: 'итерациями: у каждой свой срок и объём',
      scrollCue: 'с чем сюда приходят'
    },

    cockpit: {
      title: 'КАК ИДЁТ РАБОТА',
      idle: 'сценарий пока не выбран',
      active: 'сценарий: ',
      hint: 'Выберите сценарий в <a href="#radar">«Разборе»</a>, и этапы перестроятся под него.',
      rowRisk: 'риск',
      rowOutput: 'результат',
      rowTerm: 'срок',
      /* короткие подписи этапов */
      nm: {
        input: 'ЗАДАЧА',
        frame: 'ГРАНИЦЫ',
        build: 'СБОРКА',
        test: 'ПРОВЕРКА',
        ship: 'ЗАПУСК'
      },
      st: {
        input: 'задача как есть',
        frame: 'сценарий и границы',
        build: 'код и интерфейс',
        test: 'слабые места',
        ship: 'рабочая ссылка'
      }
    },

    intake: {
      h2: 'Подключаюсь, когда процесс или идея<br>упёрлись в ручную работу.',
      sub: 'Четыре ситуации, с которых обычно начинается разговор:',
      i1: 'Данные между системами переносим руками и ловим ошибку поздно.',
      i2: 'Нужен небольшой внутренний инструмент, но продукт всегда важнее — руки не доходят.',
      i3: 'Надо понять, даёт ли AI пользу на реальной работе, а не в демо.',
      i4: 'Хотим проверить идею до бюджета и команды.',
      /* bridge больше не в разметке (снят при сокращении текста), ключ сохранён */
      bridge: 'Если хотя бы одна ситуация похожа на вашу, ниже то, что я в таких случаях собираю.'
    },

    services: {
      h2: 'Что могу собрать первым',
      sub: 'Три места, с которых обычно начинается работа. Каждое — ограниченная первая версия, а не бесконечный проект.',
      lblProblem: 'Проблема', lblSolution: 'Решение', lblResult: 'Результат', lblExample: 'Пример',
      bar1: '01 / НАПРАВЛЕНИЕ', bar2: '02 / НАПРАВЛЕНИЕ', bar3: '03 / НАПРАВЛЕНИЕ',
      s1h: 'Автоматизация и интеграции',
      s1p: 'Повторяющиеся действия, ручной перенос данных, потерянные заявки, ноль контроля над сбоем.',
      s1s: 'Соединяю нужные сервисы и собираю сценарий с логом, уведомлением и кнопкой «стоп».',
      s1r: 'Операция повторяется без ручного участия, а сбои — на виду.',
      s2h: 'Внутренний инструмент для одной команды',
      s2p: 'Процесс живёт в таблицах, личных сообщениях и несвязанных сервисах.',
      s2s: 'Небольшой веб-инструмент вокруг одного сценария, проверенный на реальных грязных данных.',
      s2r: 'Одна понятная точка работы, короткая инструкция, назначенный владелец.',
      s3h: 'AI-пилот или продуктовый прототип',
      s3p: 'Есть идея AI-функции, но польза, цена и поведение при плохом ответе — всё под вопросом.',
      s3s: 'Один сценарий на реальном API: границы заданы, проверку делает человек.',
      s3r: 'Кликабельная первая версия и честный список ограничений — этого хватает для решения.',
      /* s1e/s2e/s3e — строка «Пример» больше не в разметке, ключи сохранены */
      s1e: 'Заявка из формы попадает в нужную систему, получает ответственного и сообщает о сбое вместо того, чтобы исчезнуть в таблице.',
      s2e: 'Внутренний интерфейс для обработки обращений, проверки данных или подготовки повторяющегося отчёта.',
      s3e: 'AI-помощник, который готовит черновик по данным команды, но оставляет человеку проверку и понятный путь исправления.',
      note: 'Если для проверки нужен лендинг или веб-страница — она часть той же первой версии.'
    },

    method: {
      h2: 'Как я работаю:<br>сначала работающий кусок.',
      lead: 'Сначала работающий кусок, потом всё остальное. Это самый быстрый способ найти направление и решать по фактам, а не по слайдам.',
      no1: '«Сделаем красиво»',
      yes1: '«Сделаем так, чтобы это можно было показать и проверить»',
      no2: '«Сначала ТЗ на двадцать страниц»',
      yes2: '«Сначала работающий кусок, потом ТЗ, которое опирается на факты»',
      no3: '«Дизайн отдельно, код отдельно, тесты когда-нибудь»',
      yes3: '«Одна голова ведёт задачу от формулировки до деплоя»',
      note: 'Этот метод называют вайбкодингом. Для меня это быстрее исследовать и собирать — не обещание «нагенерировать» продукт. За сценарий, границы, код и результат отвечаю я.'
    },

    /* Блок «Четыре этапа» снят со страницы: его подписи стадий дословно повторялись
       в Радаре, а сам он занимал 2,5 экрана прямо перед ним. На странице от блока
       остался ОДИН ключ — stack.pull, он переехал в конец раздела «Как я работаю».
       Остальные сохранены на случай возврата блока: проект без системы контроля
       версий, поэтому удаление здесь необратимо. */
    stack: {
      h2: 'Беру чётко ограниченную первую версию —<br>от сценария до передачи.',
      sub: 'На старте фиксируем три вещи: что проверяем сейчас, что сознательно не делаем и как поймём, что версия полезна. Дальше идут четыре этапа одной работы, а не четыре отдельных специалиста.',
      bar1: '01 / СЦЕНАРИЙ', bar2: '02 / СБОРКА', bar3: '03 / ПРОВЕРКА', bar4: '04 / ПЕРЕДАЧА',
      productH: 'Сценарий и границы',
      productP: 'Разбираем, кто этим пользуется, что происходит сейчас и что должно измениться. Сразу фиксируем, что в первую версию не входит.',
      productL1: 'один сценарий вместо списка «хотелок»',
      productL2: 'что проверяем сейчас, а что откладываем осознанно',
      productL3: 'критерий, по которому поймём, что версия полезна',
      qualityH: 'Рабочая версия',
      qualityP: 'Собираю минимальный объём, который уже что-то доказывает: интерфейс, код, интеграции — ровно столько, сколько нужно сценарию.',
      qualityL1: 'стек по размеру задачи, а не по моде',
      qualityL2: 'доступы, ключи, лимиты и цена запроса',
      qualityL3: 'то, что открывается по ссылке и работает',
      infraH: 'Проверка на реальных данных',
      infraP: 'Прогоняю на ваших данных, включая неудобные. Ищу, где ломается логика и что происходит, когда всё идёт не так.',
      infraL1: 'крайние случаи и пустые состояния',
      infraL2: 'поведение при сбое и повторном запуске',
      infraL3: 'честный список ограничений вместо обещаний',
      deliveryH: 'Передача и следующий шаг',
      deliveryP: 'Отдаю ссылку, короткую инструкцию и назначенного владельца, с понятным способом остановить, если что-то пойдёт не так.',
      deliveryL1: 'инструкция и владелец, а не «вот вам архив»',
      deliveryL2: 'лог выполнения и уведомление о сбое',
      deliveryL3: 'понятный следующий шаг после итерации',
      pull: 'Чтобы начать, не нужно ни заводить человека в штат, ни собирать четверых исполнителей. Работа не теряется на стыках, потому что стыков нет.'
    },

    radar: {
      h2: 'Выберите сценарий — покажу, с чего начнём<br>и какой риск проверю первым.',
      /* sub убран из разметки: почти дублировал h2. Ключ сохранён. */
      sub: 'У разных задач разный первый результат и разный первый риск.',
      bar: 'РАЗБОР ЗАДАЧИ',
      state: 'сценарий не выбран',
      stateActive: 'сценарий: ',
      reset: 'Сбросить',
      resetAria: 'Сбросить разбор',
      /* те же четыре стадии, что и в блоке [ 03 ] */
      mode1: 'СЦЕНАРИЙ', mode2: 'СБОРКА', mode3: 'ПРОВЕРКА', mode4: 'ПЕРЕДАЧА',
      empty: 'Шесть сценариев — шесть способов сборки.<br>Выберите близкий: объём, риск и срок первой версии.',
      tagRisk: 'РИСК, КОТОРЫЙ ПРОВЕРЯЮ ПЕРВЫМ',
      tagFirst: 'ПЕРВЫЙ РЕЗУЛЬТАТ',
      pull: 'Каждый разбор заканчивается конкретным первым результатом, не макетом и не презентацией.',
      horizonNote: 'Ориентир уточняется после короткого разбора: зависит от доступов, данных и объёма первой версии.',
      btnProto: 'AI-прототип',
      scenarioCta: 'Обсудить этот сценарий',
      btnLanding: 'Лендинг',
      btnTool: 'Внутренний инструмент',
      btnFeature: 'Фича',
      btnAuto: 'Автоматизация',
      btnAdopt: 'Внедрение AI'
    },

    proof: {
      h2: 'Что я собрал',
      sub: 'Собственные проекты, без выдуманных клиентских результатов. Для каждого: задача, что собрано, что изменилось.',
      lblCame: 'Задача',
      lblBuilt: 'Что собрано',
      lblInside: 'Внутри',
      lblOutcome: 'Итог',
      c1outcome: 'работающая страница вместо портфолио: её можно открыть, а не пересказать.',
      c2outcome: 'проверяемый расчёт и бэктест, которым гипотезу можно опровергнуть, а не подогнать.',
      c3outcome: 'спецификация, по которой можно строить, и явный список того, чего строить нельзя. Если проект делать не нужно — я скажу это до счёта.',
      c1bar: 'СОБСТВЕННЫЙ ПРОЕКТ · ЭТОТ САЙТ',
      c1state: 'открыт прямо сейчас',
      c1came: 'персональный сайт, который не выглядит как шаблон и доказывает метод самим фактом.',
      c1built: 'эта страница за один день: интерактивный разбор, конвейер сборки, реагирующее поле частиц. Ванильный JS без сборки, две языковые версии из одного словаря.',
      c2bar: 'ИССЛЕДОВАТЕЛЬСКИЙ ПРОЕКТ · MONEYFORESIGHT',
      c2state: 'автоматизация ручного анализа',
      c2came: 'ручной анализ: пять индикаторов смотрятся по отдельности, связку проверить нечем.',
      c2built: 'один индикатор сводит пять модулей в одну картину; отдельный бэктест на Python повторяет ту же логику и прогоняет по истории. Pine + Python, публичные данные Binance, атрибуция по MPL 2.0. Исследовательский проект, не инвестиционный продукт и не финансовая рекомендация.',
      c3bar: 'ПРОДУКТОВАЯ ПРОРАБОТКА · LUMINARY',
      c3state: 'исследование до разработки',
      c3came: 'приложение о памяти и утрате — тема, где ошибка в тоне дороже ошибки в коде.',
      c3built: 'спецификация продукта и сценарий первого сеанса с проговорёнными границами: что делаем, чего не делаем никогда и почему.',
      /* c1inside/c2inside/c3inside — строка «Внутри» больше не в разметке, ключи сохранены.
         Дисклеймер MoneyForesight перенесён в c2built. */
      c1inside: 'ванильный JS без сборки, canvas, две языковые версии из одного словаря, статический хостинг.',
      c2inside: 'Pine Script, Python, публичные данные Binance без ключей, атрибуция всех заимствованных модулей по MPL 2.0 — до публикации, а не после претензии. Это исследовательский проект, не инвестиционный продукт и не финансовая рекомендация.',
      c3inside: 'продуктовая проработка до первой строчки кода. Иногда самый честный результат итерации — понять, что и как строить нельзя.'
    },

    pulse: {
      idx: '[ 06 ] · LIVE BUILD PULSE',
      h2: 'Живое демо<br>на реальных данных',
      sub: 'Работающий пример вместо скриншотов: секция в реальном времени читает события трёх активных репозиториев GitHub и раскладывает их по этапам разработки — кто пишет код, что ревьюят, что выкатывают, какие проблемы находят. Этот же сигнал управляет полем частиц на фоне. Такие живые интерфейсы я и собираю.',
      bar: 'GITHUB · REPO EVENTS',
      connecting: 'подключение…',
      live: 'живой сигнал',
      cached: 'из кэша · обновится через 10 мин',
      offline: 'offline build signal · локальный профиль',
      events: 'СОБЫТИЙ',
      feedhead: 'ПОТОК СОБЫТИЙ',
      offlineFeed: 'поток недоступен — показан расчётный профиль',
      reason: ' · причина: ',
      agoS: 'с', agoM: 'м', agoH: 'ч', agoD: 'д',
      noteBuild: 'кто-то прямо сейчас пишет код',
      noteReview: 'код смотрят и спорят о нём',
      noteShip: 'что-то выкатывают наружу',
      noteProbe: 'находят проблемы и описывают их',
      foot: 'Источник: <a href="https://docs.github.com/en/rest/activity/events" rel="noopener noreferrer" target="_blank">GitHub REST API · Events</a> по репозиториям home-assistant/core, microsoft/vscode, rust-lang/rust. Общая анонимная лента GitHub отдаёт почти одни push-события, поэтому четыре режима собираются из репозиториев. Запрос без авторизации, ответ кэшируется на 10 минут; при недоступности API включается локальный fallback-сигнал — и он честно подписан.'
    },

    cta: {
      h2: 'Опишите процесс, который хотите упростить,<br>или идею, которую хотите проверить.',
      p: 'В сообщении достаточно трёх вещей: что происходит сейчас, кто этим пользуется и что должно измениться. Не нужны ТЗ и макеты.',
      mail: 'Написать о задаче по email',
      mailSubject: 'Разобрать задачу',
      direct: 'или скопируйте адрес',
      telegram: 'Написать в Telegram',
      s1: 'вы описываете задачу как умеете',
      s2: 'я возвращаю разбор: сценарий, риск, что собрать первым',
      s3: 'дальше либо работаем, либо у вас просто есть внятный план',
      /* note больше не в разметке (снят при сокращении текста), ключ сохранён */
      note: 'Дальше я работаю сам и возвращаюсь с тем, что уже можно открыть.'
    },

    foot: { rights: 'GADZHA · AI PRODUCT BUILDER' },

    tasks: {
      proto: {
        title: 'AI-прототип',
        product: 'Определить один сценарий, в котором AI действительно полезен, и отрезать всё остальное.',
        quality: 'Проверить крайние случаи и поведение интерфейса, когда модель отвечает плохо или не отвечает вовсе.',
        infra: 'Минимальный стек: один API, одно хранилище, один деплой. Считаем цену запроса заранее.',
        delivery: 'Собрать демо-поток: вход → генерация → результат → правка. Показать, где человек вмешивается.',
        risk: 'Демо собирают под идеальный ответ модели. План на плохой ответ нужен раньше интерфейса.',
        first: 'Кликабельный прототип на реальном API + честный список ограничений.',
        horizon: 'горизонт первой итерации ≈ 4–7 дней',
        term: '4–7 дней',
        stations: ['идея без ТЗ', 'один сценарий', 'прототип на API', 'плохие ответы', 'демо + лимиты']
      },
      landing: {
        title: 'Лендинг / продуктовая страница',
        product: 'Сформулировать оффер и один целевой сценарий посетителя: что он должен понять и сделать.',
        quality: 'Проверить читаемость, скорость загрузки, мобильную версию и весь путь до целевого действия.',
        infra: 'Статика, CDN, форма и аналитика без бэкенда. Домен и выкат быстро, если доступы уже на руках.',
        delivery: 'Выкатить, снять первые данные, подготовить следующую итерацию по фактам, а не по вкусу.',
        risk: 'Страница красивая, но за десять секунд непонятно, что предлагают. Оффер важнее анимаций.',
        first: 'Живая страница на домене + разметка событий под аналитику.',
        horizon: 'горизонт первой итерации ≈ 3–6 дней',
        term: '3–6 дней',
        stations: ['идея оффера', 'сценарий визита', 'вёрстка', 'мобайл и скорость', 'домен + аналитика']
      },
      tool: {
        title: 'Внутренний инструмент',
        product: 'Найти ручной шаг, который съедает больше всего времени, и собрать инструмент вокруг него.',
        quality: 'Проверить на реальных грязных данных, а не на аккуратном демо-наборе.',
        infra: 'Доступы, авторизация, где живут данные и кто платит за API. Это решается до кода.',
        delivery: 'Передать команде: короткая инструкция, назначенный владелец, канал для багов.',
        risk: 'Инструмент сделан под одного человека. Без владельца он умирает за месяц.',
        first: 'Рабочий инструмент для одной команды + регламент на страницу.',
        horizon: 'горизонт первой итерации ≈ 1–2 недели',
        term: '1–2 недели',
        stations: ['ручной процесс', 'узкое место', 'инструмент', 'грязные данные', 'команда + владелец']
      },
      feature: {
        title: 'Фича в существующий продукт',
        product: 'Понять, куда фича встраивается в текущий сценарий и что она заменяет собой.',
        quality: 'Не сломать то, что уже работает: пограничные состояния, старые данные, права доступа.',
        infra: 'Разобраться в чужом коде, окружении и процессе выката до первой строчки своей.',
        delivery: 'Ветка, ревью, фиче-флаг, план отката. Включаем постепенно, а не всем сразу.',
        risk: 'Фича есть, но её не находят. Точка входа важнее самой фичи.',
        first: 'Фича за фиче-флагом + описание того, что именно проверено.',
        horizon: 'горизонт первой итерации ≈ 5–10 дней',
        term: '5–10 дней',
        stations: ['запрос на фичу', 'место в сценарии', 'код в чужой базе', 'регресс', 'флаг + откат']
      },
      auto: {
        title: 'Автоматизация процесса',
        product: 'Разложить процесс на шаги и отделить те, что реально автоматизируются, от тех, что кажутся такими.',
        quality: 'Проверить, что происходит при сбое и при повторном запуске на тех же данных.',
        infra: 'Расписание, логи, уведомления, доступы. Всё, что нужно, чтобы это жило без присмотра.',
        delivery: 'Включить, понаблюдать, отдать с понятной ручкой «выключить».',
        risk: 'Тихий сбой. Автоматизация без логов и уведомлений опаснее ручной работы.',
        first: 'Работающий сценарий + лог выполнения + уведомление о сбое.',
        horizon: 'горизонт первой итерации ≈ 4–8 дней',
        term: '4–8 дней',
        stations: ['ручная рутина', 'карта шагов', 'сценарий', 'сбои и повторы', 'расписание + логи']
      },
      adopt: {
        title: 'Внедрение AI в процесс',
        product: 'Найти в процессе место, где AI даёт измеримый выигрыш, и отделить его от мест, где он просто модный.',
        quality: 'Проверить на ваших реальных данных и заранее договориться, что считается приемлемым ответом, а что браком.',
        infra: 'Где живут данные, кто платит за запросы и что происходит при недоступности модели. Решается до кода.',
        delivery: 'Включить на одном участке, замерить до и после, и только потом расширять, с понятной ручкой «выключить».',
        risk: 'AI внедряют туда, где он не нужен, потому что «надо внедрить AI». Сначала ищу, где выигрыш вообще измерим.',
        first: 'Один участок процесса, работающий на AI, с замером до и после.',
        horizon: 'горизонт первой итерации ≈ 1–3 недели',
        term: '1–3 недели',
        stations: ['процесс как есть', 'место для AI', 'пилот на участке', 'ваши данные', 'замер + расширение']
      }
    }
  },

  /* ═══════════════════════════ ENGLISH ═══════════════════════════════════ */
  en: {
    meta: {
      title: 'Gadzha — AI Product Builder: automations, internal services and AI prototypes',
      description: 'I build automations, internal services and AI prototypes for small companies and product teams. One clearly scoped first version: I map the process, ship something that works and name its limits — no spec, no hire.',
      ogTitle: 'Gadzha — AI Product Builder',
      ogDescription: 'I build automations, internal services and AI prototypes.',
      ogLocale: 'en_US'
    },

    a11y: {
      skip: 'Skip to content',
      home: 'Gadzha — back to top',
      sections: 'Page sections',
      scroll: 'Scroll down',
      taskType: 'Work scenarios',
      langGroup: 'Page language'
    },

    nav: {
      intake: 'What to bring',
      services: 'What I build',
      radar: 'Breakdown',
      proof: 'Built',
      status: 'open to work',
      cta: 'Describe a task',
      ctaShort: 'Contact'
    },

    hero: {
      kicker1: 'AI PRODUCT BUILDER',
      ctaNote: 'A task in any form is enough to start — a voice note works.',
      h1: 'I build <em>automations, internal services and AI prototypes</em>.',
      lede: 'For small companies and product teams. I map the process, build the first working version, and name its limits — no spec, no hire.',
      ctaPrimary: 'Describe your process or idea',
      ctaGhost: 'See how the work is scoped',
      metaBuiltLabel: 'shipped',
      metaBuilt: 'web interfaces · AI tools · trading indicators · product specs',
      metaFormatLabel: 'format',
      metaFormat: 'in iterations, each with its own scope and deadline',
      scrollCue: 'what people bring me'
    },

    cockpit: {
      title: 'HOW THE WORK MOVES',
      idle: 'no scenario picked yet',
      active: 'scenario: ',
      hint: 'Pick a scenario in the <a href="#radar">Breakdown</a>, and the stages rebuild around it.',
      rowRisk: 'risk',
      rowOutput: 'result',
      rowTerm: 'time',
      /* short stage labels */
      nm: {
        input: 'TASK',
        frame: 'SCOPE',
        build: 'BUILD',
        test: 'CHECK',
        ship: 'LAUNCH'
      },
      st: {
        input: 'the task as it is',
        frame: 'scope and boundaries',
        build: 'code and interface',
        test: 'weak points',
        ship: 'a working link'
      }
    },

    intake: {
      h2: 'I step in when a process or an idea<br>runs into manual work.',
      sub: 'Four ways these conversations usually start:',
      i1: 'We move data between systems by hand, and we catch mistakes late.',
      i2: 'We need a small internal tool, but the product always comes first.',
      i3: 'We need to know if AI helps on real work, not just in a demo.',
      i4: 'We want to test the idea before committing budget and a team.',
      /* bridge no longer in the markup (removed when trimming copy), key kept */
      bridge: 'If even one of these sounds familiar, below is what I build in those cases.'
    },

    services: {
      h2: 'What I can build first',
      sub: 'Three places the work usually starts. Each is a scoped first version — not an open-ended project.',
      lblProblem: 'Problem', lblSolution: 'Approach', lblResult: 'Result', lblExample: 'Example',
      bar1: '01 / DIRECTION', bar2: '02 / DIRECTION', bar3: '03 / DIRECTION',
      s1h: 'Automation and integrations',
      s1p: 'Repeated actions, data moved by hand, lost requests, no visibility on failure.',
      s1s: 'I connect the services and build a job with a log, an alert, and an off switch.',
      s1r: 'The operation repeats without manual work, and failures are visible.',
      s2h: 'An internal tool for one team',
      s2p: 'The process lives in spreadsheets, DMs, and a few disconnected services.',
      s2s: 'A small web tool around one scenario, tested on real, messy data.',
      s2r: 'One clear place to work, a short guide, a named owner.',
      s3h: 'An AI pilot or product prototype',
      s3p: 'An AI feature idea, but the benefit, the cost, and the bad-answer case are all unclear.',
      s3s: 'One scenario on a real API, with limits set and a person in the review step.',
      s3r: 'A clickable first version and an honest list of limits — enough to decide.',
      /* s1e/s2e/s3e — the “Example” row is no longer in the markup, keys kept */
      s1e: 'A form submission lands in the right system, gets an owner, and reports a failure instead of vanishing into a spreadsheet.',
      s2e: 'An internal screen for handling requests, checking data or preparing a recurring report.',
      s3e: 'An AI assistant that drafts from the team’s own data but leaves the review, and an obvious way to correct it, to a person.',
      note: 'If a landing or web page is needed to run the test, it’s part of that first version.'
    },

    method: {
      h2: 'How I work:<br>a working piece first.',
      lead: 'A working piece first, everything else after. It’s the fastest way to find the direction and decide on facts, not slides.',
      no1: '“Let’s make it look good”',
      yes1: '“Let’s make something we can show and test”',
      no2: '“First a twenty-page spec”',
      yes2: '“First a working piece, then a spec grounded in facts”',
      no3: '“Design apart, code apart, tests someday”',
      yes3: '“One head carries the work from wording to deploy”',
      note: 'Some call this vibe coding. For me it’s faster research and building — not a promise to “generate” a product. The scenario, the limits, the code and the result are on me.'
    },

    /* See the note above the Russian block: only stack.pull is still on the page. */
    stack: {
      h2: 'I take one clearly scoped first version —<br>from scenario to handover.',
      sub: 'We agree three things up front: what we test now, what we deliberately leave out, and how we’ll know the version is useful. What follows is four stages of one job, not four separate specialists.',
      bar1: '01 / SCOPE', bar2: '02 / BUILD', bar3: '03 / CHECK', bar4: '04 / HANDOVER',
      productH: 'Scenario and limits',
      productP: 'We work out who uses this, what happens today and what should change. What stays out of the first version is agreed straight away.',
      productL1: 'one scenario instead of a wishlist',
      productL2: 'what we test now, and what we postpone on purpose',
      productL3: 'the test that tells us the version is useful',
      qualityH: 'A working version',
      qualityP: 'I build the smallest thing that already proves something: interface, code, integrations — exactly as much as the scenario needs.',
      qualityL1: 'a stack sized to the job, not to the trend',
      qualityL2: 'access, keys, rate limits and cost per request',
      qualityL3: 'something that opens by link and works',
      infraH: 'Tested on real data',
      infraP: 'I run it on your data, including the awkward parts. I look for where the logic breaks and what happens when things go wrong.',
      infraL1: 'edge cases and empty states',
      infraL2: 'behaviour on failure and on a re-run',
      infraL3: 'an honest list of limits instead of promises',
      deliveryH: 'Handover and next step',
      deliveryP: 'You get the link, a short guide and a named owner, with an obvious way to stop it if something goes wrong.',
      deliveryL1: 'a guide and an owner, not “here’s an archive”',
      deliveryL2: 'an execution log and an alert on failure',
      deliveryL3: 'a clear next step after the iteration',
      pull: 'To get started you don’t hire anyone or line up four contractors. Nothing falls through the cracks, because there are no gaps.'
    },

    radar: {
      h2: 'Pick a scenario — I’ll show where we start<br>and which risk I check first.',
      /* sub removed from the markup: it nearly duplicated the h2. Key kept. */
      sub: 'Different tasks have a different first result and a different first risk.',
      bar: 'TASK BREAKDOWN',
      state: 'no scenario picked',
      stateActive: 'scenario: ',
      reset: 'Clear',
      resetAria: 'Clear the breakdown',
      /* the same four stages as in block [ 03 ] */
      mode1: 'SCOPE', mode2: 'BUILD', mode3: 'CHECK', mode4: 'HANDOVER',
      empty: 'Six scenarios, six ways to build.<br>Pick the closest to see scope, risk and timing.',
      tagRisk: 'THE RISK I CHECK FIRST',
      tagFirst: 'FIRST RESULT',
      pull: 'Every breakdown ends with a concrete first result, not a mockup and not a deck.',
      horizonNote: 'An estimate, refined after a short review: it depends on access, data and the scope of the first version.',
      btnProto: 'AI prototype',
      scenarioCta: 'Discuss this scenario',
      btnLanding: 'Landing page',
      btnTool: 'Internal tool',
      btnFeature: 'Feature',
      btnAuto: 'Automation',
      btnAdopt: 'AI adoption'
    },

    proof: {
      h2: 'Things I’ve built',
      sub: 'My own projects — no invented client results. For each: the task, what got built, what changed.',
      lblCame: 'The task',
      lblBuilt: 'What got built',
      lblInside: 'Inside',
      lblOutcome: 'Outcome',
      c1outcome: 'a working page instead of a portfolio: you can open it, not just hear about it.',
      c2outcome: 'a testable calculation and a backtest that can disprove a hypothesis, not flatter it.',
      c3outcome: 'a spec you can build from, and an explicit list of what must not be built. If a project shouldn’t be done, you hear it before the invoice.',
      c1bar: 'OWN PROJECT · THIS SITE',
      c1state: 'open right now',
      c1came: 'a personal site that doesn’t look like a template and proves the method by existing.',
      c1built: 'this page, in one day: an interactive breakdown, a build pipeline, a reactive particle field. Vanilla JS, no build step, two languages from one dictionary.',
      c2bar: 'RESEARCH PROJECT · MONEYFORESIGHT',
      c2state: 'manual analysis, automated',
      c2came: 'manual analysis: five indicators each read on its own, with no way to check whether the combination works.',
      c2built: 'one indicator merges five modules into a single picture; a separate Python backtest reproduces the logic and runs it over history. Pine + Python, public Binance data, MPL 2.0 attribution. A research project, not an investment product and not financial advice.',
      c3bar: 'PRODUCT WORK · LUMINARY',
      c3state: 'research before development',
      c3came: 'an app about memory and loss — where getting the tone wrong costs more than getting the code wrong.',
      c3built: 'a product spec and first-session script with the boundaries spelled out: what we do, what we never do, and why.',
      /* c1inside/c2inside/c3inside — the “Inside” row is no longer in the markup, keys kept.
         The MoneyForesight disclaimer has moved into c2built. */
      c1inside: 'vanilla JS with no build step, canvas, two language versions from one dictionary, static hosting.',
      c2inside: 'Pine Script, Python, public Binance data without keys, MPL 2.0 attribution for every borrowed module — before publishing, not after a complaint. This is a research project, not an investment product and not financial advice.',
      c3inside: 'product work carried right up to the first line of code. Sometimes the most honest outcome of an iteration is learning what must not be built.'
    },

    pulse: {
      idx: '[ 06 ] · LIVE BUILD PULSE',
      h2: 'A live demo<br>on real data',
      sub: 'A working example instead of screenshots: this section reads events from three active GitHub repositories in real time and sorts them into stages of development — who is writing code, what is under review, what is shipping, which problems are being found. The same signal drives the particle field in the background. Live interfaces like this are what I build.',
      bar: 'GITHUB · REPO EVENTS',
      connecting: 'connecting…',
      live: 'live signal',
      cached: 'from cache · refreshes in 10 min',
      offline: 'offline build signal · local profile',
      events: 'EVENTS',
      feedhead: 'EVENT STREAM',
      offlineFeed: 'stream unavailable — showing a computed profile',
      reason: ' · reason: ',
      agoS: 's', agoM: 'm', agoH: 'h', agoD: 'd',
      noteBuild: 'someone is writing code right now',
      noteReview: 'code is being read and argued over',
      noteShip: 'something is going out the door',
      noteProbe: 'problems are being found and written down',
      foot: 'Source: <a href="https://docs.github.com/en/rest/activity/events" rel="noopener noreferrer" target="_blank">GitHub REST API · Events</a> across home-assistant/core, microsoft/vscode, rust-lang/rust. GitHub’s anonymous global feed returns almost nothing but push events, so the four modes are assembled from repositories instead. Unauthenticated request, response cached for 10 minutes; if the API is unavailable a local fallback signal kicks in — and it says so plainly.'
    },

    cta: {
      h2: 'Describe the process you want simplified,<br>or the idea you want tested.',
      p: 'Three things are enough: what happens today, who uses it, what should change. No spec or mockups needed.',
      mail: 'Email me about the task',
      mailSubject: 'Breaking down a task',
      direct: 'or copy the address',
      telegram: 'Message me on Telegram',
      s1: 'you describe the task however you can',
      s2: 'I come back with a breakdown: scenario, risk, what to build first',
      s3: 'then either we work together, or you simply have a clear plan',
      /* note no longer in the markup (removed when trimming copy), key kept */
      note: 'After that I work on my own and come back with something you can open.'
    },

    foot: { rights: 'GADZHA · AI PRODUCT BUILDER' },

    tasks: {
      proto: {
        title: 'AI prototype',
        product: 'Pin down the one scenario where AI is genuinely useful, and cut everything else.',
        quality: 'Test the edge cases and how the interface behaves when the model answers badly, or not at all.',
        infra: 'Minimal stack: one API, one store, one deploy. Cost per request worked out up front.',
        delivery: 'Build the demo flow: input → generation → result → correction. Show where the human steps in.',
        risk: 'Demos get built around the model’s ideal answer. Plan for the bad answer first.',
        first: 'A clickable prototype on a real API, plus an honest list of limits.',
        horizon: 'first iteration ≈ 4–7 days',
        term: '4–7 days',
        stations: ['idea, no spec', 'one scenario', 'prototype on an API', 'bad answers', 'demo + limits']
      },
      landing: {
        title: 'Landing / product page',
        product: 'Nail the offer and the one visitor scenario: what they must understand and what they must do.',
        quality: 'Check readability, load speed, mobile, and the whole path to the target action.',
        infra: 'Static, CDN, a form and analytics without a backend. Domain and deploy are quick once access is in place.',
        delivery: 'Ship it, take the first numbers, prepare the next iteration from facts rather than taste.',
        risk: 'The page looks great, but ten seconds in nobody knows what’s on offer. The offer matters more than the animation.',
        first: 'A live page on your domain, with events wired up for analytics.',
        horizon: 'first iteration ≈ 3–6 days',
        term: '3–6 days',
        stations: ['an offer idea', 'the visit scenario', 'the build', 'mobile and speed', 'domain + analytics']
      },
      tool: {
        title: 'Internal tool',
        product: 'Find the manual step that eats the most time and build the tool around it.',
        quality: 'Test it on real, messy data, not on a tidy demo set.',
        infra: 'Access, auth, where the data lives and who pays for the API. Settled before any code.',
        delivery: 'Hand it to the team: a short guide, a named owner, a channel for bugs.',
        risk: 'The tool gets built for one person. Without an owner it dies within a month.',
        first: 'A working tool for one team, plus a one-page operating guide.',
        horizon: 'first iteration ≈ 1–2 weeks',
        term: '1–2 weeks',
        stations: ['a manual process', 'the bottleneck', 'the tool', 'messy data', 'team + owner']
      },
      feature: {
        title: 'Feature in an existing product',
        product: 'Work out where the feature fits the current flow and what it replaces.',
        quality: 'Don’t break what already works: edge states, legacy data, permissions.',
        infra: 'Understand someone else’s code, environment and release process before writing a line of my own.',
        delivery: 'Branch, review, feature flag, rollback plan. Turn it on gradually, not for everyone at once.',
        risk: 'The feature exists but nobody finds it. The entry point matters more than the feature.',
        first: 'The feature behind a flag, plus a written account of what exactly was tested.',
        horizon: 'first iteration ≈ 5–10 days',
        term: '5–10 days',
        stations: ['a feature request', 'its place in the flow', 'code in a foreign base', 'regression', 'flag + rollback']
      },
      auto: {
        title: 'Process automation',
        product: 'Break the process into steps and separate what genuinely automates from what only looks like it does.',
        quality: 'Check what happens on failure, and on a re-run over the same data.',
        infra: 'Schedule, logs, alerts, access. Everything it needs to live unattended.',
        delivery: 'Switch it on, watch it, hand it over with an obvious off switch.',
        risk: 'Silent failure. Automation without logs and alerts is more dangerous than doing it by hand.',
        first: 'A working job, an execution log, and an alert when it breaks.',
        horizon: 'first iteration ≈ 4–8 days',
        term: '4–8 days',
        stations: ['a manual routine', 'a map of the steps', 'the job', 'failures and re-runs', 'schedule + logs']
      },
      adopt: {
        title: 'AI adoption in a process',
        product: 'Find the spot in the process where AI gives a measurable win, and separate it from the spots where it’s just fashionable.',
        quality: 'Test it on your real data, and agree up front on what counts as an acceptable answer and what counts as a failure.',
        infra: 'Where the data lives, who pays per request, and what happens when the model is unavailable. Settled before any code.',
        delivery: 'Switch it on for one slice, measure before and after, and only then widen it, with an obvious off switch.',
        risk: 'AI gets deployed where it isn’t needed, because “we must do AI”. First I look for where the win can even be measured.',
        first: 'One slice of the process running on AI, with a before-and-after measurement.',
        horizon: 'first iteration ≈ 1–3 weeks',
        term: '1–3 weeks',
        stations: ['the process as it is', 'a spot for AI', 'pilot on one slice', 'your real data', 'measure + widen']
      }
    }
  }
  };

  /* ── выбор языка ────────────────────────────────────────────────────── */
  var STORE = 'gadzha.lang';
  var listeners = [];
  var lang = detect();

  function detect() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'ru' || q === 'en') return q;
      var saved = localStorage.getItem(STORE);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch (e) { /* приватный режим — просто идём дальше */ }
    /* основной рынок международный: по умолчанию английский,
       русский — только если браузер прямо просит русский */
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('ru') === 0 ? 'ru' : 'en';
  }

  function get(key, l) {
    var parts = key.split('.'), node = DICT[l || lang];
    for (var i = 0; i < parts.length && node != null; i++) node = node[parts[i]];
    return (typeof node === 'string') ? node : null;
  }

  function apply() {
    var d = DICT[lang];

    document.documentElement.setAttribute('lang', lang);
    document.title = d.meta.title;
    setMeta('name', 'description', d.meta.description);
    setMeta('property', 'og:title', d.meta.ogTitle);
    setMeta('property', 'og:description', d.meta.ogDescription);
    setMeta('property', 'og:locale', d.meta.ogLocale);

    each('[data-i18n]', function (el) {
      var v = get(el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });

    /* только из нашего словаря — внешние данные сюда не попадают */
    each('[data-i18n-html]', function (el) {
      var v = get(el.getAttribute('data-i18n-html'));
      if (v !== null) el.innerHTML = v;
    });

    each('[data-i18n-aria]', function (el) {
      var v = get(el.getAttribute('data-i18n-aria'));
      if (v !== null) el.setAttribute('aria-label', v);
    });

    /* тема письма зависит от языка */
    each('[data-i18n-mail]', function (el) {
      var base = el.getAttribute('data-i18n-mail');
      el.setAttribute('href', 'mailto:' + base + '?subject=' + encodeURIComponent(d.cta.mailSubject));
    });

    each('.lang__btn', function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });

    for (var i = 0; i < listeners.length; i++) listeners[i](lang);
  }

  function setMeta(attr, name, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + name + '"]');
    if (el) el.setAttribute('content', value);
  }

  function each(sel, fn) {
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) fn(list[i]);
  }

  function set(next) {
    if (next !== 'ru' && next !== 'en' || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    apply();
  }

  function init() {
    each('.lang__btn', function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-lang')); });
    });
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    get lang() { return lang; },
    t: function (key) { return get(key) || ''; },
    tasks: function () { return DICT[lang].tasks; },
    set: set,
    onChange: function (fn) { if (typeof fn === 'function') listeners.push(fn); }
  };
})();
