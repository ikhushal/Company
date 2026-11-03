// Progressive enhancement only: every page works without this script.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FILE_TYPES = ['pdf', 'dwg', 'dxf', 'jpg', 'jpeg', 'png'];

function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

function fileProblem(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return null;
  const badType = files.some((file) => !ALLOWED_FILE_TYPES.includes(file.name.split('.').pop().toLowerCase()));
  if (badType) return input.dataset.errorType;
  const totalMb = files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
  if (totalMb > Number(input.dataset.maxMb)) return input.dataset.errorSize;
  return null;
}

// Validation rules are read from the markup: `required`, `type="email"`,
// `data-required` on fieldsets, `data-max-mb` on file inputs, and
// `data-error-*` messages.
function validateForm(form) {
  const errors = [];

  form.querySelectorAll('.input[required], .textarea[required]').forEach((control) => {
    const value = control.value.trim();
    if (!value) {
      errors.push({ control, target: control, message: control.dataset.errorRequired });
    } else if (control.type === 'email' && !EMAIL_PATTERN.test(value)) {
      errors.push({ control, target: control, message: control.dataset.errorInvalid });
    }
  });

  form.querySelectorAll('fieldset[data-required]').forEach((fieldset) => {
    if (!fieldset.querySelector('input:checked')) {
      errors.push({ control: fieldset, target: fieldset.querySelector('input'), message: fieldset.dataset.errorRequired });
    }
  });

  form.querySelectorAll('input[type="file"][data-max-mb]').forEach((input) => {
    const message = fileProblem(input);
    if (message) errors.push({ control: input, target: input, message });
  });

  // Report errors in the order the fields appear on the page.
  const fields = Array.from(form.querySelectorAll('.field'));
  const position = (node) => fields.indexOf(node.closest('.field'));
  return errors.sort((a, b) => position(a.control) - position(b.control));
}

function clearErrors(form) {
  form.querySelectorAll('.field--error').forEach((field) => field.classList.remove('field--error'));
  form.querySelectorAll('.error-message').forEach((message) => message.remove());
  form.querySelectorAll('[aria-invalid]').forEach((control) => control.removeAttribute('aria-invalid'));
  form.querySelectorAll('[aria-describedby]').forEach((control) => {
    const describedBy = (control.getAttribute('aria-describedby') || '')
      .split(' ')
      .filter((id) => id && !id.endsWith('-error'))
      .join(' ');
    if (describedBy) control.setAttribute('aria-describedby', describedBy);
    else control.removeAttribute('aria-describedby');
  });
}

function showErrors(form, errors) {
  const summary = form.querySelector('[data-error-summary]');
  const list = summary.querySelector('ul');
  list.replaceChildren();

  errors.forEach(({ control, target, message }) => {
    const field = control.closest('.field');
    const id = `${target.id}-error`;
    field.classList.add('field--error');

    const error = document.createElement('p');
    error.className = 'error-message';
    error.id = id;
    const prefix = document.createElement('span');
    prefix.className = 'visually-hidden';
    prefix.textContent = 'Error: ';
    error.append(prefix, message);

    const anchor = field.querySelector('.input, .textarea, .select, .file-input, .choices');
    anchor.before(error);

    const described = control.matches('fieldset') ? control : target;
    described.setAttribute('aria-describedby', `${described.getAttribute('aria-describedby') || ''} ${id}`.trim());
    if (!control.matches('fieldset')) target.setAttribute('aria-invalid', 'true');

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${target.id}`;
    link.textContent = message;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      target.focus();
    });
    item.append(link);
    list.append(item);
  });

  summary.hidden = false;
  summary.focus();
}

function setStatus(form, message, kind) {
  const status = form.querySelector('[data-form-status]');
  status.className = `form-status${kind === 'info' ? ' form-status--info' : ''}`;
  status.textContent = message;
}

function prefillServices(form) {
  const service = new URLSearchParams(window.location.search).get('service');
  if (!service) return;
  const option = form.querySelector(`input[name="service"][value="${CSS.escape(service)}"]`);
  if (option) option.checked = true;
}

function enhanceForm(form) {
  const success = form.nextElementSibling?.matches('[data-form-success]') ? form.nextElementSibling : null;
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.textContent;
  const fallbackEmail = form.dataset.fallbackEmail;

  form.noValidate = true;
  prefillServices(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);
    setStatus(form, '');
    form.querySelector('[data-error-summary]').hidden = true;

    const errors = validateForm(form);
    if (errors.length) {
      showErrors(form, errors);
      return;
    }

    if (form.dataset.preview === 'true') {
      setStatus(form, 'Preview only: this form is not connected yet, so nothing has been sent.', 'info');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Unexpected response: ${response.status}`);

      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch (error) {
      setStatus(
        form,
        `Sorry, your message could not be sent. Please try again, or email us at ${fallbackEmail}.`,
      );
      submit.disabled = false;
      submit.textContent = submitLabel;
    }
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

// Fades sections in as they scroll into view. Anything already on screen at
// load is left alone, so nothing visible ever disappears and fades back in.
const REVEAL_TARGETS = [
  '.section-header', '.card', '.credentials > li', '.features > li', '.steps > li',
  '.faq', '.sheet', '.project-card', '.contact-option', '.table-wrap', '.definitions > div',
  '.switcher', '.cta-band__inner', '.empty-state', '.quantities', '.note', '.panel',
].join(', ');

function initReveal() {
  if (prefersReducedMotion) return;

  let pending = Array.from(document.querySelectorAll(REVEAL_TARGETS)).filter(
    (el) => !el.closest('.hero') && el.getBoundingClientRect().top > window.innerHeight,
  );
  if (!pending.length) return;

  pending.forEach((el) => {
    // Stagger siblings, such as cards in a row, by up to 320ms.
    const siblings = Array.from(el.parentElement.children).filter((child) => pending.includes(child));
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 4) * 80}ms`);
    el.setAttribute('data-reveal', '');
  });

  const show = (el) => el.classList.add('is-visible');
  let lastCheck = 0;
  let trailing = null;
  const check = () => {
    lastCheck = Date.now();
    const trigger = window.innerHeight * 0.92;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < trigger) {
        show(el);
        return false;
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };
  // At most one check per 100ms while scrolling, plus one after scrolling stops.
  const onScroll = () => {
    window.clearTimeout(trailing);
    if (Date.now() - lastCheck > 100) check();
    trailing = window.setTimeout(check, 120);
  };

  document.documentElement.classList.add('reveal-ready');
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Covers a scroll position restored by the browser before any scroll event.
  window.addEventListener('load', check);
}

// Accessible tabs (WAI-ARIA tabs pattern). Without JavaScript every panel is shown.
function initTabs(root) {
  const tablist = root.querySelector('[data-tablist]');
  const tabs = Array.from(root.querySelectorAll('[data-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-panel]'));
  if (!tablist || !tabs.length) return;

  tablist.setAttribute('role', 'tablist');
  tablist.hidden = false;
  root.classList.add('is-enhanced');

  const select = (tab, focus) => {
    tabs.forEach((other) => {
      const selected = other === tab;
      other.setAttribute('aria-selected', String(selected));
      other.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(other.dataset.tab);
      panel.hidden = !selected;
      if (selected && !prefersReducedMotion) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth; // restart the entrance animation
        panel.classList.add('is-entering');
      }
    });
    if (focus) tab.focus();
  };

  tabs.forEach((tab) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.tab);
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(tab);
      const moves = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      let next = null;
      if (event.key in moves) next = tabs[(index + moves[event.key] + tabs.length) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        select(next, true);
      }
    });
  });

  panels.forEach((panel) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs.find((tab) => tab.dataset.tab === panel.id).id);
    panel.tabIndex = 0;
  });

  select(tabs[0], false);
}

function formatSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Lists chosen files with sizes and a running total against the upload limit.
function initFileLists() {
  document.querySelectorAll('input[type="file"]').forEach((input) => {
    const list = input.parentElement.querySelector('[data-file-list]');
    if (!list) return;
    input.addEventListener('change', () => {
      list.replaceChildren();
      const files = Array.from(input.files || []);
      if (!files.length) return;
      files.forEach((file) => {
        const item = document.createElement('li');
        const size = document.createElement('span');
        size.className = 'file-list__size';
        size.textContent = formatSize(file.size);
        item.append(file.name, size);
        list.append(item);
      });
      const total = document.createElement('li');
      total.className = 'file-list__total';
      const totalSize = document.createElement('span');
      totalSize.className = 'file-list__size';
      totalSize.textContent = `${formatSize(files.reduce((sum, file) => sum + file.size, 0))} of ${input.dataset.maxMb} MB`;
      total.append(`${files.length} file${files.length === 1 ? '' : 's'} selected`, totalSize);
      list.append(total);
    });
  });
}

initNavigation();
initHeaderShadow();
document.querySelectorAll('[data-enquiry-form]').forEach(enhanceForm);
document.querySelectorAll('[data-tabs]').forEach(initTabs);
initFileLists();
initReveal();
