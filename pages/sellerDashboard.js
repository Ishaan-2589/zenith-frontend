import {
  getAdminInventoryAPI,
  getAdminStatsAPI,
  addProductAPI,
  deleteProductAPI,
  updateProductAPI,
  getAdminOrdersAPI,
  updateOrderStatusAPI,

} from "../js/api.js";
import { showToast } from "../js/app.js";

export async function setupSellerDashboard() {
  const container = document.getElementById("view-seller-dashboard");
  if (!localStorage.getItem("token")) return;

  let stats = {};
  let products = [];
  let orders = [];

  try {
    const [fetchedStats, fetchedProducts, fetchedOrders] = await Promise.all([
      getAdminStatsAPI(),
      getAdminInventoryAPI(),
      getAdminOrdersAPI(),
    ]);
    stats = fetchedStats;
    orders = fetchedOrders;

    products =
      fetchedProducts && fetchedProducts.length > 0
        ? fetchedProducts
        : await fetchProductsAPI();
  } catch (error) {
    //console.error("Dashboard Sync Error:", error);
  }

  const pendingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  container.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
        
        .material-symbols-outlined { 
            font-family: 'Material Symbols Outlined' !important; 
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
        }
        .font-serif { font-family: 'Noto Serif', serif !important; }
        .font-sans, p, span, div { font-family: 'Inter', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .admin-tab-content { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>

    <div class="bg-[#0e0e0e] selection:bg-[#b8ccb5] selection:text-[#243424] text-[#e5e2e1] min-h-screen flex">
        
        <aside class="flex flex-col fixed left-0 top-0 h-full py-8 bg-[#131313] w-64 border-r border-[#434842]/30 z-50">
            <div class="px-8 mb-12">
                <h1 class="text-2xl font-serif text-[#B8CCB5] tracking-widest uppercase">Zenith</h1>
                <div class="mt-2 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-[#2a2a2a]">
                        <img alt="Merchant Profile" class="w-full h-full object-cover" src="./assets/logo-favicon.png"/>
                    </div>
                    <div>
                        <p class="text-xs font-serif font-medium tracking-tight text-[#B8CCB5]">Elite Curator</p>
                        <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Merchant Admin</p>
                    </div>
                </div>
            </div>
            
            <nav class="flex-1 flex flex-col gap-1" id="admin-sidebar-nav">
                <a data-target="overview" class="admin-nav-link flex items-center gap-4 px-8 py-4 text-[#B8CCB5] font-bold border-l-2 border-[#B8CCB5] bg-[#201f1f] transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-xl">dashboard</span>
                    <span class="font-serif font-medium tracking-tight">Overview</span>
                </a>
                <a data-target="orders" class="admin-nav-link flex items-center gap-4 px-8 py-4 text-[#8D928B] hover:text-[#E5E2E1] hover:bg-[#3A3939] border-l-2 border-transparent transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-xl">local_shipping</span>
                    <span class="font-serif font-medium tracking-tight">Orders</span>
                </a>
                <a data-target="inventory" class="admin-nav-link flex items-center gap-4 px-8 py-4 text-[#8D928B] hover:text-[#E5E2E1] hover:bg-[#3A3939] border-l-2 border-transparent transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-xl">inventory_2</span>
                    <span class="font-serif font-medium tracking-tight">Inventory</span>
                </a>
            </nav>
            <div class="px-8 mt-auto pt-8">
                <button id="btn-admin-logout" class="w-full flex items-center gap-4 py-3 text-[#8D928B] hover:text-[#ffb4ab] transition-colors">
                    <span class="material-symbols-outlined text-xl">logout</span>
                    <span class="text-xs uppercase tracking-widest font-sans">Sign Out</span>
                </button>
            </div>
        </aside>

        <main class="ml-64 flex-1 min-h-screen relative flex flex-col">
            
            <header class="flex justify-between items-center px-12 py-6 w-full sticky top-0 z-40 bg-[#131313]/80 backdrop-blur-xl border-b border-[#434842]/30">
                <h2 id="admin-header-title" class="text-3xl font-serif text-[#B8CCB5] tracking-tighter">Overview</h2>
            </header>

            <div class="p-12 max-w-[1600px] w-full mx-auto">
                
                <section id="tab-overview" class="admin-tab-content block space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="bg-[#1c1b1b] p-6 border border-[#434842]/30 rounded-sm">
                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-2">Total Revenue</p>
                            <h3 class="text-3xl font-serif text-[#B8CCB5]">₹${stats.totalRevenue ? stats.totalRevenue.toFixed(2) : "0.00"}</h3>
                        </div>
                        <div class="bg-[#1c1b1b] p-6 border border-[#434842]/30 rounded-sm">
                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-2">Total Orders</p>
                            <h3 class="text-3xl font-serif text-[#e5e2e1]">${orders.length || "0"}</h3>
                        </div>
                        <div class="bg-[#1c1b1b] p-6 border border-[#434842]/30 rounded-sm">
                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-2">Active Catalog</p>
                            <h3 class="text-3xl font-serif text-[#e5e2e1]">${products.length || "0"}</h3>
                        </div>
                        <div class="bg-[#1c1b1b] p-6 border border-[#434842]/30 rounded-sm">
                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-2">Pending Fulfillment</p>
                            <h3 class="text-3xl font-serif text-[#e5e2e1]">${pendingCount}</h3>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        
                        <div class="lg:col-span-1 space-y-4">
                            <h3 class="font-serif text-xl text-[#e5e2e1] mb-6">Live Operations</h3>
                            
                            <div class="bg-[#1c1b1b] p-5 border-l-4 border-[#ffb4ab] border-t border-r border-b border-[#434842]/30 flex justify-between items-center">
                                <span class="text-xs uppercase tracking-widest text-[#8d928b]">Pending</span>
                                <span class="text-xl font-serif text-[#e5e2e1]">${pendingCount}</span>
                            </div>
                            <div class="bg-[#1c1b1b] p-5 border-l-4 border-[#bdc9c4] border-t border-r border-b border-[#434842]/30 flex justify-between items-center">
                                <span class="text-xs uppercase tracking-widest text-[#8d928b]">Shipped</span>
                                <span class="text-xl font-serif text-[#e5e2e1]">${shippedCount}</span>
                            </div>
                            <div class="bg-[#1c1b1b] p-5 border-l-4 border-[#B8CCB5] border-t border-r border-b border-[#434842]/30 flex justify-between items-center">
                                <span class="text-xs uppercase tracking-widest text-[#8d928b]">Delivered</span>
                                <span class="text-xl font-serif text-[#e5e2e1]">${deliveredCount}</span>
                            </div>
                        </div>

                        <div class="lg:col-span-2 bg-[#1c1b1b] p-8 border border-[#434842]/30">
                            <h3 class="font-serif text-xl text-[#e5e2e1] mb-6">7-Day Revenue Trend</h3>
                            <div class="relative h-64 w-full">
                                <canvas id="revenueChart"></canvas>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tab-orders" class="admin-tab-content hidden space-y-8">
                    <div>
                        <h2 class="text-2xl font-serif text-[#b8ccb5] tracking-tight">Order Fulfillment</h2>
                        <p class="text-sm text-[#8d928b] mt-1">Manage shipping statuses and incoming acquisitions.</p>
                    </div>
                    
                    <div class="bg-[#1c1b1b] border border-[#434842]/30 rounded-sm">
                        <div class="grid grid-cols-6 px-8 py-4 border-b border-[#434842]/30 bg-[#201f1f] gap-4">
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Order ID</p>
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Date</p>
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Customer</p>
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Acquisitions</p>
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest">Amount</p>
                            <p class="text-[10px] text-[#8d928b] uppercase tracking-widest text-right">Status</p>
                        </div>
                        <div class="divide-y divide-[#434842]/20">
                            ${orders.length === 0 ? '<div class="p-8 text-center text-[#8d928b]">No active orders found.</div>' : 
                            
                            orders.map(order => {
                              
                                const displayId = order.orderReference || order.id || 'UNKNOWN';
                                const displayDate = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : 'N/A';
                                const customerName = order.user?.name || order.customerName || order.userName || `User #${order.user?.id || order.userId || 'Guest'}`;
                         
                                const itemsArray = order.items || order.orderItems || [];
                                let itemsHTML = '<span class="text-[#8d928b] italic text-[10px]">No items sent by backend</span>';
                                
                                if (itemsArray.length > 0) {
                                    itemsHTML = itemsArray.map(item => {
                                        const itemName = item.product?.name || item.name || `Item ID: ${item.productId}`;
                                        const qty = item.quantity || 1;
                                        return `<div class="mb-1 truncate" title="${qty}x ${itemName}">${qty}x ${itemName}</div>`;
                                    }).join('');
                                }
                                
                                return `
                                <div class="grid grid-cols-6 px-8 py-5 items-center hover:bg-[#201f1f] transition-colors gap-4">
                                    <p class="text-sm font-mono text-[#8d928b]">#${displayId}</p>
                                    <p class="text-xs text-[#e5e2e1]">${displayDate}</p>
                                    <p class="text-xs text-[#8d928b] truncate pr-4">${customerName}</p>
                                    
                                    <div class="text-[10px] text-[#e5e2e1] leading-relaxed max-h-16 overflow-y-auto no-scrollbar">
                                        ${itemsHTML}
                                    </div>
                                    
                                    <p class="text-sm text-[#b8ccb5]">₹${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</p>
                                    <div class="flex justify-end">
                                        <select class="order-status-select bg-[#131313] border ${order.status === 'Delivered' ? 'border-[#B8CCB5]/50 text-[#B8CCB5]' : 'border-[#434842]/50 text-[#e5e2e1]'} text-[10px] uppercase tracking-widest p-2 outline-none" data-id="${order.id}">
                                            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                        </select>
                                    </div>
                                </div>
                                `
                            }).join('')}
                        </div>
                    </div>
                </section>

                <section id="tab-inventory" class="admin-tab-content hidden space-y-8">
                    <div class="flex justify-between items-end border-b border-[#434842]/30 pb-6">
                        <div>
                            <h2 class="text-2xl font-serif text-[#b8ccb5] tracking-tight">Active Catalog</h2>
                            <p class="text-sm text-[#8d928b] mt-1">Manage and curate your elite collection.</p>
                        </div>
                        <button id="btn-open-add-modal" class="px-6 py-3 bg-[#b8ccb5] text-[#131313] text-xs uppercase tracking-widest font-bold hover:brightness-110 transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">add</span> Add Acquisition
                        </button>
                    </div>
                    
                    <div id="dash-inventory-list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        ${
                          products.length === 0
                            ? '<p class="text-[#8d928b] col-span-full py-8 text-center border border-[#434842]/30 bg-[#1c1b1b]">No items found in the Zenith vault.</p>'
                            : products
                                .map((product) => {
                          
                                  const price =
                                    product.price != null ? product.price : 0;
                                  const stock =
                                    product.stock != null ? product.stock : 0;
                                  const stockColor =
                                    stock < 5
                                      ? "text-[#ffb4ab]"
                                      : "text-[#8d928b]";
                                  const imgSrc =
                                    product.imageUrl ||
                                    "./assets/products/placeholder.jpg";

                                  return `
                            <div class="flex items-center gap-6 p-4 bg-[#1c1b1b] border border-[#434842]/30 group hover:border-[#b8ccb5]/50 transition-all relative">
                                <div class="w-24 h-32 bg-[#0e0e0e] flex-shrink-0 overflow-hidden border border-[#434842]/20">
                                    <img alt="${product.name || "Unknown Object"}" 
                                         class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                         src="${imgSrc}"
                                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500/1C1B1B/8D928B?text=Archived';"/>
                                </div>
                                
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-serif text-lg text-[#e5e2e1] truncate" title="${product.name}">${product.name || "Unnamed Object"}</h4>
                                    <p class="text-[9px] uppercase tracking-widest text-[#8d928b] mb-4">ID: #${product.id || "N/A"}</p>
                                    
                                    <div class="flex justify-between items-end">
                                        <div>
                                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-1">Stock Level</p>
                                            <p class="text-sm font-medium ${stockColor}">${stock} Units</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-[10px] uppercase tracking-widest text-[#8d928b] mb-1">Value</p>
                                            <p class="text-sm font-medium text-[#b8ccb5]">₹${price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex flex-col gap-1 border-l border-[#434842]/30 pl-4 ml-2">
                                    <button class="btn-edit-prod p-2 text-[#8d928b] hover:text-[#b8ccb5] transition-colors" data-id="${product.id}" title="Edit Item">
                                        <span class="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button class="btn-delete-prod p-2 text-[#8d928b] hover:text-[#ffb4ab] transition-colors" data-id="${product.id}" title="Delete Item">
                                        <span class="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            </div>
                            `;
                                })
                                .join("")
                        }
                    </div>
                </section>
                
            </div>
        </main>
        <div id="modal-product" class="hidden fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-md z-50 flex items-center justify-center">
            <div class="bg-[#131313] p-8 max-w-md w-full border border-[#434842] relative">
                <div class="flex justify-between items-center mb-6">
                    <h3 id="modal-title" class="text-xl font-serif text-[#B8CCB5]">New Acquisition</h3>
                    <button id="btn-close-modal" class="text-[#8d928b] hover:text-[#ffb4ab] text-2xl leading-none">&times;</button>
                </div>
                <form id="form-product" class="space-y-6">
                    <input type="hidden" id="edit-prod-id" value="">
                    <input type="text" id="prod-name" placeholder="Product Name" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors">
                    <input type="text" id="prod-desc" placeholder="Description" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="number" id="prod-price" placeholder="Price (₹)" step="0.01" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors">
                        <input type="number" id="prod-stock" placeholder="Stock Level" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors">
                    </div>
                    <div>
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 mt-2">Product Image File</label>
                        <input type="file" id="prod-image" accept="image/*" class="w-full text-sm text-[#8d928b] file:mr-4 file:py-2 file:px-4 file:bg-[#201F1F] file:text-[#B8CCB5] file:border-0 file:cursor-pointer transition-all hover:file:brightness-110">
                    </div>
                    <button type="submit" id="btn-submit-product" class="w-full bg-[#B8CCB5] text-[#131313] py-3 uppercase tracking-widest font-bold mt-6 hover:brightness-110 transition-all">
                        Upload to Database
                    </button>
                </form>
            </div>
        </div>
  `;

  setTimeout(() => {
    const ctx = document.getElementById("revenueChart");
    if (ctx && window.Chart) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Revenue (₹)",
              data: [0, 12000, 8500, 24000, 15000, 32000, 18000], 
              borderColor: "#B8CCB5",
              backgroundColor: "rgba(184, 204, 181, 0.1)",
              borderWidth: 2,
              pointBackgroundColor: "#131313",
              pointBorderColor: "#B8CCB5",
              pointBorderWidth: 2,
              pointRadius: 4,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "rgba(67, 72, 66, 0.2)" },
              ticks: { color: "#8d928b", font: { family: "Inter", size: 10 } },
            },
            x: {
              grid: { display: false },
              ticks: { color: "#8d928b", font: { family: "Inter", size: 10 } },
            },
          },
        },
      });
    }
  }, 100);

  const navLinks = document.querySelectorAll(".admin-nav-link");
  const tabContents = document.querySelectorAll(".admin-tab-content");
  const headerTitle = document.getElementById("admin-header-title");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("data-target");
      tabContents.forEach((tab) => {
        tab.classList.remove("block");
        tab.classList.add("hidden");
      });
      navLinks.forEach((nav) => {
        nav.classList.remove(
          "bg-[#201f1f]",
          "text-[#B8CCB5]",
          "border-[#B8CCB5]",
        );
        nav.classList.add("text-[#8D928B]", "border-transparent");
      });

      document.getElementById(`tab-${targetId}`).classList.remove("hidden");
      document.getElementById(`tab-${targetId}`).classList.add("block");
      link.classList.remove("text-[#8D928B]", "border-transparent");
      link.classList.add("bg-[#201f1f]", "text-[#B8CCB5]", "border-[#B8CCB5]");
      headerTitle.innerText = link.querySelector("span:nth-child(2)").innerText;
    });
  });


  document.getElementById("btn-admin-logout").addEventListener("click", () => {
    window.dispatchEvent(new Event("auth-expired"));
  });

  const modal = document.getElementById("modal-product");
  const form = document.getElementById("form-product");

  document
    .getElementById("btn-open-add-modal")
    .addEventListener("click", () => {
      form.reset();
      document.getElementById("edit-prod-id").value = ""; // Clear ID
      document.getElementById("modal-title").innerText = "New Acquisition";
      document.getElementById("btn-submit-product").innerText =
        "Upload to Database";
      document.getElementById("prod-image").required = true;
      modal.classList.remove("hidden");
    });

  document
    .getElementById("btn-close-modal")
    .addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById("btn-submit-product");
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    try {
      const prodId = document.getElementById("edit-prod-id").value;
      const productData = {
        name: document.getElementById("prod-name").value,
        description: document.getElementById("prod-desc").value,
        price: parseFloat(document.getElementById("prod-price").value),
        stock: parseInt(document.getElementById("prod-stock").value),
      };
      const imageFile = document.getElementById("prod-image").files[0];

      if (prodId) {
        // EDIT FLOW
        await updateProductAPI(prodId, productData); 
        showToast("Product successfully updated!");
      } else {
        // ADD FLOW
        await addProductAPI(productData, imageFile);
        showToast("Product successfully added!");
      }

      modal.classList.add("hidden");
      await setupSellerDashboard(); // Refresh Data
    } catch (error) {
      showToast("Transaction failed.", true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // --- INVENTORY EDIT / DELETE LISTENERS ---
  document
    .getElementById("dash-inventory-list")
    ?.addEventListener("click", async (e) => {
      const btnEdit = e.target.closest(".btn-edit-prod");
      const btnDelete = e.target.closest(".btn-delete-prod");

      if (btnDelete) {
        const id = btnDelete.getAttribute("data-id");
        if (confirm("Permanently delete this item from the database?")) {
          try {
            await deleteProductAPI(id);
            showToast("Item deleted.");
            setupSellerDashboard();
          } catch (err) {
            showToast("Failed to delete.", true);
          }
        }
      }

      if (btnEdit) {
        const id = btnEdit.getAttribute("data-id");
        const productToEdit = products.find((p) => p.id == id);
        if (productToEdit) {

          document.getElementById("edit-prod-id").value = productToEdit.id;
          document.getElementById("prod-name").value = productToEdit.name;
          document.getElementById("prod-desc").value =
            productToEdit.description || "";
          document.getElementById("prod-price").value = productToEdit.price;
          document.getElementById("prod-stock").value = productToEdit.stock;

  
          document.getElementById("modal-title").innerText = "Update Inventory";
          document.getElementById("btn-submit-product").innerText =
            "Save Changes";
          document.getElementById("prod-image").required = false;

          modal.classList.remove("hidden");
        }
      }
    });

  document.querySelectorAll(".order-status-select").forEach((select) => {
    select.addEventListener("change", async (e) => {
      const orderId = e.target.getAttribute("data-id");
      const newStatus = e.target.value;

      try {
        e.target.disabled = true;
        await updateOrderStatusAPI(orderId, newStatus);
        showToast(`Order #${orderId} marked as ${newStatus}`);

        if (newStatus === "Delivered") {
          e.target.classList.replace("border-[#434842]/50", "border-[#B8CCB5]/50");
          e.target.classList.replace("text-[#e5e2e1]", "text-[#B8CCB5]");
        } else {
          e.target.classList.replace("border-[#B8CCB5]/50", "border-[#434842]/50");
          e.target.classList.replace("text-[#B8CCB5]", "text-[#e5e2e1]");
        }
      } catch (err) {
        showToast("Failed to update status", true);
        setTimeout(() => window.location.reload(), 1500);
      } finally {
        e.target.disabled = false;
      }
    });
  });

}