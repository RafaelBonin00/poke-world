export default function InputCadastro({ name, type = "text", placeholder, value, onChange, onBlur}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...(onBlur && { onBlur })}
      required
    />
  );
}
