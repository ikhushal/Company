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

initNavigation();
document.querySelectorAll('[data-enquiry-form]').forEach(enhanceForm);
