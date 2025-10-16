import React, { ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface BaseTextProps extends TextProps {
  children: ReactNode;
}

const BaseText: React.FC<BaseTextProps> = ({
  children,
  style,
  ...otherProps
}) => (
  <Text style={[styles.defaultStyle, style]} {...otherProps}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'DMSansRegular',
    color: '#000',
  },
});

export default BaseText;
