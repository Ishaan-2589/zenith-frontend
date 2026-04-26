import { initScrollObserver } from '../js/app.js';
export function renderLegalPages(containerId, pageType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const content = {
        shipping: {
            title: "Shipping & Returns",
            body: `
                <div class="space-y-8">
                    <section>
                        <h3 class="text-[#B8CCB5] uppercase text-xs tracking-widest mb-4">Domestic Transit</h3>
                        <p class="text-[#8D928B] leading-relaxed">All acquisitions within the region are handled via specialized couriers. Standard delivery is complimentary for the Zenith anthology. Expected transit time is 5-7 business days.</p>
                    </section>
                    <section>
                        <h3 class="text-[#B8CCB5] uppercase text-xs tracking-widest mb-4">The Return Protocol</h3>
                        <p class="text-[#8D928B] leading-relaxed">If a selection does not meet the archival standard, you may initiate a return within 14 days of receipt. Items must remain in original, unaltered condition.</p>
                    </section>
                </div>`
        },
        privacy: {
            title: "Privacy Policy",
            body: `
                <div class="space-y-8">
                    <p class="text-[#8D928B] leading-relaxed">At Zenith, your digital footprint is treated with archival care. We collect only necessary identification for transaction security and order fulfillment.</p>
                    <ul class="list-disc list-inside text-[#8D928B] space-y-2">
                        <li>Encrypted JWT authentication</li>
                        <li>No third-party data distribution</li>
                        <li>Secure payment processing via Razorpay</li>
                    </ul>
                </div>`
        },
        terms: {
            title: "Terms of Service",
            body: `
                <div class="space-y-8">
                    <p class="text-[#8D928B] leading-relaxed">By accessing the Zenith gateway, you agree to our curation standards. All creative assets and full-stack implementations are proprietary property of the Zenith Archive.</p>
                </div>`
        },
        contact: {
            title: "Contact Us",
            body: `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-[#B8CCB5] uppercase text-xs tracking-widest mb-4">Digital Correspondence</h3>
                        <p class="text-[#E5E2E1]">help@zenith.com</p>
                        <p class="text-[#8D928B] mt-4">Response time: Within 24 archival hours.</p>
                    </div>
                    <div>
                        <h3 class="text-[#B8CCB5] uppercase text-xs tracking-widest mb-4">HQ</h3>
                        <p class="text-[#E5E2E1]">123 Zenith Avenue</p>
                        <p class="text-[#8D928B] mt-4">Available for on-site inquiries by appointment.</p>
                    </div>
                </div>`
        }
    };

    const selected = content[pageType] || content.shipping;

    container.innerHTML = `
        <main class="min-h-screen pt-40 pb-20 px-6 md:px-24 bg-[#0e0e0e]">
            <div class="max-w-4xl mx-auto">
                <header class="border-b border-[#434842]/30 pb-12 mb-16">
                    <span class="text-[#B8CCB5] font-sans tracking-[0.4em] text-[10px] uppercase">Zenith Protocol</span>
                    <h1 class="text-5xl md:text-7xl font-serif text-[#E5E2E1] mt-4">${selected.title}</h1>
                </header>
                <div class="reveal-up">
                    ${selected.body}
                </div>
                <button onclick="window.dispatchEvent(new Event('go-to-shop'))" class="mt-20 text-[#B8CCB5] text-[10px] uppercase tracking-widest border-b border-[#B8CCB5] pb-1 hover:text-[#E5E2E1] hover:border-[#E5E2E1] transition-all">
                    Return to Gallery
                </button>
            </div>
        </main>
    `;
    initScrollObserver();
}