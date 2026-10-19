/* Vaultline Systems — interactions. Catalogue produits : modifiez PRODUCTS ci-dessous. */
(function () {
  'use strict';
  var CONTACT_EMAIL = 'contact@vaultline-systems.com';
  var PRODUCTS = [
    { cat: 'especes', tag: 'Espèces', name: 'Compteuse de billets CX-40', img: 'img/counter.webp', feats: ['Comptage 1 500 billets/min', 'Détection UV, MG et IR', 'Valorisation multi-devises'] },
    { cat: 'especes', tag: 'Espèces', name: 'Trieuse de billets SR-2', icon: 'i-cash', feats: ['Tri qualité et orientation', '2 poches + rejet', 'Connexion au back-office'] },
    { cat: 'especes', tag: 'Espèces', name: 'Compteuse de pièces CP-8', icon: 'i-cash', feats: ['3 000 pièces/min', 'Mise en sachet automatique', 'Rapport par lot'] },
    { cat: 'gab', tag: 'GAB', name: 'GAB de façade FX-56', icon: 'i-atm', feats: ['Retrait et dépôt', 'Écran tactile 15"', 'Conforme EMV et PCI'] },
    { cat: 'gab', tag: 'GAB', name: 'GAB d’intérieur IN-30', icon: 'i-atm', feats: ['Format compact', 'Recyclage des billets', 'Supervision à distance'] },
    { cat: 'tpe', tag: 'TPE', name: 'Terminal mobile M-10', icon: 'i-tpe', feats: ['Sans contact & puce', '4G / Wi-Fi', 'Imprimante intégrée'] },
    { cat: 'tpe', tag: 'TPE', name: 'Terminal de comptoir C-20', icon: 'i-card', feats: ['PIN pad déporté', 'Certifié réseau national', 'Mises à jour à distance'] },
    { cat: 'securite', tag: 'Sécurité', name: 'Coffre-fort certifié A2', icon: 'i-safe', feats: ['Classe de résistance élevée', 'Serrure électronique', 'Pose et ancrage inclus'] },
    { cat: 'securite', tag: 'Sécurité', name: 'Contrôle d’accès biométrique', icon: 'i-shield', feats: ['Empreinte + badge', 'Journal des accès', 'Intégration vidéo'] },
    { cat: 'bornes', tag: 'Bornes', name: 'Borne libre-service K-22', icon: 'i-kiosk', feats: ['Écran 22" tactile', 'Lecteur de cartes', 'Impression de reçus'] }
  ];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#year').textContent = new Date().getFullYear();

  /* menu */
  var nav = $('#nav'), burger = $('.burger');
  function setMenu(o) { nav.classList.toggle('is-open', o); burger.setAttribute('aria-expanded', String(o)); burger.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var links = $$('.nav a[href^="#"]:not(.btn)'), top = $('.to-top');
  function onScroll() {
    top.classList.toggle('is-on', scrollY > 800);
    var cur = null; links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < 140) cur = a; });
    links.forEach(function (a) { a.classList.toggle('is-active', a === cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* compteurs */
  function count(el) {
    var target = parseFloat(el.getAttribute('data-count')), dec = +(el.getAttribute('data-dec') || 0), t0 = performance.now(), dur = reduce ? 0 : 1800;
    (function f(now) { var p = dur ? Math.min(1, (now - t0) / dur) : 1, v = target * (1 - Math.pow(1 - p, 3)); el.textContent = v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(f); })(t0);
  }

  /* reveal + compteurs */
  var io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (!x.isIntersecting) return; if (x.target.hasAttribute('data-count')) count(x.target); else x.target.classList.add('is-in'); io.unobserve(x.target); });
  }, { threshold: .15 }) : null;
  function watch(els) { els.forEach(function (el) { if (io) io.observe(el); else if (el.hasAttribute('data-count')) count(el); else el.classList.add('is-in'); }); }
  watch($$('[data-reveal], [data-count]'));

  /* lueur qui suit la souris sur les cartes solutions */
  $$('.sol').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* catalogue */
  var grid = $('#prodGrid');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(f) {
    grid.innerHTML = PRODUCTS.filter(function (p) { return f === 'all' || p.cat === f; }).map(function (p, i) {
      var vis = p.img ? '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy">' : '<svg aria-hidden="true"><use href="#' + p.icon + '"/></svg>';
      return '<article class="prod" style="animation-delay:' + (i * 50) + 'ms"><div class="prod__vis">' + vis + '<span class="prod__tag">' + esc(p.tag) + '</span></div>' +
        '<div class="prod__body"><h3>' + esc(p.name) + '</h3><ul>' + p.feats.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<div class="prod__foot"><span>Sur devis</span><a href="#contact" data-prod="' + esc(p.name) + '">Demander →</a></div></div></article>';
    }).join('');
  }
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      render(b.getAttribute('data-f'));
    });
  });
  grid.addEventListener('click', function (e) {
    var a = e.target.closest('[data-prod]'); if (!a) return;
    var f = $('#form'); f.objet.value = 'Demande de devis'; f.message.value = 'Bonjour, je souhaite un devis pour : ' + a.getAttribute('data-prod') + '.\nQuantité : \n';
  });
  render('all');

  /* formulaire */
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, msg = $('.form__msg', f), bad = $$('[required]', f).filter(function (i) { return !i.checkValidity(); });
    $$('.is-bad', f).forEach(function (i) { i.classList.remove('is-bad'); });
    if (bad.length) { bad.forEach(function (i) { i.classList.add('is-bad'); }); bad[0].focus(); return; }
    msg.textContent = 'Merci ! Votre messagerie va s’ouvrir pour envoyer la demande.';
    location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(f.objet.value + ' — ' + (f.societe.value || f.nom.value)) +
      '&body=' + encodeURIComponent(f.message.value + '\n\n' + f.nom.value + ' · ' + f.societe.value + ' · ' + f.email.value + ' · ' + f.tel.value);
  });
})();
