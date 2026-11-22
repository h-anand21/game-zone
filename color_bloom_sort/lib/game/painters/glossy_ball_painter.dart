import 'package:flutter/material.dart';
import '../models/ball.dart';

class GlossyBallPainter extends CustomPainter {
  final BallColor ballColor;

  const GlossyBallPainter({required this.ballColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // 1. Soft base shadow
    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.35)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2.5);
    canvas.drawCircle(center + const Offset(0, 2), radius, shadowPaint);

    // 2. 3D Radial Gradient Spherical Body
    final gradient = RadialGradient(
      center: const Alignment(-0.35, -0.4),
      radius: 0.9,
      colors: [
        ballColor.highlightColor,
        ballColor.primaryColor,
        ballColor.shadowColor,
      ],
      stops: const [0.0, 0.55, 1.0],
    );

    final ballPaint = Paint()
      ..shader = gradient.createShader(Rect.fromCircle(center: center, radius: radius));
    canvas.drawCircle(center, radius, ballPaint);

    // 3. Specular highlight reflection dot at top-left
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.7)
      ..style = PaintingStyle.fill;

    canvas.save();
    canvas.translate(center.dx - radius * 0.35, center.dy - radius * 0.35);
    canvas.rotate(-0.4);
    canvas.drawOval(
      Rect.fromCenter(center: Offset.zero, width: radius * 0.45, height: radius * 0.25),
      highlightPaint,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant GlossyBallPainter oldDelegate) {
    return oldDelegate.ballColor != ballColor;
  }
}
