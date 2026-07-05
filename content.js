/* =========================================================
   content.js
   -----------------------------------------------------------
   All "data" shown on the page lives here, separate from the
   markup/logic in script.js. This is intentional groundwork
   for the FUTURE ADMIN SCREEN you mentioned:

     - Today this file is just a static JS object.
     - Later, an admin panel can write a JSON file (or call a
       small API) with the same shape, and script.js can fetch
       that instead of reading this hardcoded object — no other
       code needs to change.

   Nothing below calls out to a server. It's all local/static.
========================================================= */

const SITE_CONTENT = {

  // Scrolling top ticker
  ticker: [
    { symbol: "NIFTY 50", value: "24,813.45", change: "+1.24%", dir: "up" },
    { symbol: "SENSEX",   value: "81,397.23", change: "+0.85%", dir: "up" },
    { symbol: "BTC/USD",  value: "67,234.50", change: "-0.15%", dir: "down" },
    { symbol: "ETH/USD",  value: "3,451.20",  change: "+0.14%", dir: "up" },
    { symbol: "GOLD",     value: "2,341.80",  change: "+0.45%", dir: "up" },
    { symbol: "USD/INR",  value: "83.42",     change: "-0.05%", dir: "down" }
  ],

  // Hero "Portfolio Performance" mini line chart (last 5 weeks)
  portfolio: {
    totalReturn: "+24.7%",
    weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    values: [100000, 108500, 112000, 128000, 147000] // ₹
  },

  // Live candlestick chart (NIFTY 50) — illustrative static OHLC series
  niftyChart: {
    symbol: "NIFTY 50",
    price: "24,813.45",
    change: "+304.25 (+1.24%)",
    open: "24,509.20",
    high: "24,890.50",
    low: "24,487.25",
    volume: "1.2M",
    // [open, high, low, close] per candle, oldest -> newest
    candles: [
      [24509, 24620, 24480, 24590],
      [24590, 24710, 24560, 24680],
      [24680, 24700, 24487, 24540],
      [24540, 24660, 24510, 24630],
      [24630, 24780, 24610, 24750],
      [24750, 24890, 24720, 24805],
      [24805, 24860, 24700, 24813]
    ]
  },

  contact: {
    email: "support@bullbraincapital.com",
    phone: "+91 98765 43210",
    address: "Financial District, Mumbai, India"
  },

  /* -----------------------------------------------------------
     FUTURE INTEGRATION NOTE (not implemented yet — by design):

     When the contact form is submitted, this is where you'd
     configure WHERE notifications should go once that feature
     is built:

       notifications: {
         email:   { enabled: true,  to: "sales@bullbraincapital.com" },
         whatsapp:{ enabled: true,  to: "+91XXXXXXXXXX" },
         telegram:{ enabled: true,  chatId: "@bullbrain_leads" }
       }

     Today, script.js only shows a confirmation message in the
     browser and logs the submission to the console — no email,
     WhatsApp, or Telegram message is actually sent. Wiring this
     up needs a small backend (or a service like Formspree /
     Zapier / Make / a Cloud Function) because browsers cannot
     send email or WhatsApp/Telegram messages directly for
     security reasons. See README.md → "Next Steps".
  ----------------------------------------------------------- */
};
