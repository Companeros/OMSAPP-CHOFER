import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import TextInput from "./TextInput";
import Input, { InputProps } from "../atoms/Input";

interface EmailInputProps extends InputProps {}

const EmailInput = ({ value, onChange }: EmailInputProps) => {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (text: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    setIsValidEmail(emailPattern.test(text));
    onChange(text);
  };

  return (
    <>
      {!isValidEmail && (
        <Text style={styles.errorText}>Correo electrónico inválido</Text>
      )}
      <Input
        value={value}
        onChange={handleEmailChange}
        placeholder="Email"
        keyboardType="email-address"
        borderColor={isValidEmail ? "gray" : "red"}
      />
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
});

export default EmailInput;
