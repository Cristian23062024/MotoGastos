import 'package:flutter_test/flutter_test.dart';
import 'package:motogastos/scan.dart';

void main() {
  test('Scan.fromJson parsea la respuesta de la IA y suma el total', () {
    final scan = Scan.fromJson({
      'es_moto': true,
      'marca': 'Yamaha',
      'modelo': 'FZ 150',
      'cilindraje_cc': 149,
      'ficha': [
        {'nombre': 'Potencia', 'valor': '12.2 hp'},
      ],
      'costos': [
        {'concepto': 'SOAT', 'valor_cop': 450000, 'detalle': ''},
        {'concepto': 'Gasolina', 'valor_cop': 1200000.4, 'detalle': '10.000 km'},
      ],
      'supuestos': '10.000 km/año',
    });
    expect(scan.titulo, 'Yamaha FZ 150');
    expect(scan.ficha.single.valor, '12.2 hp');
    expect(scan.totalAnualCop, 1650000);
    expect(scan.toRow()['total_anual_cop'], 1650000);
    expect(Scan.fromJson(scan.toRow()).totalAnualCop, 1650000);
  });

  test('formatCop agrupa miles con punto', () {
    expect(formatCop(0), '\$ 0');
    expect(formatCop(999), '\$ 999');
    expect(formatCop(1000), '\$ 1.000');
    expect(formatCop(1234567), '\$ 1.234.567');
    expect(formatCop(-50000), '-\$ 50.000');
  });

  test('formatRelative: hoy, ayer, mismo año y otro año', () {
    final now = DateTime(2026, 11, 23, 20);
    expect(formatRelative(DateTime(2026, 11, 23, 14, 32), now: now), 'Hoy, 14:32');
    expect(formatRelative(DateTime(2026, 11, 22, 18, 5), now: now), 'Ayer, 18:05');
    expect(formatRelative(DateTime(2026, 10, 12, 10, 5), now: now), '12 Oct, 10:05');
    expect(formatRelative(DateTime(2025, 1, 2, 9, 0), now: now), '2 Ene 2025, 09:00');
  });

  test('diasHasta cuenta días calendario y es negativo si venció', () {
    final now = DateTime(2026, 11, 23, 23, 59);
    expect(diasHasta(DateTime(2026, 11, 24), now: now), 1);
    expect(diasHasta(DateTime(2026, 11, 23), now: now), 0);
    expect(diasHasta(DateTime(2026, 11, 20), now: now), -3);
  });
}
