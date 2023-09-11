import React, { useState } from "react";
import Input, { InputProps } from "../atoms/Input";

interface PassworInputProps extends InputProps {}

const PasswordInput = ({ placeholder, onChange, value }: PassworInputProps) => {
  const [password, setPassword] = useState("");

  const handleTextChange = (text: string) => {
    setPassword(text);
    onChange(text);
  };

  return (
    <Input
      value={password}
      placeholder={placeholder}
      onChange={handleTextChange}
      secureTextEntry={true}
    />
  );
};

export default PasswordInput;
