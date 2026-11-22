import 'dart:collection';
import '../models/tube.dart';
import '../models/move_record.dart';

class BfsSolver {
  static MoveRecord? solve(List<Tube> initialTubes, {int maxIterations = 1000}) {
    String serialize(List<Tube> tubes) {
      final list = tubes.map((t) => t.balls.map((b) => b.name).join(',')).toList();
      list.sort();
      return list.join('|');
    }

    bool isSolved(List<Tube> tubes) {
      int count = 0;
      for (final t in tubes) {
        if (t.isEmpty) continue;
        if (!t.isSolved) return false;
        count++;
      }
      return count >= 2;
    }

    final visited = <String>{};
    visited.add(serialize(initialTubes));

    final queue = Queue<_SearchNode>();

    // Initial frontier
    for (int from = 0; from < initialTubes.length; from++) {
      for (int to = 0; to < initialTubes.length; to++) {
        if (_canMove(initialTubes, from, to)) {
          final nextState = initialTubes.map((t) => t.clone()).toList();
          final ball = nextState[from].pop();
          nextState[to].push(ball);

          final key = serialize(nextState);
          if (!visited.contains(key)) {
            visited.add(key);
            final move = MoveRecord(fromTube: from, toTube: to, color: ball);
            if (isSolved(nextState)) return move;
            queue.add(_SearchNode(nextState, move));
          }
        }
      }
    }

    int steps = 0;
    while (queue.isNotEmpty && steps < maxIterations) {
      steps++;
      final node = queue.removeFirst();

      for (int from = 0; from < node.state.length; from++) {
        for (int to = 0; to < node.state.length; to++) {
          if (_canMove(node.state, from, to)) {
            final nextState = node.state.map((t) => t.clone()).toList();
            final ball = nextState[from].pop();
            nextState[to].push(ball);

            final key = serialize(nextState);
            if (!visited.contains(key)) {
              visited.add(key);
              if (isSolved(nextState)) return node.initialMove;
              queue.add(_SearchNode(nextState, node.initialMove));
            }
          }
        }
      }
    }

    return null;
  }

  static bool _canMove(List<Tube> tubes, int from, int to) {
    if (from == to) return false;
    final f = tubes[from];
    final t = tubes[to];
    if (f.isEmpty || t.isFull || f.isSolved) return false;
    if (t.isEmpty) return true;
    return f.topBall == t.topBall;
  }
}

class _SearchNode {
  final List<Tube> state;
  final MoveRecord initialMove;

  _SearchNode(this.state, this.initialMove);
}
