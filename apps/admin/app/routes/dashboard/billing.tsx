import { useState } from "react";
import { Link, Form, useSearchParams } from "react-router";
import type { Route } from "./+types/billing";
import { getAuth } from "~/lib/auth.server";
import { getDb } from "~/lib/db.server";
import { getUserPlan } from "~/lib/subscription.server";
import { PLAN_LIMITS } from "@project-promotion/db";

export async function loader({ request, context }: Route.LoaderArgs) {
  const auth = getAuth(context.cloudflare.env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response("Unauthorized", { status: 401 });

  const db = getDb(context.cloudflare.env.DB);
  const userPlan = await getUserPlan(db, session.user.id);

  return {
    plan: userPlan.plan,
    limits: userPlan.limits,
    cancelAtPeriodEnd: userPlan.subscription?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd:
      userPlan.subscription?.currentPeriodEnd?.toISOString() ?? null,
  };
}

type PlanType = "free" | "pro";

function FeatureRow({
  label,
  desc,
  free,
  pro,
  business,
  currentPlan,
  isLast = false,
}: {
  label: string;
  desc: string;
  free: boolean | string;
  pro: boolean | string;
  business: boolean | string;
  currentPlan: PlanType;
  isLast?: boolean;
}) {
  const renderValue = (
    value: boolean | string,
    columnPlan: PlanType | "business",
  ) => {
    const isCurrent = columnPlan === currentPlan;
    const isBusiness = columnPlan === "business";

    if (typeof value === "string") {
      return (
        <span
          className={`text-sm font-medium ${isCurrent ? "text-gray-900" : isBusiness ? "text-gray-400" : "text-gray-400"}`}
        >
          {value}
        </span>
      );
    }
    if (value) {
      return (
        <span
          className={`text-lg ${isCurrent ? "text-blue-600" : isBusiness ? "text-gray-300" : "text-gray-300"}`}
        >
          &#10003;
        </span>
      );
    }
    return <span className="text-gray-200 text-lg">&mdash;</span>;
  };

  const currentCol = currentPlan === "free" ? 1 : 2;

  return (
    <div
      className={`grid grid-cols-4 gap-0 items-center ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div
        className={`text-center py-3 ${currentCol === 1 ? "bg-blue-50/50" : ""}`}
      >
        {renderValue(free, "free")}
      </div>
      <div
        className={`text-center py-3 ${currentCol === 2 ? "bg-blue-50/50" : ""}`}
      >
        {renderValue(pro, "pro")}
      </div>
      <div className="text-center py-3 bg-gray-50/40 relative">
        <div className="opacity-30">{renderValue(business, "business")}</div>
      </div>
    </div>
  );
}

export default function BillingPage({ loaderData }: Route.ComponentProps) {
  const { plan, limits, cancelAtPeriodEnd, currentPeriodEnd } = loaderData;
  const [searchParams] = useSearchParams();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const canceledSub = searchParams.get("canceled_sub") === "true";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; 대시보드
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">요금제 관리</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          Pro 플랜으로 업그레이드되었습니다!
        </div>
      )}
      {canceled && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          결제가 취소되었습니다.
        </div>
      )}
      {canceledSub && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          구독 해지가 예약되었습니다. 현재 결제 기간이 끝날 때까지 Pro 기능을
          이용할 수 있습니다.
        </div>
      )}

      {/* Current plan */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">현재 플랜</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 text-sm font-semibold rounded-full ${
                  plan === "pro"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {plan === "pro" ? "Pro" : "Free"}
              </span>
              {cancelAtPeriodEnd && (
                <span className="text-xs text-amber-600">(해지 예약됨)</span>
              )}
            </div>
          </div>
          {plan === "pro" && currentPeriodEnd && (
            <p className="text-sm text-gray-500">
              다음 결제:{" "}
              {new Date(currentPeriodEnd).toLocaleDateString("ko-KR")}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">페이지 한도</p>
            <p className="font-semibold text-gray-900">{limits.maxPages}개</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500">로깅 조회</p>
            <p className="font-semibold text-gray-900">
              최근 {limits.loggingDays}일
            </p>
          </div>
        </div>
      </div>

      {/* Plan headers */}
      <div className="grid grid-cols-4 gap-0 mb-0">
        <div />
        <div
          className={`text-center p-4 rounded-t-xl border border-b-0 ${
            plan === "free"
              ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-inset relative z-10"
              : "border-gray-200 bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${plan === "free" ? "text-blue-700" : "text-gray-900"}`}
          >
            Free
          </h3>
          <p
            className={`text-xl font-bold mt-1 ${plan === "free" ? "text-blue-700" : "text-gray-900"}`}
          >
            0원
          </p>
          {plan === "free" && (
            <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
              현재 플랜
            </span>
          )}
        </div>
        <div
          className={`text-center p-4 rounded-t-xl border border-b-0 ${
            plan === "pro"
              ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-inset relative z-10"
              : "border-gray-200 bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${plan === "pro" ? "text-blue-700" : "text-gray-500"}`}
          >
            Pro
          </h3>
          <p
            className={`text-xl font-bold mt-1 ${plan === "pro" ? "text-blue-700" : "text-gray-500"}`}
          >
            2,900원
            <span className="text-sm font-normal text-gray-400"> / 월</span>
          </p>
          {plan === "pro" && (
            <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold">
              현재 플랜
            </span>
          )}
        </div>
        <div className="text-center p-4 rounded-t-xl border border-b-0 border-dashed border-gray-200 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(0,0,0,0.02)_8px,rgba(0,0,0,0.02)_16px)] relative overflow-hidden">
          <h3 className="font-semibold text-gray-300">Business</h3>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span className="text-xs font-medium text-gray-400">준비 중</span>
          </div>
          <p className="text-[10px] text-gray-300 mt-1.5">출시 시 알려드릴게요</p>
        </div>
      </div>

      {/* Feature comparison table */}
      <div className="bg-white border border-gray-200 rounded-b-xl overflow-hidden mb-6">
        <FeatureRow
          currentPlan={plan as PlanType}
          label="프로모션 페이지"
          desc="배포 가능한 페이지 수"
          free={`${PLAN_LIMITS.free.maxPages}개`}
          pro={`${PLAN_LIMITS.pro.maxPages}개`}
          business="무제한"
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="로깅 데이터 조회"
          desc="방문자 행동 데이터 보관 및 조회 기간"
          free={`최근 ${PLAN_LIMITS.free.loggingDays}일`}
          pro={`최근 ${PLAN_LIMITS.pro.loggingDays}일`}
          business="전체 기간"
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="페이지뷰 분석"
          desc="방문자 수, 고유 방문자 수 확인"
          free={true}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="클릭 분석"
          desc="어떤 버튼/링크를 얼마나 클릭했는지 추적"
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="스크롤 분석"
          desc="방문자가 페이지를 얼마나 내려봤는지 측정"
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="브랜딩 제거"
          desc="배포 페이지 하단의 PromoBuilder 로고 제거"
          free={false}
          pro={true}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="상세 리포트"
          desc="기간별 비교, 트렌드 차트, CSV 내보내기"
          free={false}
          pro={false}
          business={true}
        />
        <FeatureRow
          currentPlan={plan as PlanType}
          label="커스텀 도메인"
          desc="나만의 도메인으로 프로모션 페이지 연결"
          free={false}
          pro={false}
          business={true}
          isLast
        />
      </div>

      {/* CTA */}
      {plan === "free" && (
        <div className="mb-6">
          <Form method="post" action="/api/create-checkout">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Pro로 업그레이드
            </button>
          </Form>
        </div>
      )}

      {/* Cancel section */}
      {plan === "pro" && !cancelAtPeriodEnd && (
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">구독 해지</h3>
          <p className="text-sm text-gray-500 mb-4">
            해지하면 현재 결제 기간이 끝날 때까지 Pro 기능을 사용할 수 있습니다.
            이후 가장 최근 페이지 1개만 유지되고 나머지는 비활성화됩니다.
          </p>
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            구독 해지
          </button>
        </div>
      )}

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              정말 해지하시겠습니까?
            </h3>
            <div className="text-sm text-gray-600 space-y-2 mb-6">
              <p>구독을 해지하면:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  현재 결제 기간(
                  {currentPeriodEnd
                    ? new Date(currentPeriodEnd).toLocaleDateString("ko-KR")
                    : ""}
                  )까지는 Pro 기능 유지
                </li>
                <li>
                  만료 후 가장 최근 페이지 <strong>1개만 활성</strong> 유지
                </li>
                <li>
                  나머지 페이지는 <strong>배포 중단 + 편집 불가</strong>
                </li>
                <li>데이터는 삭제되지 않으며, 재구독 시 즉시 복원</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <Form method="post" action="/api/cancel-subscription">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  해지 확인
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
