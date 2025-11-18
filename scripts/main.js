import { drops, categories } from "./data.js";

// State
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let deliveryLocation = localStorage.getItem("deliveryLocation") || null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeAgeGate();
  initializeLocation();
  initializeCart();
  initializeCategories();
  initializeProducts();
  updateCartUI();
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

// Location
function initializeLocation() {
  const locationSelector = document.querySelector(".location-selector");
  const locationValue = document.getElementById("delivery-location");
  const locationModal = document.getElementById("location-modal");
  const closeModal = document.getElementById("close-location-modal");
  const saveLocation = document.getElementById("save-location");
  const addressInput = document.getElementById("address-input");

  if (deliveryLocation) {
    locationValue.textContent = deliveryLocation;
  }

  locationSelector?.addEventListener("click", () => {
    locationModal?.classList.add("active");
    addressInput?.focus();
  });

  closeModal?.addEventListener("click", () => {
    locationModal?.classList.remove("active");
  });

  locationModal?.addEventListener("click", (e) => {
    if (e.target === locationModal) {
      locationModal.classList.remove("active");
    }
  });

  saveLocation?.addEventListener("click", () => {
    const address = addressInput?.value.trim();
    if (address) {
      deliveryLocation = address;
      localStorage.setItem("deliveryLocation", address);
      locationValue.textContent = address;
      locationModal.classList.remove("active");
    }
  });

  addressInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveLocation?.click();
    }
  });
}

// Cart
function initializeCart() {
  const cartBtn = document.getElementById("cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCart = document.getElementById("close-cart");
  const cartOverlay = document.getElementById("cart-overlay");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("open");
    cartOverlay?.classList.add("active");
  });

  closeCart?.addEventListener("click", closeCartSidebar);
  cartOverlay?.addEventListener("click", closeCartSidebar);

  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) return;
    if (!deliveryLocation) {
      document.querySelector(".location-selector")?.click();
      return;
    }
    alert(`Order placed! Total: ${getCartTotal().toLocaleString()} KES\nDelivery to: ${deliveryLocation}`);
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    closeCartSidebar();
  });
}

function closeCartSidebar() {
  document.getElementById("cart-sidebar")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("active");
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    }
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  // Update total
  if (cartTotal) {
    cartTotal.textContent = `KES ${getCartTotal().toLocaleString()}`;
  }

  // Update checkout button
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

  // Render cart items
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 2L7 6m8-4l-2 4M3 10h18M5 10l1 10h12l1-10"/>
          </svg>
          <p>Your cart is empty</p>
          <p class="empty-cart-subtitle">Add items to get started</p>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">KES ${item.price.toLocaleString()}</div>
            <div class="cart-item-controls">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
              <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      `).join("");
    }
  }
}

// Make functions global for onclick handlers
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Categories
function initializeCategories() {
  const categoriesGrid = document.getElementById("categories-grid");
  if (!categoriesGrid) return;

  const categoryList = [
    { id: "all", name: "All", icon: "🍷" },
    { id: "beer", name: "Beer", icon: "🍺" },
    { id: "whiskey", name: "Whiskey", icon: "🥃" },
    { id: "vodka", name: "Vodka", icon: "🍸" },
    { id: "wine-red", name: "Wine", icon: "🍷" },
    { id: "champagne", name: "Champagne", icon: "🥂" },
  ];

  categoriesGrid.innerHTML = categoryList.map((cat) => `
    <div class="category-card" data-category="${cat.id}">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
    </div>
  `).join("");

  categoriesGrid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentCategory = card.dataset.category;
      categoriesGrid.querySelectorAll(".category-card").forEach((c) => {
        c.style.borderColor = c === card ? "var(--primary)" : "transparent";
      });
      renderProducts();
    });
  });
}

// Products
function initializeProducts() {
  renderProducts();
}

function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const productsTitle = document.getElementById("products-title");
  if (!productsGrid) return;

  let filteredProducts = drops;
  if (currentCategory !== "all") {
    filteredProducts = drops.filter((p) => p.category === currentCategory);
  }

  if (productsTitle) {
    productsTitle.textContent = currentCategory === "all" 
      ? "All Products" 
      : categories[currentCategory] || "Products";
  }

  productsGrid.innerHTML = filteredProducts.map((product) => `
    <div class="product-card">
      <div class="product-image">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-details">${product.size} • ${product.origin || "International"}</div>
        <div class="product-footer">
          <div class="product-price">KES ${product.price.toLocaleString()}</div>
          <button class="add-to-cart" onclick="addProductToCart(${product.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

window.addProductToCart = function(productId) {
  const product = drops.find((p) => p.id === productId);
  if (product) {
    addToCart(product);
    const btn = event.target.closest(".add-to-cart");
    if (btn) {
      btn.classList.add("added");
      setTimeout(() => btn.classList.remove("added"), 2000);
    }
  }
};

// Google Maps
const STORE_LOCATION = {
  lat: -1.2833,
  lng: 36.8667,
  address: "Karagita Sanduku Park, Utawala, Nairobi"
};

window.initMap = function() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    zoom: 13,
    center: STORE_LOCATION,
    mapTypeControl: true,
    streetViewControl: false,
  });

  // Store marker
  new google.maps.Marker({
    position: STORE_LOCATION,
    map: map,
    title: "Rong Liquor Store",
    icon: {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="20" fill="#c91517" stroke="#ffffff" stroke-width="3"/>
          <text x="24" y="30" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">R</text>
        </svg>
      `),
      scaledSize: new google.maps.Size(48, 48),
      anchor: new google.maps.Point(24, 24)
    }
  });

  // Geocoder for address input
  const geocoder = new google.maps.Geocoder();
  const addressInput = document.getElementById("address-input");
  const mapInfo = document.getElementById("map-info");

  if (addressInput) {
    addressInput.addEventListener("blur", () => {
      const address = addressInput.value.trim();
      if (address) {
        geocoder.geocode({ address: address + ", Nairobi, Kenya" }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(14);

            new google.maps.Marker({
              position: location,
              map: map,
              title: "Delivery Location"
            });

            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              location,
              new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
            );
            const distanceKm = (distance / 1000).toFixed(1);

            if (mapInfo) {
              mapInfo.innerHTML = `
                <strong>✓ Location Found</strong><br>
                Distance from store: <strong>${distanceKm} km</strong><br>
                Estimated delivery: <strong>${Math.ceil(distanceKm / 0.5)}-${Math.ceil(distanceKm / 0.3)} minutes</strong>
              `;
            }
          }
        });
      }
    });
  }
};
