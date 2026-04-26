async function addToCart(productId) {
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productId: productId,
        quantity: 1
      })
    });

    if (res.status === 401) {
      alert("Please login first");
      return;
    }

    if (!res.ok) throw new Error("Failed");

    alert("Added to cart");
  } catch (err) {
    alert("Error adding to cart");
  }
}