import 'ball.dart';

class MoveRecord {
  final int fromTube;
  final int toTube;
  final BallColor color;

  const MoveRecord({
    required this.fromTube,
    required this.toTube,
    required this.color,
  });
}
