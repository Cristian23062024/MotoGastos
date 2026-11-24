import 'scan.dart';

/// Pico y placa para motos de una ciudad (tabla `pico_placa`, sincronizada a diario desde pyphoy.com).
class PicoPlaca {
  PicoPlaca({
    required this.ciudad,
    required this.aplicaMotos,
    required this.primerDigito,
    required this.calendario,
    this.horario,
    this.nota,
    this.actualizado,
  });

  final String ciudad;
  final bool aplicaMotos;
  final bool primerDigito; // true: primer dígito de la placa; false: último
  final Map<String, List<int>> calendario; // fecha ISO -> dígitos restringidos (festivos ya excluidos)
  final String? horario;
  final String? nota;
  final DateTime? actualizado;

  factory PicoPlaca.fromJson(Map<String, dynamic> j) => PicoPlaca(
        ciudad: j['ciudad'] as String,
        aplicaMotos: j['aplica_motos'] as bool,
        primerDigito: j['digito'] == 'primero',
        calendario: {
          for (final e in (j['calendario'] as Map? ?? const {}).entries)
            '${e.key}': [for (final d in e.value as List) (d as num).toInt()],
        },
        horario: j['horario'] as String?,
        nota: j['nota'] as String?,
        actualizado: j['updated_at'] == null ? null : DateTime.parse(j['updated_at'] as String),
      );

  String get digitoLabel => primerDigito ? 'primer dígito' : 'último dígito';

  /// Último día cubierto por el calendario, o null si no hay datos.
  DateTime? get hasta => calendario.isEmpty ? null : DateTime.parse(calendario.keys.reduce((a, b) => a.compareTo(b) > 0 ? a : b));

  /// Si [dia] queda fuera del calendario sincronizado, no se sabe si hay restricción.
  bool sinDatos(DateTime dia) => aplicaMotos && (hasta == null || dia.isAfter(hasta!));

  List<int> digitosEn(DateTime dia) => aplicaMotos ? calendario[isoDate(dia)] ?? const [] : const [];

  bool restringe(String placa, DateTime dia) {
    final d = digitoPlaca(placa, primero: primerDigito);
    return d != null && digitosEn(dia).contains(d);
  }
}

/// Primer o último número de una placa ("ABC12D" -> 1 o 2).
int? digitoPlaca(String placa, {required bool primero}) {
  final digits = placa.replaceAll(RegExp(r'\D'), '');
  if (digits.isEmpty) return null;
  return int.parse(primero ? digits[0] : digits[digits.length - 1]);
}

String isoDate(DateTime d) =>
    '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

const diasSemana = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

Future<List<PicoPlaca>> fetchPicoPlaca() async {
  final rows = await supabase.from('pico_placa').select().order('ciudad');
  return rows.map(PicoPlaca.fromJson).toList();
}
