import 'package:flutter/material.dart';
import 'features/gameplay/gameplay_screen.dart';

void main() {
  runApp(const ColorBloomSortApp());
}

class ColorBloomSortApp extends StatelessWidget {
  const ColorBloomSortApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Color Bloom Sort',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0C1024),
        fontFamily: 'Roboto',
      ),
      home: const GameplayScreen(),
    );
  }
}
