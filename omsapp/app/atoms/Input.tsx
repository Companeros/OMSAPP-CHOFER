import {
  TextInput,
  StyleSheet,
  View,
  TextStyle,
  Text,
  DimensionValue,
} from "react-native";
import React, { useState } from "react";

export interface InputProps {
  value?: string;
  onChange: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  onBlur?: () => void;
  borderColor?: string;
  isRequired?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

const Input = ({
  value,
  onChange,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  onBlur,
  borderColor,
  isRequired = false,
  width,
  multiline,
  height,
  numberOfLines,
  maxLength,
}: InputProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleBlur = () => {
    setIsTouched(true);
    validateField(value);
    onBlur && onBlur();
  };

  const handleChange = (text: string) => {
    setIsTouched(true);
    onChange(text);
    if (isRequired) {
      validateField(text);
    }
  };

  const validateField = (text: string) => {
    if (isRequired) {
      setIsValid(text.trim() !== "");
    }
  };

  const inputStyles = {
    ...styles.input,
    borderColor: borderColor || (isValid ? "gray" : "red"),
  };

  return (
    <View style={{ width: width || "auto" }}>
      <TextInput
        style={[inputStyles, { height: height }]}
        value={value}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
      />
      {isRequired && isTouched && !isValid && (
        <Text style={styles.errorText}>Campo requerido</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default Input;
