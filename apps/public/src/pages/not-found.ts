export const notFoundHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지를 찾을 수 없습니다</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; color: #111827; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .container { text-align: center; padding: 2rem; }
    .code { font-size: 6rem; font-weight: 800; color: #e5e7eb; line-height: 1; }
    .message { font-size: 1.25rem; color: #6b7280; margin-top: 0.5rem; }
    .link { display: inline-block; margin-top: 1.5rem; color: #2563eb; text-decoration: none; font-size: 0.875rem; }
    .link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="code">404</div>
    <p class="message">요청하신 페이지를 찾을 수 없습니다</p>
    <a href="/" class="link">홈으로 돌아가기</a>
  </div>
</body>
</html>`;
