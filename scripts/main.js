import { drops, categories } from "./data.js";

let allProducts = [...drops];
let filteredProducts = [...drops];
let currentFilter = "all";
let currentSort = "default";
let currentPriceFilter = "all";
let currentView = "grid";
let displayedCount = 20;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeAgeGate();
  initializeNavigation();
  initializeSearch();
  initializeFilters();
  initializeSorting();
  initializeViewToggle();
  renderProducts();
  registerServiceWorker();
});

// Age Gate
function initializeAgeGate() {
  const ageGate = document.getElementById("age-gate");
  const confirmBtn = document.getElementById("confirm-age");
  const denyBtn = document.getElementById("deny-age");

  if (!ageGate) return;

  const ageVerified = localStorage.getItem("ageVerified");
  if (ageVerified === "true") {
    ageGate.style.display = "none";
    return;
  }

  confirmBtn?.addEventListener("click", () => {
    localStorage.setItem("ageVerified", "true");
    ageGate.style.display = "none";
  });

  denyBtn?.addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });
}

// Navigation
function initializeNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isOpen);
    nav?.classList.toggle("open");
  });

  // Close nav on outside click
  document.addEventListener("click", (e) => {
    if (!nav?.contains(e.target) && !navToggle?.contains(e.target)) {
      nav?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        nav?.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Search
function initializeSearch() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  const performSearch = () => {
    const query = searchInput?.value.toLowerCase().trim();
    
    if (!query) {
      applyFilters();
      return;
    }

    filteredProducts = allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.origin?.toLowerCase().includes(query)
      );
    });

    applySorting();
    renderProducts();
    updateSectionTitle(`Search: "${query}"`);
  };

  searchInput?.addEventListener("input", (e) => {
    if (e.target.value.trim() === "") {
      applyFilters();
    }
  });

  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  searchBtn?.addEventListener("click", performSearch);
}

// Filters
function initializeFilters() {
  const quickFilters = document.querySelectorAll(".quick-filter");
  
  quickFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      quickFilters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentFilter = btn.dataset.filter || "all";
      applyFilters();
    });
  });

  const priceFilter = document.getElementById("price-filter");
  priceFilter?.addEventListener("change", (e) => {
    currentPriceFilter = e.target.value;
    applyFilters();
  });
}

function applyFilters() {
  filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (currentFilter !== "all" && product.category !== currentFilter) {
      return false;
    }

    // Price filter
    if (currentPriceFilter !== "all") {
      const price = product.price;
      if (currentPriceFilter === "0-1000" && price >= 1000) return false;
      if (currentPriceFilter === "1000-5000" && (price < 1000 || price >= 5000)) return false;
      if (currentPriceFilter === "5000-10000" && (price < 5000 || price >= 10000)) return false;
      if (currentPriceFilter === "10000+" && price < 10000) return false;
    }

    return true;
  });

  applySorting();
  renderProducts();
  updateSectionTitle(categories[currentFilter] || "All Products");
}

// Sorting
function initializeSorting() {
  const sortSelect = document.getElementById("sort-select");
  sortSelect?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applySorting();
    renderProducts();
  });
}

function applySorting() {
  switch (currentSort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Keep original order
      break;
  }
}

// View Toggle
function initializeViewToggle() {
  const viewBtns = document.querySelectorAll(".view-btn");
  const productsGrid = document.getElementById("products-grid");

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      currentView = btn.dataset.view || "grid";
      productsGrid?.classList.toggle("list-view", currentView === "list");
      renderProducts();
    });
  });
}

// Render Products
function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const productsToShow = filteredProducts.slice(0, displayedCount);
  
  grid.innerHTML = productsToShow.map((product) => {
    const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          ${badge}
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-details">${product.size} • ${product.origin || "International"}</p>
          <div class="product-price">KES ${product.price.toLocaleString()}</div>
        </div>
        <div class="product-actions">
          <button class="add-to-cart-btn" data-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Add click handlers
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-to-cart-btn")) {
        const id = parseInt(card.dataset.id);
        // Could navigate to product detail page
        console.log("View product:", id);
      }
    });
  });

  // Add to cart handlers
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });

  // Update load more button
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    if (displayedCount >= filteredProducts.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-block";
    }
  }
}

// Load More
document.addEventListener("click", (e) => {
  if (e.target.id === "load-more") {
    displayedCount += 20;
    renderProducts();
  }
});

// Update Section Title
function updateSectionTitle(title) {
  const titleEl = document.getElementById("section-title");
  if (titleEl) {
    titleEl.textContent = title;
  }
}

// Cart Management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  
  // Visual feedback
  const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove("added");
    }, 2000);
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? "flex" : "none";
  }
}

// Initialize cart count
updateCartCount();

// Google Maps with Real Delivery Tracking
let deliveryMap = null;
let geocoder = null;
let markers = [];

window.initMap = function() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Initialize map
  deliveryMap = new google.maps.Map(mapContainer, {
    zoom: 12,
    center: { lat: -1.2921, lng: 36.8219 }, // Nairobi center
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e0e0e0" }]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  geocoder = new google.maps.Geocoder();

  // Delivery zones with coverage areas
  const zones = [
    { 
      id: "cbd", 
      label: "CBD / Upper Hill", 
      center: { lat: -1.2921, lng: 36.8219 },
      eta: "30-35 mins",
      radius: 5000 // meters
    },
    { 
      id: "east", 
      label: "Eastlands", 
      center: { lat: -1.2800, lng: 36.8500 },
      eta: "35-45 mins",
      radius: 6000
    },
    { 
      id: "west", 
      label: "Westlands", 
      center: { lat: -1.2600, lng: 36.8000 },
      eta: "40-55 mins",
      radius: 7000
    }
  ];

  // Add zone markers and circles
  zones.forEach((zone) => {
    // Zone marker
    const marker = new google.maps.Marker({
      position: zone.center,
      map: deliveryMap,
      title: zone.label,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#c91517",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2
      }
    });

    // Coverage circle
    const circle = new google.maps.Circle({
      strokeColor: "#c91517",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: "#c91517",
      fillOpacity: 0.1,
      map: deliveryMap,
      center: zone.center,
      radius: zone.radius
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 0.75rem; min-width: 200px;">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #c91517;">${zone.label}</h3>
          <p style="margin: 0; font-size: 0.9rem; color: #666;">Estimated Delivery: <strong>${zone.eta}</strong></p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #999;">Coverage: ${(zone.radius / 1000).toFixed(1)}km radius</p>
        </div>
      `
    });

    marker.addListener("click", () => {
      infoWindow.open(deliveryMap, marker);
    });

    markers.push({ marker, circle, zone });
  });

  // Check delivery button handler
  const checkDeliveryBtn = document.getElementById("check-delivery");
  const deliveryAddressInput = document.getElementById("delivery-address");
  const mapInfo = document.getElementById("map-info");

  checkDeliveryBtn?.addEventListener("click", () => {
    const address = deliveryAddressInput?.value.trim();
    if (!address) {
      mapInfo.textContent = "Please enter a delivery address.";
      mapInfo.style.color = "#c91517";
      return;
    }

    geocoder.geocode({ address: address + ", Nairobi, Kenya" }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        
        // Add user location marker
        const userMarker = new google.maps.Marker({
          position: location,
          map: deliveryMap,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }
        });

        // Center map on user location
        deliveryMap.setCenter(location);
        deliveryMap.setZoom(14);

        // Find nearest zone
        let nearestZone = null;
        let minDistance = Infinity;

        markers.forEach(({ zone }) => {
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            location,
            new google.maps.LatLng(zone.center.lat, zone.center.lng)
          );

          if (distance < minDistance && distance <= zone.radius) {
            minDistance = distance;
            nearestZone = zone;
          }
        });

        if (nearestZone) {
          mapInfo.innerHTML = `
            <strong style="color: #10b981;">✓ Delivery Available</strong><br>
            Your location is in the <strong>${nearestZone.label}</strong> zone.<br>
            Estimated delivery time: <strong>${nearestZone.eta}</strong>
          `;
          mapInfo.style.color = "#1a1a1a";
        } else {
          mapInfo.innerHTML = `
            <strong style="color: #c91517;">⚠ Limited Coverage</strong><br>
            Your location may be outside our main delivery zones.<br>
            Please contact us for delivery options: <strong>+254 700 000 000</strong>
          `;
          mapInfo.style.color = "#1a1a1a";
        }

        // Add info window for user location
        const userInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 0.75rem;">
              <strong>Your Location</strong><br>
              ${address}
            </div>
          `
        });

        userInfoWindow.open(deliveryMap, userMarker);
      } else {
        mapInfo.textContent = "Could not find that address. Please try a more specific location.";
        mapInfo.style.color = "#c91517";
      }
    });
  });

  // Enter key support
  deliveryAddressInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkDeliveryBtn?.click();
    }
  });
};

// Service Worker
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", {
        updateViaCache: "none"
      });
      
      registration.update();
      
      setInterval(() => {
        registration.update();
      }, 3600000);
      
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        }
      });
    } catch (error) {
      console.error("SW registration failed", error);
    }
  }
};

// Load Instagram profile pictures
window.loadInstagramProfilePic = async function(img, username) {
  try {
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

    const pageUrl = `https://www.instagram.com/${username}/`;
    const pageProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`;

    const pageResponse = await fetch(pageProxyUrl);
    const pageData = await pageResponse.json();

    if (pageData.contents) {
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
