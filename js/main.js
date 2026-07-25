// ============================================================
// NEXER - Main JavaScript
// Hex grid background, scroll effects, mobile menu, Lemon Squeezy
// ============================================================

(function() {
  'use strict';

  // ============================================================
  // Hex Grid Canvas Background
  // ============================================================
  const hexCanvas = document.getElementById('hexCanvas');
  const hexCtx = hexCanvas ? hexCanvas.getContext('2d') : null;
  let hexAnimationId = null;
  let hexTime = 0;
  let hexSize = 48;
  let hexCols = 0;
  let hexRows = 0;

  function resizeHexCanvas() {
    if (!hexCanvas) return;
    hexCanvas.width = window.innerWidth;
    hexCanvas.height = window.innerHeight;
    hexCols = Math.ceil(hexCanvas.width / (hexSize * 0.87)) + 2;
    hexRows = Math.ceil(hexCanvas.height / (hexSize * 0.75)) + 2;
  }

  function drawHex(x, y, size, color, alpha) {
    if (!hexCtx) return;
    hexCtx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) hexCtx.moveTo(px, py);
      else hexCtx.lineTo(px, py);
    }
    hexCtx.closePath();
    hexCtx.strokeStyle = `rgba(${color}, ${alpha})`;
    hexCtx.lineWidth = 0.5;
    hexCtx.stroke();
  }

  function drawHexGrid() {
    if (!hexCtx || !hexCanvas) return;
    hexCtx.clearRect(0, 0, hexCanvas.width, hexCanvas.height);
    
    const offsetX = (hexTime * 10) % (hexSize * 0.87);
    const offsetY = (hexTime * 5) % (hexSize * 0.75);
    
    const color = '46, 219, 242'; // accent cyan
    
    for (let row = -1; row <= hexRows; row++) {
      for (let col = -1; col <= hexCols; col++) {
        const x = col * hexSize * 0.87 + (row % 2 === 0 ? 0 : hexSize * 0.435) - offsetX;
        const y = row * hexSize * 0.75 - offsetY;
        
        if (x > -hexSize && x < hexCanvas.width + hexSize && y > -hexSize && y < hexCanvas.height + hexSize) {
          // Vary alpha based on position for subtle variation
          const dist = Math.hypot(
            (x + offsetX - hexCanvas.width / 2) / (hexCanvas.width / 2),
            (y + offsetY - hexCanvas.height / 2) / (hexCanvas.height / 2)
          );
          const alpha = Math.max(0.02, 0.15 * (1 - dist * 0.5));
          drawHex(x, y, hexSize * 0.45, color, alpha);
        }
      }
    }
  }

  function animateHex() {
    hexTime += 1/60;
    drawHexGrid();
    hexAnimationId = requestAnimationFrame(animateHex);
  }

  if (hexCanvas && hexCtx) {
    resizeHexCanvas();
    window.addEventListener('resize', resizeHexCanvas);
    animateHex();
  }

  // ============================================================
  // Background Glow Mouse Follow
  // ============================================================
  const bgGlow = document.getElementById('bgGlow');
  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.05;
    glowY += (mouseY - glowY) * 0.05;
    
    if (bgGlow) {
      bgGlow.style.background = `
        radial-gradient(ellipse 60% 40% at 50% 15%, rgba(46, 219, 242, 0.08) 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at 85% 85%, rgba(46, 125, 246, 0.06) 0%, transparent 60%),
        radial-gradient(ellipse 30% 25% at 15% 75%, rgba(46, 219, 242, 0.04) 0%, transparent 50%),
        radial-gradient(circle 400px at ${glowX}px ${glowY}px, rgba(46, 219, 242, 0.06) 0%, transparent 70%)
      `;
    }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ============================================================
  // Header Scroll Effect
  // ============================================================
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // ============================================================
  // Mobile Menu Toggle
  // ============================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('nav');

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active');
      
      // Animate hamburger
      const spans = mobileMenuBtn.querySelectorAll('span');
      if (nav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ============================================================
  // Scroll Reveal Animations
  // ============================================================
  const revealElements = document.querySelectorAll(
    '.feature-card, .status-card, .trust-stat, .purchase-card, .sidebar-card, .hero-card, .cta-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  });

  // ============================================================
  // Smooth Scroll for Anchor Links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================================
  // Hero Card 3D Tilt Effect
  // ============================================================
  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  // ============================================================
  // Lemon Squeezy Checkout Button
  // ============================================================
  document.querySelectorAll('.ls-checkout-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const productId = this.dataset.lsProductId;
      const variantId = this.dataset.lsVariantId;
      
      if (productId && variantId && productId !== 'YOUR_LEMON_SQUEEZY_PRODUCT_ID') {
        e.preventDefault();
        
        // Show loading state
        const btnText = this.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Opening checkout...';
        this.disabled = true;
        
        if (typeof LemonSqueezy !== 'undefined') {
          LemonSqueezy.openCheckout({
            productId: productId,
            variantId: variantId,
            checkoutOptions: {
              embed: false,
              buttonColor: '#2edbf2',
              preview: false
            }
          });
        } else {
          // Fallback: redirect to Lemon Squeezy checkout URL
          window.open(`https://lemonsqueezy.com/checkout/buy/${variantId}`, '_blank');
        }
        
        // Reset button after delay
        setTimeout(() => {
          btnText.textContent = originalText;
          this.disabled = false;
        }, 3000);
      }
    });
  });

  // ============================================================
  // Feature Card Hover Enhancement
  // ============================================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderColor = 'rgba(46, 219, 242, 0.5)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = '';
    });
  });

  // ============================================================
  // Status Cards Pulse Animation
  // ============================================================
  document.querySelectorAll('.status-indicator').forEach((dot, index) => {
    dot.style.animationDelay = `${index * 0.3}s`;
  });

  // ============================================================
  // Parallax Scroll for Hero
  // ============================================================
  let heroTicking = false;
  function updateParallax() {
    const scrollY = window.scrollY;
    const heroCard = document.getElementById('heroCard');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroCard && heroVisual && scrollY < window.innerHeight) {
      const translateY = scrollY * 0.15;
      const rotate = scrollY * 0.02;
      heroCard.style.transform = `perspective(1000px) translateY(${translateY}px) rotateX(${rotate}deg)`;
    }
    heroTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!heroTicking) {
      requestAnimationFrame(updateParallax);
      heroTicking = true;
    }
  }, { passive: true });

  // ============================================================
  // Button Ripple Effect
  // ============================================================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(255,255,255,0.3);
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ============================================================
  // Stats Counter Animation
  // ============================================================
  function animateCounter(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    
    requestAnimationFrame(update);
  }

  // Trigger stat counters when in view
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValue = entry.target.querySelector('.stat-value, .trust-value, .price-amount, .price-amount-large');
        if (statValue && !statValue.dataset.animated) {
          statValue.dataset.animated = 'true';
          const target = parseInt(statValue.textContent.replace(/[^\d]/g, ''));
          if (target) animateCounter(statValue, target);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat, .trust-stat').forEach(el => {
    statObserver.observe(el);
  });

  // ============================================================
  // Scroll Indicator Click
  // ============================================================
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const features = document.getElementById('features');
      if (features) {
        const headerOffset = 80;
        const elementPosition = features.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  }

  // ============================================================
  // FAQ Accordion Animation
  // ============================================================
  document.querySelectorAll('.faq-item details').forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('p');
    
    details.addEventListener('toggle', () => {
      if (details.open) {
        content.style.animation = 'fadeIn 0.3s ease';
      }
    });
  });

  // ============================================================
  // Console Easter Egg
  // ============================================================
  console.log(`
%c  ███╗   ███╗ █████╗ ██████╗ ██████╗ 
%c  ████╗ ████║██╔══██╗██╔══██╗██╔══██╗
%c  ██╔████╔██║███████║██████╔╝██████╔╝
%c  ██║╚██╔╝██║██╔══██║██╔══██╗██╔══██╗
%c  ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██║
%c  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
%c
%c  NEXER - Ghosts of Tabor Cheat Trials
%c  Premium • Undetected • Secure
`, 
'color: #2edbf2; font-weight: bold;',
'color: #2e7df6; font-weight: bold;',
'color: #2edbf2; font-weight: bold;',
'color: #2e7df6; font-weight: bold;',
'color: #2edbf2; font-weight: bold;',
'color: #2edbf2; font-weight: bold;',
'color: #7e96a6;',
'color: #2edbf2; font-weight: bold;',
'color: #7e96a6;'
  );

  // ============================================================
  // Cleanup on page unload
  // ============================================================
  window.addEventListener('beforeunload', () => {
    if (hexAnimationId) cancelAnimationFrame(hexAnimationId);
  });

})();