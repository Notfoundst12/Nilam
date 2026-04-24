// NILAM DOM Probe v1.0
// Paste skrip ini di Console DevTools pada halaman: ains.moe.gov.my/record/add/book
// Ia akan scan semua elemen borang dan paparkan hasilnya.
(() => {
  console.clear();
  const S = (sel) => Array.from(document.querySelectorAll(sel));
  const vis = (el) => el.offsetParent !== null || el.offsetWidth > 0;

  console.log('%c=== NILAM DOM PROBE ===', 'color:#4CAF50;font-size:16px;font-weight:bold');
  console.log('URL:', location.href);
  console.log('');

  // 1. Inputs
  const inputs = S('input').filter(vis);
  console.log(`%c[INPUTS] ${inputs.length} dijumpai:`, 'color:#2196F3;font-weight:bold');
  inputs.forEach((el, i) => {
    const label = el.closest('[class*="col"], [class*="form"], .field, div')
      ?.querySelector('label, span, div');
    const labelText = label ? label.textContent.replace(/\*/g,'').trim().substring(0,30) : '?';
    console.log(`  [${i}] label="${labelText}" type=${el.type||'text'} name="${el.name}" placeholder="${el.placeholder}" id="${el.id}" class="${el.className.substring(0,40)}"`);
  });

  // 2. Selects
  const selects = S('select').filter(vis);
  console.log(`\n%c[SELECTS] ${selects.length} dijumpai:`, 'color:#9C27B0;font-weight:bold');
  selects.forEach((el, i) => {
    const opts = Array.from(el.options).map(o => `"${o.text}"`).join(', ');
    console.log(`  [${i}] name="${el.name}" id="${el.id}" options=[${opts}]`);
  });

  // 3. Textareas
  const textareas = S('textarea').filter(vis);
  console.log(`\n%c[TEXTAREAS] ${textareas.length} dijumpai:`, 'color:#FF9800;font-weight:bold');
  textareas.forEach((el, i) => {
    console.log(`  [${i}] name="${el.name}" placeholder="${el.placeholder.substring(0,40)}" id="${el.id}"`);
  });

  // 4. Buttons
  const buttons = S('button, [role="button"]').filter(vis);
  console.log(`\n%c[BUTTONS] ${buttons.length} dijumpai:`, 'color:#E91E63;font-weight:bold');
  buttons.forEach((el, i) => {
    const t = el.textContent.trim().substring(0, 40);
    if (t) console.log(`  [${i}] "${t}" type=${el.type||'?'} class="${el.className.substring(0,30)}"`);
  });

  // 5. Custom dropdowns (vue-select, etc.)
  const vueDropdowns = S('.vs__dropdown-toggle, [class*="v-select"], [role="listbox"], [role="combobox"]');
  if (vueDropdowns.length) {
    console.log(`\n%c[VUE DROPDOWNS] ${vueDropdowns.length} dijumpai`, 'color:#00BCD4;font-weight:bold');
    vueDropdowns.forEach((el, i) => console.log(`  [${i}] class="${el.className.substring(0,50)}"`));
  }

  // 6. Framework detection
  console.log('\n%c[FRAMEWORK]', 'color:#607D8B;font-weight:bold');
  const appEl = document.querySelector('#app, [id="app"], [data-app], #__nuxt, #__next');
  if (appEl) {
    if (appEl.__vue__) console.log('  Vue 2 detected');
    else if (appEl.__vue_app__) console.log('  Vue 3 detected');
    else console.log('  #app found but no Vue instance detected');
  }
  if (window.CryptoJS) console.log('  CryptoJS available globally');
  if (window.Vue) console.log('  Vue available globally');
  if (window.axios) console.log('  Axios available globally');

  // 7. Star rating elements
  const stars = S('[class*="star"], [class*="rating"], svg[class*="star"], .fa-star, i[class*="star"]');
  console.log(`\n%c[STARS] ${stars.length} elemen rating dijumpai`, 'color:#FFC107;font-weight:bold');

  console.log('\n%c=== PROBE SELESAI ===', 'color:#4CAF50;font-size:14px;font-weight:bold');
  console.log('Salin output ini dan hantarkan untuk analisis.');
})();
