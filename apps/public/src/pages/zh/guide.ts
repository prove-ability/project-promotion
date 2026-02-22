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
  <h1>使用指南</h1>
  <p>5 分钟即可创建您的第一个促销页面</p>
</section>

<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-content">
      <h3>注册账号</h3>
      <p>使用 Google 账号快速注册，无需设置密码，即刻开始。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">2</div>
    <div class="step-content">
      <h3>创建新页面</h3>
      <p>在仪表盘点击「创建新页面」按钮，打开编辑器。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">3</div>
    <div class="step-content">
      <h3>组合组件</h3>
      <p>从左侧面板拖拽组件（图片、文本、按钮、轮播图等）到画布上。在右侧面板编辑详细属性。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">4</div>
    <div class="step-content">
      <h3>设置 SEO 信息</h3>
      <p>点击工具栏的 SEO 按钮，设置页面标题、描述和 OG 图片。这些信息会在搜索引擎和社交媒体分享时展示。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">5</div>
    <div class="step-content">
      <h3>发布</h3>
      <p>点击「发布」按钮即可生成专属链接，立即分享给您的用户。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">6</div>
    <div class="step-content">
      <h3>分析效果</h3>
      <p>在仪表盘点击各页面的「分析」链接，查看页面浏览量、点击和滚动深度等访客行为数据。</p>
    </div>
  </div>
</div>

<section class="guide-cta">
  <h2>准备好了吗？</h2>
  <p>立即免费创建您的第一个促销页面。</p>
  <a href="${ADMIN_URL}/login">免费开始</a>
</section>
`;

export const guideZhHtml = layout(
  "使用指南 — PromoBuilder",
  "分步指南：如何使用 PromoBuilder 构建和部署促销页面。",
  body,
  {
    path: "/zh/guide",
    lang: "zh",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "如何使用 PromoBuilder 构建促销页面",
      description: "分步指南：注册、选择组件、定制设计、部署促销页面。",
      step: [
        { "@type": "HowToStep", name: "注册", text: "使用 Google 登录创建免费账号。" },
        { "@type": "HowToStep", name: "创建页面", text: "点击「创建新页面」选择布局。" },
        { "@type": "HowToStep", name: "添加组件", text: "拖拽图片、文本、按钮和轮播图。" },
        { "@type": "HowToStep", name: "设置 SEO", text: "设置标题、描述和 OG 图片。" },
        { "@type": "HowToStep", name: "发布", text: "一键部署到自定义 URL。" },
      ],
    },
  },
);
