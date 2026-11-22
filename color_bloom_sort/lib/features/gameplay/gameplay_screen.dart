import 'package:flutter/material.dart';
import '../../game/models/ball.dart';
import '../../game/models/tube.dart';
import '../../game/engine/puzzle_engine.dart';
import '../../game/generator/level_generator.dart';
import '../../game/solver/bfs_solver.dart';
import '../../game/painters/glass_tube_painter.dart';
import '../../game/painters/glossy_ball_painter.dart';

class GameplayScreen extends StatefulWidget {
  final int initialLevel;

  const GameplayScreen({Key? key, this.initialLevel = 1}) : super(key: key);

  @override
  State<GameplayScreen> createState() => _GameplayScreenState();
}

class _GameplayScreenState extends State<GameplayScreen> with SingleTickerProviderStateMixin {
  late int currentLevel;
  late PuzzleEngine engine;
  int? selectedTubeIndex;
  int? hintSource;
  int? hintDest;
  late AnimationController _liftController;

  @override
  void initState() {
    super.initState();
    currentLevel = widget.initialLevel;
    _liftController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _loadLevel(currentLevel);
  }

  void _loadLevel(int level) {
    setState(() {
      currentLevel = level;
      final initialTubes = LevelGenerator.generate(level);
      engine = PuzzleEngine(initialTubes);
      selectedTubeIndex = null;
      hintSource = null;
      hintDest = null;
    });
  }

  @override
  void dispose() {
    _liftController.dispose();
    super.dispose();
  }

  void _onTubeTap(int index) {
    if (selectedTubeIndex == null) {
      if (!engine.tubes[index].isEmpty && !engine.tubes[index].isSolved) {
        setState(() {
          selectedTubeIndex = index;
          hintSource = null;
          hintDest = null;
        });
        _liftController.forward(from: 0.0);
      }
    } else if (selectedTubeIndex == index) {
      setState(() {
        selectedTubeIndex = null;
      });
      _liftController.reverse();
    } else {
      final success = engine.executeMove(selectedTubeIndex!, index);
      if (success) {
        setState(() {
          selectedTubeIndex = null;
          hintSource = null;
          hintDest = null;
        });
        _liftController.reverse();

        if (engine.isWon) {
          _showVictoryDialog();
        }
      } else {
        // Switch selection or deselect
        if (!engine.tubes[index].isEmpty && !engine.tubes[index].isSolved) {
          setState(() {
            selectedTubeIndex = index;
          });
          _liftController.forward(from: 0.0);
        } else {
          setState(() {
            selectedTubeIndex = null;
          });
          _liftController.reverse();
        }
      }
    }
  }

  void _showVictoryDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF141B3B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: Color(0xFF00CFFF), width: 2)),
        title: const Text('🎉 LEVEL SOLVED!', textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF00CFFF), fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('⭐ ⭐ ⭐', style: TextStyle(fontSize: 32)),
            const SizedBox(height: 12),
            Text('Completed in ${engine.moveCount} moves!', style: const TextStyle(color: Colors.white70)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _loadLevel(currentLevel + 1);
            },
            child: const Text('NEXT LEVEL ➔', style: TextStyle(color: Color(0xFF00CFFF), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _getHint() {
    final hint = BfsSolver.solve(engine.tubes);
    if (hint != null) {
      setState(() {
        hintSource = hint.fromTube;
        hintDest = hint.toTube;
        selectedTubeIndex = hint.fromTube;
      });
      _liftController.forward(from: 0.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tubeCount = engine.tubes.length;
    final isMultiRow = tubeCount >= 8;
    final row1Count = isMultiRow ? (tubeCount / 2).ceil() : tubeCount;
    final row1 = isMultiRow ? engine.tubes.sublist(0, row1Count) : engine.tubes;
    final row2 = isMultiRow ? engine.tubes.sublist(row1Count) : <Tube>[];

    return Scaffold(
      backgroundColor: const Color(0xFF0C1024),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('LEVEL $currentLevel', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900)),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: () => _loadLevel(currentLevel),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Moves: ${engine.moveCount}', style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
                  TextButton.icon(
                    onPressed: _getHint,
                    icon: const Icon(Icons.lightbulb, color: Color(0xFFFBBF24)),
                    label: const Text('Hint', style: TextStyle(color: Color(0xFFFBBF24))),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _buildRow(row1, 0),
                    if (row2.isNotEmpty) ...[
                      const SizedBox(height: 24),
                      _buildRow(row2, row1Count),
                    ],
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF141B3B)),
                    onPressed: engine.undoHistory.isEmpty ? null : () => setState(() => engine.undo()),
                    icon: const Icon(Icons.undo),
                    label: Text('Undo (${engine.undoHistory.length})'),
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF141B3B)),
                    onPressed: engine.tubes.length >= 12 ? null : () => setState(() => engine.addExtraTube()),
                    icon: const Icon(Icons.add),
                    label: const Text('+Tube'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRow(List<Tube> tubesList, int startIndex) {
    const ballSize = 38.0;
    const tubeWidth = ballSize + 14.0;
    const tubeHeight = ballSize * 4 + 22.0;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(tubesList.length, (idx) {
        final actualIndex = startIndex + idx;
        final tube = tubesList[idx];
        final isSelected = selectedTubeIndex == actualIndex;
        final isHintS = hintSource == actualIndex;
        final isHintD = hintDest == actualIndex;

        return GestureDetector(
          onTap: () => _onTubeTap(actualIndex),
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 6),
            width: tubeWidth,
            height: tubeHeight + (ballSize * 0.8),
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                CustomPaint(
                  size: const Size(tubeWidth, tubeHeight),
                  painter: GlassTubePainter(
                    isSelected: isSelected || isHintS || isHintD,
                    isSolved: tube.isSolved,
                    accentColor: isHintD ? const Color(0xFF34D399) : const Color(0xFF00CFFF),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: List.generate(tube.length, (bIdx) {
                      final ball = tube.balls[bIdx];
                      final isTop = bIdx == tube.length - 1;

                      Widget ballWidget = CustomPaint(
                        size: const Size(ballSize, ballSize),
                        painter: GlossyBallPainter(ballColor: ball),
                      );

                      if (isTop && isSelected) {
                        return AnimatedBuilder(
                          animation: _liftController,
                          builder: (context, child) => Transform.translate(
                            offset: Offset(0, -ballSize * 0.9 * _liftController.value),
                            child: child,
                          ),
                          child: ballWidget,
                        );
                      }

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 1.5),
                        child: ballWidget,
                      );
                    }),
                  ),
                ),
              ],
            ),
          ),
        );
      }),
    );
  }
}
