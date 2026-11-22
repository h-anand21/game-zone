import 'package:flutter/material.dart';

class GlassTubePainter extends CustomPainter {
  final bool isSelected;
  final bool isSolved;
  final Color accentColor;

  const GlassTubePainter({
    required this.isSelected,
    required this.isSolved,
    this.accentColor = const Color(0xFF00CFFF),
  });

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final r = size.width / 2;

    // Outer glass contour with rounded bottom
    final path = Path()
      ..moveTo(0, 4)
      ..lineTo(0, size.height - r)
      ..arcToPoint(Offset(size.width, size.height - r), radius: Radius.circular(r), clockwise: false)
      ..lineTo(size.width, 4);

    // Subtle glass body fill
    final glassFill = Paint()
      ..color = const Color(0xFF141B3B).withOpacity(0.35)
      ..style = PaintingStyle.fill;
    canvas.drawPath(path, glassFill);

    // Glass reflection vertical streak
    final streakPaint = Paint()
      ..color = Colors.white.withOpacity(0.18)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(4, 10), Offset(4, size.height - r - 4), streakPaint);

    // Tube outline border
    final borderPaint = Paint()
      ..color = isSolved
          ? const Color(0xFFFBBF24)
          : isSelected
              ? accentColor
              : Colors.white.withOpacity(0.25)
      ..strokeWidth = isSelected || isSolved ? 2.5 : 1.5
      ..style = PaintingStyle.stroke;
    canvas.drawPath(path, borderPaint);

    // Glass top elliptical rim
    final rimRect = Rect.fromCenter(
      center: Offset(size.width / 2, 4),
      width: size.width + 4,
      height: 7,
    );
    final rimPaint = Paint()
      ..color = isSelected ? accentColor : Colors.white.withOpacity(0.4)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    canvas.drawOval(rimRect, rimPaint);
  }

  @override
  bool shouldRepaint(covariant GlassTubePainter oldDelegate) {
    return oldDelegate.isSelected != isSelected || oldDelegate.isSolved != isSolved || oldDelegate.accentColor != accentColor;
  }
}
