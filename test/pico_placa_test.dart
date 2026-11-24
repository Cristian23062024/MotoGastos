import 'package:flutter_test/flutter_test.dart';
import 'package:motogastos/notifications.dart';
import 'package:motogastos/pico_placa.dart';
import 'package:timezone/data/latest.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

void main() {
  // Calendario real de Pasto (pyphoy, nov-2026): la rotación avanza cada semana.
  final pasto = PicoPlaca.fromJson({
    'ciudad': 'Pasto',
    'aplica_motos': true,
    'digito': 'ultimo',
    'calendario': {'2026-11-23': [6, 7], '2026-11-24': [8, 9], '2026-11-30': [8, 9]},
  });

  test('digitoPlaca toma el primer o último número', () {
    expect(digitoPlaca('ABC12D', primero: true), 1);
    expect(digitoPlaca('ABC12D', primero: false), 2);
    expect(digitoPlaca('ABCDEF', primero: true), isNull);
  });

  test('restringe según la fecha del calendario', () {
    expect(pasto.restringe('XYZ17A', DateTime(2026, 11, 23)), isTrue);
    expect(pasto.restringe('XYZ17A', DateTime(2026, 11, 30)), isFalse); // mismo lunes, otra semana
    expect(pasto.restringe('XYZ19A', DateTime(2026, 11, 30)), isTrue);
    expect(pasto.restringe('XYZ19A', DateTime(2026, 11, 28)), isFalse); // sábado sin restricción
  });

  test('sinDatos después del último día sincronizado', () {
    expect(pasto.sinDatos(DateTime(2026, 11, 30)), isFalse);
    expect(pasto.sinDatos(DateTime(2026, 12, 1)), isTrue);
    final bogota = PicoPlaca.fromJson({'ciudad': 'Bogotá', 'aplica_motos': false, 'digito': 'ultimo', 'calendario': {}});
    expect(bogota.sinDatos(DateTime(2026, 12, 1)), isFalse); // no aplica: no faltan datos
    expect(bogota.digitosEn(DateTime(2026, 12, 1)), isEmpty);
  });

  test('reminderFor avisa 7 días antes a las 9:00, o null si ya pasó', () {
    tzdata.initializeTimeZones();
    final loc = tz.getLocation('America/Bogota');
    final now = tz.TZDateTime(loc, 2026, 11, 23, 12);
    expect(reminderFor(DateTime(2026, 12, 3), now), tz.TZDateTime(loc, 2026, 11, 26, 9));
    expect(reminderFor(DateTime(2026, 11, 28), now), isNull);
  });
}
