import {
  getCartAPI,
  placeOrderAPI,
  createRazorpayOrderAPI,
  verifyPaymentAPI,
} from "../js/api.js";
import { initScrollObserver, showToast, switchView } from "../js/app.js";
import { refreshCartData } from "./cart.js";
import { getProfileAPI } from "../js/api.js";
import { renderOrderSuccess } from "./orderSuccess.js";

export async function renderCheckout(containerId, handleRemoveFromCart) {
  const container = document.getElementById(containerId);

  container.innerHTML = `
        <section class="checkout-section" style="padding: 8rem 5% 5rem 5%; min-height: 100vh; max-width: 1200px; margin: 0 auto;">
            <div class="reveal-up" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 2rem; margin-bottom: 4rem;">
                <h1 style="font-family: var(--font-serif); font-size: 2.5rem; font-weight: 400;">Finalize Anthology.</h1>
                <p style="color: var(--text-muted); margin-top: 1rem;">Provide your details to complete the acquisition.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 5rem; align-items: start;">
                
                <form id="checkout-form" class="reveal-up" style="display: flex; flex-direction: column; gap: 3rem;">
                    
                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1.5rem;">Shipping Information</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                            <input type="text" placeholder="First Name" required class="checkout-input">
                            <input type="text" placeholder="Last Name" required class="checkout-input">
                        </div>
                        <input type="text" placeholder="Street Address" required class="checkout-input" style="margin-bottom: 1.5rem;">
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem;">
                            <input type="text" placeholder="City" required class="checkout-input">
                            <input type="text" placeholder="State" required class="checkout-input">
                            <input type="text" placeholder="Zip" required class="checkout-input">
                        </div>
                    </div>

                    <div>
                        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1.5rem;">Payment Method</h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                            <div class="payment-tab active" data-method="card" style="border: 1px solid var(--accent-primary); color: var(--text-primary); text-align: center; padding: 1rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; transition: all 0.3s;">
                                Credit Card
                            </div>
                            <div class="payment-tab" data-method="upi" style="border: 1px solid var(--border-subtle); color: var(--text-muted); text-align: center; padding: 1rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; transition: all 0.3s;">
                                UPI
                            </div>
                            <div class="payment-tab" data-method="cod" style="border: 1px solid var(--border-subtle); color: var(--text-muted); text-align: center; padding: 1rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; transition: all 0.3s;">
                                Cash on Delivery
                            </div>
                        </div>

                        <div id="payment-card" class="payment-details" style="display: block;">
                            <div style="padding: 1.5rem; background: var(--card-bg); border: 1px solid var(--border-subtle);">
                                <p style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.5rem;">Secure Gateway</p>
                                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">You will be securely routed to Razorpay to enter your card details and finalize the acquisition.</p>
                            </div>
                        </div>

                       <div id="payment-upi" class="payment-details" style="display: none;">
                            <div style="padding: 1.5rem; background: var(--card-bg); border: 1px solid var(--border-subtle);">
                                <p style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.5rem;">UPI Transfer</p>
                                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">You will be securely routed to Razorpay to generate a QR code or enter your UPI ID.</p>
                            </div>
                        </div>

                        <div id="payment-cod" class="payment-details" style="display: none;">
                            <div style="padding: 1.5rem; background: var(--card-bg); border: 1px solid var(--border-subtle);">
                                <p style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 0.5rem;">Pay upon receipt.</p>
                                <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">Please ensure someone is available at the address to receive and pay for the anthology. Exact change or digital payment at the door is appreciated.</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" id="btn-submit-order" style="margin-top: 1rem;">Confirm Acquisition</button>
                </form>

                <div class="reveal-up" style="background: var(--card-bg); padding: 3rem; border: 1px solid var(--border-subtle); position: sticky; top: 120px;">
                    <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 2rem;">Order Summary</h3>
                    <div id="checkout-items" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
                        <p style="color: var(--text-muted);">Loading items...</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem; color: var(--text-primary);">
                        <span>Total</span>
                        <span id="checkout-total">$0.00</span>
                    </div>
                </div>
            </div>
        </section>
    `;

  // 1. Setup Input Styling & Focus Effects
  const inputs = container.querySelectorAll(".checkout-input");
  inputs.forEach((input) => {
    input.style.width = "100%";
    input.style.background = "transparent";
    input.style.border = "none";
    input.style.borderBottom = "1px solid var(--border-subtle)";
    input.style.color = "var(--text-primary)";
    input.style.padding = "0.8rem 0";
    input.style.fontSize = "1rem";
    input.style.fontFamily = "var(--font-sans)";
    input.style.outline = "none";
    input.style.transition = "border-color var(--transition-med)";

    input.addEventListener(
      "focus",
      () => (input.style.borderBottomColor = "var(--accent-primary)"),
    );
    input.addEventListener(
      "blur",
      () => (input.style.borderBottomColor = "var(--border-subtle)"),
    );
  });

  // 2. Handle Payment Method Switching
  const tabs = container.querySelectorAll(".payment-tab");
  const detailSections = container.querySelectorAll(".payment-details");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Reset all tabs to inactive styling
      tabs.forEach((t) => {
        t.classList.remove("active");
        t.style.borderColor = "var(--border-subtle)";
        t.style.color = "var(--text-muted)";
      });

      // Set clicked tab to active styling
      tab.classList.add("active");
      tab.style.borderColor = "var(--accent-primary)";
      tab.style.color = "var(--text-primary)";

      // Hide all detail sections
      detailSections.forEach((section) => (section.style.display = "none"));

      // Show selected section
      const method = tab.dataset.method;
      document.getElementById(`payment-${method}`).style.display = "block";
    });
  });

  // 3. Handle Form Submission
  document
    .getElementById("checkout-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const selectedMethod = document.querySelector(".payment-tab.active")
        .dataset.method;
      const btn = document.getElementById("btn-submit-order");

      btn.innerText = "Processing...";
      btn.disabled = true;

      try {
        if (selectedMethod === "cod") {
          // --- FLOW 1: GATHER DATA FOR COD ---
          const orderPayload = {
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending",
            paymentId: "COD-" + Date.now(),
            address: container.querySelector('[placeholder="Street Address"]')
              .value,
            city: container.querySelector('[placeholder="City"]').value,
            zip: container.querySelector('[placeholder="Zip"]').value,
          };

          const orderResponse = await placeOrderAPI(orderPayload);

          showToast("Acquisition Complete. Welcome to the anthology.");

          renderOrderSuccess("view-order-success", orderResponse);
          switchView("orderSuccess");
          // Reset UI
          await refreshCartData(handleRemoveFromCart);
        } 
        
        else {
          // --- FLOW 2: RAZORPAY ---
          const totalText = document.getElementById("checkout-total").innerText;
          const totalAmount = parseFloat(totalText.replace("₹", ""));
          await handleCheckout(totalAmount);
        }
      } catch (error) {
        showToast("Transaction failed. Please check all fields.", true);
      } finally {
        btn.innerText = "Confirm Acquisition";
        btn.disabled = false;
      }
    });
  try {
    const user = await getProfileAPI(); 
    if (user) {
      const firstNameInput = container.querySelector(
        '[placeholder="First Name"]',
      );
      const lastNameInput = container.querySelector(
        '[placeholder="Last Name"]',
      );
      const emailInput = container.querySelector('[placeholder="Email"]'); 
      if (user.name) {
        const names = user.name.split(" ");
        if (firstNameInput) firstNameInput.value = names[0] || "";
        if (lastNameInput) lastNameInput.value = names.slice(1).join(" ") || "";
      }
    }
  } catch (e) {
    switchView("auth");
  }
}

export async function handleCheckout(totalAmount) {
  try {
    showToast("Securing payment gateway...");

    const orderData = await createRazorpayOrderAPI(totalAmount);

    const options = {
      key: "rzp_test_SboszsNMLJm1fo",
      amount: orderData.amount,
      currency: "INR",
      name: "Zenith", 
      description: "Cinematic Essentials",
      order_id: orderData.id,
      handler: async function (response) {
        await verifyPaymentOnBackend(response);
      },
      prefill: {
        name: "User", 
        email: "user@zenith.com",
      },
      theme: { color: "#b8ccb5" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    showToast("Payment Initialization Failed: " + error.message, true);
  }
}

async function verifyPaymentOnBackend(paymentDetails) {
  try {
    const response = await verifyPaymentAPI(paymentDetails);

    if (
      response.status === "success" ||
      response.message === "Payment verified!"
    ) {
      // 1. Gather the info to save in MySQL DB
      const infoToSave = {
        paymentId: paymentDetails.razorpay_payment_id,
        paymentStatus: "Paid",
        paymentMethod: "Razorpay",
        address: document.querySelector('[placeholder="Street Address"]').value,
        city: document.querySelector('[placeholder="City"]').value,
        zip: document.querySelector('[placeholder="Zip"]').value,
      };

      // 2. Pass that info into the API function
      const orderResponse = await placeOrderAPI(infoToSave);

      showToast("Acquisition Complete.");
      await refreshCartData();
      switchView("orderSuccess");
      renderOrderSuccess("view-order-success", orderResponse);
    }
  } catch (error) {
    showToast("Error finalizing order.", true);
  }
}
// Function to refresh the summary data right before user sees the checkout page
export async function populateCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  if (!summaryContainer) return;

  try {
    const cartItems = await getCartAPI();
    let subtotal = 0;

    if (!cartItems || cartItems.length === 0) {
      summaryContainer.innerHTML =
        '<p style="color: var(--text-muted);">No items to display.</p>';
      totalEl.innerText = "₹0.00";
      return;
    }

    summaryContainer.innerHTML = cartItems
      .map((item) => {
        const total = item.price * item.quantity;
        subtotal += total;
        return `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>₹${total.toFixed(2)}</span> </div>
            `;
      })
      .join("");

    totalEl.innerText = `₹${subtotal.toFixed(2)}`;

    initScrollObserver();
  } catch (error) {
    summaryContainer.innerHTML =
      '<p style="color: #ff4444;">Failed to load summary.</p>';
  }
}
