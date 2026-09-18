const header = document.querySelector('.topbar');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const heroBg = document.querySelector('.hero-bg');
const topButton = document.querySelector('.float.top');

// A fixed header is not a scroll destination; return to the document origin.
topButton?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
  document.querySelector('.brand')?.focus({ preventScroll: true });
});


function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 24);
  if (heroBg) {
    heroBg.style.transform = `scale(1.04) translateY(${Math.min(y * 0.035, 20)}px)`;
  }
  if (topButton) {
    topButton.classList.toggle('is-shown', y > 360);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((a) =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  })
);

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }),
  { threshold: 0.14, rootMargin: '0px 0px -40px' }
);

document
  .querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-delay')
  .forEach((el) => io.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a')];

const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          )
        );
      }
    }),
  { threshold: 0.48 }
);

sections.forEach((section) => spy.observe(section));

const lb = document.querySelector('.lightbox');
const lbImg = lb?.querySelector('img');

document.querySelectorAll('.insta-item').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lb || !lbImg) return;
    lbImg.src = button.dataset.full;
    lbImg.alt = button.querySelector('img')?.alt || 'Imagem ampliada';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

function closeLb() {
  if (!lb || !lbImg) return;
  lb.hidden = true;
  lbImg.src = '';
  document.body.style.overflow = '';
}

lb?.querySelector('.lightbox-close')?.addEventListener('click', closeLb);
lb?.addEventListener('click', (e) => {
  if (e.target === lb) closeLb();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lb && !lb.hidden) closeLb();
});
