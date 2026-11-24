import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../notifications.dart';
import '../pico_placa.dart';
import '../scan.dart';

// Consulta ciudadana oficial de SOAT y RTM por placa (pide captcha y documento del propietario).
final _runtUrl = Uri.parse('https://www.runt.gov.co/consultaCiudadana/#/consultaVehiculo');

class ScanDetailScreen extends StatelessWidget {
  const ScanDetailScreen({super.key, required this.scan});

  final Scan scan;

  Future<void> _delete(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Eliminar escaneo?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Eliminar')),
        ],
      ),
    );
    if (ok != true || !context.mounted) return;
    try {
      await deleteScan(scan.id!);
      if (scan.esMia) await refreshNotifications();
      if (context.mounted) Navigator.pop(context, true);
    } catch (e) {
      if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final total = scan.totalAnualCop;
    return Scaffold(
      appBar: AppBar(
        title: Text(scan.titulo),
        actions: [
          if (scan.id != null)
            IconButton(tooltip: 'Eliminar', icon: const Icon(Icons.delete_outline), onPressed: () => _delete(context)),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            color: theme.colorScheme.primaryContainer,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text('Costo anual estimado', style: theme.textTheme.titleMedium),
                  Text(formatCop(total), style: theme.textTheme.headlineLarge),
                  Text('≈ ${formatCop((total / 12).round())} al mes'),
                ],
              ),
            ),
          ),
          if (scan.id != null) ...[
            const SizedBox(height: 16),
            _OwnerForm(scan: scan),
          ],
          const SizedBox(height: 16),
          Text('Costos anuales', style: theme.textTheme.titleLarge),
          for (final c in scan.costos)
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(c.concepto),
              subtitle: c.detalle.isEmpty ? null : Text(c.detalle),
              trailing: Text(formatCop(c.valorCop), style: theme.textTheme.titleSmall),
            ),
          const SizedBox(height: 16),
          Text('Ficha técnica', style: theme.textTheme.titleLarge),
          if (scan.anio != null) _spec('Año', scan.anio!),
          for (final f in scan.ficha) _spec(f.nombre, f.valor),
          if (scan.supuestos != null) ...[
            const SizedBox(height: 16),
            Text('Supuestos: ${scan.supuestos}', style: theme.textTheme.bodySmall),
          ],
          const SizedBox(height: 8),
          Text(
            'Valores estimados por IA. Verifica tarifas oficiales de SOAT, RTM e impuestos antes de tomar decisiones.',
            style: theme.textTheme.bodySmall,
          ),
        ],
      ),
    );
  }

  Widget _spec(String name, String value) => ListTile(
        dense: true,
        contentPadding: EdgeInsets.zero,
        title: Text(name),
        trailing: Text(value),
      );
}

/// "Mi moto": placa, ciudad y vencimientos de SOAT/RTM, que alimentan los avisos.
class _OwnerForm extends StatefulWidget {
  const _OwnerForm({required this.scan});

  final Scan scan;

  @override
  State<_OwnerForm> createState() => _OwnerFormState();
}

class _OwnerFormState extends State<_OwnerForm> {
  late final _placa = TextEditingController(text: widget.scan.placa);
  late String? _ciudad = widget.scan.ciudad;
  late DateTime? _soat = widget.scan.soatVence;
  late DateTime? _rtm = widget.scan.rtmVence;
  final _ciudades = fetchPicoPlaca();
  bool _saving = false;

  @override
  void dispose() {
    _placa.dispose();
    super.dispose();
  }

  Future<DateTime?> _pick(DateTime? current) {
    final now = DateTime.now();
    return showDatePicker(
      context: context,
      initialDate: current ?? now,
      firstDate: DateTime(now.year - 2),
      lastDate: DateTime(now.year + 3),
    );
  }

  void _show(String msg) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));

  Future<void> _save() async {
    final placa = _placa.text.trim().toUpperCase().replaceAll(RegExp(r'[\s-]'), '');
    if (placa.isNotEmpty && !RegExp(r'^[A-Z0-9]{5,7}$').hasMatch(placa)) {
      return _show('Placa inválida. Ejemplo: ABC12D');
    }
    setState(() => _saving = true);
    try {
      await updateOwner(widget.scan.id!,
          placa: placa.isEmpty ? null : placa, ciudad: _ciudad, soatVence: _soat, rtmVence: _rtm);
      await refreshNotifications();
      _show(placa.isEmpty ? 'Ya no es una moto propia' : 'Guardado. Te avisaremos a tiempo.');
    } catch (e) {
      _show('No se pudo guardar: $e');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Widget _dateTile(String label, DateTime? value, ValueChanged<DateTime?> onChanged) => ListTile(
        contentPadding: EdgeInsets.zero,
        title: Text(label),
        subtitle: Text(value == null ? 'Sin fecha' : 'Vence el ${formatDate(value)}'),
        trailing: const Icon(Icons.calendar_month),
        onTap: () async {
          final d = await _pick(value);
          if (d != null) setState(() => onChanged(d));
        },
      );

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Mi moto', style: theme.textTheme.titleLarge),
            const Text('Agrega la placa para recibir avisos de pico y placa, SOAT y técnico-mecánica.'),
            const SizedBox(height: 12),
            TextField(
              controller: _placa,
              textCapitalization: TextCapitalization.characters,
              decoration: const InputDecoration(labelText: 'Placa', hintText: 'ABC12D', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            FutureBuilder<List<PicoPlaca>>(
              future: _ciudades,
              builder: (context, snap) => DropdownButtonFormField<String>(
                initialValue: _ciudad,
                decoration: const InputDecoration(labelText: 'Ciudad donde circula', border: OutlineInputBorder()),
                items: [
                  for (final r in snap.data ?? const <PicoPlaca>[])
                    DropdownMenuItem(value: r.ciudad, child: Text(r.ciudad)),
                ],
                onChanged: (c) => setState(() => _ciudad = c),
              ),
            ),
            _dateTile('SOAT', _soat, (d) => _soat = d),
            _dateTile('Revisión técnico-mecánica', _rtm, (d) => _rtm = d),
            OutlinedButton.icon(
              onPressed: () => launchUrl(_runtUrl, mode: LaunchMode.externalApplication),
              icon: const Icon(Icons.open_in_new),
              label: const Text('Consultar SOAT y RTM en el RUNT'),
            ),
            const SizedBox(height: 8),
            FilledButton(onPressed: _saving ? null : _save, child: const Text('Guardar')),
          ],
        ),
      ),
    );
  }
}
