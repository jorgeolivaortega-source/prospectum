(function () {
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
