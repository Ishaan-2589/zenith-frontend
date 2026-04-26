import { getCartAPI, fetchProductsAPI } from '../js/api.js';
import { initScrollObserver } from '../js/app.js';

// Global reference for the checkout navigation function
let navigateToCheckout = null;

export async function renderCart(containerId, handleRemoveFromCart, goToCheckout) {
    navigateToCheckout = goToCheckout;
    const container = document.getElementById(containerId);
    
    // 1. Build the Static Shell
    container.innerHTML = `
        <main class="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen">
            <header class="mb-16 reveal-up">
                <p class="font-sans text-[10px] tracking-[0.4em] uppercase text-[#B8CCB5] mb-4">Current Selection</p>
                <h1 class="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#E5E2E1]">Your Anthology</h1>
            </header>
            
            <div id="cart-content-area" class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                <p class="col-span-12 text-center text-[#8D928B] italic py-20">Retrieving selections...</p>
            </div>
        </main>
    `;
}

export async function refreshCartData(handleRemoveFromCart) {
    const container = document.getElementById('cart-content-area');
    const cartCountIndicator = document.getElementById('cart-count'); // 1. Target the navbar counter
    if (!container) return;

    try {
        const items = await getCartAPI();

        // 2. Handle Empty State & Reset Counter
        if (!items || items.length === 0) {
            if (cartCountIndicator) cartCountIndicator.innerText = "0";
            
            container.innerHTML = `
                <div class="col-span-12 py-24 text-center border-t border-[#434842]/30 reveal-up">
                    <p class="font-serif text-2xl text-[#8D928B] italic mb-8">Your anthology is currently empty.</p>
                    <button onclick="window.dispatchEvent(new Event('go-to-shop'))" class="text-[#B8CCB5] text-[10px] uppercase tracking-widest border-b border-[#B8CCB5] pb-1 hover:text-[#E5E2E1] hover:border-[#E5E2E1] transition-all">
                        Return to Gallery
                    </button>
                </div>
            `;
            return;
        }

        // 3. Calculate Totals & Count
        let subtotal = 0;
        let totalItemsCount = 0; // Track the number of items for the nav

        const itemsHtml = items.map(item => {
            const totalItemPrice = item.price * item.quantity;
            subtotal += totalItemPrice;
            totalItemsCount += item.quantity; // Add to global cart count
            
            // 4. Bulletproof Image Path Mapping
            const imgSrc = item.imageUrl || (item.product && item.product.imageUrl) || './assets/products/placeholder.jpg';
            
            return `
                <div class="flex flex-col sm:flex-row gap-8 py-8 border-b border-[#434842]/30 group reveal-up">
                    
                    <div class="w-32 h-40 bg-[#1C1B1B] overflow-hidden flex-shrink-0 cursor-pointer" onclick="window.handleViewProduct('${item.productId}')">
                        <img src="${imgSrc}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                    </div>
                    
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-serif text-xl text-[#E5E2E1] font-light cursor-pointer hover:text-[#B8CCB5] transition-colors" onclick="window.handleViewProduct('${item.productId}')">${item.name}</h3>
                                <p class="font-sans text-[10px] tracking-[0.2em] uppercase text-[#8D928B] mt-2">Quantity: ${item.quantity}</p>
                            </div>
                            <p class="font-sans text-[#E5E2E1] text-lg">₹${totalItemPrice.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div class="flex justify-start mt-6">
                            <button class="btn-remove-item text-[#8D928B] text-[9px] uppercase tracking-[0.2em] hover:text-[#ff4444] transition-colors border-b border-transparent hover:border-[#ff4444] pb-1" data-id="${item.id}">
                                Revoke Selection
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 5. Update Navbar Count
        if (cartCountIndicator) cartCountIndicator.innerText = totalItemsCount;

        // 6. Inject Cart Items and Sticky Order Summary
        container.innerHTML = `
            <div class="lg:col-span-7 xl:col-span-8">
                <div class="border-t border-[#434842]/30">
                    ${itemsHtml}
                </div>
            </div>
            
            <div class="lg:col-span-5 xl:col-span-4 reveal-up">
                <div class="bg-[#1C1B1B] p-8 border border-[#434842]/20 sticky top-32">
                    <h2 class="font-serif text-2xl text-[#E5E2E1] mb-8 border-b border-[#434842]/30 pb-4">Acquisition Summary</h2>
                    
                    <div class="space-y-6 mb-8">
                        <div class="flex justify-between text-[#8D928B] text-sm font-light">
                            <span>Subtotal</span>
                            <span>₹${subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="flex justify-between text-[#8D928B] text-sm font-light">
                            <span>Shipping & Transit</span>
                            <span class="text-[#B8CCB5] uppercase text-[9px] tracking-widest font-bold">Complimentary</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between text-[#E5E2E1] text-xl font-serif mb-10 pt-6 border-t border-[#434842]/30">
                        <span>Total Estimated</span>
                        <span>₹${subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <button id="btn-proceed-checkout" class="w-full bg-[#B8CCB5] text-[#131313] py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#839681] transition-colors">
                        Secure Checkout
                    </button>
                </div>
            </div>
        `;

        // Action Listeners
        container.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                handleRemoveFromCart(id);
            });
        });

        document.getElementById('btn-proceed-checkout').addEventListener('click', () => {
            if(navigateToCheckout) navigateToCheckout();
        });

        initScrollObserver();

    } catch (error) {
        if (cartCountIndicator) cartCountIndicator.innerText = "0";
        container.innerHTML = `
            <div class="col-span-12 text-center py-20">
                <p class="text-[#ff4444] text-[10px] uppercase tracking-widest">Unable to verify credentials. Please sign in to view your anthology.</p>
                <button onclick="window.dispatchEvent(new Event('auth-expired'))" class="mt-6 text-[#B8CCB5] text-[10px] uppercase tracking-widest border-b border-[#B8CCB5] pb-1">Authenticate</button>
            </div>
        `;
    }
}