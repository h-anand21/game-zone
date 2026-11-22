import 'ball.dart';

class Tube {
  static const int capacity = 4;
  final List<BallColor> balls;

  Tube([List<BallColor>? initialBalls]) : balls = initialBalls != null ? List<BallColor>.from(initialBalls) : [];

  bool get isEmpty => balls.isEmpty;
  bool get isFull => balls.length >= capacity;
  int get length => balls.length;

  BallColor? get topBall => isEmpty ? null : balls.last;

  bool get isSolved {
    if (balls.length != capacity) return false;
    final first = balls.first;
    return balls.every((b) => b == first);
  }

  void push(BallColor ball) {
    if (isFull) throw StateError('Cannot push to a full tube');
    balls.add(ball);
  }

  BallColor pop() {
    if (isEmpty) throw StateError('Cannot pop from an empty tube');
    return balls.removeLast();
  }

  Tube clone() => Tube(balls);
}
