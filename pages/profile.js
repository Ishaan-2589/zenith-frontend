import { getOrdersAPI, getProfileAPI } from "../js/api.js";
import { initScrollObserver } from "../js/app.js";

// 1. RENDER PROFILE: Builds the Bento Grid Shell
export async function renderProfile(containerId, handleLogout) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Build the Shell
  container.innerHTML = `
        <style>
            .serif-display { font-family: 'Noto Serif', serif; }
            .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        </style>

        <main class="max-w-7xl mx-auto py-12">
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 reveal-up">
                <div class="flex items-center gap-8">
                    <div class="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <img id="profile-img" alt="Profile Avatar" class="w-full h-full object-cover" src="./assets/logo-favicon.png"/>
                    </div>
                    <div>
                        <p class="text-[#B8CCB5] font-sans text-xs tracking-[0.3em] uppercase mb-2">Elite Curator</p>
                        <h1 id="profile-name" class="serif-display text-5xl md:text-7xl font-light tracking-tight text-[#E5E2E1]">Member</h1>
                        <p id="profile-date" class="text-[#8D928B] mt-2 font-light">Member since 2026</p>
                    </div>
                </div>
                <button id="btn-profile-logout" class="bg-transparent border border-[#B8CCB5] text-[#B8CCB5] hover:bg-[#B8CCB5] hover:text-[#131313] px-8 py-3 rounded-sm font-medium transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest">
                    Sign Out
                </button>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                <section class="md:col-span-7 lg:col-span-8 bg-[#1C1B1B] p-8 rounded-lg reveal-up">
                    <h2 class="serif-display text-2xl mb-8">Personal Details</h2>
                    <div class="space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="border-b border-[#434842] py-2">
                                <p class="text-[10px] text-[#8D928B] uppercase tracking-widest mb-1">Full Name</p>
                                <p id="detail-name" class="text-[#E5E2E1]">---</p>
                            </div>
                            <div class="border-b border-[#434842] py-2">
                                <p class="text-[10px] text-[#8D928B] uppercase tracking-widest mb-1">Email Address</p>
                                <p id="detail-email" class="text-[#E5E2E1]">---</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="md:col-span-5 lg:col-span-4 bg-[#201F1F] p-8 rounded-lg flex flex-col justify-between reveal-up">
                    <div>
                        <h2 class="serif-display text-2xl mb-2">Wallet</h2>
                        <span class="text-4xl serif-display text-[#B8CCB5] block my-6">₹0.00</span>
                    </div>
                    <button class="w-full border border-[#434842] py-3 text-[10px] uppercase tracking-widest text-[#8D928B] hover:text-[#E5E2E1]">Manage Methods</button>
                </section>

                <section class="md:col-span-12 bg-[#1C1B1B] p-8 rounded-lg reveal-up">
                    <h2 class="serif-display text-2xl mb-8">Acquisition History</h2>
                    <div class="space-y-6" id="order-history-list">
                        <p class="text-[#8D928B] italic">Accessing archives...</p>
                    </div>
                </section>
            </div>
        </main>
    `;

  document
    .getElementById("btn-profile-logout")
    ?.addEventListener("click", handleLogout);

  // Initial Fetch of personal info
  try {
    const user = await getProfileAPI();
    document.getElementById("profile-name").innerText = user.name || "Member";
    document.getElementById("detail-name").innerText = user.name || "---";
    document.getElementById("detail-email").innerText = user.email || "---";
    if (user.createdAt)
      document.getElementById("profile-date").innerText =
        `Member since ${new Date(user.createdAt).getFullYear()}`;
  } catch (e) {
    //console.warn("Profile sync incomplete.");
  }

  initScrollObserver();
}

// 2. REFRESH ORDERS: Populates the list inside the shell
export async function refreshOrderHistory() {
    const orderList = document.getElementById('order-history-list');
    if (!orderList) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Unauthorized");

        const orders = await getOrdersAPI();

        if (!orders || orders.length === 0) {
           orderList.innerHTML = `<p class="text-[#8D928B] italic py-8 text-center">No recent acquisitions found.</p>`;
            return;
        }

        // Clean mapping using 'order' instead of 'item'
        orderList.innerHTML = orders.map(order => {
            const firstItem = order.items?.[0];
            const imgSrc = firstItem?.product?.imageUrl || firstItem?.imageUrl;
            const itemName = firstItem?.product?.name || firstItem?.name || 'Zenith Essential';

            return `
                <div class="flex items-center justify-between py-6 border-b border-[#434842]/30 group reveal-up">
                    <div class="flex gap-6">
                        <div class="w-16 h-20 bg-[#353534] rounded-sm overflow-hidden flex-shrink-0">
                            <img src="${imgSrc}" 
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500/1C1B1B/8D928B?text=Archived';"
                                 class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"/>
                        </div>
                        <div class="flex flex-col justify-center">
                            <p class="text-sm font-medium text-[#E5E2E1] mb-1">${itemName}</p>
                            <p class="text-[10px] text-[#8D928B] uppercase tracking-widest">Order #${order.id || 'N/A'} • ${new Date(order.date || Date.now()).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="text-right flex flex-col items-end gap-2">
                        <p class="text-sm text-[#E5E2E1] font-medium">₹${(order.totalAmount || 0).toFixed(2)}</p>
                        <span class="text-[9px] px-3 py-1 bg-[#B8CCB5]/10 text-[#B8CCB5] border border-[#B8CCB5]/20 uppercase tracking-widest font-bold">${order.status || 'Processing'}</span>
                        
                        <button class="btn-track-order text-[#B8CCB5] text-[10px] uppercase tracking-widest border-b border-[#B8CCB5] pb-1 mt-2 hover:text-[#E5E2E1] hover:border-[#E5E2E1] transition-colors" data-id="${order.id}">
                            Track Acquisition
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // LISTENERS OUTSIDE THE HTML STRING
        orderList.querySelectorAll('.btn-track-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                window.dispatchEvent(new Event('go-to-track')); 
                import('./trackOrder.js').then(module => {
                    const app = document.querySelector('.view.active');
                    if(app) app.classList.remove('active');
                    const trackView = document.getElementById('view-track-order');
                    if(trackView) {
                        trackView.classList.remove('hidden');
                        trackView.classList.add('active');
                        module.renderTrackOrder("view-track-order", id);
                    }
                });
            });
        });

        initScrollObserver();
    } catch (error) {
        orderList.innerHTML = '<p class="text-[#ff4444] text-xs uppercase tracking-widest">Archive Link Interrupted. Please re-authenticate.</p>';
    }
}