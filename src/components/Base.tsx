import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
  color = theme.colors.text, 
  style,
  numberOfLines 
}) => {
  return (
    <Text 
      style={[theme.typography[variant], { color }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  safe?: boolean;
  scroll?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, style, safe, scroll }) => {
  const Content = scroll ? ScrollView : View;
  const Wrapper = safe ? SafeAreaView : View;

  return (
    <Wrapper style={styles.wrapper}>
      <Content style={[styles.container, style]} contentContainerStyle={scroll ? styles.scrollContent : undefined}>
        {children}
      </Content>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
});
