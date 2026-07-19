/* =========================================================
   script.js — BullBrain Capital static site behaviour
   No backend calls. Everything runs client-side.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderTicker();
  renderContactInfo();
  drawPortfolioChart();
  drawCandleChart(1);
  wireTimeframeButtons();
  wireMobileNav();
  wireContactForm();
  wireLoginPlaceholder();
});

/* ---------------- Ticker ---------------- */
function renderTicker(){
  const track = document.getElementById("tickerTrack");
  if(!track) return;
  const items = SITE_CONTENT.ticker;
  // duplicate the list once so the marquee loop is seamless
  const list = [...items, ...items];
  track.innerHTML = list.map(t => `
    <span class="ticker-item ${t.dir}">
      <b>${t.symbol}</b> ${t.value} ${t.change}
    </span>
  `).join("");
}

/* ---------------- Contact info (from content.js) ---------------- */
function renderContactInfo(){
  const c = SITE_CONTENT.contact;
  const emailEl = document.querySelector(".contact-item:nth-of-type(1) span");
  const phoneEl = document.querySelector(".contact-item:nth-of-type(2) span");
  const addrEl  = document.querySelector(".contact-item:nth-of-type(3) span");
  if(emailEl) emailEl.textContent = c.email;
  if(phoneEl) phoneEl.textContent = c.phone;
  if(addrEl)  addrEl.textContent  = c.address;
}

/* ---------------- Hero line chart ---------------- */
function drawPortfolioChart(){
  const canvases = document.querySelectorAll('.portfolio-chart');
  if(!canvases || canvases.length === 0) return;

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 480;
    // allow canvas to determine its height via CSS, fallback to 220
    const cssH = canvas.clientHeight || 220;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);

    const values = SITE_CONTENT.portfolio.values;
    const min = Math.min(...values) * 0.96;
    const max = Math.max(...values) * 1.04;
    const padX = 10, padY = 14;
    const w = cssW - padX * 2;
    const h = cssH - padY * 2;

    const pts = values.map((v, i) => ({
      x: padX + (i / (values.length - 1)) * w,
      y: padY + h - ((v - min) / (max - min)) * h
    }));

    // gradient fill under the line (Centricity clay/gold)
    const grad = ctx.createLinearGradient(0, 0, 0, cssH);
    grad.addColorStop(0, 'rgba(169,103,59,0.32)');
    grad.addColorStop(1, 'rgba(169,103,59,0.0)');

    ctx.beginPath();
    ctx.moveTo(pts[0].x, cssH - padY);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, cssH - padY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#a9673b';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f4ede2';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#a9673b';
      ctx.stroke();
    });
  });
}

/* ---------------- Candlestick chart ---------------- */
// Deterministic pseudo-random so re-renders per timeframe stay consistent per click
function seededRandom(seed){
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildCandlesForTimeframe(tf){
  const base = SITE_CONTENT.niftyChart.candles;
  const counts = { "1D": 7, "1W": 12, "1M": 22, "3M": 30, "1Y": 36 };
  const n = counts[tf] || 7;
  const rand = seededRandom(n * 17 + 3);
  let last = base[0][0];
  const out = [];
  for(let i = 0; i < n; i++){
    const drift = (rand() - 0.48) * 220;
    const open = last;
    const close = open + drift;
    const high = Math.max(open, close) + rand() * 90;
    const low = Math.min(open, close) - rand() * 90;
    out.push([open, high, low, close]);
    last = close;
  }
  return out;
}

function drawCandleChart(tfLabel){
  const canvas = document.getElementById("candleChart");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 900;
  const cssH = 320;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const candles = buildCandlesForTimeframe(tfLabel);
  const allVals = candles.flat();
  const min = Math.min(...allVals) * 0.998;
  const max = Math.max(...allVals) * 1.002;
  const padX = 20, padY = 16;
  const w = cssW - padX * 2;
  const h = cssH - padY * 2;
  const slot = w / candles.length;
  const bodyW = Math.max(4, slot * 0.55);

  // gridlines
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for(let i = 0; i <= 4; i++){
    const y = padY + (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(cssW - padX, y);
    ctx.stroke();
  }

  const yFor = v => padY + h - ((v - min) / (max - min)) * h;

  candles.forEach((c, i) => {
    const [o, hi, lo, cl] = c;
    const x = padX + i * slot + slot / 2;
    const up = cl >= o;
    ctx.strokeStyle = up ? "#a9673b" : "#c97a6d";
    ctx.fillStyle = up ? "#a9673b" : "#c97a6d";

    // wick
    ctx.beginPath();
    ctx.moveTo(x, yFor(hi));
    ctx.lineTo(x, yFor(lo));
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // body
    const yOpen = yFor(o);
    const yClose = yFor(cl);
    const top = Math.min(yOpen, yClose);
    const bh = Math.max(2, Math.abs(yClose - yOpen));
    ctx.fillRect(x - bodyW / 2, top, bodyW, bh);
  });
}

function wireTimeframeButtons(){
  const buttons = document.querySelectorAll(".timeframes button");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      drawCandleChart(btn.dataset.tf);
    });
  });
  window.addEventListener("resize", () => {
    const active = document.querySelector(".timeframes button.active");
    drawCandleChart(active ? active.dataset.tf : "1D");
    drawPortfolioChart();
  });
}

/* ---------------- Mobile nav ---------------- */
function wireMobileNav(){
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  if(!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
    });
  });

  window.addEventListener("resize", () => {
    if(window.innerWidth > 980){
      navLinks.classList.remove("mobile-open");
    }
  });
}

/* ---------------- Login placeholder ---------------- */
function wireLoginPlaceholder(){
  const btn = document.getElementById("loginBtn");
  if(!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // Placeholder — real auth/admin screen comes later.
    alert("Trader login isn't wired up yet. This is a static preview site — auth and the admin dashboard are planned for a future phase.");
  });
}

/* ---------------- Contact form ---------------- */
function wireContactForm(){
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if(!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if(!data.fullName || !data.email){
      status.textContent = "Please fill in your name and email.";
      status.className = "form-status err";
      return;
    }

    /* -----------------------------------------------------
       NOTE — FUTURE FEATURE (not active yet):
       This is where the form submission would be sent to a
       server, which would then notify your team by email,
       WhatsApp, or Telegram. That requires a backend endpoint
       (browsers can't send email/WhatsApp/Telegram directly),
       so for now we just log it locally and show a confirmation.

       Example of what a real call might look like later:

       fetch("/api/contact", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data)
       });
    ----------------------------------------------------- */
    console.log("Contact form submission (not sent anywhere yet):", data);

    status.textContent = "Thanks! Your message has been received. Our team will reach out within 24 hours.";
    status.className = "form-status ok";
    form.reset();
  });
}
