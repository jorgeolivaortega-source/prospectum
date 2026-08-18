(function () {
  const carousel = document.querySelector('[data-testimonials-carousel]');
  if (!carousel) return;

  const viewport = carousel.querySelector('[data-testimonials-viewport]');
  const track = carousel.querySelector('[data-testimonials-track]');
  const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
  const prev = carousel.querySelector('[data-testimonials-prev]');
  const next = carousel.querySelector('[data-testimonials-next]');
  const status = carousel.querySelector('[data-testimonials-status]');
  if (!viewport || !track || !cards.length) return;

  let index = 0;

  function visibleCount() {
    if (window.matchMedia('(max-width: 580px)').matches) return 1;
    if (window.matchMedia('(max-width: 900px)').matches) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function updateDesktop() {
    if (window.matchMedia('(max-width: 580px)').matches) {
      track.style.transform = 'none';
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      return;
    }

    index = Math.min(index, maxIndex());
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index >= maxIndex();
    updateStatus(index + 1);
  }

  function updateStatus(active) {
    if (!status) return;
    status.textContent = `${String(active).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  if (prev) {
    prev.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      updateDesktop();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      index = Math.min(maxIndex(), index + 1);
      updateDesktop();
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateDesktop, 100);
  });

  if (viewport) {
    viewport.addEventListener('scroll', () => {
      if (!window.matchMedia('(max-width: 580px)').matches) return;
      const firstCard = cards[0];
      const step = firstCard.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || '0');
      const active = Math.min(cards.length, Math.max(1, Math.round(viewport.scrollLeft / step) + 1));
      updateStatus(active);
    }, { passive: true });
  }

  updateStatus(1);
  updateDesktop();
})();
