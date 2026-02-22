import { layout, ADMIN_URL } from "../layout";

const body = `
<style>
  .guide-hero { padding: 4rem 1.5rem 2rem; text-align: center; }
  .guide-hero h1 { font-size: 2.25rem; font-weight: 800; }
  .guide-hero p { color: #6b7280; margin-top: 0.75rem; }

  .steps { max-width: 720px; margin: 0 auto 5rem; padding: 0 1.5rem; }
  .step { display: flex; gap: 1.5rem; padding: 2rem 0; border-bottom: 1px solid #f3f4f6; }
  .step:last-child { border-bottom: none; }
  .step-num { flex-shrink: 0; width: 48px; height: 48px; background: #eff6ff; color: #2563eb; font-size: 1.25rem; font-weight: 700; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .step-content h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
  .step-content p { font-size: 0.875rem; color: #6b7280; }

  .guide-cta { text-align: center; padding: 3rem 1.5rem 5rem; }
  .guide-cta h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
  .guide-cta p { color: #6b7280; margin-bottom: 1.5rem; }
  .guide-cta a { display: inline-flex; padding: 0.875rem 2rem; background: #2563eb; color: #fff; border-radius: 12px; font-weight: 600; transition: background 0.15s; }
  .guide-cta a:hover { background: #1d4ed8; }
</style>

<section class="guide-hero">
  <h1>Getting Started Guide</h1>
  <p>Build your first promotion page in 5 minutes</p>
</section>

<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-content">
      <h3>Sign Up</h3>
      <p>Sign in with your Google account. No password setup — get started instantly.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">2</div>
    <div class="step-content">
      <h3>Create a New Page</h3>
      <p>Click "New Page" on your dashboard to open the editor.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">3</div>
    <div class="step-content">
      <h3>Add Components</h3>
      <p>Drag components (images, text, buttons, carousels) from the left panel onto the canvas. Customize properties in the right panel.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">4</div>
    <div class="step-content">
      <h3>Set SEO Info</h3>
      <p>Click the SEO button in the toolbar to set the page title, description, and OG image for search engines and social sharing.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">5</div>
    <div class="step-content">
      <h3>Deploy</h3>
      <p>Hit "Publish" to generate a unique link. Share it with your audience right away.</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">6</div>
    <div class="step-content">
      <h3>Track Performance</h3>
      <p>Click "Analytics" on your dashboard to see pageviews, clicks, and scroll depth for each page.</p>
    </div>
  </div>
</div>

<section class="guide-cta">
  <h2>Ready to build?</h2>
  <p>Create your first promotion page now — it's free.</p>
  <a href="${ADMIN_URL}/login">Start Free</a>
</section>
`;

export const guideEnHtml = layout(
  "Guide — PromoBuilder",
  "Step-by-step guide to building and deploying promotion pages with PromoBuilder.",
  body,
  {
    path: "/en/guide",
    lang: "en",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Build a Promotion Page with PromoBuilder",
      description:
        "Step-by-step guide: sign up, choose components, customize design, and deploy your promotion page.",
      step: [
        { "@type": "HowToStep", name: "Sign Up", text: "Create a free account with Google login." },
        { "@type": "HowToStep", name: "Create Page", text: "Click 'New Page' and choose a layout." },
        { "@type": "HowToStep", name: "Add Components", text: "Drag and drop images, text, buttons, and carousels." },
        { "@type": "HowToStep", name: "Set SEO", text: "Configure title, description, and OG image for search engines." },
        { "@type": "HowToStep", name: "Deploy", text: "Click publish to deploy instantly to your custom URL." },
      ],
    },
  },
);
