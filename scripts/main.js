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
  initializeHeroSlideshow();
  initializeCategoryCards();
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
  const locationSelector = document.getElementById("location-selector");
  const locationValue = document.getElementById("delivery-location");
  const locationModal = document.getElementById("location-modal");
  const closeModal = document.getElementById("close-location-modal");
  const saveLocation = document.getElementById("save-location");
  const addressInput = document.getElementById("address-input");
  const etaTime = document.getElementById("eta-time");

  if (deliveryLocation) {
    locationValue.textContent = deliveryLocation;
    updateETA();
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
      updateETA();
    }
  });

  addressInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveLocation?.click();
    }
  });

  // Make updateETA globally accessible
  window.updateETA = function() {
    const etaTime = document.getElementById("eta-time");
    if (etaTime && deliveryLocation) {
      // Calculate ETA based on location (simplified)
      const etas = ["30-35 min", "35-45 min", "40-55 min"];
      const randomETA = etas[Math.floor(Math.random() * etas.length)];
      etaTime.textContent = randomETA;
    } else if (etaTime) {
      etaTime.textContent = "--";
    }
  };
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

// Slideshow
function initializeSlideshow() {
  const track = document.getElementById("slideshow-track");
  const dotsContainer = document.getElementById("slideshow-dots");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  
  if (!track) return;

  const slides = track.querySelectorAll(".slide");
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "slideshow-dot" + (index === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer?.appendChild(dot);
  });

  function updateSlideshow() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dotsContainer?.querySelectorAll(".slideshow-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    updateSlideshow();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
  }

  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);

  // Auto-play slideshow
  setInterval(nextSlide, 5000);

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  track.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  });

  track.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}

// Quick Filters
function initializeCategories() {
  const filterChips = document.querySelectorAll(".filter-chip");
  
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      currentCategory = chip.dataset.filter || "all";
      
      // Update active state
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      
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
  const productsCount = document.getElementById("products-count");
  if (!productsGrid) return;

  let filteredProducts = [];
  
  if (currentCategory === "all") {
    // Show 1 product per category when "All" is selected
    const categoryMap = {};
    drops.forEach((product) => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = product;
      }
    });
    filteredProducts = Object.values(categoryMap);
  } else {
    // Show only the first product in the selected category
    const categoryProducts = drops.filter((p) => p.category === currentCategory);
    filteredProducts = categoryProducts.length > 0 ? [categoryProducts[0]] : [];
  }

  if (productsTitle) {
    productsTitle.textContent = currentCategory === "all" 
      ? "Featured Products" 
      : categories[currentCategory] || "Products";
  }

  if (productsCount) {
    productsCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`;
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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

// Hero Slideshow
function initializeHeroSlideshow() {
  const track = document.getElementById("hero-slideshow-track");
  const indicators = document.getElementById("hero-slideshow-indicators");
  const prevBtn = document.getElementById("prev-hero-slide");
  const nextBtn = document.getElementById("next-hero-slide");
  
  if (!track) return;

  const slides = track.querySelectorAll(".slide");
  let currentSlide = 0;

  // Create indicators
  slides.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.className = "indicator" + (index === 0 ? " active" : "");
    indicator.addEventListener("click", () => goToSlide(index));
    indicators?.appendChild(indicator);
  });

  function updateSlideshow() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });
    
    indicators?.querySelectorAll(".indicator").forEach((ind, index) => {
      ind.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    updateSlideshow();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlideshow();
  }

  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);

  // Auto-play slideshow - seamless loop
  setInterval(nextSlide, 5000);
}

// Category Cards Click Handlers
function initializeCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (category) {
        // Update filter and scroll to products
        currentCategory = category;
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach((chip) => {
          chip.classList.remove('active');
          if (chip.dataset.filter === category) {
            chip.classList.add('active');
          }
        });
        renderProducts();
        document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Google Maps
const STORE_LOCATION = {
  lat: -1.2833,
  lng: 36.8667,
  address: "Karagita Sanduku Park, Utawala, Nairobi"
};

let deliveryMap = null;
let geocoder = null;
let storeMarker = null;

window.initMap = function() {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Initialize map
  deliveryMap = new google.maps.Map(mapContainer, {
    zoom: 13,
    center: STORE_LOCATION,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  });

  // Store marker
  storeMarker = new google.maps.Marker({
    position: STORE_LOCATION,
    map: deliveryMap,
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

  // Store info window
  const storeInfoWindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 1rem; min-width: 250px;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #c91517; font-weight: 700;">Rong Liquor Store</h3>
        <p style="margin: 0; font-size: 0.9rem; color: #666;">
          <strong>📍 Location:</strong><br>
          Karagita Sanduku Park<br>
          Utawala, Nairobi
        </p>
      </div>
    `
  });

  storeMarker.addListener("click", () => {
    storeInfoWindow.open(deliveryMap, storeMarker);
  });

  // Open store info window by default
  setTimeout(() => {
    storeInfoWindow.open(deliveryMap, storeMarker);
  }, 500);

  // Geocoder for address input
  geocoder = new google.maps.Geocoder();
  const addressInput = document.getElementById("address-input");
  const mapInfo = document.getElementById("map-info");
  const saveLocationBtn = document.getElementById("save-location");

  function geocodeAddress() {
    const address = addressInput?.value.trim();
    if (!address) return;

    geocoder.geocode({ address: address + ", Nairobi, Kenya" }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        
        // Remove previous user marker if exists
        if (window.userMarker) {
          window.userMarker.setMap(null);
        }

        // Add user location marker
        window.userMarker = new google.maps.Marker({
          position: location,
          map: deliveryMap,
          title: "Delivery Location",
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

        // Calculate distance
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          location,
          new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
        );
        const distanceKm = (distance / 1000).toFixed(1);
        const eta = Math.ceil(distanceKm / 0.5) + "-" + Math.ceil(distanceKm / 0.3);

        if (mapInfo) {
          mapInfo.innerHTML = `
            <strong style="color: #10b981;">✓ Location Found</strong><br>
            Distance from store: <strong>${distanceKm} km</strong><br>
            Estimated delivery: <strong>${eta} minutes</strong>
          `;
          mapInfo.style.color = "#1a1a1a";
        }
      } else {
        if (mapInfo) {
          mapInfo.innerHTML = `<strong style="color: #c91517;">⚠ Could not find address</strong><br>Please try a more specific location.`;
          mapInfo.style.color = "#1a1a1a";
        }
      }
    });
  }

  // Geocode on input blur
  addressInput?.addEventListener("blur", geocodeAddress);
  
  // Geocode on Enter key
  addressInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      geocodeAddress();
    }
  });

  // Save location button
  saveLocationBtn?.addEventListener("click", () => {
    const address = addressInput?.value.trim();
    if (address) {
      deliveryLocation = address;
      localStorage.setItem("deliveryLocation", address);
      document.getElementById("delivery-location").textContent = address;
      document.getElementById("location-modal")?.classList.remove("active");
      updateETA();
    }
  });
};
