import { drops, categories } from "./data.js";

// State
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let searchQuery = "";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeAgeGate();
  initializeCart();
  initializeCategories();
  initializeProducts();
  initializeSearch();
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

// Cart Functions
function initializeCart() {
  const cartButton = document.getElementById("cart-button");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCart = document.getElementById("close-cart");
  const checkoutBtn = document.getElementById("checkout-btn");
  const closeCheckout = document.getElementById("close-checkout");
  const checkoutModal = document.getElementById("checkout-modal");
  const placeOrder = document.getElementById("place-order");

  cartButton?.addEventListener("click", () => {
    cartSidebar?.classList.add("open");
    cartOverlay?.classList.add("show");
  });

  closeCart?.addEventListener("click", closeCartSidebar);
  cartOverlay?.addEventListener("click", closeCartSidebar);

  checkoutBtn?.addEventListener("click", () => {
    closeCartSidebar();
    checkoutModal?.classList.add("show");
    updateCheckoutSummary();
  });

  closeCheckout?.addEventListener("click", () => {
    checkoutModal?.classList.remove("show");
  });

  checkoutModal?.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove("show");
    }
  });

  placeOrder?.addEventListener("click", handlePlaceOrder);
}

function closeCartSidebar() {
  document.getElementById("cart-sidebar")?.classList.remove("open");
  document.getElementById("cart-overlay")?.classList.remove("show");
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 2L7 6m8-4l-2 4M3 10h18M5 10l1 10h12l1-10"/>
          </svg>
          <p>Your cart is empty</p>
          <span>Add items to get started</span>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart.map(item => `
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
              <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      `).join("");
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  document.getElementById("cart-subtotal")?.textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById("cart-total")?.textContent = `KES ${total.toLocaleString()}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

function updateCheckoutSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  document.getElementById("checkout-subtotal")?.textContent = `KES ${subtotal.toLocaleString()}`;
  document.getElementById("checkout-total")?.textContent = `KES ${total.toLocaleString()}`;
}

function handlePlaceOrder() {
  const address = document.getElementById("checkout-address")?.value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value;

  if (!address) {
    alert("Please enter a delivery address");
    return;
  }

  // Simulate order placement
  alert(`Order placed successfully!\n\nDelivery to: ${address}\nPayment: ${payment}\n\nYou will receive a confirmation SMS shortly.`);
  
  cart = [];
  saveCart();
  updateCartUI();
  document.getElementById("checkout-modal")?.classList.remove("show");
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
    { id: "gin", name: "Gin", icon: "🍸" },
    { id: "rum", name: "Rum", icon: "🥃" },
  ];

  categoriesGrid.innerHTML = categoryList.map(cat => `
    <div class="category-card ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
      <div class="category-icon">${cat.icon}</div>
      <span>${cat.name}</span>
    </div>
  `).join("");

  categoriesGrid.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      currentCategory = card.dataset.category;
      categoriesGrid.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      renderProducts();
    });
  });
}

// Products
function initializeProducts() {
  renderProducts();
}

function initializeSearch() {
  const searchInput = document.getElementById("product-search");
  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderProducts();
  });
}

function renderProducts() {
  const productsGrid = document.getElementById("products-grid");
  const productsTitle = document.getElementById("products-title");
  
  if (!productsGrid) return;

  let filteredProducts = drops;

  // Filter by category
  if (currentCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
  }

  // Filter by search
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  if (productsTitle) {
    productsTitle.textContent = searchQuery 
      ? `Search: "${searchQuery}"`
      : currentCategory === "all" 
        ? "All Products" 
        : categories[currentCategory] || "Products";
  }

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>No products found</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-details">${product.size} • ${product.origin || 'International'}</div>
        <div class="product-footer">
          <div class="product-price">KES ${product.price.toLocaleString()}</div>
          <button class="add-btn" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            Add
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// Make addToCart global
window.addToCart = (product) => {
  addToCart(product);
  updateCartUI();
  
  // Show feedback
  const btn = event?.target;
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.style.background = "var(--success)";
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
    }, 1000);
  }
};

// Google Maps
window.initMap = function() {
  // Map initialization can be added here if needed
  console.log("Google Maps initialized");
};
