# BullBrain Capital — Static Site

A fully static (no build step, no server required) recreation of the BullBrain Capital
landing page: hero, director profile, live-style trading charts, services, market
stats, testimonials, and a contact form.

## Files

```
bullbrain-capital/
├── index.html      # All page markup/sections
├── style.css       # All styling (dark theme, emerald accent)
├── content.js      # Editable data: ticker, chart values, contact info
├── script.js       # Ticker marquee, canvas charts, nav, form handling
└── README.md
```

## How to view it

Just open `index.html` in any browser — double-click it, or drag it into a browser
tab. No install, no server, no dependencies beyond a Google Fonts link (the page still
works fine offline, it'll just fall back to system fonts).

If you'd rather serve it locally:
```bash
cd bullbrain-capital
python3 -m http.server 8080
# then open http://localhost:8080
```

## What's real vs. placeholder right now

- **Real / working:** layout, styling, responsive behaviour, scrolling ticker,
  animated line chart (portfolio performance), animated candlestick chart with
  working 1D/1W/1M/3M/1Y buttons, mobile menu, contact form validation.
- **Placeholder (by design, per your request):** the "Log In" button just shows a
  message. The contact form validates and shows a confirmation, but does **not**
  send an email/WhatsApp/Telegram message anywhere yet — see below. Prices/logos/
  testimonials are illustrative content, not live market data.

## Next steps (the two features you flagged as "future")

### 1. Admin screen to update info
`content.js` already separates the site's editable data (ticker prices, chart
numbers, contact details) from the page logic. That's intentional groundwork:
a future admin panel could write a JSON file with the same shape, and `script.js`
would fetch that JSON instead of reading the hardcoded object — no rewrite of the
rest of the site needed. Building the actual admin UI + auth + storage is a
separate, later project.

### 2. Email / WhatsApp / Telegram notifications on contact form submit
Browsers can't send email, WhatsApp, or Telegram messages directly for security
reasons — this needs a small backend. When you're ready, a common lightweight path is:
- A serverless function (e.g. a Cloud Function, Vercel/Netlify function, or a tiny
  Node/Express endpoint) that receives the form POST.
- That function calls an email API (e.g. SendGrid/SES), the WhatsApp Business API,
  and/or the Telegram Bot API to notify your team.
- `script.js` already has a clearly marked spot (`wireContactForm`) with the exact
  line to uncomment/adjust once that endpoint exists.

Everything else in this zip is fully working today.
