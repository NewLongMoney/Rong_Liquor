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

let cartItems = 0;
let activeFilter = "all";

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

const initMapHighlight = () => {
  const map = document.getElementById("map");
  if (!map) return;
  map.addEventListener("mousemove", (event) => {
    const { offsetX, offsetY } = event;
    map.style.backgroundPosition = `${offsetX / 5}% ${offsetY / 5}%`;
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
initMapHighlight();
registerServiceWorker();

