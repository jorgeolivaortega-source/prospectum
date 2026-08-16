(function () {
  const logoColor = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120"><rect width="520" height="120" fill="none"/><text x="0" y="66" font-family="Arial,Helvetica,sans-serif" font-size="56" font-weight="700" fill="#584771" letter-spacing="-1">PROSPECTUM</text><text x="2" y="104" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="#0EB0CC" letter-spacing="7">ACADEMY</text></svg>`;
  const logoWhite = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120"><rect width="520" height="120" fill="none"/><text x="0" y="66" font-family="Arial,Helvetica,sans-serif" font-size="56" font-weight="700" fill="#FFFFFF" letter-spacing="-1">PROSPECTUM</text><text x="2" y="104" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" fill="#0EB0CC" letter-spacing="7">ACADEMY</text></svg>`;

  document.querySelectorAll('img.brand-logo').forEach((img) => {
    const original = img.getAttribute('src') || '';
    const svg = original.includes('white') ? logoWhite : logoColor;
    img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  });

  // Preview hosting does not resolve directory indexes automatically.
  // Preserve the approved route architecture while making every link navigable.
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
