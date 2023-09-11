import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";
import React from "react";
import { FontSize } from "../styles/GlobalStyles";

//Interfaz de los estilos del boton
export interface ButtonStyles {
  container: ViewStyle;
  text: TextStyle;
}

//estilos por defecto del boton
const defaultButtonStyles: ButtonStyles = {
  container: {
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },
  text: {
    color: "gray",
    textAlign: "center",
    fontSize: FontSize.body,
    fontWeight: "bold",
  },
};

//Propiedades del boton
export interface ButtonProps {
  title: string;
  onPress: () => void;
  width?: DimensionValue;
  height?: DimensionValue;
  styles?: ButtonStyles;
  borderWidth?: number;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

export const Button = ({
  title,
  onPress,
  width,
  height,
  borderWidth,
  backgroundColor,
  textColor,
  styles = defaultButtonStyles,
  disabled,
}: ButtonProps) => {
  const opacity = disabled ? 0.5 : 1;
  const containerStyle = {
    opacity: opacity,
    ...styles.container,
    width: width,
    height: height,
    borderWidth: borderWidth,
    backgroundColor: backgroundColor,
    textColor: textColor,
  };

  const textStyles = {
    ...styles.text,
    color: textColor || defaultButtonStyles.text.color, // Usar textColor o el color predeterminado
  };

  const combinedContainerStyle = StyleSheet.flatten([containerStyle]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={combinedContainerStyle}
      disabled={disabled}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};
