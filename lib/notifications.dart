import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

import 'pico_placa.dart';
import 'scan.dart';

final _plugin = FlutterLocalNotificationsPlugin();

const _details = NotificationDetails(
  android: AndroidNotificationDetails('recordatorios', 'Recordatorios',
      channelDescription: 'Pico y placa, SOAT y revisión técnico-mecánica', importance: Importance.high),
  iOS: DarwinNotificationDetails(),
);

Future<void> initNotifications() async {
  tzdata.initializeTimeZones();
  // shortcut: la app asume hora de Colombia (sin horario de verano); usar flutter_timezone si se usa fuera del país.
  tz.setLocalLocation(tz.getLocation('America/Bogota'));
  await _plugin.initialize(
    settings: const InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      iOS: DarwinInitializationSettings(
          requestAlertPermission: false, requestBadgePermission: false, requestSoundPermission: false),
    ),
  );
}

/// Aviso a las 9:00 a. m. una semana antes de [vence], o null si ya pasó.
tz.TZDateTime? reminderFor(DateTime vence, tz.TZDateTime now) {
  final t = tz.TZDateTime(now.location, vence.year, vence.month, vence.day - 7, 9);
  return t.isAfter(now) ? t : null;
}

/// Reprograma todos los avisos según las motos propias del usuario y las reglas vigentes.
Future<void> rescheduleNotifications(List<Scan> scans, List<PicoPlaca> reglas) async {
  await _plugin.cancelAll();
  final mias = scans.where((s) => s.esMia).toList();
  if (mias.isEmpty) return;

  await _plugin
      .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
      ?.requestNotificationsPermission();
  await _plugin
      .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
      ?.requestPermissions(alert: true, badge: true, sound: true);

  final now = tz.TZDateTime.now(tz.local);
  final avisos = <(tz.TZDateTime, String, String)>[];
  for (final s in mias) {
    for (final (doc, vence) in [('SOAT', s.soatVence), ('Revisión técnico-mecánica', s.rtmVence)]) {
      final when = vence == null ? null : reminderFor(vence, now);
      if (when != null) avisos.add((when, '$doc por vencer', 'El $doc de ${s.placa} vence el ${formatDate(vence!)}.'));
    }
    final regla = reglas.where((r) => r.ciudad == s.ciudad).firstOrNull;
    if (regla == null) continue;
    for (final fecha in regla.calendario.keys) {
      final d = DateTime.parse(fecha);
      final when = tz.TZDateTime(now.location, d.year, d.month, d.day, 6);
      if (when.isAfter(now) && regla.restringe(s.placa!, d)) {
        avisos.add((when, 'Hoy tienes pico y placa',
            '${s.placa} no puede circular en ${regla.ciudad}. ${regla.horario ?? ''}'.trim()));
      }
    }
  }

  // iOS guarda como máximo 64 avisos pendientes: se programan los más próximos y el resto
  // entra en la siguiente reprogramación (cada vez que se abre la app).
  avisos.sort((a, b) => a.$1.compareTo(b.$1));
  var id = 0;
  for (final (fecha, title, body) in avisos.take(60)) {
    await _plugin.zonedSchedule(
      id: id++,
      scheduledDate: fecha,
      title: title,
      body: body,
      notificationDetails: _details,
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
    );
  }
}

Future<void> refreshNotifications() async =>
    rescheduleNotifications(await fetchScans(), await fetchPicoPlaca());

Future<void> cancelNotifications() => _plugin.cancelAll();
