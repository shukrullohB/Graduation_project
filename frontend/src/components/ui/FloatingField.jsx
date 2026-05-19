export default function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  children,
}) {
  const hasValue = String(value ?? "").length > 0;

  return (
    <label className="floating-field" htmlFor={id} data-filled={hasValue}>
      {children ? (
        <select id={id} value={value} onChange={onChange} required={required}>
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
        />
      )}
      <span>{label}</span>
    </label>
  );
}
