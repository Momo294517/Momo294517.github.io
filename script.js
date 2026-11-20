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

// Fond animé : réseau de points reliés entre eux (clin d'œil aux réseaux)
(function () {
  var canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = getComputedStyle(document.documentElement);
  var rgb = css.getPropertyValue('--accent-rgb').trim() || '52, 211, 153';
  var rgb2 = css.getPropertyValue('--accent2-rgb').trim() || '163, 230, 53';
  var w, h, dpr, pts = [], mouse = { x: -999, y: -999 };
  var LINK = 150;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(90, Math.round(w * h / 15000));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8, alt: Math.random() < 0.18
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (var k = i + 1; k < pts.length; k++) {
        var q = pts[k], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.22 * (1 - d / LINK)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
      if (md < 170) {
        ctx.strokeStyle = 'rgba(' + rgb2 + ',' + (0.5 * (1 - md / 170)).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(' + (p.alt ? rgb2 : rgb) + ',0.75)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseout', function () { mouse.x = mouse.y = -999; });
  window.addEventListener('resize', function () { resize(); if (reduce) draw(); });
  resize();
  draw();
})();
