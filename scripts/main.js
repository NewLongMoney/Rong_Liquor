import { drops } from "./data.js";

const dropsGrid = document.getElementById("drops-grid");
const filterButtons = document.querySelectorAll(".chip");
const cartCount = document.getElementById("cart-count");
const deliverNow = document.getElementById("deliver-now");
const navToggle = document.querySelector(".nav-toggle");
const navList = document.getElementById("nav");
const ageGate = document.getElementById("age-gate");
const confirmAge = document.getElementById("confirm-age");
const denyAge = document.getElementById("deny-age");
const zoneEta = document.getElementById("zone-eta");
const zoneListItems = document.querySelectorAll(".zones li");
const deliveryForm = document.querySelector(".delivery-form");
const deliveryEta = document.getElementById("delivery-eta");

const zones = [
  {
    id: "cbd",
    label: "CBD / Upper Hill",
    eta: "30-35 mins",
    note: "Bike + sprinter vans on standby",
    fill: "#c91517",
    stroke: "#ff5f1f",
    short: "CBD",
    cx: 150,
    cy: 90,
  },
  {
    id: "east",
    label: "Eastlands",
    eta: "35-45 mins",
    note: "Flash promo zone for Buru, Umoja",
    fill: "#00d4ff",
    stroke: "#21ff8c",
    short: "EAS",
    cx: 240,
    cy: 150,
  },
  {
    id: "west",
    label: "Westlands / Parklands",
    eta: "40-55 mins",
    note: "Premium concierge riders",
    fill: "#ff1f7a",
    stroke: "#c91517",
    short: "WST",
    cx: 90,
    cy: 160,
  },
];

let cartItems = 0;
let activeFilter = "all";
let activeZoneId = "cbd";

const renderDrops = () => {
  if (!dropsGrid) return;
  dropsGrid.innerHTML = "";
  drops
    .filter((drop) => activeFilter === "all" || drop.vibe === activeFilter)
    .forEach((drop) => {
      const card = document.createElement("article");
      card.className = "drop-card";
      card.innerHTML = `
        <div class="drop-meta">
          <p class="badge">${drop.badge}</p>
          <h3>${drop.name}</h3>
          <p>${drop.mood}</p>
        </div>
        <div class="drop-price">
          <p class="price">KES ${drop.price.toLocaleString()}</p>
        </div>
        <button class="btn btn-primary" data-id="${drop.id}">
          Add to cart
        </button>
      `;
      dropsGrid.appendChild(card);
    });
};

const attachHandlers = () => {
  dropsGrid?.addEventListener("click", (event) => {
    if (event.target.matches("button[data-id]")) {
      cartItems += 1;
      cartCount.textContent = cartItems;
      event.target.textContent = "Added!";
      setTimeout(() => {
        event.target.textContent = "Add to cart";
      }, 1200);
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderDrops();
    });
  });

  deliverNow?.addEventListener("click", () => {
    const address = document.getElementById("address").value;
    const message = address
      ? `ETA for ${address}: 35-50 mins depending on traffic.`
      : "Enter a Nairobi drop zone to unlock estimates.";
    alert(message);
  });

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("open");
  });

  confirmAge?.addEventListener("click", () => {
    ageGate.classList.add("hidden");
    localStorage.setItem("rong-age-verified", "true");
  });

  denyAge?.addEventListener("click", () => {
    window.location.href = "https://www.google.com/search?q=mocktails";
  });
};

const initAgeGate = () => {
  const verified = localStorage.getItem("rong-age-verified");
  if (!ageGate) return;
  if (verified) {
    ageGate.classList.add("hidden");
  }
};

const renderCoverageMap = () => {
  const map = document.getElementById("map");
  if (!map) return;
  const routePath =
    "M40 190 C80 140, 140 120, 190 140 S300 210, 320 160";
  const svgMarkup = `
    <svg viewBox="0 0 360 240" role="img" aria-label="Rong Liquor delivery coverage">
      <defs>
        <linearGradient id="cityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#12141b"/>
          <stop offset="100%" stop-color="#1f2330"/>
        </linearGradient>
        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff1f7a"/>
          <stop offset="100%" stop-color="#00d4ff"/>
        </linearGradient>
      </defs>
      <rect width="360" height="240" fill="url(#cityGradient)"/>
      <path d="${routePath}" stroke="url(#routeGradient)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9" stroke-dasharray="8 10"/>
      ${zones
        .map(
          (zone) => `
        <g data-zone="${zone.id}" class="zone-group">
          <circle class="zone-circle" cx="${zone.cx}" cy="${zone.cy}" r="28" fill="${zone.fill}" stroke="${zone.stroke}" stroke-width="5" />
          <text x="${zone.cx}" y="${zone.cy + 5}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="12" fill="#0f1115" font-weight="700">${zone.short}</text>
        </g>
      `
        )
        .join("")}
    </svg>
  `;
  map.innerHTML = svgMarkup;

  const setActiveZone = (zoneId) => {
    activeZoneId = zoneId;
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    map.querySelectorAll(".zone-circle").forEach((node) => node.classList.remove("active"));
    const activeCircle = map.querySelector(`[data-zone="${zoneId}"] .zone-circle`);
    activeCircle?.classList.add("active");
    zoneListItems.forEach((item) =>
      item.classList.toggle("active", item.dataset.zone === zoneId)
    );
    if (zoneEta) {
      zoneEta.textContent = `${zone.label}: ${zone.eta} • ${zone.note}`;
    }
  };

  map.querySelectorAll("[data-zone]").forEach((group) => {
    group.addEventListener("click", () => setActiveZone(group.dataset.zone));
  });

  zoneListItems.forEach((item) => {
    item.addEventListener("click", () => setActiveZone(item.dataset.zone));
  });

  setActiveZone(activeZoneId);
};

const initDeliveryForm = () => {
  if (!deliveryForm || !deliveryEta) return;
  deliveryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const locationField = deliveryForm.querySelector('input[type="text"]');
    const locationValue = locationField?.value.trim();
    if (!locationValue) {
      deliveryEta.textContent = "Drop zone required – ping your estate.";
      deliveryEta.classList.add("warning");
      return;
    }
    deliveryEta.classList.remove("warning");
    const zoneMeta = zones.find((zone) => zone.id === activeZoneId) || zones[0];
    deliveryEta.textContent = `${locationValue} locked. Rider ETA ${zoneMeta.eta}. Tracking link sent via SMS & WhatsApp.`;
  });
};

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./service-worker.js");
    } catch (error) {
      console.error("SW registration failed", error);
    }
  }
};

renderDrops();
attachHandlers();
initAgeGate();
renderCoverageMap();
initDeliveryForm();
registerServiceWorker();

