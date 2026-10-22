const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.classList.toggle('is-open', open);
});

mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}));

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const lines = [
    'Hello Global Smile Care,', '',
    'I would like to discuss dental care for our residential care centre.', '',
    `Name: ${form.get('name') || ''}`,
    `Role: ${form.get('role') || ''}`,
    `Organisation: ${form.get('organisation') || ''}`,
    `Work email: ${form.get('email') || ''}`,
    `Telephone: ${form.get('phone') || ''}`, '',
    'How can you help?',
    `${form.get('message') || 'I would like to arrange an introductory conversation.'}`
  ];
  window.location.href = `mailto:info@globalsmilecare.be?subject=${encodeURIComponent('Care-centre dental service enquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
});
