import { fetchProductsAPI } from '../js/api.js';

let cachedProducts = [];
let isCatalogLoaded = false;

export function initSearch(handleViewProduct) {
    // Exact IDs from your original HTML
    const tray = document.getElementById('search-tray');
    const btnOpen = document.getElementById('nav-search');
    const btnClose = document.getElementById('close-search');
    const input = document.getElementById('search-input');
    const resultsGrid = document.getElementById('search-results');

    // 1. Open / Toggle Tray
    btnOpen?.addEventListener('click', async (e) => {
        e.preventDefault();

        // Toggle behavior: close if already open
        if (!tray.classList.contains('hidden')) {
            closeSearch();
            return; 
        }

        tray.classList.remove('hidden');
        input.value = '';
        resultsGrid.innerHTML = '';
        
        setTimeout(() => input.focus(), 100);

        // Fetch products only once when first opened
        if (!isCatalogLoaded) {
            try {
                resultsGrid.innerHTML = '<p style="color: #8D928B; font-style: italic; font-size: 0.9rem;">Accessing archives...</p>';
                cachedProducts = await fetchProductsAPI();
                isCatalogLoaded = true;
                resultsGrid.innerHTML = ''; // Clear loading text
            } catch (error) {
                resultsGrid.innerHTML = '<p style="color: #ffb4ab; font-size: 0.9rem;">Failed to load search data.</p>';
            }
        }
    });

    // 2. Close Tray Logic
    const closeSearch = () => {
        tray.classList.add('hidden');
        input.blur();
    };

    btnClose?.addEventListener('click', closeSearch);

    // Close on 'Escape' key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !tray.classList.contains('hidden')) {
            closeSearch();
        }
    });

    // 3. Live Smart Search (Debounced & Fuzzy)
    let debounceTimer;

    input?.addEventListener('input', (e) => {
        clearTimeout(debounceTimer); // Clear the timer on every keystroke
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            resultsGrid.innerHTML = ''; 
            return;
        }

        // Wait 300ms after the user stops typing to run the search
        debounceTimer = setTimeout(() => {
            
            const filtered = cachedProducts.filter(p => {
                const nameMatch = (p.name || '').toLowerCase().includes(query);
                const descMatch = (p.description || '').toLowerCase().includes(query);
                const catMatch = (p.category || '').toLowerCase().includes(query);
                
                return nameMatch || descMatch || catMatch;
            });

            // Handle empty results
            if (filtered.length === 0) {
                resultsGrid.innerHTML = '<p style="color: #8D928B; font-style: italic; font-size: 0.9rem;">No items match your search.</p>';
                return;
            }

            // Render Results safely
            resultsGrid.innerHTML = filtered.map(product => {
                const imgSrc = product.imageUrl || './assets/products/placeholder.jpg';
                const price = product.price != null ? product.price : 0;
                const cat = product.category || 'Archival Object';

                return `
                <div class="search-item group" data-id="${product.id}" style="cursor: pointer; display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(67, 72, 66, 0.3);">
                    
                    <div style="width: 55px; height: 70px; background: #1C1B1B; flex-shrink: 0; overflow: hidden;">
                        <img src="${imgSrc}" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500/1C1B1B/8D928B?text=Archived';"
                             style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%); transition: filter 0.5s;"
                             onmouseover="this.style.filter='grayscale(0%)'"
                             onmouseout="this.style.filter='grayscale(100%)'">
                    </div>
                    
                    <div style="display: flex; flex-direction: column; justify-content: center;">
                        <p style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.2em; color: #8D928B; margin-bottom: 4px;">${cat}</p>
                        <h4 style="font-family: 'Noto Serif', serif; font-size: 1rem; color: #E5E2E1; margin: 0 0 4px 0;">${product.name || 'Unnamed Object'}</h4>
                        <span style="color: #b8ccb5; font-size: 0.85rem;">₹${price.toLocaleString('en-IN')}</span>
                    </div>
                    
                </div>
                `
            }).join('');

            resultsGrid.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', () => {
                    closeSearch();
                    handleViewProduct(item.dataset.id);
                });
            });

        }, 300); 
    });
}