import { initScrollObserver } from '../js/app.js';

export function renderAbout(containerId) {
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <section style="padding: 10rem 5% 5rem 5%; min-height: 100vh; max-width: 1200px; margin: 0 auto;">
            <div class="reveal-up" style="margin-bottom: 6rem; text-align: center;">
                <span style="color: var(--accent-primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 4px; display: block; margin-bottom: 1.5rem;">The Zenith Ethos</span>
                <h1 style="font-family: var(--font-serif); font-size: clamp(3rem, 8vw, 6rem); line-height: 1; font-weight: 400; color: var(--text-primary);">
                    Design Through <br> Absolute Restraint.
                </h1>
            </div>

            <div class="reveal-up" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: center; margin-bottom: 10rem;">
                <div style="height: 600px; background: var(--card-bg); overflow: hidden;">
                    <img src="./assets/hero-editorial.png" alt="Editorial Visual" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) contrast(1.1);">
                </div>
                <div style="max-width: 450px;">
                    <h3 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 2rem; font-weight: 400;">The Anthology Concept</h3>
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem; font-size: 1.05rem;">
                        Zenith is not a marketplace; it is a curated archive. We believe in the "Anthology" approach to living—surrounding oneself only with objects that possess a distinct purpose and an enduring soul.
                    </p>
                    <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem;">
                        Our mission is the elimination of the unnecessary. By stripping away the noise, we elevate the essential, creating a dialogue between the object and the individual.
                    </p>
                </div>
            </div>

            <div class="reveal-up" style="border-top: 1px solid var(--border-subtle); padding-top: 6rem; text-align: center;">
                <p style="font-family: var(--font-serif); font-style: italic; font-size: 1.5rem; max-width: 800px; margin: 0 auto; color: var(--text-primary);">
                    "Excellence is achieved, not when there is nothing more to add, but when there is nothing left to take away."
                </p>
                <button class="btn-primary" style="margin-top: 4rem;" onclick="window.dispatchEvent(new Event('go-to-shop'))">
                    Explore the Collection
                </button>
            </div>
        </section>
    `;

    initScrollObserver();
}