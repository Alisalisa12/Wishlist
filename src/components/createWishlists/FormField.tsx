import React from "react";


interface FormFieldProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = React.memo(({
  placeholder,
  type,
  value,
  onChange,
}) => (
  <div>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}/>
  </div>
));

FormField.displayName = 'FormField';

export default FormField;