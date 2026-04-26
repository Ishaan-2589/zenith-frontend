import { fetchProductsAPI, getOrdersAPI } from '../js/api.js';
import { showToast } from '../js/app.js';

// ==========================================
// 1. ADMIN AUTHENTICATION UI
// ==========================================
export function renderAdminAuth(containerId, handleAdminLogin) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
        <section style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #050505;">
            <div style="width: 100%; max-width: 400px; padding: 3rem; border: 1px solid var(--accent-primary); background: rgba(10,10,10,0.9);">
                <div style="text-align: center; margin-bottom: 2.5rem;">
                    <span style="color: var(--accent-primary); font-family: monospace; font-size: 0.85rem; letter-spacing: 2px;">RESTRICTED AREA</span>
                    <h1 style="font-family: var(--font-sans); font-size: 1.5rem; color: #fff; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 4px;">System Override</h1>
                </div>
                
                <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <label style="color: var(--text-muted); font-family: monospace; font-size: 0.75rem; text-transform: uppercase;">Admin Designation</label>
                        <input type="text" id="admin-user" required style="width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border-subtle); color: #fff; padding: 0.5rem 0; font-family: monospace; outline: none;">
                    </div>
                    <div>
                        <label style="color: var(--text-muted); font-family: monospace; font-size: 0.75rem; text-transform: uppercase;">Security Clearance Code</label>
                        <input type="password" id="admin-pass" required style="width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border-subtle); color: #fff; padding: 0.5rem 0; font-family: monospace; outline: none; letter-spacing: 3px;">
                    </div>
                    <button type="submit" style="margin-top: 1rem; background: var(--accent-primary); color: #000; border: none; padding: 1rem; font-family: monospace; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;">Initiate Uplink</button>
                    <button type="button" id="admin-cancel" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border-subtle); padding: 0.8rem; font-family: monospace; text-transform: uppercase; cursor: pointer; transition: color 0.3s;">Cancel</button>
                </form>
            </div>
        </section>
    `;

    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;
        handleAdminLogin(user, pass);
    });

    document.getElementById('admin-cancel').addEventListener('click', () => {
        window.dispatchEvent(new Event('exit-admin-flow'));
    });
}

// ==========================================
// 2. COMPLETE SELLER DASHBOARD
// ==========================================
export function renderAdmin(containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
        <section class="admin-section" style="padding: 4rem 5%; min-height: 100vh; max-width: 1600px; margin: 0 auto;">
            
            <div style="border-bottom: 1px solid var(--accent-primary); padding-bottom: 1rem; margin-bottom: 3rem; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <span style="color: var(--accent-primary); font-family: monospace; font-size: 0.85rem; letter-spacing: 2px;">SECURE PROTOCOL ACTIVE</span>
                    <h1 style="font-family: var(--font-sans); font-size: 2rem; font-weight: 300; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 4px;">Command Center</h1>
                </div>
                <button id="admin-exit" class="btn-primary" style="padding: 0.5rem 1.5rem; font-size: 0.75rem; border-color: var(--accent-primary); color: var(--accent-primary);">Terminate Session</button>
            </div>

            <div style="display: grid; grid-template-columns: 250px 1fr; gap: 4rem; align-items: start;">
                
                <div style="background: var(--card-bg); border: 1px solid var(--border-subtle); padding: 2rem; position: sticky; top: 2rem;">
                    <ul style="list-style: none; font-family: monospace; font-size: 0.9rem; line-height: 2.5; color: var(--text-muted);">
                        <li class="admin-tab active" data-target="admin-metrics" style="color: var(--text-primary); cursor: pointer; border-left: 2px solid var(--accent-primary); padding-left: 1rem; margin-left: -2rem;">Telemetry (Overview)</li>
                        <li class="admin-tab" data-target="admin-orders" style="cursor: pointer; padding-left: 1rem; margin-left: -2rem; border-left: 2px solid transparent; transition: all 0.3s;">Global Orders</li>
                        <li class="admin-tab" data-target="admin-inventory" style="cursor: pointer; padding-left: 1rem; margin-left: -2rem; border-left: 2px solid transparent; transition: all 0.3s;">Inventory Database</li>
                    </ul>
                </div>

                <div class="admin-content-area">
                    
                    <div id="admin-metrics" class="admin-view active" style="display: block;">
                        <h2 style="font-family: monospace; font-size: 1.2rem; font-weight: 400; margin-bottom: 2rem;">Live Telemetry</h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 4rem;">
                            <div style="border: 1px solid var(--border-subtle); padding: 2rem; background: var(--card-bg);">
                                <span style="color: var(--text-muted); font-family: monospace; font-size: 0.8rem; text-transform: uppercase;">Total Revenue (30 Days)</span>
                                <div id="metric-revenue" style="font-size: 2.5rem; font-family: var(--font-serif); margin-top: 1rem; color: var(--text-primary);">$0.00</div>
                            </div>
                            <div style="border: 1px solid var(--border-subtle); padding: 2rem; background: var(--card-bg);">
                                <span style="color: var(--text-muted); font-family: monospace; font-size: 0.8rem; text-transform: uppercase;">Active Orders</span>
                                <div id="metric-orders" style="font-size: 2.5rem; font-family: var(--font-serif); margin-top: 1rem; color: var(--text-primary);">0</div>
                            </div>
                            <div style="border: 1px solid var(--border-subtle); padding: 2rem; background: var(--card-bg);">
                                <span style="color: var(--text-muted); font-family: monospace; font-size: 0.8rem; text-transform: uppercase;">Inventory Count</span>
                                <div id="metric-inventory" style="font-size: 2.5rem; font-family: var(--font-serif); margin-top: 1rem; color: var(--text-primary);">0</div>
                            </div>
                        </div>
                    </div>

                    <div id="admin-orders" class="admin-view" style="display: none;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h2 style="font-family: monospace; font-size: 1.2rem; font-weight: 400;">Global Transaction Log</h2>
                            <input type="text" placeholder="Search by Order ID..." style="background: transparent; border: 1px solid var(--border-subtle); color: var(--text-primary); padding: 0.5rem 1rem; font-family: monospace; outline: none; width: 250px;">
                        </div>
                        
                        <div style="overflow-x: auto; border: 1px solid var(--border-subtle);">
                            <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.85rem; text-align: left;">
                                <thead style="background: var(--card-bg);">
                                    <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted);">
                                        <th style="padding: 1rem;">Order ID</th>
                                        <th style="padding: 1rem;">Date</th>
                                        <th style="padding: 1rem;">Customer</th>
                                        <th style="padding: 1rem;">Total</th>
                                        <th style="padding: 1rem;">Fulfillment Status</th>
                                        <th style="padding: 1rem; text-align: right;">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-orders-table">
                                    <tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-muted);">Syncing transaction log...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="admin-inventory" class="admin-view" style="display: none;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h2 style="font-family: monospace; font-size: 1.2rem; font-weight: 400;">Product Database</h2>
                            <button id="btn-toggle-add-product" style="background: var(--accent-primary); color: var(--bg-dark); border: none; padding: 0.5rem 1rem; font-family: monospace; font-size: 0.8rem; cursor: pointer; text-transform: uppercase; font-weight: bold;">+ Initialize New Object</button>
                        </div>
                        
                        <div id="add-product-panel" style="display: none; background: var(--card-bg); border: 1px solid var(--accent-primary); padding: 2rem; margin-bottom: 3rem;">
                            <h3 style="font-family: monospace; color: var(--accent-primary); margin-bottom: 1.5rem; text-transform: uppercase;">Input New Object Parameters</h3>
                            <form id="form-add-product" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; margin-bottom: 0.5rem;">Designation (Name)</label>
                                    <input type="text" required style="width: 100%; background: transparent; border: 1px solid var(--border-subtle); color: #fff; padding: 0.8rem; font-family: var(--font-sans);">
                                </div>
                                <div>
                                    <label style="display: block; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; margin-bottom: 0.5rem;">Value (Price)</label>
                                    <input type="number" step="0.01" required style="width: 100%; background: transparent; border: 1px solid var(--border-subtle); color: #fff; padding: 0.8rem; font-family: var(--font-sans);">
                                </div>
                                <div style="grid-column: span 2;">
                                    <label style="display: block; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; margin-bottom: 0.5rem;">Description</label>
                                    <textarea rows="3" required style="width: 100%; background: transparent; border: 1px solid var(--border-subtle); color: #fff; padding: 0.8rem; font-family: var(--font-sans); resize: vertical;"></textarea>
                                </div>
                                <div style="grid-column: span 2;">
                                    <label style="display: block; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; margin-bottom: 0.5rem;">Visual Asset URL (Image)</label>
                                    <input type="url" placeholder="https://..." style="width: 100%; background: transparent; border: 1px solid var(--border-subtle); color: #fff; padding: 0.8rem; font-family: var(--font-sans);">
                                </div>
                                <div style="grid-column: span 2; text-align: right;">
                                    <button type="button" id="btn-cancel-add" style="background: transparent; color: var(--text-muted); border: none; padding: 0.8rem 1.5rem; font-family: monospace; cursor: pointer; margin-right: 1rem;">Cancel</button>
                                    <button type="submit" style="background: var(--accent-primary); color: #000; border: none; padding: 0.8rem 2rem; font-family: monospace; font-weight: bold; cursor: pointer;">Commit to Database</button>
                                </div>
                            </form>
                        </div>

                        <div style="overflow-x: auto; border: 1px solid var(--border-subtle);">
                            <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.85rem; text-align: left;">
                                <thead style="background: var(--card-bg);">
                                    <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-muted);">
                                        <th style="padding: 1rem;">ID</th>
                                        <th style="padding: 1rem;">Visual</th>
                                        <th style="padding: 1rem;">Designation</th>
                                        <th style="padding: 1rem;">Value</th>
                                        <th style="padding: 1rem; text-align: right;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-product-table">
                                    <tr><td colspan="5" style="padding: 2rem; text-align: center; color: var(--text-muted);">Syncing with mainframe...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    `;

    // --- TAB SWITCHING LOGIC ---
    const tabs = container.querySelectorAll('.admin-tab');
    const views = container.querySelectorAll('.admin-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.style.color = 'var(--text-muted)'; t.style.borderLeftColor = 'transparent'; });
            tab.style.color = 'var(--text-primary)';
            tab.style.borderLeftColor = 'var(--accent-primary)';
            views.forEach(v => v.style.display = 'none');
            document.getElementById(tab.dataset.target).style.display = 'block';
        });
    });

    // --- ADD PRODUCT UI TOGGLE ---
    document.getElementById('btn-toggle-add-product').addEventListener('click', () => {
        document.getElementById('add-product-panel').style.display = 'block';
    });
    document.getElementById('btn-cancel-add').addEventListener('click', () => {
        document.getElementById('add-product-panel').style.display = 'none';
        document.getElementById('form-add-product').reset();
    });

    // --- POPULATE DATA ---
    populateAdminDashboard();
}

// ==========================================
// 3. DASHBOARD DATA POPULATION LOGIC
// ==========================================
async function populateAdminDashboard() {
    try {
        // Fetch real data from your Spring Boot API
        const products = await fetchProductsAPI() || [];
        const orders = await getOrdersAPI() || []; 
        
        // --- 1. POPULATE METRICS ---
        document.getElementById('metric-inventory').innerText = products.length;
        document.getElementById('metric-orders').innerText = orders.length;
        
        const totalRev = orders.reduce((sum, order) => {
            const total = order.totalAmount || order.totalPrice || order.total || order.price || 0;
            return sum + total;
        }, 0);
        document.getElementById('metric-revenue').innerText = `$${totalRev.toFixed(2)}`;

        // --- 2. POPULATE INVENTORY TABLE ---
        const inventoryTbody = document.getElementById('admin-product-table');
        if (products.length === 0) {
            inventoryTbody.innerHTML = `<tr><td colspan="5" style="padding: 2rem; text-align: center; color: var(--text-muted);">Database empty.</td></tr>`;
        } else {
            inventoryTbody.innerHTML = products.map(p => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;" onmouseover="this.style.background='var(--card-bg)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 1rem; color: var(--text-muted);">#${p.id}</td>
                    <td style="padding: 1rem;"><img src="${p.imageUrl || '"fallback.jpg"'}" style="width: 40px; height: 40px; object-fit: cover; filter: grayscale(100%);"></td>
                    <td style="padding: 1rem; color: var(--text-primary);">${p.name}</td>
                    <td style="padding: 1rem;">$${p.price.toFixed(2)}</td>
                    <td style="padding: 1rem; text-align: right;">
                        <button style="background: none; border: none; color: var(--text-muted); cursor: pointer; margin-right: 1rem; text-decoration: underline;">Edit</button>
                        <button style="background: none; border: none; color: #ff4444; cursor: pointer; text-decoration: underline;">Archive</button>
                    </td>
                </tr>
            `).join('');
        }

        // --- 3. POPULATE ORDERS TABLE ---
        const ordersTbody = document.getElementById('admin-orders-table');
        if (orders.length === 0) {
            ordersTbody.innerHTML = `<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-muted);">No transactions found.</td></tr>`;
        } else {
            ordersTbody.innerHTML = orders.map(o => {
                const orderTotal = o.totalAmount || o.totalPrice || o.total || o.price || 0;
                const status = o.status || 'Processing';
                const date = o.date ? new Date(o.date).toLocaleDateString() : new Date().toLocaleDateString();
                
                // Dynamic styling for the dropdown based on status
                let statusColor = status === 'Delivered' ? 'var(--accent-primary)' : (status === 'Shipped' ? '#4da6ff' : 'var(--text-muted)');

                return `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 1rem; color: var(--text-primary);">#${o.id || Math.floor(Math.random()*10000)}</td>
                    <td style="padding: 1rem; color: var(--text-muted);">${date}</td>
                    <td style="padding: 1rem; color: var(--text-primary);">User ${o.userId || 'Guest'}</td>
                    <td style="padding: 1rem; font-family: var(--font-serif);">$${orderTotal.toFixed(2)}</td>
                    <td style="padding: 1rem;">
                        <select style="background: transparent; border: 1px solid ${statusColor}; color: ${statusColor}; padding: 0.3rem; font-family: monospace; outline: none; border-radius: 2px;">
                            <option value="Processing" ${status === 'Processing' ? 'selected' : ''} style="color: #000;">Processing</option>
                            <option value="Shipped" ${status === 'Shipped' ? 'selected' : ''} style="color: #000;">Shipped</option>
                            <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''} style="color: #000;">Delivered</option>
                        </select>
                    </td>
                    <td style="padding: 1rem; text-align: right;">
                        <button style="background: none; border: none; color: var(--text-primary); cursor: pointer; text-decoration: underline; font-family: monospace;">Update</button>
                    </td>
                </tr>
            `}).join('');
        }

    } catch (error) {
        showToast("Error syncing with backend mainframe.", true);
    }
}