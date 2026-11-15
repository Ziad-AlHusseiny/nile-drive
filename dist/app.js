(() => {
  'use strict';

  const isArabic = () => document.documentElement.lang === 'ar';
  const tr = (en, ar) => isArabic() ? ar : en;
  const locale = () => isArabic() ? 'ar-EG-u-nu-latn' : 'en-GB';
  const cars = [
    { id: 'corolla', name: 'Toyota Corolla', nameAr: 'تويوتا كورولا', year: '2024', category: 'sedan', monthly: 28500, seats: 5, bags: 3, tag: 'The everyday favourite', tagAr: 'اختيارك لكل يوم', image: 'assets/corolla.jpg' },
    { id: 'sportage', name: 'Kia Sportage', nameAr: 'كيا سبورتاج', year: '2024', category: 'suv', monthly: 46500, seats: 5, bags: 4, tag: 'More room for everyone', tagAr: 'مساحة أوسع لكل العيلة', image: 'assets/sportage.jpg' },
    { id: 'elantra', name: 'Hyundai Elantra', nameAr: 'هيونداي إلنترا', year: '2024', category: 'sedan', monthly: 31500, seats: 5, bags: 3, tag: 'A little extra comfort', tagAr: 'راحة أكتر في كل مشوار', image: 'assets/elantra.jpg' },
    { id: 'sunny', name: 'Nissan Sunny', nameAr: 'نيسان صني', year: '2024', category: 'sedan', monthly: 22500, seats: 5, bags: 2, tag: 'Easy on your budget', tagAr: 'سعر يناسب ميزانيتك', image: 'assets/sunny.jpg' },
    { id: 'tucson', name: 'Hyundai Tucson', nameAr: 'هيونداي توسان', year: '2024', category: 'suv', monthly: 49500, seats: 5, bags: 4, tag: 'Made for family plans', tagAr: 'لمشاوير العيلة', image: 'assets/tucson.jpg' },
    { id: 'peugeot', name: 'Peugeot 3008', nameAr: 'بيجو 3008', year: '2024', category: 'suv', monthly: 52500, seats: 5, bags: 4, tag: 'Arrive in your own style', tagAr: 'طابع خاص لكل مشوار', image: 'assets/peugeot.jpg' }
  ];
  window.NILE_CARS = cars;
  const carName = (car) => tr(car.name, car.nameAr);
  const currencyName = (code) => isArabic() ? ({ EGP: 'ج.م', SAR: 'ر.س', AED: 'د.إ' }[code] || code) : code;
  const icons = {
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    person: '<circle cx="12" cy="7" r="3"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/>',
    gear: '<path d="M7 3v13a4 4 0 0 0 8 0V3M7 8h8"/><circle cx="7" cy="3" r="1"/><circle cx="15" cy="3" r="1"/>',
    bag: '<rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 7V4h6v3M9 11v5m6-5v5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>'
  };
  const icon = (name) => `<svg class="${name === 'arrow' ? 'directional-icon' : ''}" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const supportedCurrencies = ['EGP', 'SAR', 'AED'];
  const rates = { EGP: 1, SAR: 0.075, AED: 0.0735 };
  const state = { category: 'all', duration: 30, currency: 'EGP', showAll: false, status: 'initial' };
  try {
    const saved = localStorage.getItem('nile-currency');
    if (supportedCurrencies.includes(saved)) state.currency = saved;
  } catch (_) { /* Currency still works when storage is blocked. */ }

  function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  const today = localDate();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = localDate(tomorrowDate);
  const displayDate = (value) => new Date(`${value}T12:00:00`).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = (value, days) => {
    const date = new Date(`${value}T12:00:00`);
    date.setDate(date.getDate() + Number(days));
    return localDate(date);
  };
  const discountFor = (days) => Number(days) === 90 ? 0.10 : Number(days) === 60 ? 0.05 : 0;
  const monthlyFor = (car, days = state.duration) => Math.round(car.monthly * (1 - discountFor(days)));
  const numberPrice = (amount) => Math.round(amount * rates[state.currency]).toLocaleString('en-GB');
  const money = (amount, currency = state.currency) => {
    const price = Math.round(amount * rates[currency]).toLocaleString('en-GB');
    return tr(`${currency} ${price}`, `${price} ${currencyName(currency)}`);
  };
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateControls() {
    $$('[data-filter]').forEach((button) => {
      const active = button.dataset.filter === state.category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $$('[data-duration]').forEach((button) => {
      const active = Number(button.dataset.duration) === state.duration;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if ($('#rental-length')) $('#rental-length').value = String(state.duration);
    if ($('#currency')) $('#currency').value = state.currency;
    const note = $('#currency-note');
    if (note) {
      note.hidden = state.currency === 'EGP';
      note.textContent = state.currency === 'EGP'
        ? tr('Sample rates in EGP. Final price and availability are confirmed with your quote.', 'الأسعار أمثلة بالجنيه المصري. السعر النهائي وتوفر العربية بيتأكدوا في عرض السعر.')
        : tr(`${state.currency} prices are rough planning estimates. Final quotes and payment are in EGP.`, `الأسعار بعملة ${currencyName(state.currency)} تقديرية للتخطيط فقط. عرض السعر النهائي والدفع بالجنيه المصري.`);
    }
  }

  const savedCars = new Set();
  try { const stored = JSON.parse(localStorage.getItem('nile-favorites') || '[]'); if (Array.isArray(stored)) stored.filter(id => cars.some(c => c.id === id)).forEach(id => savedCars.add(id)); } catch (_) {}
  const comparedCars = new Set();
  let savedOnly = false;
  let featureMode = null;
  const featureDialog = document.createElement('dialog');
  featureDialog.className = 'feature-dialog';
  featureDialog.setAttribute('aria-labelledby', 'feature-title');
  document.body.append(featureDialog);
  featureDialog.addEventListener('click', e => { if (e.target === featureDialog || e.target.closest('[data-feature-close]')) featureDialog.close(); });
  featureDialog.addEventListener('close', () => { document.body.classList.remove('feature-open'); featureMode = null; });
  const toolsBar = document.createElement('div');
  toolsBar.className = 'fleet-extras';
  $('#fleet-grid').before(toolsBar);
  function featureControls() {
    toolsBar.innerHTML = `<button type="button" data-saved-only aria-pressed="${savedOnly}">♡ ${tr('Saved cars', 'المفضلة')} (${savedCars.size})</button><button type="button" data-compare-open ${comparedCars.size < 2 ? 'disabled' : ''}>${tr('Compare', 'قارن العربيات')} (${comparedCars.size}/3)</button><span>${tr('Choose 2 or 3 cars to compare.', 'اختار عربيتين أو تلاتة للمقارنة.')}</span>`;
  }
  function renderFeature() {
    const selected = featureMode === 'compare' ? cars.filter(c => comparedCars.has(c.id)) : cars.filter(c => c.id === featureMode);
    featureDialog.innerHTML = `<div class="feature-head"><div><span class="eyebrow">${tr('YOUR STAY, YOUR CHOICE', 'إقامتك على مزاجك')}</span><h2 id="feature-title">${featureMode === 'compare' ? tr('Find your perfect fit', 'اختار الأنسب ليك') : carName(selected[0])}</h2></div><button type="button" data-feature-close aria-label="${tr('Close', 'إغلاق')}">×</button></div><p class="feature-note">${tr('Sample prices. Availability, deposit, insurance and all extra fees must be confirmed in your quote.', 'أسعار توضيحية. توفر العربية والضمان والتغطية وأي رسوم إضافية لازم تتأكد في عرض السعر.')}</p><div class="feature-cars">${selected.map(car => `<article class="feature-car"><img src="${car.image}" alt="${carName(car)}" width="720" height="480"><h3>${carName(car)}</h3><p>${tr(car.tag, car.tagAr)}</p><dl><div><dt>${tr('Model year', 'سنة الموديل')}</dt><dd>${car.year}</dd></div><div><dt>${tr('Seats / bags', 'مقاعد / شنط')}</dt><dd>${car.seats} / ${car.bags}</dd></div><div><dt>${tr('Gearbox', 'ناقل الحركة')}</dt><dd>${tr('Automatic', 'أوتوماتيك')}</dd></div>${[30,60,90].map(days => `<div><dt>${days} ${tr('days — total', 'يوم — الإجمالي')}</dt><dd><bdi>${money(monthlyFor(car, days) * days / 30)}</bdi></dd></div>`).join('')}</dl><button class="primary-btn" type="button" data-feature-book="${car.id}">${tr('Plan with this car', 'خطط بالعربية دي')} ${icon('arrow')}</button></article>`).join('')}</div><p class="feature-note">${tr('60 days: 5% off. 90 days: 10% off. Totals are rental estimates only; extra fees are not included. Non-EGP values are rough conversions.', 'خصم ٥٪ لـ٦٠ يوم و١٠٪ لـ٩٠ يوم. الإجماليات تقدير للإيجار فقط ومش شاملة الرسوم الإضافية. العملات غير الجنيه تحويلات تقريبية.')}</p>`;
  }
  function openFeature(mode) { featureMode = mode; renderFeature(); featureDialog.showModal(); document.body.classList.add('feature-open'); }
  document.addEventListener('click', e => {
    const save = e.target.closest('[data-save-car]');
    if (save) { const id = save.dataset.saveCar; savedCars.has(id) ? savedCars.delete(id) : savedCars.add(id); try { localStorage.setItem('nile-favorites', JSON.stringify([...savedCars])); } catch (_) {} renderFleet(); $(`[data-save-car="${id}"]`)?.focus({preventScroll:true}); }
    const compare = e.target.closest('[data-compare-car]');
    if (compare) { const id = compare.dataset.compareCar; if (comparedCars.has(id)) comparedCars.delete(id); else if (comparedCars.size < 3) comparedCars.add(id); renderFleet(); $(`[data-compare-car="${id}"]`)?.focus({preventScroll:true}); }
    if (e.target.closest('[data-saved-only]')) { savedOnly = !savedOnly; renderFleet(); $('[data-saved-only]').focus({preventScroll:true}); }
    if (e.target.closest('[data-compare-open]') && comparedCars.size >= 2) openFeature('compare');
    const details = e.target.closest('[data-car-details]'); if (details) openFeature(details.dataset.carDetails);
    const book = e.target.closest('[data-feature-book]'); if (book) { featureDialog.close(); openBooking(book.dataset.featureBook, $(`[data-car-details="${book.dataset.featureBook}"]`) || $('[data-saved-only]')); }
  });

  function renderFleet(announce = false) {
    const grid = $('#fleet-grid');
    if (!grid) return;
    if (announce) state.status = 'filter';
    const filtered = cars.filter((car) => (state.category === 'all' || car.category === state.category) && (!savedOnly || savedCars.has(car.id)));
    const visible = state.showAll ? filtered : filtered.slice(0, 3);
    grid.innerHTML = visible.map((car) => `
      <article class="car-card">
        <div class="car-image-wrap">
          <span class="car-tag">${escapeHTML(tr(car.tag, car.tagAr))}</span>
          <img class="car-image" src="${car.image}" alt="${escapeHTML(carName(car))} — ${tr('example rental car', 'صورة توضيحية لعربية للإيجار')}" loading="lazy" width="720" height="480">
          <span class="car-type">${car.category === 'suv' ? 'SUV' : tr('Sedan', 'سيدان')}</span>
        </div>
        <div class="car-body">
          <div class="car-title-line"><h3 class="car-name">${escapeHTML(carName(car))}</h3><span class="car-year"><bdi>${car.year}</bdi></span></div>
          <div class="car-specs"><span>${icon('gear')} ${tr('Automatic', 'أوتوماتيك')}</span><span>${icon('person')} ${car.seats} ${tr('seats', 'مقاعد')}</span><span>${icon('bag')} ${car.bags} ${tr('bags', 'شنط')}</span></div>
          <div class="car-price-line"><div><span class="car-price"><span class="price-currency">${currencyName(state.currency)}</span> <bdi dir="ltr">${numberPrice(monthlyFor(car))}</bdi></span><span class="car-price-unit"> / ${tr('30 days', '30 يوم')}</span>${state.duration > 30 ? `<span class="car-saving">${tr(`${Math.round(discountFor(state.duration) * 100)}% longer-stay saving`, `خصم ${Math.round(discountFor(state.duration) * 100)}% للإقامة الأطول`)}</span>` : ''}</div><button class="car-book-btn" type="button" data-book-car="${car.id}" aria-label="${escapeHTML(tr(`Plan a rental with ${car.name}`, `خطط لإيجار ${car.nameAr}`))}">${icon('arrow')}</button></div>
          <div class="car-extra-actions"><button type="button" data-car-details="${car.id}">${tr('View details', 'تفاصيل العربية')}</button><button type="button" data-save-car="${car.id}" aria-pressed="${savedCars.has(car.id)}" aria-label="${tr('Save', 'حفظ')} ${carName(car)}">${savedCars.has(car.id) ? '♥' : '♡'}</button><button type="button" data-compare-car="${car.id}" aria-pressed="${comparedCars.has(car.id)}" ${comparedCars.size >= 3 && !comparedCars.has(car.id) ? 'disabled' : ''}>${comparedCars.has(car.id) ? '✓ ' : '+ '}${tr('Compare', 'قارن')}</button></div>
        </div>
      </article>`).join('');
    if (!visible.length) grid.innerHTML = `<p class="empty-saved">${tr('No saved cars in this category yet. Tap the heart on a car to save it, or choose another category.', 'مفيش عربيات محفوظة في الفئة دي. اضغط على القلب لحفظ عربية أو اختار فئة تانية.')}</p>`;
    featureControls();
    const moreButton = $('#show-all-cars');
    if (moreButton) {
      moreButton.hidden = filtered.length <= 3;
      moreButton.setAttribute('aria-expanded', String(state.showAll));
      moreButton.innerHTML = `${state.showAll ? tr('Show fewer cars', 'عرض عربيات أقل') : tr(`Explore all ${filtered.length} cars`, `شوف الـ ${filtered.length} عربيات`)} ${icon('arrow')}`;
    }
    const status = $('#fleet-status');
    if (status) {
      if (state.status === 'search') {
        const date = $('#pickup-date').value;
        status.textContent = tr(`Your ${state.duration}-day stay, from ${displayDate(date)}. Explore all six cars below. We’ll confirm availability with your quote.`, `إقامتك ${state.duration} يوم، من ${displayDate(date)}. شوف العربيات الستة تحت. توفر العربية بيتأكد مع عرض السعر.`);
      } else if (state.status === 'filter') {
        const kind = state.category === 'all' ? tr('cars', 'عربيات') : state.category === 'suv' ? tr('SUVs', 'عربيات SUV') : tr('sedans', 'عربيات سيدان');
        const saving = Math.round(discountFor(state.duration) * 100);
        status.textContent = tr(`${filtered.length} ${kind} to explore · ${state.duration}-day plan${state.duration > 30 ? ` · ${saving}% longer-stay saving` : ''}. Availability is confirmed with your quote.`, `${filtered.length} ${kind} للاختيار · خطة ${state.duration} يوم${state.duration > 30 ? ` · خصم ${saving}% للإقامة الأطول` : ''}. التوفر بيتأكد مع عرض السعر.`);
      } else {
        status.textContent = tr('Sample monthly rates · final price and availability confirmed in your quote.', 'أسعار شهرية توضيحية · السعر النهائي والتوفر بيتأكدوا في عرض السعر.');
      }
    }
    updateControls();
  }

  function getPickupOptions() {
    const source = $('#pickup-location');
    if (source && source.options.length) {
      return [...source.options].filter((option) => option.value && !option.disabled).map((option) => ({ value: option.value, label: option.textContent.trim() }));
    }
    return [
      { value: 'Cairo Airport', label: tr('Cairo International Airport', 'مطار القاهرة الدولي') },
      { value: 'Sphinx Airport', label: tr('Sphinx International Airport', 'مطار سفنكس الدولي') },
      { value: 'Cairo home or hotel', label: tr('Your Cairo address', 'عنوانك في القاهرة') }
    ];
  }
  const pickupLabel = (value) => getPickupOptions().find((option) => option.value === value)?.label || tr('Cairo International Airport', 'مطار القاهرة الدولي');
  let draft = null;
  let bookingStep = 1;
  let lastTrigger = null;
  let dialog;

  function createDialog() {
    dialog = document.createElement('dialog');
    dialog.id = 'booking-dialog';
    dialog.className = 'booking-dialog';
    dialog.setAttribute('aria-labelledby', 'booking-title');
    document.body.append(dialog);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (lastTrigger?.isConnected) lastTrigger.focus({ preventScroll: true });
    });
  }

  function openBooking(carId, trigger) {
    if (!dialog) createDialog();
    const dateInput = $('#pickup-date');
    const pickedDate = dateInput?.value && dateInput.value >= today ? dateInput.value : tomorrow;
    const car = cars.find((item) => item.id === carId) || cars[0];
    draft = { car: car.id, date: pickedDate, duration: state.duration, pickup: $('#pickup-location')?.value || getPickupOptions()[0].value, name: '', phone: '', notes: '' };
    if (!getPickupOptions().some((option) => option.value === draft.pickup)) draft.pickup = getPickupOptions()[0].value;
    bookingStep = 1;
    lastTrigger = trigger || document.activeElement;
    renderDialog();
    document.body.classList.add('modal-open');
    dialog.showModal();
  }

  function summaryMarkup() {
    const car = cars.find((item) => item.id === draft.car);
    const total = monthlyFor(car, draft.duration) * (draft.duration / 30);
    return `<div class="booking-summary">
      <div class="summary-car"><img src="${car.image}" alt="${escapeHTML(carName(car))}" width="120" height="80"><div><strong>${escapeHTML(carName(car))}</strong><span>${car.year} · ${tr('Automatic', 'أوتوماتيك')} · ${car.seats} ${tr('seats', 'مقاعد')}</span></div></div>
      <dl class="summary-lines"><div><dt>${tr('Your stay', 'مدة الإقامة')}</dt><dd>${draft.duration} ${tr('days', 'يوم')}</dd></div><div><dt>${tr('Pick-up', 'الاستلام')}</dt><dd>${displayDate(draft.date)}</dd></div><div><dt>${tr('Return', 'التسليم')}</dt><dd>${displayDate(endDate(draft.date, draft.duration))}</dd></div><div><dt>${tr('Meet us at', 'مكان الاستلام')}</dt><dd>${escapeHTML(pickupLabel(draft.pickup))}</dd></div>${discountFor(draft.duration) ? `<div class="summary-discount"><dt>${tr('Longer-stay saving', 'خصم الإقامة الأطول')}</dt><dd><bdi>${Math.round(discountFor(draft.duration) * 100)}%</bdi></dd></div>` : ''}<div class="summary-total"><dt>${tr('Sample rental total', 'إجمالي الإيجار التوضيحي')}</dt><dd><bdi>${money(total)}</bdi></dd></div></dl>
      <p class="summary-note">${state.currency !== 'EGP' ? tr(`Rough currency estimate. EGP total: ${money(total, 'EGP')}. `, `تحويل العملة تقديري. الإجمالي بالجنيه المصري: ${money(total, 'EGP')}. `) : ''}${tr('This is a sample rental price. Delivery, extras, deposit, and final availability need a written quote.', 'ده سعر إيجار توضيحي. التوصيل والإضافات والتأمين النقدي والتوفر النهائي محتاجين عرض سعر مكتوب.')}</p>
    </div>`;
  }

  function saveContact() {
    if (!dialog || !draft) return;
    if ($('#booking-name', dialog)) draft.name = $('#booking-name', dialog).value.trim();
    if ($('#booking-phone', dialog)) draft.phone = $('#booking-phone', dialog).value.trim();
    if ($('#booking-notes', dialog)) draft.notes = $('#booking-notes', dialog).value.trim();
  }
  function syncTrip(form) {
    const data = new FormData(form);
    draft.car = data.get('car');
    draft.duration = Number(data.get('duration'));
    draft.pickup = data.get('pickup');
    const date = data.get('date');
    if (date && date >= today) draft.date = date;
  }
  function validateDate(input) {
    input.setCustomValidity(!input.value ? tr('Please choose a pick-up date.', 'اختار تاريخ الاستلام.') : input.value < today ? tr('Please choose today or a later date.', 'اختار تاريخ النهارده أو تاريخ بعده.') : '');
  }

  function renderDialog() {
    const title = bookingStep === 1 ? tr('Make your Egypt plans.', 'خطط لإقامتك في مصر.') : bookingStep === 2 ? tr('A few details. Then you’re set.', 'شوية تفاصيل، وخطتك جاهزة.') : tr('Your request is ready.', 'طلبك جاهز.');
    dialog.innerHTML = `<div class="modal-head"><div><p class="modal-eyebrow">${bookingStep < 3 ? tr(`YOUR MONTHLY DRIVE · STEP ${bookingStep} OF 2`, `عربيتك بالشهر · خطوة ${bookingStep} من 2`) : tr('SAVED IN THIS SESSION', 'محفوظ طول ما الصفحة مفتوحة')}</p><h2 id="booking-title">${title}</h2></div><button class="modal-close" type="button" aria-label="${tr('Close trip planner', 'إغلاق مخطط الإقامة')}">${icon('close')}</button></div><div class="modal-body"></div>`;
    $('.modal-close', dialog).addEventListener('click', () => dialog.close());
    const body = $('.modal-body', dialog);
    if (bookingStep === 1) {
      body.innerHTML = `<p class="modal-intro">${tr('Choose a car and tell us when you’re coming. Your price updates as you plan.', 'اختار عربيتك ومعاد وصولك. السعر بيتغير مع اختياراتك.')}</p>
        <form id="booking-trip-form" novalidate>
          <div class="form-grid">
            <label class="form-field">${tr('Your car', 'عربيتك')}<select name="car" id="booking-car">${cars.map((car) => `<option value="${car.id}"${draft.car === car.id ? ' selected' : ''}>${escapeHTML(carName(car))}</option>`).join('')}</select></label>
            <label class="form-field">${tr('Your stay', 'مدة الإقامة')}<select name="duration" id="booking-duration">${[30, 60, 90].map((days) => `<option value="${days}"${Number(draft.duration) === days ? ' selected' : ''}>${days} ${tr('days', 'يوم')}${days > 30 ? tr(` · Save ${Math.round(discountFor(days) * 100)}%`, ` · خصم ${Math.round(discountFor(days) * 100)}%`) : ''}</option>`).join('')}</select></label>
            <label class="form-field">${tr('Pick-up date', 'تاريخ الاستلام')}<input type="date" dir="ltr" name="date" id="booking-date" min="${today}" value="${draft.date}" required></label>
            <label class="form-field">${tr('Pick-up location', 'مكان الاستلام')}<select name="pickup" id="booking-pickup">${getPickupOptions().map((option) => `<option value="${escapeHTML(option.value)}"${draft.pickup === option.value ? ' selected' : ''}>${escapeHTML(option.label)}</option>`).join('')}</select></label>
          </div>
          <div id="booking-price-preview" aria-live="polite">${summaryMarkup()}</div>
          <p class="booking-plan-note">${tr('Proposed plan: 2,000 km per 30 days. Extra distance and any added costs will be confirmed before booking.', 'الخطة المقترحة: 2,000 كم لكل 30 يوم. تكلفة المسافة الزيادة وأي مصاريف إضافية بتتأكد قبل الحجز.')}</p>
          <div class="modal-actions"><button type="submit" class="primary-btn">${tr('Continue', 'متابعة')} ${icon('arrow')}</button><span class="modal-reassurance">${tr('No payment needed', 'من غير دفع دلوقتي')}</span></div>
        </form>`;
      const form = $('#booking-trip-form', dialog);
      const bookingDate = $('#booking-date', dialog);
      bookingDate.addEventListener('input', () => bookingDate.setCustomValidity(''));
      form.addEventListener('change', () => { syncTrip(form); $('#booking-price-preview', dialog).innerHTML = summaryMarkup(); });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        validateDate(bookingDate);
        if (!form.reportValidity()) return;
        syncTrip(form);
        bookingStep = 2;
        renderDialog();
        $('#booking-name', dialog).focus();
      });
    } else if (bookingStep === 2) {
      body.innerHTML = `<p class="modal-intro">${tr('Check your plan and add your contact details. You can save or copy the request on the next screen.', 'راجع خطتك وضيف بيانات التواصل. تقدر تحفظ الطلب أو تنسخه في الخطوة الجاية.')}</p>${summaryMarkup()}
        <form id="booking-contact-form" novalidate>
          <div class="form-grid">
            <label class="form-field">${tr('Your name', 'اسمك')}<input id="booking-name" name="name" dir="auto" autocomplete="name" maxlength="80" placeholder="${tr('Full name', 'الاسم بالكامل')}" value="${escapeHTML(draft.name)}" required></label>
            <label class="form-field">${tr('WhatsApp number', 'رقم واتساب')}<input id="booking-phone" name="phone" type="tel" dir="ltr" autocomplete="tel" maxlength="24" placeholder="+971 50 123 4567" value="${escapeHTML(draft.phone)}" required aria-describedby="phone-help"><span id="phone-help" class="field-hint">${tr('Please include your country code.', 'اكتب كود الدولة قبل الرقم.')}</span></label>
            <label class="form-field form-field-full">${tr('Anything else?', 'أي تفاصيل تانية؟')} <span class="field-optional">${tr('Optional', 'اختياري')}</span><textarea name="notes" id="booking-notes" dir="auto" rows="2" maxlength="500" placeholder="${tr('Flight time, a child seat, or a question…', 'معاد الرحلة، كرسي طفل، أو أي سؤال…')}">${escapeHTML(draft.notes)}</textarea></label>
          </div>
          <p class="booking-demo-note">${tr('This preview saves a request on your device. It does not send a message or confirm a booking.', 'النسخة التجريبية بتحفظ الطلب على جهازك. مش بتبعت رسالة ومش بتأكد حجز.')}</p>
          <div class="modal-actions"><button type="button" class="secondary-btn" id="booking-back">${tr('Back', 'رجوع')}</button><button type="submit" class="primary-btn">${tr('Save my request', 'حفظ طلبي')} ${icon('arrow')}</button></div>
        </form>`;
      const form = $('#booking-contact-form', dialog);
      $('#booking-back', dialog).addEventListener('click', () => { saveContact(); bookingStep = 1; renderDialog(); $('#booking-car', dialog).focus(); });
      const nameInput = $('#booking-name', dialog);
      const phoneInput = $('#booking-phone', dialog);
      nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
      phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        saveContact();
        nameInput.setCustomValidity(draft.name.length < 2 ? tr('Please enter your name.', 'اكتب اسمك بالكامل.') : '');
        draft.phone = draft.phone.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));
        phoneInput.value = draft.phone;
        const digits = draft.phone.replace(/\D/g, '').replace(/^00/, '');
        const validPhone = /^(?:\+|00)/.test(draft.phone) && /^\+?[\d\s().-]+$/.test(draft.phone) && digits.length >= 8 && digits.length <= 15 && !digits.startsWith('0');
        phoneInput.setCustomValidity(validPhone ? '' : tr('Please start with + and your country code, for example +971 50 123 4567.', 'ابدأ بعلامة + وكود الدولة، مثال: ‎+971 50 123 4567.'));
        if (!form.reportValidity()) return;
        bookingStep = 3;
        renderDialog();
        $('#copy-request', dialog).focus();
      });
    } else {
      body.innerHTML = `<div class="booking-success-mark">${icon('check')}</div><p class="modal-intro">${tr('Your trip plan is ready to share. Copy it or keep a file for later.', 'خطة إقامتك جاهزة للمشاركة. انسخها أو نزّل نسخة تحتفظ بيها.')}</p>${summaryMarkup()}<p class="booking-demo-note"><strong>${tr('No booking has been sent or confirmed.', 'ما اتبعتش أي طلب وما اتأكدش أي حجز.')}</strong> ${tr('The company’s WhatsApp number must be added before this site can send requests.', 'لازم يتضاف رقم واتساب الشركة قبل ما الموقع يقدر يبعت طلبات.')}</p><div class="modal-actions"><button id="copy-request" type="button" class="primary-btn">${icon('copy')} ${tr('Copy request', 'نسخ الطلب')}</button><button id="download-request" type="button" class="secondary-btn">${icon('download')} ${tr('Download', 'تنزيل')}</button></div><p id="request-action-status" class="request-action-status" role="status" aria-live="polite"></p><button class="text-btn" id="edit-request" type="button">${tr('Edit my trip', 'تعديل خطتي')}</button>`;
      $('#copy-request', dialog).addEventListener('click', copyRequest);
      $('#download-request', dialog).addEventListener('click', downloadRequest);
      $('#edit-request', dialog).addEventListener('click', () => { bookingStep = 1; renderDialog(); $('#booking-car', dialog).focus(); });
    }
    dialog.scrollTop = 0;
  }

  function requestText() {
    const car = cars.find((item) => item.id === draft.car);
    const total = monthlyFor(car, draft.duration) * (draft.duration / 30);
    return [
      tr('NILE DRIVE — RENTAL REQUEST', 'نايل درايف — طلب إيجار عربية'), '',
      `${tr('Name', 'الاسم')}: ${draft.name}`,
      `${tr('WhatsApp', 'واتساب')}: ${draft.phone}`,
      `${tr('Car', 'العربية')}: ${carName(car)} (${car.year})`,
      `${tr('Pick-up', 'الاستلام')}: ${displayDate(draft.date)}`,
      `${tr('Return', 'التسليم')}: ${displayDate(endDate(draft.date, draft.duration))}`,
      `${tr('Length', 'المدة')}: ${draft.duration} ${tr('days', 'يوم')}`,
      `${tr('Location', 'مكان الاستلام')}: ${pickupLabel(draft.pickup)}`,
      `${tr('Sample rental total', 'إجمالي الإيجار التوضيحي')}: ${money(total, 'EGP')}`,
      `${tr('Proposed mileage', 'المسافة المقترحة')}: ${2000 * (draft.duration / 30)} ${tr('km', 'كم')}`,
      draft.notes ? `${tr('Notes', 'ملاحظات')}: ${draft.notes}` : null, '',
      tr('This is a saved request only. It has not been sent and is not a confirmed booking.', 'ده طلب محفوظ فقط. ما اتبعتش ومش حجز مؤكد.'),
      tr('Sample car and price. Availability, delivery, extras, deposit, and final terms need a written quote.', 'العربية والسعر أمثلة توضيحية. التوفر والتوصيل والإضافات والتأمين النقدي والشروط النهائية محتاجين عرض سعر مكتوب.')
    ].filter((line) => line !== null).join('\n');
  }

  async function copyRequest() {
    const status = $('#request-action-status', dialog);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(requestText());
      status.textContent = tr('Copied. You can now paste your request into a message.', 'تم النسخ. تقدر تلصق طلبك في رسالة.');
    } catch (_) {
      let textarea = $('#request-copy-text', dialog);
      if (!textarea) {
        textarea = document.createElement('textarea');
        textarea.id = 'request-copy-text';
        textarea.className = 'request-copy-text';
        textarea.setAttribute('aria-label', tr('Rental request text to copy', 'نص طلب الإيجار للنسخ'));
        textarea.dir = 'auto';
        textarea.readOnly = true;
        status.insertAdjacentElement('afterend', textarea);
      }
      textarea.value = requestText();
      textarea.focus();
      textarea.select();
      status.textContent = tr('Your request is selected below. Use Copy on your device, or download it.', 'نص طلبك متحدد تحت. اختار نسخ من جهازك، أو نزّل الطلب.');
    }
  }

  function downloadRequest() {
    const blob = new Blob(['\uFEFF', requestText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nile-drive-request-${draft.date}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#request-action-status', dialog).textContent = tr('Your request file is ready. Check your downloads.', 'ملف الطلب جاهز. هتلاقيه في التنزيلات.');
  }

  document.addEventListener('click', (event) => {
    const filter = event.target.closest('[data-filter]');
    if (filter) { state.category = filter.dataset.filter; state.showAll = false; renderFleet(true); }
    const duration = event.target.closest('[data-duration]');
    if (duration) { state.duration = Number(duration.dataset.duration); renderFleet(true); }
    const trigger = event.target.closest('[data-book-car], [data-open-booking]');
    if (trigger) { event.preventDefault(); openBooking(trigger.dataset.bookCar, trigger); }
  });
  $('#show-all-cars')?.addEventListener('click', () => {
    state.showAll = !state.showAll;
    renderFleet(true);
    if (!state.showAll) $('#fleet')?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
  });
  $('#currency')?.addEventListener('change', (event) => {
    if (!supportedCurrencies.includes(event.target.value)) return;
    state.currency = event.target.value;
    try { localStorage.setItem('nile-currency', state.currency); } catch (_) { /* Optional preference. */ }
    renderFleet(true);
  });
  $('#rental-length')?.addEventListener('change', (event) => {
    const duration = Number(event.target.value);
    if (![30, 60, 90].includes(duration)) return;
    state.duration = duration;
    renderFleet(true);
  });
  const dateInput = $('#pickup-date');
  if (dateInput) {
    dateInput.min = today;
    dateInput.dir = 'ltr';
    if (!dateInput.value || dateInput.value < today) dateInput.value = tomorrow;
    dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));
  }
  const search = $('#trip-search');
  if (search) {
    search.noValidate = true;
    search.addEventListener('submit', (event) => {
      event.preventDefault();
      validateDate(dateInput);
      if (!search.reportValidity()) return;
      state.duration = Number($('#rental-length')?.value) || 30;
      state.category = 'all';
      state.showAll = true;
      state.status = 'search';
      renderFleet();
      $('#fleet')?.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
    });
  }

  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function menuLabel() {
    if (menuToggle) menuToggle.setAttribute('aria-label', menuToggle.getAttribute('aria-expanded') === 'true' ? tr('Close menu', 'إغلاق القائمة') : tr('Open menu', 'فتح القائمة'));
  }
  function closeMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    mobileNav.classList.remove('open');
    menuLabel();
  }
  if (menuToggle && mobileNav) {
    closeMobileMenu();
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
      mobileNav.classList.toggle('open', open);
      menuLabel();
    });
    mobileNav.addEventListener('click', (event) => { if (event.target.closest('a, button')) closeMobileMenu(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { closeMobileMenu(); menuToggle.focus(); }
    });
  }

  document.addEventListener('nile:languagechange', () => {
    const focusId = document.activeElement?.id;
    if (dialog?.open && draft) {
      saveContact();
      const tripForm = $('#booking-trip-form', dialog);
      if (tripForm) syncTrip(tripForm);
      renderDialog();
      const field = focusId && document.getElementById(focusId);
      if (field && dialog.contains(field)) field.focus({ preventScroll: true });
    }
    renderFleet();
    if (featureDialog.open) renderFeature();
    menuLabel();
    dateInput?.setCustomValidity('');
  });
  if ($('#copyright-year')) $('#copyright-year').textContent = String(new Date().getFullYear());
  renderFleet();
})();
