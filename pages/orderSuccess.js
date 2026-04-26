import { initScrollObserver } from '../js/app.js';

export function renderOrderSuccess(containerId, orderDetails) {
    const container = document.getElementById(containerId);
    
    const orderId = orderDetails?.id || orderDetails?.orderId || orderDetails?.orderReference || "ZN-PENDING";
    
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 5); 
    const farDate = new Date(arrivalDate.getTime() + 86400000 * 3);

    container.innerHTML = `
    <main class="min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center bg-[#0e0e0e]">
        <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 flex flex-col space-y-12">
                <div class="space-y-4">
                    <span class="text-[#B8CCB5] font-sans tracking-[0.3em] text-[10px] uppercase">Transaction Successful</span>
                    <h1 class="text-5xl md:text-7xl font-serif font-light tracking-tight text-[#E5E2E1] leading-tight">
                        The Selection <br/><i class="italic">is Yours</i>
                    </h1>
                </div>

                <div class="p-8 bg-[#1C1B1B] border-l-2 border-[#B8CCB5]/30 space-y-6 max-w-xl reveal-up">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] tracking-widest text-[#8D928B] uppercase">Order Reference</span>
                        <span class="text-xl font-serif text-[#E5E2E1]">#${orderId}</span>
                    </div>
                    <p class="text-[#C4C8C0] font-sans leading-relaxed text-lg">
                        Your curation has been secured and is being prepared for transit. A confirmation has been dispatched to your digital correspondence.
                    </p>
                    <div class="flex items-center gap-4 py-4 border-y border-[#434842]/20">
                        <span class="material-symbols-outlined text-[#B8CCB5]">schedule</span>
                        <div class="flex flex-col">
                            <span class="text-[9px] tracking-widest text-[#8D928B] uppercase">Estimated Arrival</span>
                            <span class="text-sm font-medium text-[#E5E2E1]">
                                ${arrivalDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })} — ${farDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-6 pt-4">
                    <button id="btn-view-status" class="px-10 py-4 bg-[#B8CCB5] text-[#131313] text-xs tracking-[0.2em] uppercase font-bold hover:brightness-110 transition-all text-center rounded-sm">
                        View Order Status
                    </button>
                    <button id="btn-return-gallery" class="px-10 py-4 border border-[#8D928B]/20 text-[#E5E2E1] text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#3A3939] transition-all text-center rounded-sm">
                        Return to Gallery
                    </button>
                </div>
            </div>

            <div class="lg:col-span-5 relative mt-12 lg:mt-0 reveal-up">
                <div class="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-2xl bg-[#1c1b1b]">
                    <img class="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 scale-105" 
                         src="./assets/hero-editorial.png"
                         onerror="this.src='https://images.unsplash.com/photo-1549037173-e3b717902c57?q=80&w=2070&auto=format&fit=crop';">
                </div>
                <div class="absolute -bottom-6 -left-6 bg-[#2A2A2A] p-6 hidden md:block border border-[#434842]/30">
                    <div class="text-[9px] tracking-[0.4em] text-[#B8CCB5] uppercase mb-2">Authenticity Guaranteed</div>
                    <div class="text-[10px] text-[#8D928B] leading-tight max-w-[140px]">Every archival piece is inspected by our senior curators.</div>
                </div>
            </div>
        </div>
    </main>
    `;

    // Event Listeners for Navigation
    document.getElementById('btn-view-status').addEventListener('click', () => {
        // Change view to profile and refresh history
        window.location.hash = "#profile"; 
        location.reload(); 
    });
    
    document.getElementById('btn-return-gallery').addEventListener('click', () => {
        window.dispatchEvent(new Event('go-to-shop'));
    });

    initScrollObserver();
}