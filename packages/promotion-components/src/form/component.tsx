import type { FormProps, FormFieldDef } from "./schema";

function FieldInput({ field }: { field: FormFieldDef }) {
  const base: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
  };

  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        rows={3}
        style={{ ...base, resize: "vertical" }}
      />
    );
  }

  if (field.type === "select") {
    const opts = field.options
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    return (
      <select name={field.name} required={field.required} style={base}>
        <option value="">{field.placeholder || "선택하세요"}</option>
        {opts.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  const inputType =
    field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text";

  return (
    <input
      type={inputType}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
      style={base}
    />
  );
}

export function FormComponent({
  fields,
  submitText,
  successMessage,
  backgroundColor,
  textColor,
}: FormProps) {
  return (
    <div
      data-promo-form
      data-success-message={successMessage}
      style={{
        padding: "24px 16px",
        backgroundColor,
        color: textColor,
      }}
    >
      <form
        style={{ maxWidth: "480px", margin: "0 auto" }}
        onSubmit={(e) => e.preventDefault()}
      >
        {fields.map((field, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              {field.label}
              {field.required && (
                <span style={{ color: "#dc2626", marginLeft: "2px" }}>*</span>
              )}
            </label>
            <FieldInput field={field} />
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {submitText}
        </button>
      </form>
    </div>
  );
}
