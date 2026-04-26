import { loginAPI, registerAPI } from "../js/api.js";
import { showToast } from "../js/app.js";

export function renderAuth(containerId, onSuccess) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="min-h-screen flex bg-[#0e0e0e] text-[#e5e2e1] w-full">
        
        <div class="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#131313]">
            <img src="./assets/cloth-aesthetic.png" 
                 onerror="this.src='https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop';"
                 class="absolute inset-0 w-full h-full object-cover grayscale opacity-100 transition-transform duration-[20s] hover:scale-110"
                 alt="Textured cloth aesthetic background"> 
            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e0e]"></div>
            
            <div class="absolute bottom-16 left-16 z-10">
                <h1 class="font-serif text-6xl text-[#b8ccb5] tracking-tight mb-2">Zenith.</h1>
                <p class="text-xs text-[#8d928b] uppercase tracking-[0.3em]">Curated Artifacts & Acquisitions</p>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
            <div class="max-w-md w-full space-y-10 relative z-10">

                <div class="flex gap-8 border-b border-[#434842]/30 pb-4 mb-10">
                    <button id="btn-show-login" class="text-xl font-serif text-[#b8ccb5] transition-colors relative after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:w-full after:h-[2px] after:bg-[#b8ccb5] after:transition-all">Sign In</button>
                    <button id="btn-show-register" class="text-xl font-serif text-[#8d928b] hover:text-[#e5e2e1] transition-colors relative after:content-[''] after:absolute after:-bottom-[17px] after:left-0 after:w-0 after:h-[2px] after:bg-[#b8ccb5] after:transition-all">Request Access</button>
                </div>

                <form id="form-login" class="space-y-8 block animate-[fadeIn_0.4s_ease-out]">
                    <div class="group relative">
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#b8ccb5]">Identification (Email)</label>
                        <input type="email" id="login-email" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors font-sans text-lg">
                    </div>
                    <div class="group relative">
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#b8ccb5]">Passphrase</label>
                        <input type="password" id="login-password" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors font-sans text-lg">
                    </div>
                    <button type="submit" id="btn-submit-login" class="w-full bg-[#B8CCB5] text-[#131313] py-4 mt-8 text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all flex justify-center items-center gap-2">
                        Enter Vault <span class="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </form>

                <form id="form-register" class="space-y-8 hidden animate-[fadeIn_0.4s_ease-out]">
                    <div class="group relative">
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#b8ccb5]">Full Designation (Name)</label>
                        <input type="text" id="reg-name" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors font-sans text-lg">
                    </div>
                    <div class="group relative">
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#b8ccb5]">Identification (Email)</label>
                        <input type="email" id="reg-email" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors font-sans text-lg">
                    </div>
                    <div class="group relative">
                        <label class="text-[10px] text-[#8d928b] uppercase tracking-widest block mb-2 transition-colors group-focus-within:text-[#b8ccb5]">Passphrase</label>
                        <input type="password" id="reg-password" required class="w-full bg-transparent border-b border-[#434842] text-[#e5e2e1] py-2 focus:border-[#B8CCB5] outline-none transition-colors font-sans text-lg">
                    </div>
                    <button type="submit" id="btn-submit-register" class="w-full bg-transparent border border-[#B8CCB5] text-[#B8CCB5] py-4 mt-8 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#B8CCB5] hover:text-[#131313] transition-all">
                        Submit Credentials
                    </button>
                </form>

            </div>
        </div>
    </div>
    `;

    // 1. Form Toggling Logic
    const btnShowLogin = document.getElementById('btn-show-login');
    const btnShowReg = document.getElementById('btn-show-register');
    const formLogin = document.getElementById('form-login');
    const formReg = document.getElementById('form-register');

    const switchView = (showReg) => {
        if (showReg) {
            formLogin.classList.add('hidden');
            formReg.classList.remove('hidden');
            
           
            btnShowReg.classList.add('text-[#b8ccb5]', 'after:w-full');
            btnShowReg.classList.remove('text-[#8d928b]', 'after:w-0');
            
            btnShowLogin.classList.add('text-[#8d928b]', 'after:w-0');
            btnShowLogin.classList.remove('text-[#b8ccb5]', 'after:w-full');
        } else {
            formReg.classList.add('hidden');
            formLogin.classList.remove('hidden');
   
            btnShowLogin.classList.add('text-[#b8ccb5]', 'after:w-full');
            btnShowLogin.classList.remove('text-[#8d928b]', 'after:w-0');
            
            btnShowReg.classList.add('text-[#8d928b]', 'after:w-0');
            btnShowReg.classList.remove('text-[#b8ccb5]', 'after:w-full');
        }
    };

    btnShowLogin.addEventListener('click', () => switchView(false));
    btnShowReg.addEventListener('click', () => switchView(true));

    // 2. API Integrations
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-submit-login');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-sm">sync</span> Verifying...`;
        btn.disabled = true;

        try {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            
            const token = await loginAPI({ email, password });
            
            // Clean out old sessions, drop in the new key
            localStorage.clear();
            localStorage.setItem("token", token);
            
            // Pass control back to app.js for role-based routing
            if(onSuccess) onSuccess("Authorization Accepted.");
            
        } catch (error) {
            showToast("Credentials rejected. Please try again.", true);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    formReg.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-submit-register');
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            
            await registerAPI({ name, email, password, role: "USER" });
            
            showToast("Credentials accepted. Please sign in.");
            formReg.reset();
            switchView(false); 
            
        } catch (error) {
            showToast("Failed to process credentials.", true);
        } finally {
            btn.innerText = "Submit Credentials";
            btn.disabled = false;
        }
    });
}