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
  <h1>使い方ガイド</h1>
  <p>5分で最初のプロモーションページを作成できます</p>
</section>

<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-content">
      <h3>アカウント登録</h3>
      <p>Googleアカウントで簡単に登録。パスワード設定不要ですぐに始められます。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">2</div>
    <div class="step-content">
      <h3>新しいページを作成</h3>
      <p>ダッシュボードで「新規ページ作成」ボタンをクリックするとエディタが開きます。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">3</div>
    <div class="step-content">
      <h3>コンポーネントを組み合わせる</h3>
      <p>左パネルからコンポーネント（画像、テキスト、ボタン、カルーセルなど）をドラッグしてキャンバスに配置。右パネルで詳細なプロパティを編集できます。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">4</div>
    <div class="step-content">
      <h3>SEO情報を設定</h3>
      <p>ツールバーのSEOボタンをクリックして、ページタイトル、説明文、OG画像を設定。検索エンジンやSNS共有時に表示される情報です。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">5</div>
    <div class="step-content">
      <h3>公開する</h3>
      <p>「公開」ボタンを押すと固有リンクが生成されます。このリンクをお客様に共有しましょう。</p>
    </div>
  </div>

  <div class="step">
    <div class="step-num">6</div>
    <div class="step-content">
      <h3>パフォーマンスを分析</h3>
      <p>ダッシュボードで各ページの「分析」リンクをクリックすると、ページビュー、クリック、スクロール深度などの訪問者行動を確認できます。</p>
    </div>
  </div>
</div>

<section class="guide-cta">
  <h2>準備はできましたか？</h2>
  <p>今すぐ最初のプロモーションページを作成しましょう。</p>
  <a href="${ADMIN_URL}/login">無料で始める</a>
</section>
`;

export const guideJaHtml = layout(
  "使い方ガイド — PromoBuilder",
  "PromoBuilderでプロモーションページを作成する方法をステップバイステップでご案内します。",
  body,
  {
    path: "/ja/guide",
    lang: "ja",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "PromoBuilderでプロモーションページを作成する方法",
      description: "ステップバイステップガイド：登録、コンポーネント選択、デザインカスタマイズ、公開まで。",
      step: [
        { "@type": "HowToStep", name: "アカウント登録", text: "Googleログインで無料アカウントを作成。" },
        { "@type": "HowToStep", name: "ページ作成", text: "「新規ページ作成」をクリックしてレイアウトを選択。" },
        { "@type": "HowToStep", name: "コンポーネント追加", text: "画像、テキスト、ボタン、カルーセルをドラッグ＆ドロップ。" },
        { "@type": "HowToStep", name: "SEO設定", text: "タイトル、説明文、OG画像を設定。" },
        { "@type": "HowToStep", name: "公開", text: "クリックひとつでカスタムURLに即座にデプロイ。" },
      ],
    },
  },
);
