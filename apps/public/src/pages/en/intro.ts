import { layout, ADMIN_URL } from "../layout";

const body = `
<style>
  .hero { padding: 6rem 1.5rem 4rem; text-align: center; }
  .hero-badge { display: inline-block; padding: 0.25rem 0.75rem; background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; margin-bottom: 1.5rem; }
  .hero h1 { font-size: 3rem; font-weight: 800; letter-spacing: -0.025em; line-height: 1.15; max-width: 700px; margin: 0 auto; }
  .hero h1 span { color: #2563eb; }
  .hero p { font-size: 1.125rem; color: #6b7280; max-width: 520px; margin: 1.25rem auto 0; }
  .hero-actions { margin-top: 2.5rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: #2563eb; color: #fff; border-radius: 12px; font-size: 1rem; font-weight: 600; transition: background 0.15s; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-secondary { display: inline-flex; align-items: center; padding: 0.875rem 2rem; background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 1rem; font-weight: 500; transition: all 0.15s; }
  .btn-secondary:hover { background: #f3f4f6; border-color: #d1d5db; }

  .features { padding: 4rem 1.5rem 5rem; background: #f9fafb; }
  .features-title { text-align: center; font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem; }
  .features-sub { text-align: center; color: #6b7280; margin-bottom: 3rem; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1080px; margin: 0 auto; }
  .feature-card { background: #fff; padding: 2rem; border-radius: 16px; border: 1px solid #f3f4f6; }
  .feature-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1rem; }
  .feature-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.875rem; color: #6b7280; }

  .cta-section { padding: 5rem 1.5rem; text-align: center; }
  .cta-section h2 { font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; }
  .cta-section p { color: #6b7280; margin-bottom: 2rem; }
</style>

<section class="hero">
  <div class="hero-badge">Component-Driven Page Builder</div>
  <h1>Build Promotion Pages<br><span>Fast & Easy</span></h1>
  <p>Create event pages with drag-and-drop, deploy instantly, and track performance with real-time analytics.</p>
  <div class="hero-actions">
    <a href="${ADMIN_URL}/login" class="btn-primary">Start Free</a>
    <a href="/en/guide" class="btn-secondary">View Guide</a>
  </div>
</section>

<section class="features">
  <h2 class="features-title">Why PromoBuilder?</h2>
  <p class="features-sub">Everything you need for promotion pages, all in one place</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon" style="background:#eff6ff;">🧩</div>
      <h3>Component-Based Editor</h3>
      <p>Drag and drop images, buttons, carousels, menus, and more to build your page.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0fdf4;">📊</div>
      <h3>Real-Time Analytics</h3>
      <p>Track pageviews, clicks, and scroll depth — no extra tools needed.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef3c7;">⚡</div>
      <h3>Blazing Performance</h3>
      <p>Served as static HTML for near-perfect Lighthouse scores.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fce7f3;">🔗</div>
      <h3>One-Click Deploy</h3>
      <p>Publish your page with a single click and share the unique link instantly.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ede9fe;">🔍</div>
      <h3>SEO Optimized</h3>
      <p>Easily set title, description, and OG image for search engines and social sharing.</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ecfdf5;">💰</div>
      <h3>Affordable Pricing</h3>
      <p>Start free. Unlock Pro features from ₩2,075/mo. Save 28% with annual billing!</p>
    </div>
  </div>
</section>

<section class="cta-section">
  <h2>Ready to get started?</h2>
  <p>Create your first promotion page for free. No credit card required.</p>
  <a href="${ADMIN_URL}/login" class="btn-primary">Start Free</a>
</section>
`;

export const introEnHtml = layout(
  "PromoBuilder — Build & Deploy Promotion Pages Fast",
  "Create stunning promotion pages with drag-and-drop, deploy instantly, and track performance with real-time analytics.",
  body,
  {
    path: "/en",
    lang: "en",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "PromoBuilder",
        url: "https://promotion.ccoshong.top",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Drag-and-drop promotion page builder with real-time analytics. Create, deploy, and track landing pages in minutes.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "KRW",
          lowPrice: "0",
          highPrice: "24900",
          offerCount: "2",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PromoBuilder",
        url: "https://promotion.ccoshong.top",
        logo: "https://promotion.ccoshong.top/favicon.svg",
      },
    ],
  },
);
