/* Sweet Escape — bandeau de consentement cookies + Google Consent Mode v2
   Le consentement par defaut est "denied" (defini dans le <head> de chaque page).
   Concerne Google Analytics 4 (G-FXSW1YGC34) et Google Ads (AW-16595546249).
   Un lien href="#cookies" rouvre le bandeau pour modifier le choix. */
(function () {
  var STORAGE_KEY = 'se_consent';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  function readChoice() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }
  function applyConsent(state) {
    window.gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
  }

  function build() {
    if (document.getElementById('se-consent')) return;

    var bar = document.createElement('div');
    bar.id = 'se-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Consentement aux cookies');
    bar.style.cssText = [
      'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:99999',
      'background:#111', 'color:#fff', 'padding:18px 22px',
      'font-family:Arial, Helvetica, sans-serif', 'font-size:14px',
      'line-height:1.6', 'display:flex', 'flex-wrap:wrap',
      'align-items:center', 'justify-content:center', 'gap:16px',
      'box-shadow:0 -2px 14px rgba(0,0,0,0.35)'
    ].join(';');

    var text = document.createElement('div');
    text.style.cssText = 'flex:1 1 380px; min-width:250px; max-width:780px;';
    text.innerHTML = 'Nous utilisons des cookies pour mesurer l\'audience du site et l\'efficacite de nos annonces. ' +
      'Ils ne sont deposes qu\'avec votre accord. ' +
      '<a href="/confidentialite" style="color:#fff; text-decoration:underline;">En savoir plus</a>.';

    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex; gap:10px; flex:0 0 auto;';

    function makeBtn(label, primary) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = [
        'border:1px solid #fff', 'padding:10px 24px', 'font-size:14px',
        'font-weight:600', 'cursor:pointer', 'border-radius:3px',
        'font-family:inherit',
        primary ? 'background:#fff' : 'background:transparent',
        primary ? 'color:#111' : 'color:#fff'
      ].join(';');
      return b;
    }

    var refuse = makeBtn('Refuser', false);
    var accept = makeBtn('Accepter', true);

    function close(state) {
      saveChoice(state);
      applyConsent(state);
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }

    refuse.addEventListener('click', function () { close('denied'); });
    accept.addEventListener('click', function () { close('granted'); });

    btns.appendChild(refuse);
    btns.appendChild(accept);
    bar.appendChild(text);
    bar.appendChild(btns);
    document.body.appendChild(bar);
  }

  function init() {
    // lien "Parametres des cookies" -> rouvre le bandeau
    var links = document.querySelectorAll('a[href="#cookies"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        build();
      });
    }

    var choice = readChoice();
    if (choice === 'granted' || choice === 'denied') {
      applyConsent(choice);
      return;
    }
    build();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
