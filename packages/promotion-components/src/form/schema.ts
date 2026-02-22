import { z } from "zod";

export const formFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "email", "phone", "select", "textarea"]),
  label: z.string(),
  placeholder: z.string().default(""),
  required: z.boolean().default(false),
  options: z.string().default(""),
});

export const formSchema = z.object({
  fields: z
    .array(formFieldSchema)
    .min(1)
    .default([
      { name: "name", type: "text", label: "이름", placeholder: "홍길동", required: true, options: "" },
      { name: "phone", type: "phone", label: "연락처", placeholder: "010-1234-5678", required: true, options: "" },
    ]),
  submitText: z.string().default("제출하기"),
  successMessage: z.string().default("제출이 완료되었습니다. 감사합니다!"),
  backgroundColor: z.string().default("#ffffff"),
  textColor: z.string().default("#111827"),
});

export type FormFieldDef = z.infer<typeof formFieldSchema>;
export type FormProps = z.infer<typeof formSchema>;
