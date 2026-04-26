import { fetchProductsAPI } from '../js/api.js';
import { initScrollObserver } from '../js/app.js';

export async function renderHome(containerId, handleAddToCart) {
    const container = document.getElementById(containerId);

    // 1. Initial Hero Layout
    container.innerHTML = `
        <section class="hero">
            <div class="hero-content reveal-up">
                <img src="./assets/logo-navbar.png" class="hero-logo" alt="Zenith">
                <h1 class="hero-title">Cinematic<br>Essentials.</h1>
                <p class="hero-subtitle">A curated anthology of objects designed with absolute restraint and functional elegance.</p>
                <button class="btn-primary" onclick="window.dispatchEvent(new Event('go-to-shop'))">Explore Anthology</button>
            </div>
            <div class="hero-visual reveal-up">
                <img src="./assets/hero-editorial.png" class="hero-img" alt="Zenith Showcase">
            </div>
        </section>

        <section class="featured-section" style="padding: 10rem 5%;">
            <h2 class="font-serif text-[#E5E2E1]" style="font-size: 2rem; margin-bottom: 4rem; text-align: center;">Featured Acquisitions</h2>
            <div class="product-grid" id="featured-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <p style="text-align: center; color: var(--text-muted);">Syncing with vault...</p>
            </div>
        </section>
    `;

    // 2. Fetch and Render Live "Featured" Items
    try {
        const products = await fetchProductsAPI();
        const featuredGrid = document.getElementById('featured-grid');

        // Only show the first 3 items for the "Featured" look
        const featuredItems = products.slice(0, 3);

        if (featuredItems.length === 0) {
            featuredGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Vault currently empty.</p>';
        } else {
            featuredGrid.innerHTML = featuredItems.map(product => `
                <div class="product-card reveal-up" style="background: var(--card-bg); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; cursor: pointer;">
                    
                    <div class="product-image-wrapper" style="flex: 1; position: relative; overflow: hidden; aspect-ratio: 3/4;" onclick="window.handleViewProduct('${product.id}')">
                        <img src="${product.imageUrl || './assets/products/placeholder.jpg'}" alt="${product.name}" class="product-image" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: all 0.6s ease;">
                        
                        <div class="product-overlay" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s; display: flex; align-items: center; justify-content: center;">
                            <span style="border: 1px solid #fff; color: #fff; padding: 0.5rem 1.5rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 2px;">View Object</span>
                        </div>
                    </div>
                    
                    <div class="product-info" style="padding: 1.5rem;" onclick="window.handleViewProduct('${product.id}')">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <h3 class="font-serif" style="font-size: 1.2rem; color: var(--text-primary); margin: 0;">${product.name}</h3>
                        </div>
                        <span style="color: var(--accent-primary); font-weight: 400;">₹${product.price.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        document.getElementById('featured-grid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ff4444;">Archive link failed.</p>';
    }

    initScrollObserver();
}