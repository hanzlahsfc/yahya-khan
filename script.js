// Yahya Khan — Awaragard

// One set in the HTML. Doubling here is what makes -50% loop.
const track = document.querySelector('.marquee-track');
if (track && !track.dataset.looped) {
  track.innerHTML += track.innerHTML;
  track.dataset.looped = 'true';
}

// Reveal-on-scroll. No-JS stays visible, because .reveal is added here.
const reveals = document.querySelectorAll('.section, .hero-foot, .catchphrase, .hero h1');
reveals.forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
function closeNav() {
  if (!nav || !toggle) return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

// Which section is on screen
const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const watched = navLinks
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window && watched.length) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  watched.forEach((el) => spy.observe(el));
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Pointer overlay. The dot snaps to the pointer. The ring trails it
// and grows on links and buttons. Off for touch and reduced motion.
(function () {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;
  let seen = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!seen) {
      seen = true;
      rx = mx;
      ry = my;
      document.documentElement.classList.add('has-cursor');
    }
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    document.documentElement.classList.remove('has-cursor');
    seen = false;
  });

  function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const hot = 'a, button, summary, [role="button"]';
  function hotOf(node) {
    if (!node || !node.closest) return null;
    return node.closest(hot);
  }
  document.addEventListener('mouseover', (e) => {
    const now = hotOf(e.target);
    if (now && now !== hotOf(e.relatedTarget)) ring.classList.add('is-hot');
  });
  document.addEventListener('mouseout', (e) => {
    const now = hotOf(e.target);
    if (now && now !== hotOf(e.relatedTarget)) ring.classList.remove('is-hot');
  });
})();
