import '../models/ball.dart';
import '../models/tube.dart';
import '../models/move_record.dart';

class PuzzleEngine {
  final List<Tube> tubes;
  final List<MoveRecord> undoHistory = [];
  int moveCount = 0;

  PuzzleEngine(List<Tube> initialTubes)
      : tubes = initialTubes.map((t) => t.clone()).toList();

  bool canMove(int fromIndex, int toIndex) {
    if (fromIndex == toIndex) return false;
    if (fromIndex < 0 || fromIndex >= tubes.length) return false;
    if (toIndex < 0 || toIndex >= tubes.length) return false;

    final fromTube = tubes[fromIndex];
    final toTube = tubes[toIndex];

    if (fromTube.isEmpty) return false;
    if (toTube.isFull) return false;
    if (fromTube.isSolved) return false;

    if (toTube.isEmpty) return true;

    return fromTube.topBall == toTube.topBall;
  }

  bool executeMove(int fromIndex, int toIndex) {
    if (!canMove(fromIndex, toIndex)) return false;

    final ball = tubes[fromIndex].pop();
    tubes[toIndex].push(ball);

    undoHistory.add(MoveRecord(
      fromTube: fromIndex,
      toTube: toIndex,
      color: ball,
    ));

    moveCount++;
    return true;
  }

  bool undo() {
    if (undoHistory.isEmpty) return false;

    final lastMove = undoHistory.removeLast();
    final ball = tubes[lastMove.toTube].pop();
    tubes[lastMove.fromTube].push(ball);

    return true;
  }

  bool get isWon {
    int solvedCount = 0;
    for (final tube in tubes) {
      if (tube.isEmpty) continue;
      if (!tube.isSolved) return false;
      solvedCount++;
    }
    return solvedCount >= 2;
  }

  void addExtraTube() {
    tubes.add(Tube());
  }

  void reset(List<Tube> initialTubes) {
    tubes.clear();
    tubes.addAll(initialTubes.map((t) => t.clone()));
    undoHistory.clear();
    moveCount = 0;
  }
}
