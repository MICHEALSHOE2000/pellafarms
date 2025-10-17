/* ============================================================
   PELLA FARMS — INTERACTIVE LOGIC
   Stage 4: scripts.js
   ============================================================ */

/* ---------- CONFIGURABLE SETTINGS ---------- */
const WHATSAPP_NUMBER = "+2347034774672"; // business WhatsApp number
const FORMSPREE_ENDPOINT = "https://formspree.io/f/yourformid"; // replace with your real Formspree endpoint
const DEADLINE = new Date("October 31, 2025 23:59:59").getTime();

/* ---------- COUNTDOWN TIMER ---------- */
const countdownEl = document.querySelector(".countdown");
if (countdownEl) {
  const tick = () => {
    const now = Date.now();
    const diff = DEADLINE - now;

    if (diff <= 0) {
      countdownEl.textContent = "Registration closed";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `${days}d ${hrs}h ${mins}m ${secs}s left`;
  };
  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- SMOOTH SCROLL FOR INTERNAL LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ---------- STICKY CTA TOGGLE ---------- */
const ctaBtn = document.querySelector(".cta-sticky");
const formPanel = document.querySelector(".cta-form-panel");
const formClose = document.querySelector(".cta-form-close");

if (ctaBtn && formPanel) {
  ctaBtn.addEventListener("click", () => formPanel.classList.toggle("open"));
  if (formClose) formClose.addEventListener("click", () => formPanel.classList.remove("open"));
}

/* ---------- FORM VALIDATION + SUBMISSION ---------- */
const form = document.querySelector("form#contact-form");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const whatsapp = form.querySelector('[name="whatsapp"]').value.trim();

    if (!name || !phone) {
      showToast("Please enter your name and phone number.");
      return;
    }

    // Send to Formspree
    const data = { name, phone, whatsapp };
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showToast("Thank you! Opening WhatsApp…");
        openWhatsApp(name, phone, whatsapp);
        form.reset();
      } else {
        showToast("Error sending form. Try again later.");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Check your connection.");
    }
  });
}

/* ---------- OPEN WHATSAPP WITH PREFILLED MESSAGE ---------- */
function openWhatsApp(name, phone, whatsapp) {
  const msg = encodeURIComponent(
    `Hi Pella Farms — I'm interested in the Own a Farm package.\nName: ${name}\nPhone: ${phone}\nWhatsApp: ${whatsapp || phone}`
  );
  const link = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${msg}`;
  window.open(link, "_blank");
}

/* ---------- TOAST / SNACKBAR NOTIFICATIONS ---------- */
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ---------- ON-SCROLL FADE-IN ANIMATIONS ---------- */
const revealEls = document.querySelectorAll(".reveal-on-scroll");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
revealEls.forEach(el => observer.observe(el));

/* ---------- REDUCE MOTION RESPECT ---------- */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("*").forEach(el => (el.style.transition = "none"));
}
// ----------------------
// Handle "Get X Plot" Buttons
// ----------------------
document.querySelectorAll('.package-cta').forEach(button => {
  button.addEventListener('click', event => {
    const plots = event.target.getAttribute('data-plots');
    
    // Open the same contact form panel
    const formPanel = document.querySelector('.cta-form-panel');
    formPanel.classList.add('open');

    // Prefill a hidden message in the form for context
    const nameField = document.querySelector('#contact-form input[name="name"]');
    if (nameField) nameField.focus();

    // Optionally include which package user clicked (for WhatsApp message)
    formPanel.dataset.package = `${plots} Plot${plots > 1 ? 's' : ''}`;

    console.log(`User clicked: ${plots} plot package`);
  });
});
// ----------------------
// Count-Up Animation for Stats
// ----------------------
const counters = document.querySelectorAll('.count');
let started = false;

function startCounting() {
  if (started) return;
  started = true;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const speed = target / 100; // adjust speed (lower = faster)

    const updateCount = () => {
      if (count < target) {
        count += speed;
        counter.textContent = Math.ceil(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    updateCount();
  });
}

// Trigger when visible on scroll
window.addEventListener('scroll', () => {
  const section = document.querySelector('#trust');
  const sectionTop = section.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.8;
  if (sectionTop < triggerPoint) startCounting();
});
// ----------------------
// Count-Up Animation for Stats Section
// ----------------------
const statNumbers = document.querySelectorAll('.stat-number');
let statsStarted = false;

function startStatsCount() {
  if (statsStarted) return;
  statsStarted = true;

  statNumbers.forEach(stat => {
    const target = +stat.getAttribute('data-target');
    let count = 0;
    const increment = target / 100; // adjust speed (smaller = slower)

    const update = () => {
      count += increment;
      if (count < target) {
        stat.textContent = Math.ceil(count);
        requestAnimationFrame(update);
      } else {
        stat.textContent = target.toLocaleString() + (target >= 100 ? '+' : '');
      }
    };
    update();
  });
}

// Trigger count when stats enter viewport
window.addEventListener('scroll', () => {
  const section = document.querySelector('#stats-section');
  if (!section) return;
  const sectionTop = section.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.8;
  if (sectionTop < triggerPoint) startStatsCount();
});
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  const packageButtons = document.querySelectorAll('.package-cta');
  const overlay = document.getElementById('packageFormOverlay');
  const closeBtn = overlay.querySelector('.close-btn');
  const selectedPackageInput = document.getElementById('selected_package');
  const visitDateInput = document.getElementById('visitDate');

  // Open popup on any package click
  packageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const packageType = button.dataset.plots;
      selectedPackageInput.value = `${packageType} Plot${packageType > 1 ? 's' : ''}`;
      overlay.classList.add('active');
    });
  });

  // Close popup
  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  // Set min date = today
  const today = new Date().toISOString().split('T')[0];
  visitDateInput.setAttribute('min', today);

  // Restrict to weekdays only
  visitDateInput.addEventListener('input', e => {
    const date = new Date(e.target.value);
    const day = date.getUTCDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      alert('Please select a weekday (Monday–Friday).');
      e.target.value = '';
    }
  });
});
// FAQ Accordion Logic
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const openItem = document.querySelector(".faq-question.active");
    if (openItem && openItem !== btn) {
      openItem.classList.remove("active");
      openItem.nextElementSibling.style.maxHeight = null;
    }

    btn.classList.toggle("active");
    const answer = btn.nextElementSibling;
    if (btn.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});
