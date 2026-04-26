import { fetchProductsAPI } from "../js/api.js";
import { initScrollObserver } from "../js/app.js";

let currentProducts = [];
let currentSort = "featured";

export async function renderShop(
  containerId,
  handleAddToCart,
  handleViewProduct,
) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
    <style>
        .editorial-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 2rem;
        }
        .product-card-image {
            filter: grayscale(100%);
            transition: filter 600ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .product-card:hover .product-card-image {
            filter: grayscale(0%);
            transform: scale(1.02);
        }
    </style>

    <main class="pt-32 pb-24 px-12 max-w-[1600px] mx-auto">
        <header class="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 reveal-up">
            <div class="max-w-2xl">
                <p class="font-sans text-[10px] tracking-[0.4em] uppercase text-[#B8CCB5] mb-4">Essence of Form</p>
                <h1 class="font-serif text-6xl md:text-8xl leading-tight font-light tracking-tight italic">The Shadow Collection</h1>
            </div>
            <div class="flex items-center gap-12 font-sans text-[10px] tracking-[0.2em] uppercase text-[#8D928B]">
                <div class="custom-select-wrapper">
    <select id="shop-sort">
        <option value="featured">Featured</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
    </select>
</div>
                <div class="flex items-center gap-4 border-b border-[#434842] pb-2">
                    <span id="product-count">0 Results</span>
                </div>
            </div>
        </header>

        <section class="editorial-grid" id="shop-product-grid">
            <p style="color: var(--text-muted); grid-column: span 12; text-align: center;">Curating collection...</p>
        </section>

        <div class="mt-24 flex flex-col items-center reveal-up">
            <div class="w-px h-24 bg-[#434842]/30 mb-8"></div>
            <p class="font-serif text-[10px] tracking-[0.3em] uppercase text-[#8D928B]">End of Anthology</p>
        </div>
    </main>
    `;

  document.getElementById("shop-sort").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProductGrid(handleAddToCart, handleViewProduct);
  });

  try {
    currentProducts = await fetchProductsAPI();
    document.getElementById("product-count").innerText =
      `${currentProducts.length} Results`;
    renderProductGrid(handleAddToCart, handleViewProduct);
  } catch (error) {
    document.getElementById("shop-product-grid").innerHTML =
      `<p style="color: #ff4444; grid-column: span 12;">Failed to load the collection.</p>`;
  }
}

function renderProductGrid(handleAddToCart, handleViewProduct) {
  const grid = document.getElementById("shop-product-grid");
  if (!currentProducts || currentProducts.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">The collection is currently empty.</p>';
    return;
  }

  let sortedProducts = [...currentProducts];
  if (currentSort === "price-low")
    sortedProducts.sort((a, b) => a.price - b.price);
  else if (currentSort === "price-high")
    sortedProducts.sort((a, b) => b.price - a.price);
  else if (currentSort === "name-asc")
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = sortedProducts
    .map((product, index) => {
      let gridClass = "col-span-1 row-span-1"; // Default Small

      if (index % 7 === 0)
        gridClass = "md:col-span-2 md:row-span-2"; // Large
      else if (index % 7 === 1)
        gridClass = "md:col-span-1 md:row-span-2"; // Tall
      else if (index % 7 === 5) gridClass = "md:col-span-2 md:row-span-1"; // Wide

      return `
    <div class="product-card reveal-up ${gridClass}" 
         style="background: var(--card-bg); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; cursor: pointer;"
         onclick="window.handleViewProduct('${product.id}')">
        
        <div class="product-image-wrapper" style="flex: 1; position: relative; overflow: hidden;">
            <img src="${product.imageUrl || "./assets/products/placeholder.jpg"}" 
                 alt="${product.name}" class="product-image" 
                 style="width: 100%; height: 100%; object-fit: cover;">
            
            <div class="product-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center;">
                <span style="border: 1px solid #fff; color: #fff; padding: 0.5rem 1.5rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px;">View Object</span>
            </div>
        </div>
        
        <div class="product-info" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 class="font-serif" style="font-size: 1.2rem; color: var(--text-primary); margin: 0;">${product.name}</h3>
            </div>
            <span style="color: var(--accent-primary); font-weight: 400;">₹${product.price.toLocaleString("en-IN")}</span>
        </div>
    </div>
`;
    })
    .join("");

  // Listeners
  grid.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleAddToCart(e.target.dataset.id);
    });
  });

  grid.querySelectorAll(".btn-view-detail").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      const id = e.currentTarget.closest(".product-card").dataset.id;
      handleViewProduct(id);
    });
  });

  initScrollObserver();
}
