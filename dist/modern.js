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
