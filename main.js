(function () {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let points = [];
  const pointer = { x: -200, y: -200 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    buildPoints();
  }

  function buildPoints() {
    const spacing = Math.max(56, Math.min(90, Math.floor(width / 14)));
    points = [];

    for (let x = 0; x <= width + spacing; x += spacing) {
      for (let y = 0; y <= height + spacing; y += spacing) {
        points.push({
          x,
          y,
          baseX: x,
          baseY: y,
          drift: Math.random() * Math.PI * 2
        });
      }
    }
  }

  document.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  document.addEventListener('mouseleave', () => {
    pointer.x = -200;
    pointer.y = -200;
  });

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    for (const point of points) {
      const waveX = Math.sin(time * 0.0006 + point.drift) * 6;
      const waveY = Math.cos(time * 0.0007 + point.drift) * 6;
      const dx = point.baseX - pointer.x;
      const dy = point.baseY - pointer.y;
      const distance = Math.hypot(dx, dy);
      const pull = Math.max(0, 150 - distance) / 150;

      point.x += ((point.baseX + waveX + dx * pull * 0.12) - point.x) * 0.07;
      point.y += ((point.baseY + waveY + dy * pull * 0.12) - point.y) * 0.07;
    }

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const next = points[index + 1];

      if (next && Math.abs(next.baseY - point.baseY) < 1) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = 'rgba(18, 35, 48, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    for (const point of points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 118, 110, 0.18)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }
});

const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.fade-up, .fade-sequence').forEach((element) => {
  observer.observe(element);
});

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  const submitButton = document.getElementById('contact-submit');
  const endpoint = form.action;

  if (!endpoint) {
    if (error) {
      error.classList.add('show');
    }
    return;
  }

  if (success) {
    success.classList.remove('show');
  }

  if (error) {
    error.classList.remove('show');
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending Inquiry...';
  }

  const formData = new FormData(form);

  fetch(endpoint.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/'), {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      return response.json();
    })
    .then(() => {
      if (success) {
        success.classList.add('show');
      }

      form.reset();
    })
    .catch(() => {
      if (error) {
        error.classList.add('show');
      }
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.defaultLabel || 'Send Inquiry';
      }
    });
}
