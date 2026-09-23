// Reusable input field component
const InputField = ({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  maxLength,
}) => {
  return (
    <label className="field">
      <span>
        {label}
        {required && " *"}
      </span>

      <div className="field-input">
        {icon && <i className={`fa-solid ${icon}`} />}

        <input
          type={type}
          value={value}
          // Send the input value to the parent component
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
      </div>
    </label>
  );
};

export default InputField;
