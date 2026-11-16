// Menus déroulants : ouverture au clic (utile sur téléphone), au survol sur ordinateur (géré en CSS)
document.querySelectorAll('.drop-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    var menu = btn.parentElement;
    var wasOpen = menu.classList.contains('open');
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    if (!wasOpen) { menu.classList.add('open'); }
    btn.setAttribute('aria-expanded', String(!wasOpen));
    e.stopPropagation();
  });
});

document.addEventListener('click', function () {
  document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
});
