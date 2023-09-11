import React from "react";
import Input, { InputProps } from "../atoms/Input";
import { StyleSheet } from "react-native";

export interface TextInputProps extends InputProps {}

const TextInput = ({
  value,
  onChange,
  placeholder,
  multiline,
  numberOfLines,
}: TextInputProps) => {
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      keyboardType="default"
    />
  );
};

export default TextInput;
