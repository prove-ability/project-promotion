import type { PageComponent } from "@project-promotion/components";
import { useT } from "~/lib/i18n";

interface Template {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  components: PageComponent[];
}

function uid() {
  return `comp_${crypto.randomUUID().slice(0, 8)}`;
}

const TEMPLATES: Template[] = [
  {
    id: "blank",
    nameKey: "template.blank",
    descKey: "template.blank.desc",
    icon: "📄",
    components: [],
  },
  {
    id: "product-launch",
    nameKey: "template.productLaunch",
    descKey: "template.productLaunch.desc",
    icon: "🚀",
    components: [
      {
        id: uid(),
        type: "hero-image",
        props: {
          src: "https://placehold.co/800x400/2563eb/white?text=Product+Launch",
          alt: "Product Launch",
          height: 400,
          objectFit: "cover",
          link: "",
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "새로운 제품을 소개합니다",
          tag: "h1",
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          color: "#111827",
          backgroundColor: "#ffffff",
          paddingX: 24,
          paddingY: 32,
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "제품의 핵심 가치를 여기에 설명하세요. 고객이 왜 이 제품을 선택해야 하는지 간결하게 전달합니다.",
          tag: "p",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "center",
          color: "#6b7280",
          backgroundColor: "#ffffff",
          paddingX: 24,
          paddingY: 0,
        },
      },
      {
        id: uid(),
        type: "button",
        props: {
          text: "지금 구매하기",
          href: "#",
          linkType: "url",
          variant: "primary",
          size: "lg",
          fullWidth: true,
          backgroundColor: "#2563eb",
          textColor: "#ffffff",
          borderRadius: 12,
        },
      },
      { id: uid(), type: "spacer", props: { height: 32 } },
      {
        id: uid(),
        type: "carousel",
        props: {
          images: [
            { src: "https://placehold.co/800x400/f3f4f6/6b7280?text=Feature+1", alt: "Feature 1", link: "" },
            { src: "https://placehold.co/800x400/f3f4f6/6b7280?text=Feature+2", alt: "Feature 2", link: "" },
            { src: "https://placehold.co/800x400/f3f4f6/6b7280?text=Feature+3", alt: "Feature 3", link: "" },
          ],
          autoPlay: true,
          autoPlayInterval: 3000,
          showDots: true,
        },
      },
      {
        id: uid(),
        type: "footer",
        props: {
          text: "© 2026 Your Company",
          links: [],
          backgroundColor: "#f9fafb",
          textColor: "#9ca3af",
        },
      },
    ],
  },
  {
    id: "event-promo",
    nameKey: "template.eventPromo",
    descKey: "template.eventPromo.desc",
    icon: "🎉",
    components: [
      {
        id: uid(),
        type: "menu",
        props: {
          logoSrc: "",
          logoText: "EVENT",
          items: [
            { label: "이벤트 소개", href: "#intro" },
            { label: "참여 방법", href: "#how" },
          ],
          backgroundColor: "#ffffff",
          textColor: "#111827",
        },
      },
      {
        id: uid(),
        type: "hero-image",
        props: {
          src: "https://placehold.co/800x400/dc2626/white?text=SUMMER+SALE",
          alt: "Summer Sale",
          height: 400,
          objectFit: "cover",
          link: "",
        },
      },
      {
        id: uid(),
        type: "countdown",
        props: {
          targetDate: "2026-08-31T23:59:59",
          expiredText: "이벤트가 종료되었습니다",
          style: "card",
          textColor: "#111827",
          backgroundColor: "#fef2f2",
          showDays: true,
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "최대 70% 할인! 놓치지 마세요",
          tag: "h1",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#dc2626",
          backgroundColor: "#ffffff",
          paddingX: 24,
          paddingY: 24,
        },
      },
      {
        id: uid(),
        type: "button",
        props: {
          text: "이벤트 참여하기",
          href: "#",
          linkType: "url",
          variant: "primary",
          size: "lg",
          fullWidth: true,
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
          borderRadius: 12,
        },
      },
      {
        id: uid(),
        type: "footer",
        props: {
          text: "© 2026 Your Brand",
          links: [{ label: "이용약관", href: "#" }],
          backgroundColor: "#f9fafb",
          textColor: "#9ca3af",
        },
      },
    ],
  },
  {
    id: "lead-collect",
    nameKey: "template.leadCollect",
    descKey: "template.leadCollect.desc",
    icon: "📋",
    components: [
      {
        id: uid(),
        type: "hero-image",
        props: {
          src: "https://placehold.co/800x300/4f46e5/white?text=Get+Early+Access",
          alt: "Early Access",
          height: 300,
          objectFit: "cover",
          link: "",
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "사전 신청 받고 있습니다",
          tag: "h1",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          color: "#111827",
          backgroundColor: "#ffffff",
          paddingX: 24,
          paddingY: 24,
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "아래 정보를 남겨주시면 출시 알림을 보내드립니다.",
          tag: "p",
          fontSize: 16,
          fontWeight: "normal",
          textAlign: "center",
          color: "#6b7280",
          backgroundColor: "#ffffff",
          paddingX: 24,
          paddingY: 0,
        },
      },
      {
        id: uid(),
        type: "form",
        props: {
          fields: [
            { name: "name", type: "text", label: "이름", placeholder: "홍길동", required: true, options: "" },
            { name: "email", type: "email", label: "이메일", placeholder: "email@example.com", required: true, options: "" },
            { name: "phone", type: "phone", label: "연락처", placeholder: "010-1234-5678", required: false, options: "" },
          ],
          submitText: "사전 신청하기",
          successMessage: "신청이 완료되었습니다! 출시 시 알림을 보내드리겠습니다.",
          backgroundColor: "#ffffff",
          textColor: "#111827",
        },
      },
      {
        id: uid(),
        type: "footer",
        props: {
          text: "© 2026 Your Company",
          links: [{ label: "개인정보처리방침", href: "#" }],
          backgroundColor: "#f9fafb",
          textColor: "#9ca3af",
        },
      },
    ],
  },
  {
    id: "restaurant",
    nameKey: "template.restaurant",
    descKey: "template.restaurant.desc",
    icon: "🍽️",
    components: [
      {
        id: uid(),
        type: "menu",
        props: {
          logoSrc: "",
          logoText: "RESTAURANT",
          items: [
            { label: "메뉴", href: "#menu" },
            { label: "예약", href: "#reserve" },
            { label: "위치", href: "#location" },
          ],
          backgroundColor: "#1f2937",
          textColor: "#ffffff",
        },
      },
      {
        id: uid(),
        type: "hero-image",
        props: {
          src: "https://placehold.co/800x400/92400e/white?text=Fine+Dining",
          alt: "Restaurant",
          height: 400,
          objectFit: "cover",
          link: "",
        },
      },
      {
        id: uid(),
        type: "text",
        props: {
          content: "특별한 맛, 특별한 순간",
          tag: "h1",
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          color: "#92400e",
          backgroundColor: "#fffbeb",
          paddingX: 24,
          paddingY: 32,
        },
      },
      {
        id: uid(),
        type: "image",
        props: {
          src: "https://placehold.co/800x500/fef3c7/92400e?text=Menu+Image",
          alt: "Menu",
          objectFit: "cover",
          link: "",
        },
      },
      {
        id: uid(),
        type: "button",
        props: {
          text: "예약하기",
          href: "tel:02-1234-5678",
          linkType: "tel",
          variant: "primary",
          size: "lg",
          fullWidth: true,
          backgroundColor: "#92400e",
          textColor: "#ffffff",
          borderRadius: 12,
        },
      },
      {
        id: uid(),
        type: "footer",
        props: {
          text: "서울시 강남구 테헤란로 123 | 02-1234-5678",
          links: [],
          backgroundColor: "#1f2937",
          textColor: "#9ca3af",
        },
      },
    ],
  },
];

interface TemplatePickerProps {
  onSelect: (components: PageComponent[]) => void;
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const { t } = useT();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[640px] p-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {t("template.pickTitle")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("template.pickDesc")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg w-full">
        {TEMPLATES.map((tpl) => {
          const name = t(tpl.nameKey) !== tpl.nameKey ? t(tpl.nameKey) : tpl.id;
          const desc = t(tpl.descKey) !== tpl.descKey ? t(tpl.descKey) : "";
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.components.map((c) => ({ ...c, id: uid() })))}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm active:scale-95 transition-all text-center"
            >
              <span className="text-3xl">{tpl.icon}</span>
              <span className="text-sm font-medium text-gray-800">{name}</span>
              {desc && (
                <span className="text-[11px] text-gray-500 leading-tight">{desc}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
