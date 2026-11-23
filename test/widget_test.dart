import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:motogastos/main.dart';

void main() {
  testWidgets('MotoGastosApp arranca sin errores', (tester) async {
    // flutter_test responde 400 a toda petición HTTP: ignora solo los fallos de NetworkImage.
    final original = FlutterError.onError;
    FlutterError.onError = (d) {
      if (d.library != 'image resource service') original?.call(d);
    };
    await tester.pumpWidget(const MotoGastosApp());
    await tester.pump();
    FlutterError.onError = original;
    expect(find.byType(MotoGastosApp), findsOneWidget);
  });
}
