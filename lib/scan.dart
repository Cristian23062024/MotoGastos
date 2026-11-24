import 'dart:convert';

import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

SupabaseClient get supabase => Supabase.instance.client;

typedef Spec = ({String nombre, String valor});
typedef Cost = ({String concepto, int valorCop, String detalle});

/// Resultado del análisis de Gemini; el mismo formato se guarda en la tabla `scans`.
class Scan {
  Scan({
    this.id,
    this.createdAt,
    required this.marca,
    required this.modelo,
    this.anio,
    this.cilindrajeCc,
    required this.ficha,
    required this.costos,
    this.supuestos,
    this.placa,
    this.ciudad,
    this.soatVence,
    this.rtmVence,
  });

  final String? id;
  final DateTime? createdAt;
  final String marca;
  final String modelo;
  final String? anio;
  final int? cilindrajeCc;
  final List<Spec> ficha;
  final List<Cost> costos;
  final String? supuestos;
  // Datos de propietario: un escaneo con placa es "mi moto".
  final String? placa;
  final String? ciudad;
  final DateTime? soatVence;
  final DateTime? rtmVence;

  bool get esMia => placa != null;
  int get totalAnualCop => costos.fold(0, (sum, c) => sum + c.valorCop);
  String get titulo => '$marca $modelo';

  factory Scan.fromJson(Map<String, dynamic> j) => Scan(
        id: j['id'] as String?,
        createdAt: j['created_at'] == null ? null : DateTime.parse(j['created_at'] as String),
        marca: j['marca'] as String? ?? 'Desconocida',
        modelo: j['modelo'] as String? ?? '',
        anio: j['anio'] as String?,
        cilindrajeCc: (j['cilindraje_cc'] as num?)?.toInt(),
        ficha: [
          for (final f in (j['ficha'] as List? ?? const []))
            (nombre: '${f['nombre']}', valor: '${f['valor']}'),
        ],
        costos: [
          for (final c in (j['costos'] as List? ?? const []))
            (
              concepto: '${c['concepto']}',
              valorCop: (c['valor_cop'] as num? ?? 0).round(),
              detalle: '${c['detalle'] ?? ''}',
            ),
        ],
        supuestos: j['supuestos'] as String?,
        placa: j['placa'] as String?,
        ciudad: j['ciudad'] as String?,
        soatVence: j['soat_vence'] == null ? null : DateTime.parse(j['soat_vence'] as String),
        rtmVence: j['rtm_vence'] == null ? null : DateTime.parse(j['rtm_vence'] as String),
      );

  Map<String, dynamic> toRow() => {
        'marca': marca,
        'modelo': modelo,
        'anio': anio,
        'cilindraje_cc': cilindrajeCc,
        'ficha': [for (final f in ficha) {'nombre': f.nombre, 'valor': f.valor}],
        'costos': [
          for (final c in costos) {'concepto': c.concepto, 'valor_cop': c.valorCop, 'detalle': c.detalle},
        ],
        'supuestos': supuestos,
        'total_anual_cop': totalAnualCop,
      };
}

/// Formato de pesos colombianos: 1234567 -> "$ 1.234.567".
String formatCop(int value) {
  final digits = value.abs().toString();
  final buf = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) buf.write('.');
    buf.write(digits[i]);
  }
  return '${value < 0 ? '-' : ''}\$ $buf';
}

String formatDate(DateTime d) =>
    '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

String? _isoDate(DateTime? d) => d?.toIso8601String().substring(0, 10);

String _mimeType(XFile file) {
  if (file.mimeType != null) return file.mimeType!;
  final name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.heic')) return 'image/heic';
  return 'image/jpeg';
}

/// Envía la foto a la Edge Function `analyze-moto` (que llama a Gemini) y guarda el resultado.
Future<Scan> analyzeAndSave(XFile file) async {
  final FunctionResponse res;
  try {
    res = await supabase.functions.invoke('analyze-moto', body: {
      'image': base64Encode(await file.readAsBytes()),
      'mimeType': _mimeType(file),
    });
  } on FunctionException catch (e) {
    final details = e.details;
    throw Exception(details is Map && details['error'] != null ? details['error'] : 'Error ${e.status} al analizar la imagen');
  }
  final data = res.data as Map<String, dynamic>;
  if (data['es_moto'] != true) {
    throw const NotAMotorcycleException();
  }
  final row = await supabase.from('scans').insert(Scan.fromJson(data).toRow()).select().single();
  return Scan.fromJson(row);
}

Future<List<Scan>> fetchScans() async {
  final rows = await supabase.from('scans').select().order('created_at', ascending: false);
  return rows.map(Scan.fromJson).toList();
}

/// Marca (o desmarca, con placa null) un escaneo como moto propia.
Future<void> updateOwner(String id,
        {String? placa, String? ciudad, DateTime? soatVence, DateTime? rtmVence}) =>
    supabase.from('scans').update({
      'placa': placa,
      'ciudad': ciudad,
      'soat_vence': _isoDate(soatVence),
      'rtm_vence': _isoDate(rtmVence),
    }).eq('id', id);

Future<void> deleteScan(String id) => supabase.from('scans').delete().eq('id', id);

class NotAMotorcycleException implements Exception {
  const NotAMotorcycleException();
  @override
  String toString() => 'No se detectó una motocicleta en la imagen. Intenta con otra foto.';
}
