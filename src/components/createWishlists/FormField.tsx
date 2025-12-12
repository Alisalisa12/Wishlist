import React from "react";


interface FormFieldProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  placeholder,
  type,
  value,
  onChange,
}) => (
  <div>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}/>
  </div>
);

export default FormField;