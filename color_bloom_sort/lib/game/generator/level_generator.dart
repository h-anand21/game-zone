import 'dart:math';
import '../models/ball.dart';
import '../models/tube.dart';

class LevelGenerator {
  static List<Tube> generate(int levelNumber) {
    final clampedLevel = max(1, levelNumber);

    int colorCount;
    int emptyCount = 2;

    if (clampedLevel <= 5) {
      colorCount = 3;
    } else if (clampedLevel <= 20) {
      colorCount = 4;
    } else if (clampedLevel <= 50) {
      colorCount = 5;
    } else if (clampedLevel <= 120) {
      colorCount = 6;
    } else if (clampedLevel <= 250) {
      colorCount = 7;
    } else {
      colorCount = min(BallColor.values.length, 8);
    }

    final colors = BallColor.values.sublist(0, colorCount);
    final totalTubes = colorCount + emptyCount;

    final random = Random(clampedLevel * 104729 + 7919);

    final tubes = List.generate(totalTubes, (index) {
      if (index < colorCount) {
        return Tube(List.filled(Tube.capacity, colors[index]));
      }
      return Tube();
    });

    // Shuffle using legal reverse moves to guarantee 100% solvability
    final shuffleSteps = min(60, 20 + clampedLevel * 2);

    for (int step = 0; step < shuffleSteps; step++) {
      final validMoves = <Point<int>>[];

      for (int from = 0; from < totalTubes; from++) {
        for (int to = 0; to < totalTubes; to++) {
          if (from == to) continue;
          final source = tubes[from];
          final dest = tubes[to];

          if (!source.isEmpty && !dest.isFull) {
            final movingBall = source.topBall!;
            final remainingTop = source.length > 1 ? source.balls[source.length - 2] : null;

            if (remainingTop == null || remainingTop == movingBall) {
              validMoves.add(Point(from, to));
            }
          }
        }
      }

      if (validMoves.isNotEmpty) {
        final chosen = validMoves[random.nextInt(validMoves.length)];
        final ball = tubes[chosen.x].pop();
        tubes[chosen.y].push(ball);
      }
    }

    return tubes;
  }
}
