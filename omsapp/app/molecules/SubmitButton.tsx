import { View, Text } from "react-native";
import React from "react";
import { Button, ButtonProps } from "../atoms/Button";

interface SubmitButtonProps extends ButtonProps {
  onPress: () => void;
}

const SubmitButton = ({
  title,
  onPress,
  width,
  height,
  styles,
  borderWidth,
  backgroundColor,
  textColor,
}: SubmitButtonProps) => {
  return (
    <Button
      title={title}
      onPress={onPress}
      width={width}
      height={height}
      styles={styles}
      borderWidth={borderWidth}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
};

export default SubmitButton;
