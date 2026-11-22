import 'package:flutter/material.dart';

enum BallColor {
  red,
  blue,
  green,
  amber,
  purple,
  pink,
  cyan,
  orange,
  mint,
  lime;

  Color get primaryColor {
    switch (this) {
      case BallColor.red:
        return const Color(0xFFEF4444);
      case BallColor.blue:
        return const Color(0xFF3B82F6);
      case BallColor.green:
        return const Color(0xFF10B981);
      case BallColor.amber:
        return const Color(0xFFF59E0B);
      case BallColor.purple:
        return const Color(0xFF8B5CF6);
      case BallColor.pink:
        return const Color(0xFFEC4899);
      case BallColor.cyan:
        return const Color(0xFF06B6D4);
      case BallColor.orange:
        return const Color(0xFFF97316);
      case BallColor.mint:
        return const Color(0xFF14B8A6);
      case BallColor.lime:
        return const Color(0xFF84CC16);
    }
  }

  Color get highlightColor {
    switch (this) {
      case BallColor.red:
        return const Color(0xFFFCA5A5);
      case BallColor.blue:
        return const Color(0xFF93C5FD);
      case BallColor.green:
        return const Color(0xFF6EE7B7);
      case BallColor.amber:
        return const Color(0xFFFCD34D);
      case BallColor.purple:
        return const Color(0xFFC4B5FD);
      case BallColor.pink:
        return const Color(0xFFF9A8D4);
      case BallColor.cyan:
        return const Color(0xFF67E8F9);
      case BallColor.orange:
        return const Color(0xFFFDBA74);
      case BallColor.mint:
        return const Color(0xFF5EEAD4);
      case BallColor.lime:
        return const Color(0xFFBEF264);
    }
  }

  Color get shadowColor {
    switch (this) {
      case BallColor.red:
        return const Color(0xFF7F1D1D);
      case BallColor.blue:
        return const Color(0xFF1E3A8A);
      case BallColor.green:
        return const Color(0xFF064E3B);
      case BallColor.amber:
        return const Color(0xFF78350F);
      case BallColor.purple:
        return const Color(0xFF4C1D95);
      case BallColor.pink:
        return const Color(0xFF831843);
      case BallColor.cyan:
        return const Color(0xFF164E63);
      case BallColor.orange:
        return const Color(0xFF7C2D12);
      case BallColor.mint:
        return const Color(0xFF134E4A);
      case BallColor.lime:
        return const Color(0xFF365314);
    }
  }
}
