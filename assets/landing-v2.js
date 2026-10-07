(() => {
  'use strict';

  const hero = document.querySelector('.hero--video');
  const video = document.querySelector('#hero-video');
  const button = document.querySelector('#hero-video-toggle');
  if (!hero || !video || !button) return;

  const label = button.querySelector('.video-toggle-label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let requestedPlay = !reducedMotion.matches && !saveData;
  let inView = true;
  let attempt = 0;

  video.muted = true;
  video.defaultMuted = true;
  button.hidden = false;

  function updateButton() {
    const playing = !video.paused && !video.ended;
    button.classList.toggle('is-playing', playing);
    label.textContent = playing ? 'Пауза' : 'Включить видео';
    button.setAttribute('aria-label', playing ? 'Приостановить фоновое видео' : 'Воспроизвести фоновое видео');
  }

  function loadVideo() {
    if (video.hasAttribute('src')) return;
    const mobile = window.matchMedia('(max-width: 639px)').matches;
    video.src = mobile ? video.dataset.mobileSrc : video.dataset.desktopSrc;
  }

  async function synchronize() {
    const currentAttempt = ++attempt;
    if (!requestedPlay || !inView || document.hidden) {
      video.pause();
      updateButton();
      return;
    }
    loadVideo();
    try {
      await video.play();
      if (currentAttempt !== attempt || !requestedPlay || !inView || document.hidden) video.pause();
    } catch {
      // The poster remains visible when the browser blocks autoplay or the file cannot load.
    }
    updateButton();
  }

  button.addEventListener('click', () => {
    requestedPlay = video.paused;
    synchronize();
  });
  video.addEventListener('playing', () => {
    hero.classList.add('has-video-frame');
    updateButton();
  });
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => {
    hero.classList.remove('has-video-frame');
    updateButton();
  });
  reducedMotion.addEventListener('change', () => {
    requestedPlay = !reducedMotion.matches && !saveData;
    synchronize();
  });
  document.addEventListener('visibilitychange', synchronize);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      synchronize();
    }, {threshold: 0});
    observer.observe(hero);
  } else {
    synchronize();
  }
  updateButton();
})();
