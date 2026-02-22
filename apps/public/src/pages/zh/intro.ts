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
  <div class="hero-badge">组件驱动的页面构建器</div>
  <h1>快速创建<br><span>促销页面</span></h1>
  <p>通过拖拽操作制作活动页面，发布后实时追踪分析效果。</p>
  <div class="hero-actions">
    <a href="${ADMIN_URL}/login" class="btn-primary">免费开始</a>
    <a href="/zh/guide" class="btn-secondary">查看指南</a>
  </div>
</section>

<section class="features">
  <h2 class="features-title">为什么选择 PromoBuilder？</h2>
  <p class="features-sub">促销页面所需的一切，尽在一个平台</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon" style="background:#eff6ff;">🧩</div>
      <h3>组件化编辑器</h3>
      <p>拖拽 12+ 种组件 — 图片、按钮、轮播图、倒计时、表单等，轻松构建页面。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#faf5ff;">📑</div>
      <h3>5 种现成模板</h3>
      <p>无需从零开始。产品发布、活动推广、线索收集等多种模板，助您快速上手。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0fdf4;">📊</div>
      <h3>实时数据分析</h3>
      <p>追踪页面浏览、点击和滚动深度，无需额外工具即可查看。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ecfdf5;">🖼️</div>
      <h3>直接上传图片</h3>
      <p>无需外部托管，上传文件即可自动生成 URL，直接应用到页面。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fce7f3;">📱</div>
      <h3>应用深度链接</h3>
      <p>通过 App Scheme 链接直达 KakaoTalk、Instagram、电话、短信等应用。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef3c7;">⏱️</div>
      <h3>倒计时 & 浮动 CTA</h3>
      <p>用倒计时营造紧迫感，用固定 CTA 按钮提升转化率。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0f9ff;">📋</div>
      <h3>表单收集线索</h3>
      <p>在页面上直接收集访客的姓名、邮箱、手机号等信息，在后台查看提交记录。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef2f2;">🗓️</div>
      <h3>定时发布</h3>
      <p>设定日期和时间，页面自动上线。完美把控营销活动的节奏。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ede9fe;">✨</div>
      <h3>滚动动画</h3>
      <p>无需设计师，也能为页面添加优雅的淡入效果，吸引访客目光。</p>
    </div>
  </div>
</section>

<section class="cta-section">
  <h2>立即开始</h2>
  <p>免费创建您的第一个促销页面，无需信用卡。</p>
  <a href="${ADMIN_URL}/login" class="btn-primary">免费开始</a>
</section>
`;

export const introZhHtml = layout(
  "PromoBuilder — 快速构建促销页面",
  "通过拖拽操作创建促销页面，即时部署，实时追踪分析效果。",
  body,
  {
    path: "/zh",
    lang: "zh",
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
          priceCurrency: "USD",
          lowPrice: "0",
          highPrice: "19.99",
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
