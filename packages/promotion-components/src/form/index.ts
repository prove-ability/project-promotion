import type { ComponentDefinition } from "../types";
import { FormComponent } from "./component";
import { formSchema, type FormProps } from "./schema";

export { FormComponent } from "./component";
export { formSchema, type FormProps, type FormFieldDef } from "./schema";

export const formDefinition: ComponentDefinition<FormProps> = {
  type: "form",
  name: "폼/설문",
  icon: "clipboard",
  category: "interactive",
  schema: formSchema,
  defaultProps: {
    fields: [
      { name: "name", type: "text", label: "이름", placeholder: "홍길동", required: true, options: "" },
      { name: "phone", type: "phone", label: "연락처", placeholder: "010-1234-5678", required: true, options: "" },
    ],
    submitText: "제출하기",
    successMessage: "제출이 완료되었습니다. 감사합니다!",
    backgroundColor: "#ffffff",
    textColor: "#111827",
  },
  component: FormComponent,
};
