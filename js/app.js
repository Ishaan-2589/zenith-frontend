import { renderCart, refreshCartData } from "../pages/cart.js";
import { renderAuth } from "../pages/auth.js";
import { renderHome } from "../pages/home.js";
import { renderProfile, refreshOrderHistory } from "../pages/profile.js";
import { renderShop } from "../pages/shop.js";
import { renderAbout } from "../pages/about.js";
import { initSearch } from "../pages/search.js"; 
import { renderAdmin, renderAdminAuth } from '../pages/admin.js';
import { setupSellerDashboard } from '../pages/sellerDashboard.js';
import { renderOrderSuccess } from "../pages/orderSuccess.js";
import { renderTrackOrder } from "../pages/trackOrder.js";
import { renderCheckout, populateCheckoutSummary } from "../pages/checkout.js"; 
import { renderProductDetail } from "../pages/product.js"; 
import {
  removeFromCartAPI,
  addToCartAPI,
  placeOrderAPI,
  getCartAPI,
} from "./api.js";

// ==========================================
// Main Application Controller
// ==========================================
const views = {
  home: document.getElementById("view-home"),
  shop: document.getElementById("view-shop"),
  productDetail: document.getElementById("view-product-detail"),
  cart: document.getElementById("view-cart"),
  checkout: document.getElementById("view-checkout"),
  auth: document.getElementById("view-auth"),
  profile: document.getElementById("view-profile"),
  about: document.getElementById("view-about"),
  adminAuth: document.getElementById("view-admin-auth"),
  admin: document.getElementById("view-admin"),
  sellerDashboard: document.getElementById("view-seller-dashboard"), // New Dashboard
  orderSuccess: document.getElementById("view-order-success"),
  trackOrder: document.getElementById("view-track-order"),
};

const navBtns = {
  brand: document.getElementById("nav-brand-img"),
  home: document.getElementById("nav-home"),
  shop: document.getElementById("nav-shop"),
  about: document.getElementById("nav-about"),
  cart: document.getElementById("nav-cart"),
  profile: document.getElementById("nav-profile"),
};

const historyStack = [];

// --- Global Utilities ---
export function showToast(message, isError = false) {
  const toastEl = document.getElementById("toast");
  toastEl.textContent = message;

  if (isError) {
    toastEl.style.borderColor = "rgba(255, 68, 68, 0.3)"; 
    toastEl.style.color = "#ffaaaa"; 
  } else {
    toastEl.style.borderColor = "var(--accent-primary)"; 
    toastEl.style.color = "var(--text-primary)";
  }

  toastEl.classList.remove("hidden");
  setTimeout(() => toastEl.classList.add("hidden"), 3500);
}

export function switchView(viewName, isGoingBack = false) {
  let currentViewName = null;

  Object.keys(views).forEach((key) => {
    if (views[key] && views[key].classList.contains("active")) {
      currentViewName = key;
    }
  });

  if (currentViewName === viewName) return;

  if (currentViewName && !isGoingBack) {
    historyStack.push(currentViewName);
  }

  const backBtn = document.getElementById("nav-back");
  if (historyStack.length > 0 && viewName !== "home") {
    backBtn.style.display = "block";
  } else {
    backBtn.style.display = "none";
    if (viewName === "home") historyStack.length = 0;
  }

  // INSTANT VIEW SWITCH (No timeouts, no loader)
  Object.values(views).forEach((view) => {
    if (view) {
      view.classList.remove("active");
      view.classList.add("hidden");
    }
  });

  const targetView = views[viewName];
  if (targetView) {
    targetView.classList.remove("hidden");
    targetView.classList.add("active");
  }

  window.scrollTo(0, 0);
}

// JWT Decoder Helper
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (e) {
        return null;
    }
}

function updateNavUI() {
  const token = localStorage.getItem("token");
  const navDashboardBtn = document.getElementById('nav-dashboard');
  
  if (token) {
    navBtns.profile.innerText = "Member Profile";
    const userData = decodeJWT(token);
    
    // Show Dashboard link ONLY for Admins
    if (userData && userData.role === "ADMIN" && navDashboardBtn) {
        navDashboardBtn.classList.remove("hidden");
        navDashboardBtn.style.display = "inline-block";
    } else if (navDashboardBtn) {
        navDashboardBtn.classList.add("hidden");
        navDashboardBtn.style.display = "none";
    }
  } else {
    navBtns.profile.innerText = "Sign In";
    // Hide Dashboard link for logged-out users
    if (navDashboardBtn) {
        navDashboardBtn.classList.add("hidden");
        navDashboardBtn.style.display = "none";
    }
  }
}
// ==========================================
// ACTION HANDLERS
// ==========================================
export function handleAuthSuccess(message) {
  showToast(message);
  
  // 1. Update the Nav UI first so the Dashboard button appears if needed
  updateNavUI(); 
  
  // 2. Decode the token to check the role
  const token = localStorage.getItem("token");
  const userData = decodeJWT(token);

  // 3. Smart Routing
  if (userData && userData.role === "ADMIN") {
      showToast("Admin Uplink Established.", false);
      switchView("sellerDashboard");
      setupSellerDashboard();
  } else {
      switchView("home");
  }
  
  // 4. Refresh cart for standard users
  refreshCartData(handleRemoveFromCart);
}

export function handleLogout() {
  localStorage.clear(); // Complete wipe per requirements
  updateNavUI();
  document.getElementById("cart-count").innerText = "0";
  showToast("Session terminated successfully.");
  switchView("home");
}

async function handleRemoveFromCart(cartItemId) {
  try {
    await removeFromCartAPI(cartItemId);
    showToast("Item removed from anthology.");
    await refreshCartData(handleRemoveFromCart); 
  } catch (error) {
    showToast("Failed to remove item.", true);
  }
}

async function handleAddToCart(productId) {
  try {
    await addToCartAPI(productId, 1);
    showToast("Added to anthology.");
    refreshCartData(handleRemoveFromCart); 
  } catch (error) {
    
    if (error.message.includes("expired") || error.message.includes("Unauthorized") || error.message.includes("No token found")) {
      showToast("Please sign in to access your anthology.", true);
      switchView("auth"); // Instant redirect to login page
    } else {
      showToast("Failed to add item.", true);
    }
  }
}

async function handleViewProduct(productId) {
  switchView("productDetail");
  setTimeout(async () => {
    await renderProductDetail("view-product-detail", productId, handleAddToCart);
  }, 400);
}
window.handleViewProduct = handleViewProduct;
async function goToCheckout() {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Please sign in to proceed to checkout.", true);
    switchView("auth");
    return;
  }
  try {
    const cartItems = await getCartAPI();
    if (!cartItems || cartItems.length === 0) {
      showToast("Your anthology is empty. Please add items to proceed.", true);
      return; 
    }
    switchView("checkout");
    await populateCheckoutSummary();
  } catch (error) {
    showToast("Unable to verify cart status.", true);
  }
}

export function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
}

// ==========================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {

  // Initialize all pages
  await renderHome("view-home", handleAddToCart);
  await renderShop("view-shop", handleAddToCart, handleViewProduct);
  await renderCart("view-cart", handleRemoveFromCart, goToCheckout); 
  await renderCheckout("view-checkout", handleRemoveFromCart);
  renderAuth("view-auth", handleAuthSuccess);
  renderProfile("view-profile", handleLogout);
  renderAbout("view-about");
  renderOrderSuccess("view-order-success");
  
  
  // Init new Seller Dashboard if it exists
  initSearch(handleViewProduct);

  window.addEventListener("go-to-shop", () => switchView("shop")); 

  updateNavUI();
  if (localStorage.getItem("token")) {
    try { await refreshCartData(handleRemoveFromCart); } catch (err) { switchView("auth"); }
  }

  document.getElementById("nav-back")?.addEventListener("click", () => {
    if (historyStack.length > 0) {
      const previousView = historyStack.pop();
      switchView(previousView, true); 
    }
  });

  // Routing Events
  navBtns.brand?.addEventListener("click", () => switchView("home"));
  navBtns.home?.addEventListener("click", () => switchView("home"));
  navBtns.shop?.addEventListener("click", () => switchView("shop"));
  navBtns.about?.addEventListener("click", () => switchView("about"));
  
document.getElementById('nav-dashboard')?.addEventListener("click", async () => {
    switchView("sellerDashboard");
    await setupSellerDashboard();
});
  
  navBtns.cart?.addEventListener("click", async () => {
    switchView("cart");
    try { await refreshCartData(handleRemoveFromCart); } catch (err) { /* ignore */ }
  });

  navBtns.profile?.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (token) {
      switchView("profile");
      await refreshOrderHistory();
    } else {
      switchView("auth");
    }
  });

  // Admin / Ghost Door Events
  window.addEventListener('exit-admin-flow', () => {
      document.querySelector(".navbar").style.display = 'flex'; 
      switchView('home');
  });

  document.getElementById('admin-exit')?.addEventListener('click', () => {
      document.querySelector(".navbar").style.display = 'flex'; 
      showToast("Session terminated.");
      switchView('home');
  });
});

// Global Listeners
window.addEventListener("auth-expired", () => {
  updateNavUI(); 
  document.getElementById("cart-count").innerText = "0";
  switchView("auth"); 
  showToast("Session expired. Please sign in again.", true);
});

window.addEventListener("scroll", () => {
  const img = document.querySelector(".hero-img");
  if (!img) return;
  img.style.transform = `translateY(${window.scrollY * 0.2}px) scale(1.05)`;
});
