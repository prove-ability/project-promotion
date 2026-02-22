# PromoBuilder

CDD(Component-Driven Development) 기반 프로모션 페이지 빌더. 드래그 앤 드롭으로 페이지를 제작하고, 원클릭으로 배포한 뒤 방문자 행동을 실시간으로 분석할 수 있습니다.

## 아키텍처

```
project-promotion/
├── apps/
│   ├── admin/          # 어드민 대시보드 (React Router v7 + Cloudflare Workers)
│   └── public/         # 퍼블릭 페이지 서버 (Hono + Cloudflare Workers)
├── packages/
│   ├── db/             # Drizzle ORM 스키마 + D1 마이그레이션
│   └── promotion-components/  # CDD 컴포넌트 라이브러리
└── .github/workflows/  # CI/CD (deploy, preview)
```

| 앱 | 역할 | 도메인 |
|---|---|---|
| **Admin** | 로그인, 페이지 에디터, 분석 대시보드, 요금제 관리 | `admin.promotion.ccoshong.top` |
| **Public** | 배포된 프로모션 페이지 서빙, 인트로/요금제/가이드 페이지, 이벤트 로깅 API | `promotion.ccoshong.top` |

## 기술 스택

- **런타임**: Cloudflare Workers
- **Admin**: React Router v7, Tailwind CSS, dnd-kit
- **Public**: Hono (정적 HTML 서빙, JS 번들 없음)
- **DB**: Cloudflare D1 (SQLite) + Drizzle ORM
- **스토리지**: Cloudflare KV (배포 HTML), Cloudflare R2 (이미지/에셋)
- **인증**: Better Auth (Google OAuth)
- **결제**: LemonSqueezy (월별 구독)
- **모노레포**: pnpm workspaces + Turborepo

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 10+
- Cloudflare 계정 (D1, KV, R2, Workers)
- Google OAuth 클라이언트 ID/Secret
- LemonSqueezy 계정 (결제 기능 사용 시)

### 설치

```bash
pnpm install
```

### 환경변수 설정

```bash
cp apps/admin/.dev.vars.example apps/admin/.dev.vars
```

`apps/admin/.dev.vars`에 실제 값을 입력합니다:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BETTER_AUTH_SECRET=...
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_VARIANT_ID_MONTHLY=...
LEMONSQUEEZY_VARIANT_ID_YEARLY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
```

### 로컬 개발

```bash
# 전체 실행
pnpm dev

# 개별 실행
pnpm dev:admin   # http://localhost:5173
pnpm dev:public  # http://localhost:8787
```

### DB 마이그레이션

```bash
# 스키마 변경 후 마이그레이션 파일 생성
pnpm db:generate

# 로컬 D1에 적용
cd apps/admin && npx wrangler d1 migrations apply promotion-db --local

# 프로덕션 D1에 적용
cd apps/admin && npx wrangler d1 migrations apply promotion-db --remote
```

### 배포

```bash
# Admin 앱 배포 (프로덕션)
pnpm --filter @project-promotion/admin run deploy

# Admin 앱 배포 (프리뷰)
pnpm --filter @project-promotion/admin run deploy:preview

# Public 앱 배포
pnpm --filter @project-promotion/public run deploy
```

프로덕션 시크릿은 Wrangler로 설정합니다:

```bash
cd apps/admin
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put LEMONSQUEEZY_API_KEY
npx wrangler secret put LEMONSQUEEZY_STORE_ID
npx wrangler secret put LEMONSQUEEZY_VARIANT_ID_MONTHLY
npx wrangler secret put LEMONSQUEEZY_VARIANT_ID_YEARLY
npx wrangler secret put LEMONSQUEEZY_WEBHOOK_SECRET
```

## CI/CD

| 워크플로우 | 트리거 | 동작 |
|---|---|---|
| `deploy.yml` | `main` 브랜치 push | admin + public 앱 자동 배포 + Slack 알림 |
| `preview.yml` | PR open/sync | 프리뷰 Worker 배포 (`preview-admin.promotion.ccoshong.top`) + Slack 알림 |
| `preview.yml` | PR closed | 프리뷰 Worker 삭제 + Slack 알림 |

**GitHub Secrets 필요:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

**GitHub Variables (선택):**
- `SLACK_WEBHOOK_URL` — 설정 시 배포 시작/성공/실패 알림 전송

## 요금제

|  | Free | Pro | Business |
|---|---|---|---|
| 가격 | 0원 | 월 2,900원 | 준비 중 |
| 페이지 | 1개 | 5개 | 무제한 |
| 로깅 조회 | 최근 14일 | 최근 1년 | 전체 기간 |
| 분석 | 페이지뷰 | + 클릭, 스크롤 | + 리포트, CSV |
| 브랜딩 제거 | X | O | O |

## 컴포넌트

CDD 컴포넌트는 `packages/promotion-components`에서 관리됩니다. 각 컴포넌트는 Zod 스키마를 포함하며, 에디터가 자동으로 속성 편집 UI를 생성합니다.

기본 제공 컴포넌트:
`hero-image` | `image` | `text` | `button` | `carousel` | `menu` | `footer` | `divider` | `spacer`
