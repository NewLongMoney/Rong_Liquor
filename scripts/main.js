import { drops, categories } from "./data.js";

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
    lat: -1.2921,
    lng: 36.8219,
  },
  {
    id: "east",
    label: "Eastlands",
    eta: "35-45 mins",
    note: "Flash promo zone for Buru, Umoja",
    fill: "#00d4ff",
    stroke: "#21ff8c",
    short: "EAS",
    lat: -1.2833,
    lng: 36.8667,
  },
  {
    id: "west",
    label: "Westlands / Parklands",
    eta: "40-55 mins",
    note: "Premium concierge riders",
    fill: "#ff1f7a",
    stroke: "#c91517",
    short: "WST",
    lat: -1.2631,
    lng: 36.8000,
  },
];

let cartItems = 0;
let activeFilter = "all";
let activeZoneId = "cbd";

const renderDrops = () => {
  if (!dropsGrid) return;
  dropsGrid.innerHTML = "";
  
  const filteredDrops = drops.filter((drop) => {
    if (activeFilter === "all") return true;
    return drop.category === activeFilter;
  });

  if (filteredDrops.length === 0) {
    dropsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }

  filteredDrops.forEach((drop) => {
    const card = document.createElement("article");
    card.className = "drop-card";
    card.innerHTML = `
      <div class="drop-image-wrapper">
        <img 
          src="${drop.image}" 
          alt="${drop.name}" 
          class="drop-image" 
          loading="lazy"
          onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400/f8f9fa/e9ecef?text=${encodeURIComponent(drop.name)}';"
        />
        <div class="drop-image-overlay"></div>
        ${drop.badge ? `<span class="badge-overlay badge-${drop.badge.toLowerCase()}">${drop.badge.toUpperCase()}</span>` : ""}
      </div>
      <div class="drop-meta">
        <h3>${drop.name}</h3>
        <p class="drop-details">${drop.size || ""} ${drop.origin ? `• ${drop.origin}` : ""}</p>
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
      if (cartCount) cartCount.textContent = cartItems;
      event.target.textContent = "Added!";
      event.target.style.background = "#21ff8c";
      setTimeout(() => {
        event.target.textContent = "Add to cart";
        event.target.style.background = "";
      }, 1200);
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter || "all";
      renderDrops();
    });
  });

  deliverNow?.addEventListener("click", () => {
    const address = document.getElementById("address")?.value;
    const message = address
      ? `ETA for ${address}: 35-50 mins depending on traffic.`
      : "Enter a Nairobi drop zone to unlock estimates.";
    alert(message);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        
        // Close mobile menu if open
        if (navList?.classList.contains("open")) {
          navList.classList.remove("open");
          navToggle?.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navList?.classList.toggle("open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navList?.classList.contains("open") && 
        !navList.contains(e.target) && 
        !navToggle?.contains(e.target)) {
      navList.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  confirmAge?.addEventListener("click", () => {
    ageGate?.classList.add("hidden");
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

let googleMap = null;
let mapMarkers = [];

const setActiveZone = (zoneId) => {
  activeZoneId = zoneId;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone || !googleMap) return;

  // Update marker styles
  mapMarkers.forEach((marker) => {
    const isActive = marker.zoneId === zoneId;
    const zoneData = zones.find((z) => z.id === marker.zoneId);
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: isActive ? 16 : 12,
      fillColor: zoneData.fill,
      fillOpacity: 1,
      strokeColor: zoneData.stroke,
      strokeWeight: isActive ? 4 : 3
    });
  });

  // Center map on selected zone
  googleMap.setCenter({ lat: zone.lat, lng: zone.lng });
  googleMap.setZoom(13);

  // Update zone list items
  zoneListItems.forEach((item) =>
    item.classList.toggle("active", item.dataset.zone === zoneId)
  );

  if (zoneEta) {
    zoneEta.textContent = `${zone.label}: ${zone.eta} • ${zone.note}`;
  }
};

const renderCoverageMap = () => {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Check if Google Maps is loaded
  if (typeof google === "undefined" || !google.maps) {
    console.error("Google Maps API not loaded");
    mapContainer.innerHTML = "<p>Map loading...</p>";
    return;
  }

  // Initialize Google Map centered on Nairobi
  const nairobiCenter = { lat: -1.2921, lng: 36.8219 };
  
  googleMap = new google.maps.Map(mapContainer, {
    center: nairobiCenter,
    zoom: 12,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#0f1115" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#1a1d24" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#2a2d35" }]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  // Create markers for each zone
  zones.forEach((zone) => {
    const marker = new google.maps.Marker({
      position: { lat: zone.lat, lng: zone.lng },
      map: googleMap,
      title: zone.label,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: zone.fill,
        fillOpacity: 1,
        strokeColor: zone.stroke,
        strokeWeight: 3
      },
      label: {
        text: zone.short,
        color: "#fff",
        fontSize: "11px",
        fontWeight: "bold"
      },
      zoneId: zone.id
    });

    // Add click listener to marker
    marker.addListener("click", () => {
      setActiveZone(zone.id);
    });

    mapMarkers.push(marker);
  });

  // Add click listeners to zone list items
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

// Load Instagram profile picture using API
window.loadInstagramProfilePic = async function(img, username) {
  try {
    // Use Instagram's web profile API (may require authentication in some cases)
    const apiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.contents) {
      const profileData = JSON.parse(data.contents);
      if (profileData?.data?.user?.profile_pic_url_hd) {
        img.src = profileData.data.user.profile_pic_url_hd;
        return;
      }
      if (profileData?.data?.user?.profile_pic_url) {
        img.src = profileData.data.user.profile_pic_url;
        return;
      }
    }
    
    // Fallback: Try to get from Instagram page HTML
    const pageUrl = `https://www.instagram.com/${username}/`;
    const pageProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`;
    
    const pageResponse = await fetch(pageProxyUrl);
    const pageData = await pageResponse.json();
    
    if (pageData.contents) {
      // Extract from meta tag
      const metaMatch = pageData.contents.match(/<meta property="og:image" content="([^"]+)"/);
      if (metaMatch && metaMatch[1]) {
        img.src = metaMatch[1];
        return;
      }
    }
    
    console.warn(`Could not load Instagram profile picture for ${username}`);
  } catch (error) {
    console.error(`Error loading Instagram profile picture for ${username}:`, error);
  }
};

// Load Instagram profile pictures on page load
const loadInstagramImages = async () => {
  const images = document.querySelectorAll('img[onerror*="loadInstagramProfilePic"]');
  images.forEach((img) => {
    const onerrorAttr = img.getAttribute('onerror');
    const match = onerrorAttr.match(/loadInstagramProfilePic\(this, '([^']+)'\)/);
    if (match && match[1]) {
      loadInstagramProfilePic(img, match[1]);
    }
  });
};

// Google Maps callback function
window.initMap = () => {
  renderCoverageMap();
};

renderDrops();
attachHandlers();
initAgeGate();
// renderCoverageMap() will be called by initMap callback when Google Maps loads
if (typeof google !== "undefined" && google.maps) {
  renderCoverageMap();
}
initDeliveryForm();
registerServiceWorker();
loadInstagramImages();
