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
  initializeFeaturedProducts();
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
    const subtotal = getCartSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getCartTotal();
    alert(`Order placed!\n\nSubtotal: ${subtotal.toLocaleString()} KES\nDelivery Fee: ${deliveryFee.toLocaleString()} KES\nTotal: ${total.toLocaleString()} KES\n\nDelivery to: ${deliveryLocation}`);
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

// Delivery fee calculation (Uber-style pricing)
function calculateDeliveryFee(distanceKm) {
  if (!distanceKm || distanceKm <= 0) {
    return 0;
  }
  
  // Base delivery fee (KES)
  const baseFee = 150;
  
  // Distance-based fee (KES per km after first 2km)
  const freeDistance = 2; // First 2km included in base fee
  const perKmRate = 25; // KES per km after free distance
  
  if (distanceKm <= freeDistance) {
    return baseFee;
  }
  
  const additionalKm = distanceKm - freeDistance;
  const distanceFee = Math.ceil(additionalKm * perKmRate);
  
  // Maximum delivery fee cap
  const maxFee = 500;
  
  return Math.min(baseFee + distanceFee, maxFee);
}

function getDeliveryFee() {
  const locationData = localStorage.getItem("deliveryLocationData");
  if (!locationData) return 0;
  
  try {
    const data = JSON.parse(locationData);
    if (!data.lat || !data.lng) return 0;
    
    // Use stored distance if available (for when map isn't loaded)
    if (data.distanceKm) {
      return calculateDeliveryFee(data.distanceKm);
    }
    
    // Calculate distance if Google Maps is available
    if (typeof google !== 'undefined' && google.maps && google.maps.geometry) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(data.lat, data.lng),
        new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
      );
      
      if (distance) {
        const distanceKm = distance / 1000;
        // Store distance for future use
        data.distanceKm = distanceKm;
        localStorage.setItem("deliveryLocationData", JSON.stringify(data));
        return calculateDeliveryFee(distanceKm);
      }
    }
    
    // Fallback: calculate distance using Haversine formula if Google Maps isn't loaded
    const distanceKm = calculateHaversineDistance(
      data.lat, data.lng,
      STORE_LOCATION.lat, STORE_LOCATION.lng
    );
    return calculateDeliveryFee(distanceKm);
  } catch (e) {
    return 0;
  }
}

// Haversine formula to calculate distance between two lat/lng points
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getCartTotal() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = getDeliveryFee();
  return subtotal + deliveryFee;
}

function getCartSubtotal() {
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

  // Update total with delivery fee breakdown
  if (cartTotal) {
    const subtotal = getCartSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;
    
    if (deliveryFee > 0) {
      cartTotal.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.25rem; text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Subtotal: <span style="font-weight: 500;">KES ${subtotal.toLocaleString()}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Delivery: <span style="font-weight: 500;">KES ${deliveryFee.toLocaleString()}</span>
          </div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--text); margin-top: 0.25rem; border-top: 1px solid var(--border); padding-top: 0.25rem;">
            Total: KES ${total.toLocaleString()}
          </div>
        </div>
      `;
    } else {
      cartTotal.textContent = `KES ${total.toLocaleString()}`;
    }
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
    // Show ALL products in the selected category
    filteredProducts = drops.filter((p) => p.category === currentCategory);
  }

  if (productsTitle) {
    productsTitle.textContent = currentCategory === "all" 
      ? "Featured Products" 
      : categories[currentCategory] || "Products";
  }

  if (productsCount) {
    productsCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'}`;
  }

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem;">No products found in this category.</p>
      </div>
    `;
    return;
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
  let slideshowInterval = null;

  // Ensure we have slides
  if (slides.length === 0) {
    console.warn("No slides found in slideshow");
    return;
  }

  // Create indicators
  if (indicators) {
    indicators.innerHTML = ""; // Clear any existing indicators
    slides.forEach((_, index) => {
      const indicator = document.createElement("button");
      indicator.className = "indicator" + (index === 0 ? " active" : "");
      indicator.setAttribute("aria-label", `Go to slide ${index + 1}`);
      indicator.addEventListener("click", () => {
        goToSlide(index);
        resetInterval();
      });
      indicators.appendChild(indicator);
    });
  }

  function updateSlideshow() {
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
    
    if (indicators) {
      indicators.querySelectorAll(".indicator").forEach((ind, index) => {
        if (index === currentSlide) {
          ind.classList.add("active");
        } else {
          ind.classList.remove("active");
        }
      });
    }
  }

  function goToSlide(index) {
    if (index < 0) {
      currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }
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

  function resetInterval() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
    }
    slideshowInterval = setInterval(nextSlide, 5000);
  }

  // Initialize first slide
  updateSlideshow();

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetInterval();
    });
  }

  // Auto-play slideshow - seamless loop from image 1 to 4
  resetInterval();

  // Pause on hover (optional enhancement)
  if (track) {
    track.addEventListener("mouseenter", () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
      }
    });
    
    track.addEventListener("mouseleave", () => {
      resetInterval();
    });
  }
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

// Featured Products Inventory
function initializeFeaturedProducts() {
  const featuredGrid = document.getElementById('featured-products-grid');
  if (!featuredGrid) return;

  // Get all Kenyan products (one per category)
  const kenyanProducts = [];
  const categoryMap = {};
  
  drops.forEach((product) => {
    if (product.origin === "Kenya" && !categoryMap[product.category]) {
      categoryMap[product.category] = product;
      kenyanProducts.push(product);
    }
  });

  // Render featured products
  featuredGrid.innerHTML = kenyanProducts.map((product) => `
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

// Google Maps
const STORE_LOCATION = {
  lat: -1.286389,
  lng: 36.817223,
  address: "Utawala Karagita Sanduku Park, PW5W+VGF, Eastern Bypass, Nairobi, Kenya"
};

// Kenya bounds for map restriction
const KENYA_BOUNDS = {
  north: 5.5,
  south: -4.7,
  east: 41.9,
  west: 33.9
};

let deliveryMap = null;
let geocoder = null;
let autocomplete = null;
let storeMarker = null;
let routeLine = null;

window.initMap = function() {
  const mapContainer = document.getElementById("map");
  const mapInfo = document.getElementById("map-info");
  
  if (!mapContainer) return;
  
  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || !google.maps) {
    if (mapInfo) {
      mapContainer.style.display = 'none';
      mapInfo.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; background: #fff; border-radius: 8px;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
          <strong style="color: #c91517; display: block; margin-bottom: 0.5rem; font-size: 1.1rem;">Oops! Something went wrong.</strong>
          <p style="color: #666; font-size: 0.9rem; margin: 0;">This page didn't load Google Maps correctly. See the JavaScript console for technical details.</p>
        </div>
      `;
      mapInfo.style.display = 'block';
    }
    return;
  }
  
  // Ensure map container is visible when map loads successfully
  mapContainer.style.display = 'block';
  
  // Clear timeout if it exists
  if (window.mapLoadTimeout) {
    clearTimeout(window.mapLoadTimeout);
    window.mapLoadTimeout = null;
  }
  window.deliveryMapInitialized = true;

  // Initialize map centered on Nairobi, showing Kenya
  deliveryMap = new google.maps.Map(mapContainer, {
    zoom: 10,
    center: { lat: -1.2921, lng: 36.8219 }, // Nairobi center
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    restriction: {
      latLngBounds: KENYA_BOUNDS,
      strictBounds: false
    },
    minZoom: 6, // Show Kenya as a whole
    maxZoom: 18
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
          Utawala Karagita Sanduku Park<br>
          PW5W+VGF, Eastern Bypass<br>
          Nairobi, Kenya
        </p>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_LOCATION.address)}" 
           target="_blank" 
           style="display: inline-block; margin-top: 0.5rem; color: #c91517; text-decoration: none; font-size: 0.85rem;">
          View on Google Maps →
        </a>
      </div>
    `
  });

  storeMarker.addListener("click", () => {
    storeInfoWindow.open(deliveryMap, storeMarker);
  });

  // Fit map to show both store and Kenya bounds
  const kenyaBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(KENYA_BOUNDS.south, KENYA_BOUNDS.west),
    new google.maps.LatLng(KENYA_BOUNDS.north, KENYA_BOUNDS.east)
  );
  
  // Set initial view to show Nairobi area with store
  deliveryMap.fitBounds(
    new google.maps.LatLngBounds(
      new google.maps.LatLng(STORE_LOCATION.lat - 0.1, STORE_LOCATION.lng - 0.1),
      new google.maps.LatLng(STORE_LOCATION.lat + 0.1, STORE_LOCATION.lng + 0.1)
    )
  );

  // Open store info window by default
  setTimeout(() => {
    storeInfoWindow.open(deliveryMap, storeMarker);
  }, 500);

  // Geocoder for address input
  geocoder = new google.maps.Geocoder();
  const addressInput = document.getElementById("address-input");
  const mapInfo = document.getElementById("map-info");
  const saveLocationBtn = document.getElementById("save-location");

  // Initialize Google Places Autocomplete
  if (addressInput && google.maps.places) {
    autocomplete = new google.maps.places.Autocomplete(addressInput, {
      componentRestrictions: { country: 'ke' }, // Restrict to Kenya
      fields: ['geometry', 'formatted_address', 'name'],
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(KENYA_BOUNDS.south, KENYA_BOUNDS.west),
        new google.maps.LatLng(KENYA_BOUNDS.north, KENYA_BOUNDS.east)
      )
    });

    // Bias autocomplete to Nairobi area
    autocomplete.setBounds(
      new google.maps.LatLngBounds(
        new google.maps.LatLng(-1.5, 36.5),
        new google.maps.LatLng(-1.0, 37.2)
      )
    );

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry) {
        if (mapInfo) {
          mapInfo.innerHTML = `<strong style="color: #c91517;">⚠ Could not find address</strong><br>Please try a more specific location.`;
          mapInfo.style.color = "#1a1a1a";
        }
        return;
      }

      const location = place.geometry.location;
      
      // Remove previous user marker if exists
      if (window.userMarker) {
        window.userMarker.setMap(null);
      }

      // Add user location marker
      window.userMarker = new google.maps.Marker({
        position: location,
        map: deliveryMap,
        title: "Delivery Location",
        draggable: true,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3
        }
      });

      // Update address input with formatted address
      if (place.formatted_address) {
        addressInput.value = place.formatted_address;
      }

      // Center map to show both store and delivery location
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng));
      bounds.extend(location);
      deliveryMap.fitBounds(bounds);
      
      // Ensure zoom is not too far out
      if (deliveryMap.getZoom() > 15) {
        deliveryMap.setZoom(15);
      }

      // Calculate distance and update info
      updateLocationInfo(location, place.formatted_address || place.name);

      // Handle marker drag
      window.userMarker.addListener('dragend', () => {
        const newLocation = window.userMarker.getPosition();
        updateLocationInfo(newLocation, addressInput.value);
        
        // Reverse geocode to update address
        geocoder.geocode({ location: newLocation }, (results, status) => {
          if (status === "OK" && results[0]) {
            addressInput.value = results[0].formatted_address;
          }
        });
      });
    });
  }

  function drawRouteLine(deliveryLocation) {
    // Remove previous route line if exists
    if (routeLine) {
      routeLine.setMap(null);
    }

    // Draw a straight line between store and delivery location
    routeLine = new google.maps.Polyline({
      path: [
        new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng),
        deliveryLocation
      ],
      geodesic: true,
      strokeColor: '#c91517',
      strokeOpacity: 0.6,
      strokeWeight: 3,
      map: deliveryMap
    });
  }

  function updateLocationInfo(location, address) {
    // Calculate distance
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      location,
      new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
    );
    const distanceKm = parseFloat((distance / 1000).toFixed(1));
    const eta = Math.ceil(distanceKm / 0.5) + "-" + Math.ceil(distanceKm / 0.3);
    
    // Calculate delivery fee
    const deliveryFee = calculateDeliveryFee(distanceKm);
    
    // Update stored location data with distance
    const existingData = localStorage.getItem("deliveryLocationData");
    if (existingData) {
      try {
        const data = JSON.parse(existingData);
        data.distanceKm = distanceKm;
        localStorage.setItem("deliveryLocationData", JSON.stringify(data));
      } catch (e) {
        // Ignore errors
      }
    }

    if (mapInfo) {
      mapInfo.innerHTML = `
        <div style="padding: 0.75rem; background: #f0f9ff; border-left: 3px solid #10b981; border-radius: 4px;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.2rem;">✓</span>
            <strong style="color: #10b981; font-size: 1rem;">Location Found</strong>
          </div>
          <div style="font-size: 0.85rem; color: #1a1a1a; margin-bottom: 0.5rem; line-height: 1.4;">
            ${address || 'Selected location'}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #e0e0e0;">
            <div>
              <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Distance</div>
              <div style="font-size: 0.95rem; font-weight: 600; color: #1a1a1a;">${distanceKm.toFixed(1)} km</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">ETA</div>
              <div style="font-size: 0.95rem; font-weight: 600; color: #1a1a1a;">${eta} min</div>
            </div>
          </div>
          <div style="background: #fff; padding: 0.75rem; border-radius: 4px; border: 1px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Delivery Fee</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: #c91517;">KES ${deliveryFee.toLocaleString()}</div>
              </div>
              <div style="font-size: 0.7rem; color: #666; text-align: right;">
                ${distanceKm <= 2 ? 'Base fee' : `Base + ${(distanceKm - 2).toFixed(1)}km`}
              </div>
            </div>
          </div>
        </div>
      `;
      mapInfo.style.color = "#1a1a1a";
    }
    
    // Draw route line
    drawRouteLine(location);
    
    // Update cart UI to reflect new delivery fee
    updateCartUI();
  }

  // Fallback geocode function for manual entry
  function geocodeAddress() {
    const address = addressInput?.value.trim();
    if (!address) return;

    geocoder.geocode({ 
      address: address + ", Kenya",
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(KENYA_BOUNDS.south, KENYA_BOUNDS.west),
        new google.maps.LatLng(KENYA_BOUNDS.north, KENYA_BOUNDS.east)
      )
    }, (results, status) => {
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
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }
        });

        // Center map on user location
        deliveryMap.setCenter(location);
        deliveryMap.setZoom(15);

        // Calculate distance
        updateLocationInfo(location, results[0].formatted_address);
      } else {
        if (mapInfo) {
          mapInfo.innerHTML = `<strong style="color: #c91517;">⚠ Could not find address</strong><br>Please try a more specific location in Kenya.`;
          mapInfo.style.color = "#1a1a1a";
        }
      }
    });
  }

  // Geocode on input blur (fallback if autocomplete doesn't work)
  addressInput?.addEventListener("blur", () => {
    if (!autocomplete || !autocomplete.getPlace()) {
      geocodeAddress();
    }
  });
  
  // Geocode on Enter key
  addressInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!autocomplete || !autocomplete.getPlace()) {
        geocodeAddress();
      }
    }
  });

  // Save location button
  saveLocationBtn?.addEventListener("click", () => {
    const address = addressInput?.value.trim();
    if (address && window.userMarker) {
      const location = window.userMarker.getPosition();
      // Calculate distance and store it (if Google Maps is available)
      let distanceKm = null;
      if (google.maps && google.maps.geometry) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          location,
          new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
        );
        distanceKm = distance / 1000;
      } else {
        // Fallback to Haversine formula
        distanceKm = calculateHaversineDistance(
          location.lat(), location.lng(),
          STORE_LOCATION.lat, STORE_LOCATION.lng
        );
      }
      
      const locationData = {
        address: address,
        lat: location.lat(),
        lng: location.lng(),
        distanceKm: distanceKm
      };
      
      deliveryLocation = address;
      localStorage.setItem("deliveryLocation", address);
      localStorage.setItem("deliveryLocationData", JSON.stringify(locationData));
      
      const deliveryLocationEl = document.getElementById("delivery-location");
      if (deliveryLocationEl) {
        deliveryLocationEl.textContent = address.length > 40 ? address.substring(0, 40) + "..." : address;
      }
      
      document.getElementById("location-modal")?.classList.remove("active");
      updateETA();
      updateCartUI(); // Update cart to show delivery fee
    } else if (address) {
      // Fallback if marker doesn't exist - try to geocode
      geocoder.geocode({ 
        address: address + ", Kenya",
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(KENYA_BOUNDS.south, KENYA_BOUNDS.west),
          new google.maps.LatLng(KENYA_BOUNDS.north, KENYA_BOUNDS.east)
        )
      }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          // Calculate distance
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            location,
            new google.maps.LatLng(STORE_LOCATION.lat, STORE_LOCATION.lng)
          );
          const distanceKm = distance / 1000;
          
          const locationData = {
            address: address,
            lat: location.lat(),
            lng: location.lng(),
            distanceKm: distanceKm
          };
          localStorage.setItem("deliveryLocationData", JSON.stringify(locationData));
        }
        deliveryLocation = address;
        localStorage.setItem("deliveryLocation", address);
        const deliveryLocationEl = document.getElementById("delivery-location");
        if (deliveryLocationEl) {
          deliveryLocationEl.textContent = address.length > 40 ? address.substring(0, 40) + "..." : address;
        }
        document.getElementById("location-modal")?.classList.remove("active");
        updateETA();
        updateCartUI(); // Update cart to show delivery fee
      });
    } else {
      if (mapInfo) {
        mapInfo.innerHTML = `<strong style="color: #c91517;">⚠ Please select a delivery location</strong>`;
        mapInfo.style.color = "#1a1a1a";
      }
    }
  });
};
