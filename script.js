// Apparition en douceur des blocs au défilement
var items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
} else {
  items.forEach(function (el) { el.classList.add('visible'); });
}

// Lien du menu actif selon la section affichée
var links = document.querySelectorAll('.menu a');
var sections = Array.prototype.map.call(links, function (a) {
  return document.querySelector(a.getAttribute('href'));
});
function updateActive() {
  var pos = window.scrollY + 120;
  var current = 0;
  sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) current = i; });
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) current = sections.length - 1;
  links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
}
window.addEventListener('scroll', updateActive, { passive: true });
updateActive();

// Menu mobile
var toggle = document.querySelector('.menu-toggle');
var menu = document.querySelector('.menu');
toggle.addEventListener('click', function () {
  var open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.forEach(function (a) {
  a.addEventListener('click', function () {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
