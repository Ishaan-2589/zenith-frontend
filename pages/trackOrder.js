import { getOrdersAPI } from '../js/api.js';
import { initScrollObserver } from '../js/app.js';

export async function renderTrackOrder(containerId, orderIdFromParams = null) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
    <main class="min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center">
        <div id="track-content" class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-12 text-center py-20">
                <p class="text-[#8D928B] font-serif italic">Accessing historical archives...</p>
            </div>
        </div>
    </main>
    `;

    try {
        const orders = await getOrdersAPI();
        const order = orders.find(o => o.id == orderIdFromParams) || orders[0]; 

        if (!order) {
            throw new Error("Reference not found");
        }

        const estArrival = new Date(order.date || Date.now());
        estArrival.setDate(estArrival.getDate() + 7);

        document.getElementById('track-content').innerHTML = `
            <div class="lg:col-span-7 flex flex-col space-y-12 reveal-up">
                <div class="space-y-4">
                    <span class="text-[#B8CCB5] font-sans tracking-[0.3em] text-[10px] uppercase">Archive Tracking</span>
                    <h1 class="text-5xl md:text-7xl font-serif font-light tracking-tight text-[#E5E2E1] leading-tight">
                        The Selection <br/><i class="italic">is in Transit</i>
                    </h1>
                </div>

                <div class="p-8 bg-[#1C1B1B] border-l-2 border-[#B8CCB5]/30 space-y-6 max-w-xl">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] tracking-widest text-[#8D928B] uppercase">Order Reference</span>
                        <span class="text-xl font-serif text-[#E5E2E1]">#${order.id}</span>
                    </div>
                    <p class="text-[#C4C8C0] font-sans leading-relaxed text-lg">
                        Your curation has been secured and is currently moving through our private logistics network.
                    </p>
                    <div class="flex items-center gap-4 py-4 border-y border-[#434842]/20">
                        <span class="material-symbols-outlined text-[#B8CCB5]">local_shipping</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] tracking-widest text-[#8D928B] uppercase">Current Status</span>
                            <span class="text-sm font-medium text-[#E5E2E1] uppercase tracking-widest">${order.status || 'Manifested'}</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-6 pt-4">
                    <button onclick="window.dispatchEvent(new Event('go-to-shop'))" class="px-10 py-4 bg-[#B8CCB5] text-[#243424] text-xs tracking-[0.2em] uppercase font-bold hover:opacity-90 transition-opacity text-center rounded-sm">
                        Return to Gallery
                    </button>
                </div>
            </div>

            <div class="lg:col-span-5 relative mt-12 lg:mt-0 reveal-up">
                <div class="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl">
                    <img class="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-105" src="./assets/hero-editorial.png">
                </div>
            </div>

            <section class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                <div class="space-y-4 p-8 bg-[#0E0E0E] reveal-up">
                    <span class="material-symbols-outlined text-[#B8CCB5]">package_2</span>
                    <h3 class="font-serif text-lg tracking-wide text-[#E5E2E1]">Curation Audit</h3>
                    <p class="text-sm text-[#8D928B] leading-relaxed font-light">Items are undergoing a final quality inspection before being sealed.</p>
                </div>
                <div class="space-y-4 p-8 bg-[#0E0E0E] reveal-up">
                    <span class="material-symbols-outlined text-[#B8CCB5]">local_shipping</span>
                    <h3 class="font-serif text-lg tracking-wide text-[#E5E2E1]">Discrete Transit</h3>
                    <p class="text-sm text-[#8D928B] leading-relaxed font-light">Shipped via our private network to ensure archival security.</p>
                </div>
                <div class="space-y-4 p-8 bg-[#0E0E0E] reveal-up">
                    <span class="material-symbols-outlined text-[#B8CCB5]">support_agent</span>
                    <h3 class="font-serif text-lg tracking-wide text-[#E5E2E1]">Concierge Support</h3>
                    <p class="text-sm text-[#8D928B] leading-relaxed font-light">Our dedicated team is available 24/7 for updates on your journey.</p>
                </div>
            </section>
        `;

        initScrollObserver();

    } catch (error) {
        document.getElementById('track-content').innerHTML = `
            <div class="lg:col-span-12 text-center py-20">
                <h2 class="serif-display text-2xl mb-4">Archive Reference Invalid</h2>
                <p class="text-[#8D928B] mb-8">We could not locate this specific acquisition in our records.</p>
                <button onclick="window.dispatchEvent(new Event('go-to-shop'))" class="text-[#B8CCB5] uppercase tracking-widest text-xs border-b border-[#B8CCB5] pb-1">Return to Collection</button>
            </div>
        `;
    }
}