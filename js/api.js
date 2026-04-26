const API_BASE_URL = "http://localhost:8080/api";

/**
 * HELPER: getAuthHeaders
 * Retrieves token and returns standard headers.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please log in.");
  }
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

/**
 * HELPER: authenticatedFetch
 * A wrapper for fetch that automatically adds Auth headers and 'credentials: include'
 * to satisfy Spring Boot's CORS requirements for authenticated requests.
 */
async function authenticatedFetch(url, options = {}) {
  const headers = getAuthHeaders();
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: "include", 
  });
}

// ==========================
// AUTH APIs
// ==========================

export async function loginAPI(credentials) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const data = await res.json();
  // Backend returns the token string or an object { token: "..." }
  return data.token || data; 
}

export async function registerAPI(userData) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// ==========================
// PRODUCT APIs
// ==========================

export async function fetchProductsAPI() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductByIdAPI(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // console.warn("Direct ID fetch failed, falling back to list filter.");
  }

  // Fallback: Fetch all and find the matching ID locally
  const products = await fetchProductsAPI();
  return products.find((p) => p.id == id);
}

// ==========================
// CART APIs
// ==========================

export async function getCartAPI() {
  if (!localStorage.getItem("token")) return [];

  const res = await authenticatedFetch(`${API_BASE_URL}/cart`);

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-expired"));
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCartAPI(productId, quantity = 1) {
  const res = await authenticatedFetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    body: JSON.stringify({
      productId: Number(productId),
      quantity: quantity,
    }),
  });

  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to add to cart");

  const textRes = await res.text();
  return textRes ? JSON.parse(textRes) : {};
}

export async function removeFromCartAPI(cartItemId) {
  const res = await authenticatedFetch(`${API_BASE_URL}/cart/${cartItemId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove item");
  return res;
}

// ==========================
// ORDER & PAYMENT APIs
// ==========================
export async function placeOrderAPI(orderData) {

  const res = await authenticatedFetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(orderData), 
  });
  
  if (!res.ok) throw new Error("Order failed");
  return res.json();
}

export async function getOrdersAPI() {
  if (!localStorage.getItem("token")) return [];

  const res = await authenticatedFetch(`${API_BASE_URL}/orders`);
  
  if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch orders: ${res.status}`);
  }
  
  return res.json();
}

export async function searchProductsAPI(query) {
  const res = await fetch(`${API_BASE_URL}/products/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}
/**
 * RAZORPAY: Create Order
 * This will call the new PaymentController we discussed
 */
export async function createRazorpayOrderAPI(amount) {
  const res = await authenticatedFetch(`${API_BASE_URL}/payment/create-order?amount=${amount}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to initialize payment");
  return res.json(); // Returns the Razorpay Order Object
}

export async function verifyPaymentAPI(paymentDetails) {
  const res = await authenticatedFetch(`${API_BASE_URL}/payment/verify-payment`, {
    method: "POST",
    body: JSON.stringify(paymentDetails),
  });
  if (!res.ok) throw new Error("Payment verification failed");
  return res.json();
}

export async function getAdminStatsAPI() {
  const res = await authenticatedFetch(`${API_BASE_URL}/admin/dashboard-stats`);
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function getAdminInventoryAPI() {
  const res = await authenticatedFetch(`${API_BASE_URL}/admin/inventory`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function addProductAPI(productData, imageFile) {
  const formData = new FormData();
  
  // 1. Convert the product object into a JSON Blob 
  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  
  // 2. Append the actual image file 
  formData.append("image", imageFile);

  const token = localStorage.getItem("token");

  // The browser must automatically set it to 'multipart/form-data' with a dynamic boundary.
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload product to Cloudinary/Database");
  return res;
}

export async function deleteProductAPI(productId) {
  const res = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res;
}

export async function updateProductAPI(productId, updatedData) {
  const res = await authenticatedFetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT", 
    // For standard text updates, JSON is fine:
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res;
}

// Fetch all orders for the admin
export async function getAdminOrdersAPI() {
  try {
      const res = await authenticatedFetch(`${API_BASE_URL}/admin/orders`);
      if (res.ok) return await res.json();
      return [];
  } catch (e) {
      return []; 
  }
}

// Ping the server to update the status of an order
export async function updateOrderStatusAPI(orderId, newStatus) {
  const res = await authenticatedFetch(`${API_BASE_URL}/orders/${orderId}/status?status=${newStatus}`, {
      method: "PUT"
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res;
}

export async function getProfileAPI() {
  const res = await authenticatedFetch(`${API_BASE_URL}/users/me`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}
