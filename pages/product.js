import { fetchProductByIdAPI, fetchProductsAPI } from '../js/api.js';
import { initScrollObserver } from '../js/app.js';

export async function renderProductDetail(containerId, productId, handleAddToCart) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
        <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
            <p style="color: var(--text-muted); font-style: italic;">Curating details...</p>
        </div>
    `;
    const allProducts = await fetchProductsAPI();
    const similarProducts = allProducts.filter(p => p.id != productId).slice(0, 4);

    try {
        const product = await fetchProductByIdAPI(productId);
        if (!product) throw new Error("Item not found");

        container.innerHTML = `
            <section class="product-detail-section" style="min-height: 100vh; padding: 7rem 5% 5rem 5%; display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center;">
                
                <div class="product-visual reveal-up" style="height: 80vh; background: var(--card-bg); overflow: hidden; border-radius: 2px;">
                    <img src="${product.imageUrl || './assets/products/placeholder.jpg'}" 
                         alt="${product.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; filter: contrast(1.05);">
                </div>

                <div class="product-info-panel reveal-up" style="max-width: 480px;">
                    
                    <span style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px;">01 / Object</span>
                    
                    <h1 style="font-family: var(--font-serif); font-size: clamp(2.5rem, 4vw, 4rem); font-weight: 400; margin: 1rem 0 2rem 0; line-height: 1.1; color: var(--text-primary);">
                        ${product.name}
                    </h1>
                    
                    <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">
                        ${product.description}
                    </p>
                    
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 4rem; padding-left: 1rem; border-left: 1px solid var(--accent-primary);">
                        Designed with absolute restraint. Every angle serves a distinct purpose, eliminating the unnecessary to elevate the essential.
                    </p>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 2rem; border-top: 1px solid var(--border-subtle);">
                        <span style="font-size: 1.5rem; font-weight: 300; color: var(--text-primary);">₹${product.price.toFixed(2)}</span>
                        <button class="btn-primary" id="btn-add-detail" data-id="${product.id}">Add to Anthology</button>
                    </div>
                </div>
            </section>
            <section style="padding: 5rem 5% 10rem 5%; max-width: 1200px; margin: 0 auto;">
                <h2 class="font-serif reveal-up" style="font-size: 2rem; margin-bottom: 3rem; text-align: center;">Object Insights</h2>
                <div class="product-insights reveal-up" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 3rem;">
                    <div style="background: var(--card-bg); padding: 2rem; border: 1px solid var(--border-subtle);">
                        <h3 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">Craftsmanship</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
                            Each object is meticulously crafted by artisans who share our philosophy of restraint and purpose.
                        </p>
                    </div>
                    <div style="background: var(--card-bg); padding: 2rem; border: 1px solid var(--border-subtle);">
                        <h3 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">Materiality</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
                            We source materials that age gracefully, developing a unique patina that tells the story of its journey with you.
                        </p>
                    </div>
                    <div style="background: var(--card-bg); padding: 2rem; border: 1px solid var(--border-subtle);">   
                        <h3 style="font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 1rem; color: var(--text-primary);">Design Philosophy</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
                            Our objects are born from the belief that true excellence is achieved when there is nothing left to take away.
                        </p>
                    </div>
                </div>
            </section>
            <div class="max-w-[1600px] mx-auto px-6 md:px-12 pb-24">
    <div class="mt-24 border-t border-[#434842]/30 pt-16 reveal-up">
        <h2 class="font-serif text-3xl mb-12 text-[#E5E2E1] font-light tracking-tight">Curator Feedbacks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            
            <div class="border-l border-[#B8CCB5]/40 pl-6">
                <div class="flex text-[#B8CCB5] mb-4 text-sm">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                </div>
                <p class="font-sans font-light italic text-[#C4C8C0] leading-relaxed text-lg">
                    "An absolute masterpiece of restraint. The craftsmanship speaks for itself. It has elevated the entire atmosphere of my space."
                </p>
                <p class="text-[10px] uppercase tracking-widest text-[#8D928B] mt-6">Julian V. • Verified Acquisition</p>
            </div>

            <div class="border-l border-[#434842]/50 pl-6">
                <div class="flex text-[#B8CCB5] mb-4 text-sm">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">★</span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">★</span>
                </div>
                <p class="font-sans font-light italic text-[#C4C8C0] leading-relaxed text-lg">
                    "A subtle yet powerful presence. The texture and finish are exactly as depicted in the archival photos. Shipping was discreet and secure."
                </p>
                <p class="text-[10px] uppercase tracking-widest text-[#8D928B] mt-6">Eleanor T. • Verified Acquisition</p>
            </div>
            
        </div>
    </div>

    <div class="mt-32 reveal-up">
        <div class="flex justify-between items-end mb-8 border-b border-[#434842]/30 pb-4">
            <h2 class="font-serif text-2xl text-[#E5E2E1] font-light">Related Curations</h2>
            <div class="flex gap-4">
                <button id="slider-prev" class="text-[#8D928B] hover:text-[#B8CCB5] transition-colors"><span class="material-symbols-outlined"><--</span></button>
                <button id="slider-next" class="text-[#8D928B] hover:text-[#B8CCB5] transition-colors"><span class="material-symbols-outlined">--></span></button>
            </div>
        </div>
        
        <div id="similar-slider" class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8" style="scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth;">
            ${similarProducts.map(p => `
                <div class="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer" onclick="window.handleViewProduct('${p.id}')">
                    <div class="aspect-[3/4] bg-[#1C1B1B] overflow-hidden mb-4 border border-[#434842]/20">
                        <img src="${p.imageUrl || './assets/products/placeholder.jpg'}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105">
                    </div>
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-serif text-lg text-[#E5E2E1] font-light italic">${p.name}</h3>
                            <p class="font-sans text-[9px] tracking-[0.2em] uppercase text-[#8D928B] mt-1">${p.description.substring(0, 30)}...</p>
                        </div>
                        <p class="text-[#B8CCB5] text-sm">₹${p.price.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</div>
        `;

        // 'Add to Cart' listener
        document.getElementById('btn-add-detail').addEventListener('click', (e) => {
            handleAddToCart(e.target.dataset.id);
        });
        // Slider Controls
const slider = document.getElementById('similar-slider');
if (slider) {
    slider.style.cssText += "::-webkit-scrollbar { display: none; }";
    
    document.getElementById('slider-prev').addEventListener('click', () => {
        slider.scrollBy({ left: -340, behavior: 'smooth' });
    });
    document.getElementById('slider-next').addEventListener('click', () => {
        slider.scrollBy({ left: 340, behavior: 'smooth' });
    });
}

        initScrollObserver();

    } catch (error) {
        container.innerHTML = `
            <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
                <p style="color: #ff4444;">Item unavailable or archived.</p>
            </div>
        `;
    }
}