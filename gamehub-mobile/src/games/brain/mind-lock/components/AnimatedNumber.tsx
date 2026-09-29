// ============================================================
// Mind Lock — Animated Number Counter Component
// ============================================================

import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  style?: TextStyle;
  formatter?: (n: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 600,
  style,
  formatter = (n) => Math.round(n).toLocaleString(),
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startVal = displayValue;
    const diff = value - startVal;
    if (diff === 0) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = startVal + diff * progress;
      setDisplayValue(current);

      if (progress >= 1) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <Text style={style}>{formatter(displayValue)}</Text>;
};
