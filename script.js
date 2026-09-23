(function(){
  // Theme toggle: light/dark, persisted in localStorage, falls back to
  // the visitor's OS preference (style.css already handles that fallback
  // via prefers-color-scheme when no explicit choice has been made).
  (function(){
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    function storedTheme(){
      try{ return localStorage.getItem('kalakari_theme'); }catch(e){ return null; }
    }
    function currentTheme(){
      var stored = storedTheme();
      if(stored === 'light' || stored === 'dark') return stored;
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    function applyTheme(theme, persist){
      root.setAttribute('data-theme', theme);
      if(btn){
        btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      }
      if(persist){ try{ localStorage.setItem('kalakari_theme', theme); }catch(e){} }
    }
    applyTheme(currentTheme(), false);
    if(btn){
      btn.addEventListener('click', function(){
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
      });
    }
  })();

  var TODA_IMG_RUNNER = "images/toda_runner.jpg";
  var TODA_IMG_CUSHION = "images/toda_cushion.jpg";
  var TODA_IMG_SHAWL = "images/toda_shawl2.jpg";
  var DHOKRA_IMG_ELEPHANT_DIYA = "images/dhokra_elephant_diya.jpg";
  var DHOKRA_IMG_DEER_TEALIGHTS = "images/dhokra_deer_tealights.jpg";
  var DHOKRA_IMG_OWL_NECKLACE = "images/dhokra_owl_necklace.jpg";
  var TC_IMG_HORSE_PAIR = "images/tc_horse_pair.jpg";
  var TC_IMG_VASE = "images/tc_vase.jpg";
  var TC_IMG_TRIBAL_COUPLE = "images/tc_tribal_couple.jpg";
  var ND_IMG_PEACOCK_RUG = "images/nd_peacock_rug.jpg";
  var ND_IMG_MANDALA_ROUND = "images/nd_mandala_round.jpg";
  var ND_IMG_RUNNER = "images/nd_runner.jpg";
  var SJ_IMG_TREE_FRAME = "images/sj_tree_frame.jpg";
  var SJ_IMG_LAMP_SHADE = "images/sj_lamp_shade.jpg";
  var SJ_IMG_KRISHNA_SWING = "images/sj_krishna_swing.jpg";
  var products = {
    terracotta: [
      {n:"Terracotta Horse Pair (Bankura Style)", p:"₹899", d:"Hand-shaped duo with the iconic long-necked form.", img: TC_IMG_HORSE_PAIR},
      {n:"Hand-painted Terracotta Vase", p:"₹649", d:"Folk-motif face design, painted on natural clay.", img: TC_IMG_VASE},
      {n:"Terracotta Tribal Couple Figurines", p:"₹1,199", d:"Hand-painted pair with traditional dress detailing.", img: TC_IMG_TRIBAL_COUPLE}
    ],
    toda: [
      {n:"Toda Embroidered Table Runner (Set of 3)", p:"₹1,199", d:"Fringed cotton runners with a bold central pukhoor band.", img: TODA_IMG_RUNNER},
      {n:"Toda Embroidered Cushion Cover", p:"₹649", d:"Red, black and cream panels with button-front closing.", img: TODA_IMG_CUSHION},
      {n:"Toda Ceremonial Shawl", p:"₹1,499", d:"Heavier drape with dense red-and-black embroidery, worn draped.", img: TODA_IMG_SHAWL}
    ],
    dhokra: [
      {n:"Dhokra Elephant Diya Stand", p:"₹700", d:"Lost-wax cast elephant base holding a brass lamp stem.", img: DHOKRA_IMG_ELEPHANT_DIYA},
      {n:"Dhokra Deer Tea-Light Holders (Set of 2)", p:"₹899", d:"Pair of deer-form holders on a wooden base.", img: DHOKRA_IMG_DEER_TEALIGHTS},
      {n:"Dhokra Owl Pendant Necklace", p:"₹1,000", d:"Owl motif pendant on a hand-knotted stone-bead strand.", img: DHOKRA_IMG_OWL_NECKLACE}
    ],
    namda: [
      {n:"Namda Peacock & Tree Rug", p:"₹1,499", d:"Rectangular felted rug with a bold peacock-and-tree motif.", img: ND_IMG_PEACOCK_RUG},
      {n:"Namda Floral Mandala Rug (Round)", p:"₹1,299", d:"Round rug with a concentric hand-embroidered mandala.", img: ND_IMG_MANDALA_ROUND},
      {n:"Namda Floral Runner Rug", p:"₹1,199", d:"Long-format runner with dense multicolour floral work.", img: ND_IMG_RUNNER}
    ],
    sanjhi: [
      {n:"Sanjhi Tree-of-Life Framed Panel", p:"₹899", d:"Layered paper-cut tree design, framed under glass.", img: SJ_IMG_TREE_FRAME},
      {n:"Sanjhi Hanging Lamp Shade", p:"₹1,199", d:"Cylindrical shade with a pierced village-scene motif.", img: SJ_IMG_LAMP_SHADE},
      {n:"Sanjhi Krishna Swing Panel", p:"₹1,299", d:"Fine hand-cut Radha-Krishna scene under a flowering tree.", img: SJ_IMG_KRISHNA_SWING}
    ]
  };
  var accent = {terracotta:"var(--terracotta)", toda:"var(--toda)", dhokra:"var(--dhokra)", namda:"var(--namda)", sanjhi:"var(--sanjhi)"};

  function iconSvg(craft){
    var c = accent[craft];
    if(craft==="terracotta") return '<svg viewBox="0 0 60 60" width="70%" height="70%"><path d="M18 10h24v8q10 4 10 22c0 16-13 20-22 20s-22-4-22-20c0-18 10-18 10-22z" fill="none" stroke="'+c+'" stroke-width="2.2"/></svg>';
    if(craft==="toda") return '<svg viewBox="0 0 60 60" width="70%" height="70%"><path d="M18 15 l9 9 l-9 9 l9 9 l-9 9" fill="none" stroke="'+c+'" stroke-width="3"/><path d="M40 15 l9 9 l-9 9 l9 9 l-9 9" fill="none" stroke="var(--ink)" stroke-width="3"/></svg>';
    if(craft==="dhokra") return '<svg viewBox="0 0 60 60" width="70%" height="70%"><ellipse cx="30" cy="36" rx="16" ry="11" fill="none" stroke="'+c+'" stroke-width="2.2"/><circle cx="30" cy="14" r="4" fill="none" stroke="'+c+'" stroke-width="2.2"/><path d="M30 18v8" stroke="'+c+'" stroke-width="2.2"/></svg>';
    if(craft==="namda") return '<svg viewBox="0 0 60 60" width="70%" height="70%"><path d="M30 10c8 0 14 10 14 22s-6 22-14 22-14-10-14-22 6-22 14-22z" fill="none" stroke="'+c+'" stroke-width="2.2"/><path d="M30 10v44M18 22c6 4 6 8 12 10M42 22c-6 4-6 8-12 10" stroke="'+c+'" stroke-width="1.6" fill="none"/></svg>';
    if(craft==="sanjhi") return '<svg viewBox="0 0 60 60" width="70%" height="70%"><g fill="none" stroke="'+c+'" stroke-width="1.6"><circle cx="30" cy="30" r="18"/><circle cx="30" cy="30" r="10"/><path d="M30 8 L33 20 L30 30 L27 20 Z"/><path d="M30 52 L33 40 L30 30 L27 40 Z"/><path d="M8 30 L20 27 L30 30 L20 33 Z"/><path d="M52 30 L40 27 L30 30 L40 33 Z"/></g></svg>';
    return '<svg viewBox="0 0 60 60" width="70%" height="70%"><path d="M10 12 L50 42 M10 24 L50 52 M22 10 L50 30" stroke="'+c+'" stroke-width="2" fill="none"/></svg>';
  }

  function buildGrids(){
    Object.keys(products).forEach(function(craft){
      var grid = document.getElementById('grid-'+craft);
      if(!grid) return;
      var c = accent[craft];
      grid.innerHTML = products[craft].map(function(item, idx){
        var thumbInner = item.img
          ? '<img src="'+item.img+'" alt="'+item.n+'" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">'
          : iconSvg(craft);
        var thumbBg = item.img ? 'var(--bg-alt)' : 'color-mix(in srgb, '+c+' 10%, var(--bg-alt))';
        var thumbPad = item.img ? '0' : '20px';
        var thumbAttrs = item.img
          ? ' data-craft="'+craft+'" data-idx="'+idx+'" role="button" tabindex="0" aria-label="View larger photo of '+item.n+'"'
          : '';
        return '<div class="pcard">'
          + '<div class="thumb" style="background:'+thumbBg+'; padding:'+thumbPad+';"'+thumbAttrs+'>'+thumbInner+'</div>'
          + '<div class="pbody">'
          + '<h4>'+item.n+'</h4>'
          + '<p>'+item.d+'</p>'
          + '<span class="price" style="color:'+c+';">'+item.p+'</span>'
          + '<button class="addcart" style="border-color:'+c+'; color:'+c+';" data-craft="'+craft+'" data-idx="'+idx+'">View Artisan &amp; Buy</button>'
          + '</div></div>';
      }).join('');
    });
  }

  // ---------------- Cart data (persisted, product-level) ----------------
  var CART_KEY = 'kalakari_cart_items';
  var FREE_SHIP_THRESHOLD = 1499;
  var cartItems = [];
  try{
    var storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if(Array.isArray(storedCart)) cartItems = storedCart;
  }catch(e){ cartItems = []; }

  function parsePrice(str){ return parseInt(String(str).replace(/[^\d]/g,''), 10) || 0; }
  function formatPrice(n){ return '₹' + n.toLocaleString('en-IN'); }
  function saveCart(){ try{ localStorage.setItem(CART_KEY, JSON.stringify(cartItems)); }catch(e){} }
  function cartCount(){ return cartItems.reduce(function(sum, it){ return sum + it.qty; }, 0); }
  function cartSubtotal(){ return cartItems.reduce(function(sum, it){ return sum + parsePrice(it.p) * it.qty; }, 0); }

  var cartCountEl = document.getElementById('cartCount');
  function renderCartBadge(){ if(cartCountEl) cartCountEl.textContent = cartCount(); }
  renderCartBadge();

  window.addToCart = function(craft, idx){
    var item = products[craft] && products[craft][idx];
    if(!item) return;
    var key = craft + '-' + idx;
    var existing = cartItems.filter(function(it){ return it.key === key; })[0];
    if(existing){ existing.qty += 1; }
    else{ cartItems.push({ key:key, craft:craft, idx:idx, n:item.n, p:item.p, img:item.img||'', qty:1 }); }
    saveCart();
    renderCartBadge();
    renderCartDrawer();
    showToast('Added "'+item.n+'" to cart');
    openCartDrawer(cartBtnEl);
  };

  function changeQty(key, delta){
    var it = cartItems.filter(function(x){ return x.key === key; })[0];
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0) cartItems = cartItems.filter(function(x){ return x.key !== key; });
    saveCart();
    renderCartBadge();
    renderCartDrawer();
  }
  function removeFromCart(key){
    cartItems = cartItems.filter(function(x){ return x.key !== key; });
    saveCart();
    renderCartBadge();
    renderCartDrawer();
  }

  // Craft-level context shown in the artisan modal
  var craftInfo = {
    terracotta: { label:"Terracotta", region:"Rajasthan · West Bengal · Gujarat · UP", artisan:"Made by small family workshops across regional clusters like Molela, Bankura, Gorakhpur, Alwar and Khavda — we haven't sourced from one named workshop yet.", helps:"Buying direct supports the family workshops still hand-shaping and open-firing terracotta, rather than factory slip-cast replicas." },
    toda: { label:"Toda Embroidery", region:"Nilgiri Hills, Tamil Nadu", artisan:"Made by Toda women of the Nilgiris using counted-thread pukhoor embroidery — a skill taught only within the community, mother to daughter.", helps:"Buying direct puts more of the price in the embroiderer's hands than the usual cooperative-to-retail chain, where field reports show makers keep only a small share." },
    dhokra: { label:"Dhokra", region:"Chhattisgarh · Odisha · West Bengal · Jharkhand", artisan:"Cast by artisans from the Ghadwa and Dhokra Damar communities using lost-wax casting — we haven't sourced from one named workshop yet.", helps:"Buying direct supports the slow, fuel-heavy lost-wax process over faster casting shortcuts that skip it." },
    namda: { label:"Namda Craft", region:"Kashmir · Kutch, Gujarat", artisan:"Felted and embroidered by artisans in Gagodar and Mundra, Kachchh, supported by the crafts organisation Khamir.", helps:"Only four Namda practitioners are known to still be active in Kachchh — buying direct helps keep that small, specific skill set economically viable." },
    sanjhi: { label:"Sanjhi", region:"Mathura & Vrindavan, Uttar Pradesh", artisan:"Hand-cut by a small number of families, including artisans documented in Mathura and Alwar — we haven't sourced from one named workshop yet.", helps:"Sanjhi is formally listed as an endangered craft by the Government of India — buying direct supports one of very few people who can still cut a stencil this fine." }
  };

  // ---------------- Generic focus-trap helpers (shared by modal, cart drawer & lightbox) ----------------
  var activeOverlayEl = null;
  var activeCloseFn = null;
  function getFocusable(container){
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
    );
  }
  function trapFocus(container, e){
    var focusable = getFocusable(container);
    if(!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', function(e){
    if(!activeOverlayEl) return;
    if(e.key === 'Escape'){ if(activeCloseFn) activeCloseFn(); return; }
    if(e.key === 'Tab') trapFocus(activeOverlayEl, e);
  });
  function refreshScrollLock(){
    var locked = (modalOverlay && modalOverlay.classList.contains('show'))
      || (cartOverlay && cartOverlay.classList.contains('show'))
      || (lightboxOverlay && lightboxOverlay.classList.contains('show'));
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  // ---------------- Artisan / product modal ----------------
  var modalOverlay, modalCard, modalCardEl, lastFocusedEl;
  function ensureModal(){
    if(modalOverlay) return;
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" aria-label="Close">✕</button><div class="modal-body"></div></div>';
    document.body.appendChild(modalOverlay);
    modalCardEl = modalOverlay.querySelector('.modal-card');
    modalCard = modalOverlay.querySelector('.modal-body');
    modalOverlay.addEventListener('click', function(e){ if(e.target === modalOverlay) closeModal(); });
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
  }
  function closeModal(){
    if(!modalOverlay || !modalOverlay.classList.contains('show')) return;
    modalOverlay.classList.remove('show');
    refreshScrollLock();
    activeOverlayEl = null; activeCloseFn = null;
    if(lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  }
  function openModal(craft, item, triggerEl, idx){
    ensureModal();
    lastFocusedEl = triggerEl || document.activeElement;
    var info = craftInfo[craft] || {};
    var c = accent[craft] || 'var(--terracotta)';
    modalCard.innerHTML =
      '<h3 id="modalTitle">'+item.n+'</h3>'
      + '<div class="modal-price" style="color:'+c+';">'+item.p+'</div>'
      + '<div class="modal-row"><div class="k">Who made this</div><div class="v">'+(info.artisan||'')+'</div></div>'
      + '<div class="modal-row"><div class="k">Where</div><div class="v">'+(info.region||'')+'</div></div>'
      + '<div class="modal-row"><div class="k">Tradition</div><div class="v"><a href="#'+craft+'" style="color:'+c+';">'+(info.label||craft)+' →</a></div></div>'
      + '<div class="modal-row"><div class="k">How this helps</div><div class="v">'+(info.helps||'')+'</div></div>'
      + '<div class="modal-actions"><button class="btn btn-solid" style="background:'+c+';" id="modalAddToCart">Add to Cart</button></div>';
    modalCard.querySelector('#modalAddToCart').addEventListener('click', function(){
      window.addToCart(craft, idx);
    });
    modalOverlay.classList.add('show');
    refreshScrollLock();
    activeOverlayEl = modalCardEl;
    activeCloseFn = closeModal;
    var closeBtn = modalOverlay.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest('.addcart');
    if(!btn) return;
    var craft = btn.getAttribute('data-craft');
    var idx = parseInt(btn.getAttribute('data-idx'), 10);
    var item = products[craft] && products[craft][idx];
    if(item) openModal(craft, item, btn, idx);
  });

  window.showToast = function(msg){
    var t = document.getElementById('toast');
    if(!t) return;
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2200);
  };

  // ---------------- Cart drawer ----------------
  var cartOverlay, cartDrawerEl, cartItemsEl, cartShippingEl, cartSubtotalEl, cartLastFocused;
  var ENQUIRY_EMAIL = 'hello@kalakari.example'; // sample address — swap in a real inbox

  function ensureCartDrawer(){
    if(cartOverlay) return;
    cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    cartOverlay.innerHTML =
      '<aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cartDrawerTitle">'
      +   '<div class="cart-drawer-head"><h3 id="cartDrawerTitle">Your cart</h3><button class="cart-drawer-close" aria-label="Close cart">✕</button></div>'
      +   '<div class="cart-drawer-shipping"></div>'
      +   '<div class="cart-drawer-items"></div>'
      +   '<div class="cart-drawer-footer">'
      +     '<div class="cart-drawer-subtotal"><span>Subtotal</span><span class="amt">₹0</span></div>'
      +     '<div class="cart-drawer-actions">'
      +       '<button class="btn btn-outline cart-continue" type="button">Continue browsing</button>'
      +       '<a class="btn btn-solid cart-enquire" href="#">Enquire about these pieces</a>'
      +     '</div>'
      +     '<p class="cart-drawer-note">These are sample listings, so this opens an enquiry email rather than a live checkout.</p>'
      +   '</div>'
      + '</aside>';
    document.body.appendChild(cartOverlay);
    cartDrawerEl = cartOverlay.querySelector('.cart-drawer');
    cartItemsEl = cartOverlay.querySelector('.cart-drawer-items');
    cartShippingEl = cartOverlay.querySelector('.cart-drawer-shipping');
    cartSubtotalEl = cartOverlay.querySelector('.cart-drawer-subtotal .amt');

    cartOverlay.addEventListener('click', function(e){ if(e.target === cartOverlay) closeCartDrawer(); });
    cartOverlay.querySelector('.cart-drawer-close').addEventListener('click', closeCartDrawer);
    cartOverlay.querySelector('.cart-continue').addEventListener('click', closeCartDrawer);
    cartItemsEl.addEventListener('click', function(e){
      var incBtn = e.target.closest('.qty-inc');
      var decBtn = e.target.closest('.qty-dec');
      var rmBtn = e.target.closest('.cart-item-remove');
      if(incBtn) changeQty(incBtn.getAttribute('data-key'), 1);
      else if(decBtn) changeQty(decBtn.getAttribute('data-key'), -1);
      else if(rmBtn) removeFromCart(rmBtn.getAttribute('data-key'));
    });
  }

  function renderCartDrawer(){
    if(!cartOverlay) return;
    if(!cartItems.length){
      cartItemsEl.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a class="btn btn-outline" href="terracotta.html">Explore crafts →</a></div>';
    } else {
      cartItemsEl.innerHTML = cartItems.map(function(it){
        var c = accent[it.craft] || 'var(--terracotta)';
        var thumb = it.img ? '<img src="'+it.img+'" alt="'+it.n+'">' : '';
        return '<div class="cart-item">'
          + '<div class="cart-item-thumb">'+thumb+'</div>'
          + '<div class="cart-item-body">'
          +   '<h5>'+it.n+'</h5>'
          +   '<span class="cart-item-price" style="color:'+c+';">'+it.p+'</span>'
          +   '<div class="cart-item-qty">'
          +     '<button class="qty-dec" type="button" data-key="'+it.key+'" aria-label="Decrease quantity of '+it.n+'">−</button>'
          +     '<span aria-live="polite">'+it.qty+'</span>'
          +     '<button class="qty-inc" type="button" data-key="'+it.key+'" aria-label="Increase quantity of '+it.n+'">+</button>'
          +   '</div>'
          + '</div>'
          + '<button class="cart-item-remove" type="button" data-key="'+it.key+'" aria-label="Remove '+it.n+' from cart">Remove</button>'
          + '</div>';
      }).join('');
    }
    var subtotal = cartSubtotal();
    cartSubtotalEl.textContent = formatPrice(subtotal);
    if(!cartItems.length){
      cartShippingEl.innerHTML = '';
    } else if(subtotal >= FREE_SHIP_THRESHOLD){
      cartShippingEl.innerHTML = '<div class="ship-msg ship-done">🎉 You\'ve unlocked free shipping</div>';
    } else {
      var remaining = FREE_SHIP_THRESHOLD - subtotal;
      var pct = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100));
      cartShippingEl.innerHTML = '<div class="ship-msg">'+formatPrice(remaining)+' more for free shipping</div>'
        + '<div class="ship-bar"><span style="width:'+pct+'%;"></span></div>';
    }
    var enquireLink = cartOverlay.querySelector('.cart-enquire');
    if(enquireLink){
      if(cartItems.length){
        var lines = cartItems.map(function(it){ return '- ' + it.n + ' (x' + it.qty + ') \u2014 ' + it.p; });
        var body = 'Hi Kalakari,\n\nI would like to ask about these pieces:\n\n' + lines.join('\n')
          + '\n\nSubtotal: ' + formatPrice(subtotal) + '\n\nPlease let me know availability and next steps.';
        enquireLink.href = 'mailto:' + ENQUIRY_EMAIL + '?subject=' + encodeURIComponent('Enquiry about my Kalakari selections')
          + '&body=' + encodeURIComponent(body);
        enquireLink.setAttribute('aria-disabled', 'false');
      } else {
        enquireLink.href = '#';
        enquireLink.setAttribute('aria-disabled', 'true');
      }
    }
  }

  function openCartDrawer(triggerEl){
    ensureCartDrawer();
    cartLastFocused = triggerEl || document.activeElement;
    renderCartDrawer();
    closeModal();
    cartOverlay.classList.add('show');
    refreshScrollLock();
    activeOverlayEl = cartDrawerEl;
    activeCloseFn = closeCartDrawer;
    var closeBtn = cartOverlay.querySelector('.cart-drawer-close');
    if(closeBtn) closeBtn.focus();
  }
  function closeCartDrawer(){
    if(!cartOverlay || !cartOverlay.classList.contains('show')) return;
    cartOverlay.classList.remove('show');
    refreshScrollLock();
    activeOverlayEl = null; activeCloseFn = null;
    if(cartLastFocused && typeof cartLastFocused.focus === 'function') cartLastFocused.focus();
  }

  var cartBtnEl = document.getElementById('cartBtn');
  if(cartBtnEl) cartBtnEl.addEventListener('click', function(){ openCartDrawer(cartBtnEl); });

  // ---------------- Product photo lightbox ----------------
  var lightboxOverlay, lightboxImg, lightboxCaption, lightboxLastFocused, lightboxCraft, lightboxIdx;
  function ensureLightbox(){
    if(lightboxOverlay) return;
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML =
      '<div class="lightbox-card" role="dialog" aria-modal="true" aria-label="Product photo">'
      +   '<button class="lightbox-close" aria-label="Close photo">✕</button>'
      +   '<button class="lightbox-nav lightbox-prev" aria-label="Previous photo">‹</button>'
      +   '<img alt="">'
      +   '<button class="lightbox-nav lightbox-next" aria-label="Next photo">›</button>'
      +   '<div class="lightbox-caption"></div>'
      + '</div>';
    document.body.appendChild(lightboxOverlay);
    lightboxImg = lightboxOverlay.querySelector('img');
    lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
    lightboxOverlay.addEventListener('click', function(e){ if(e.target === lightboxOverlay) closeLightbox(); });
    lightboxOverlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightboxOverlay.querySelector('.lightbox-prev').addEventListener('click', function(){ stepLightbox(-1); });
    lightboxOverlay.querySelector('.lightbox-next').addEventListener('click', function(){ stepLightbox(1); });
  }
  function renderLightbox(){
    var item = products[lightboxCraft][lightboxIdx];
    var c = accent[lightboxCraft] || 'var(--terracotta)';
    lightboxImg.src = item.img;
    lightboxImg.alt = item.n;
    lightboxCaption.innerHTML = item.n + '<span class="lb-price" style="color:'+c+';">'+item.p+'</span>';
  }
  function stepLightbox(delta){
    var list = products[lightboxCraft];
    lightboxIdx = (lightboxIdx + delta + list.length) % list.length;
    renderLightbox();
  }
  function openLightbox(craft, idx, triggerEl){
    ensureLightbox();
    lightboxCraft = craft; lightboxIdx = idx;
    lightboxLastFocused = triggerEl || document.activeElement;
    renderLightbox();
    lightboxOverlay.classList.add('show');
    refreshScrollLock();
    activeOverlayEl = lightboxOverlay.querySelector('.lightbox-card');
    activeCloseFn = closeLightbox;
    lightboxOverlay.querySelector('.lightbox-close').focus();
  }
  function closeLightbox(){
    if(!lightboxOverlay || !lightboxOverlay.classList.contains('show')) return;
    lightboxOverlay.classList.remove('show');
    refreshScrollLock();
    activeOverlayEl = null; activeCloseFn = null;
    if(lightboxLastFocused && typeof lightboxLastFocused.focus === 'function') lightboxLastFocused.focus();
  }
  document.addEventListener('click', function(e){
    var thumb = e.target.closest('.pcard .thumb[data-craft]');
    if(!thumb) return;
    openLightbox(thumb.getAttribute('data-craft'), parseInt(thumb.getAttribute('data-idx'), 10), thumb);
  });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ') return;
    var thumb = e.target.closest('.pcard .thumb[data-craft]');
    if(!thumb) return;
    e.preventDefault();
    openLightbox(thumb.getAttribute('data-craft'), parseInt(thumb.getAttribute('data-idx'), 10), thumb);
  });
  document.addEventListener('keydown', function(e){
    if(!lightboxOverlay || !lightboxOverlay.classList.contains('show')) return;
    if(e.key === 'ArrowLeft') stepLightbox(-1);
    else if(e.key === 'ArrowRight') stepLightbox(1);
  });

  var hamburger = document.getElementById('hamburger');
  var mainnav = document.getElementById('mainnav');
  hamburger.addEventListener('click', function(){
    var open = mainnav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mainnav.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){ mainnav.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
  });

  // Sticky jump-nav: clicking a tab smooth-scrolls to that section of the
  // continuous craft story instead of switching pages. A "Support This
  // Craft" button (data-target) jumps to the product collection instead.
  document.querySelectorAll('.detail-tabs').forEach(function(group){
    group.addEventListener('click', function(e){
      var btn = e.target.closest('.tab-btn');
      if(!btn) return;
      e.preventDefault();
      var targetId = btn.getAttribute('data-target');
      var el = targetId
        ? document.getElementById(targetId)
        : group.querySelector('.tab-panel[data-tab="' + btn.getAttribute('data-tab') + '"]');
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Scroll-spy: highlight the tab for whichever section is currently in view,
  // and update the "Section X of N" label next to the tabs.
  if('IntersectionObserver' in window){
    document.querySelectorAll('.detail-tabs').forEach(function(group){
      var buttons = group.querySelectorAll('.tab-btn[data-tab]');
      var panels = group.querySelectorAll('.tab-panel');
      var countEl = group.querySelector('.section-count');
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var key = entry.target.getAttribute('data-tab');
            var activeIdx = 0;
            buttons.forEach(function(b, i){
              var isActive = b.getAttribute('data-tab') === key;
              b.classList.toggle('active', isActive);
              if(isActive) activeIdx = i;
            });
            if(countEl) countEl.textContent = 'Section ' + (activeIdx + 1) + ' of ' + buttons.length;
          }
        });
      }, {rootMargin: '-140px 0px -55% 0px', threshold: 0});
      panels.forEach(function(p){ obs.observe(p); });
    });
  }

  // Reading progress bar: overall scroll position through the whole page,
  // tinted with the current craft's accent colour via --_accent.
  var progressEl = document.querySelector('.reading-progress span');
  if(progressEl){
    var updateProgress = function(){
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / scrollable) * 100)) : 0;
      progressEl.style.width = pct + '%';
    };
    document.addEventListener('scroll', updateProgress, {passive:true});
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // Share button on the Support page
  var shareBtn = document.getElementById('shareBtn');
  if(shareBtn){
    shareBtn.addEventListener('click', function(){
      var url = window.location.href;
      var done = function(){ showToast('Link copied — share away'); };
      var fail = function(){ showToast('Could not copy — copy the address bar link instead'); };
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(url).then(done, fail);
        } else {
          var ta = document.createElement('textarea');
          ta.value = url; ta.style.position='fixed'; ta.style.opacity='0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done();
        }
      }catch(e){ fail(); }
    });
  }

  buildGrids();
})();
