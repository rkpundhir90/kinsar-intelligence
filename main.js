// ── Animated grid canvas background ─────────────────────
(function () {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const spacing = 48;
    for (let x = 0; x < W + spacing; x += spacing) {
      for (let y = 0; y < H + spacing; y += spacing) {
        dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
      }
    }
  }

  let mouse = { x: -999, y: -999 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // grid lines
    ctx.strokeStyle = 'rgba(99,102,241,0.06)';
    ctx.lineWidth = 1;
    const spacing = 48;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // animated dots
    dots.forEach(d => {
      const dx = d.x - mouse.x;
      const dy = d.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 80 - dist) / 80;

      d.vx += (d.ox - d.x) * 0.08 + (dx / Math.max(dist, 1)) * force * 2;
      d.vy += (d.oy - d.y) * 0.08 + (dy / Math.max(dist, 1)) * force * 2;
      d.vx *= 0.82;
      d.vy *= 0.82;
      d.x += d.vx;
      d.y += d.vy;

      const opacity = 0.15 + force * 0.5;
      const radius  = 1.5 + force * 2;
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── Sticky nav ───────────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav toggle ────────────────────────────────────
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (toggle) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Fade-up on scroll ────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.stat, .service-card, .team-card, .about__card, .section-title, .section-sub, .section-tag, .value'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ── Contact form ─────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const success = document.getElementById('form-success');
  success.classList.add('show');
  e.target.reset();
  setTimeout(() => success.classList.remove('show'), 4000);
}
