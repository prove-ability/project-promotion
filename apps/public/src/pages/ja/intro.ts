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
  <div class="hero-badge">コンポーネント駆動ページビルダー</div>
  <h1>プロモーションページを<br><span>簡単・素早く</span>作成</h1>
  <p>ドラッグ＆ドロップでイベントページを作成し、公開後のパフォーマンスをリアルタイムで分析できます。</p>
  <div class="hero-actions">
    <a href="${ADMIN_URL}/login" class="btn-primary">無料で始める</a>
    <a href="/ja/guide" class="btn-secondary">使い方ガイド</a>
  </div>
</section>

<section class="features">
  <h2 class="features-title">なぜPromoBuilderなのか</h2>
  <p class="features-sub">プロモーションページに必要なすべてをひとつに</p>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon" style="background:#eff6ff;">🧩</div>
      <h3>コンポーネントベースエディタ</h3>
      <p>画像、ボタン、カルーセル、カウントダウン、フォームなど12種以上のコンポーネントをドラッグ＆ドロップで組み合わせ。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#faf5ff;">📑</div>
      <h3>5種類のテンプレート</h3>
      <p>ゼロから悩む必要なし。商品ローンチ、イベント、リード獲得など目的別テンプレートですぐに開始。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0fdf4;">📊</div>
      <h3>リアルタイム分析</h3>
      <p>ページビュー、クリック、スクロール深度まで。追加ツール不要でその場で確認できます。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ecfdf5;">🖼️</div>
      <h3>画像ダイレクトアップロード</h3>
      <p>外部ホスティング不要。ファイルをアップロードするだけでURLが自動生成されます。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fce7f3;">📱</div>
      <h3>アプリディープリンク</h3>
      <p>KakaoTalk、Instagram、電話、SMSなど、アプリスキームURLで直接つなげましょう。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef3c7;">⏱️</div>
      <h3>カウントダウン＆フローティングCTA</h3>
      <p>緊急性を演出するタイマーと画面固定CTAボタンでコンバージョン率をアップ。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#f0f9ff;">📋</div>
      <h3>フォームでリード獲得</h3>
      <p>名前、メール、電話番号など訪問者情報をその場で収集し、ダッシュボードで確認。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#fef2f2;">🗓️</div>
      <h3>予約公開</h3>
      <p>日時を設定するだけでページが自動で公開。キャンペーンのタイミングを完璧に合わせましょう。</p>
    </div>
    <div class="feature-card">
      <div class="feature-icon" style="background:#ede9fe;">✨</div>
      <h3>スクロールアニメーション</h3>
      <p>デザイナーなしでも洗練されたフェードイン効果を適用して訪問者の視線を引きつけましょう。</p>
    </div>
  </div>
</section>

<section class="cta-section">
  <h2>今すぐ始めましょう</h2>
  <p>無料アカウントでプロモーションページを作成してみてください。クレジットカード不要です。</p>
  <a href="${ADMIN_URL}/login" class="btn-primary">無料で始める</a>
</section>
`;

export const introJaHtml = layout(
  "PromoBuilder — プロモーションページを簡単・素早く作成",
  "ドラッグ＆ドロップでプロモーションページを作成し、公開後のパフォーマンスをリアルタイムで分析。",
  body,
  {
    path: "/ja",
    lang: "ja",
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
          priceCurrency: "JPY",
          lowPrice: "0",
          highPrice: "2990",
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
