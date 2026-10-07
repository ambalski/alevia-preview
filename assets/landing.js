(() => {
  'use strict';

  const root = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.alevia-menu-toggle');
  const navigation = document.querySelector('#site-navigation');
  const desktop = window.matchMedia('(min-width: 960px)');

  if (header && menuButton && navigation) {
    root.classList.add('has-js');
    menuButton.hidden = false;

    function setMenu(open, returnFocus = false) {
      header.classList.toggle('is-menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.querySelector('.menu-label').textContent = open ? 'Закрыть меню' : 'Открыть меню';
      if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false, true);
      }
    });

    document.addEventListener('click', (event) => {
      if (!header.contains(event.target)) setMenu(false);
    });

    header.addEventListener('focusout', (event) => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
    });

    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      setMenu(false);
      const target = document.querySelector(link.getAttribute('href'));
      if (target && !desktop.matches) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });

    desktop.addEventListener('change', () => setMenu(false));
  }

  const form = document.querySelector('#visit-form');
  const phone = document.querySelector('#visit-phone');
  const button = document.querySelector('#visit-submit');
  const error = document.querySelector('#phone-error');
  const status = document.querySelector('#form-status');

  if (!form || !phone || !button || !error || !status) return;

  function clearError() {
    phone.setAttribute('aria-invalid', 'false');
    error.hidden = true;
    error.textContent = '';
    status.hidden = true;
    status.textContent = '';
  }

  function demonstrateForm() {
    clearError();
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, '');
    const validCharacters = /^\+?[\d\s()\-]+$/.test(value);
    if (!validCharacters || digits.length < 10 || digits.length > 15) {
      phone.setAttribute('aria-invalid', 'true');
      error.textContent = 'Проверьте номер телефона';
      error.hidden = false;
      phone.focus();
      return;
    }
    status.textContent = 'Это демонстрация формы. Номер никуда не отправлен.';
    status.hidden = false;
  }

  // The design preview does not send requests or store entered phone numbers.
  phone.addEventListener('input', clearError);
  button.addEventListener('click', demonstrateForm);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    demonstrateForm();
  });
})();
