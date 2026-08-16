(function () {
  // BRAND RULE: usar exclusivamente los archivos maestros oficiales de Prospectum Academy.
  // No redibujar, no sustituir por texto, no recolorear.
  const logoColor = 'https://lh3.googleusercontent.com/d/1juMaVsFDKG-3K57DN4DkeiS3ccTXpISk=w1200';
  const logoWhite = 'https://lh3.googleusercontent.com/d/11tCy8A2R8cQESVlTNwNSUvfQxvMrmWSc=w1200';

  document.querySelectorAll('img.brand-logo').forEach((img) => {
    const original = img.getAttribute('src') || '';
    img.src = original.includes('white') ? logoWhite : logoColor;
  });

  // Ajuste visual solicitado: títulos Instrument Sans Medium, sin efecto Bold.
  const currentScript = document.currentScript;
  if (currentScript) {
    const tuningHref = new URL('../css/visual-tuning-v1.2.css', currentScript.src).href;
    if (!document.querySelector(`link[href="${tuningHref}"]`)) {
      const tuning = document.createElement('link');
      tuning.rel = 'stylesheet';
      tuning.href = tuningHref;
      document.head.appendChild(tuning);
    }
  }

  // El hosting de preview no siempre resuelve índices de directorio automáticamente.
  // Preserva la arquitectura aprobada y mantiene navegables las cuatro vistas.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const parts = href.split('#');
    let path = parts[0];
    const hash = parts[1] ? '#' + parts[1] : '';
    if (path === './' || path === '../') path += 'index.html';
    else if (path.endsWith('/')) path += 'index.html';
    link.setAttribute('href', path + hash);
  });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-track]');
    if (!target) return;
    window.dataLayer.push({
      event: 'academy_click',
      academy_action: target.dataset.track,
      academy_label: target.textContent.trim(),
      academy_path: window.location.pathname
    });
  });

  const form = document.querySelector('[data-application-form]');
  if (form) {
    const error = form.querySelector('[data-form-error]');
    const content = form.querySelector('[data-form-content]');
    const success = form.querySelector('[data-form-success]');
    const params = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = params.get(key) || '';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (error) error.textContent = 'Revisa los campos obligatorios antes de enviar.';
        return;
      }
      if (error) error.textContent = '';
      window.dataLayer.push({
        event: 'academy_form_submit_success',
        form_name: 'postulacion_ruta_sdr',
        profile: new FormData(form).get('perfil_ruta_sdr') || '',
        academy_path: window.location.pathname
      });
      if (content && success) {
        content.classList.add('is-hidden');
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
        window.scrollTo({ top: Math.max(0, form.offsetTop - 110), behavior: 'smooth' });
      }
    });
  }
})();
