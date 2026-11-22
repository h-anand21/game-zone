import 'package:flutter_test/flutter_test.dart';
import 'package:color_bloom_sort/game/models/ball.dart';
import 'package:color_bloom_sort/game/models/tube.dart';
import 'package:color_bloom_sort/game/engine/puzzle_engine.dart';
import 'package:color_bloom_sort/game/generator/level_generator.dart';
import 'package:color_bloom_sort/game/solver/bfs_solver.dart';

void main() {
  group('Color Bloom Sort Flutter Engine Tests', () {
    test('canMove legal and illegal moves validation', () {
      final tubes = [
        Tube([BallColor.red, BallColor.red, BallColor.blue]),
        Tube([BallColor.green, BallColor.blue]),
        Tube(),
        Tube([BallColor.green, BallColor.green, BallColor.green, BallColor.green]),
      ];

      final engine = PuzzleEngine(tubes);

      expect(engine.canMove(0, 1), isTrue); // blue onto blue
      expect(engine.canMove(0, 2), isTrue); // blue into empty tube
      expect(engine.canMove(1, 0), isFalse); // cannot move into non-matching top
      expect(engine.canMove(2, 0), isFalse); // cannot move from empty tube
      expect(engine.canMove(3, 2), isFalse); // cannot move from already solved tube
    });

    test('win detection', () {
      final solvedTubes = [
        Tube([BallColor.red, BallColor.red, BallColor.red, BallColor.red]),
        Tube([BallColor.blue, BallColor.blue, BallColor.blue, BallColor.blue]),
        Tube(),
      ];

      final engine = PuzzleEngine(solvedTubes);
      expect(engine.isWon, isTrue);
    });

    test('level generation generates valid tubes', () {
      final tubes = LevelGenerator.generate(1);
      expect(tubes.length, greaterThanOrEqualTo(3));

      int totalBalls = 0;
      for (final t in tubes) {
        totalBalls += t.length;
      }
      expect(totalBalls, equals(12)); // 3 colors * 4 = 12
    });

    test('solver finds valid hint move', () {
      final nearWinTubes = [
        Tube([BallColor.red, BallColor.red, BallColor.red]),
        Tube([BallColor.blue, BallColor.blue, BallColor.blue, BallColor.blue]),
        Tube([BallColor.red]),
      ];

      final hint = BfsSolver.solve(nearWinTubes);
      expect(hint, isNotNull);
      expect(hint?.fromTube, equals(2));
      expect(hint?.toTube, equals(0));
    });
  });
}
