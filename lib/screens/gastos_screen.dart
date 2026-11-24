import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../notifications.dart';
import '../pico_placa.dart';
import '../scan.dart';
import '../theme.dart';
import '../widgets.dart';

// Consulta ciudadana oficial de SOAT y RTM por placa (pide captcha y documento del propietario).
final _runtUrl = Uri.parse('https://www.runt.gov.co/consultaCiudadana/#/consultaVehiculo');

/// Ícono y color de cada concepto de costo (los conceptos los redacta la IA, por eso se busca por palabra).
(IconData, Color) costStyle(String concepto) {
  final c = concepto.toLowerCase();
  if (c.contains('gasolina') || c.contains('combustible')) return (Icons.local_gas_station, AppColors.orange);
  if (c.contains('soat') || c.contains('seguro')) return (Icons.health_and_safety, AppColors.blue);
  if (c.contains('técnic') || c.contains('tecno') || c.contains('rtm')) return (Icons.fact_check, AppColors.lime);
  if (c.contains('impuesto')) return (Icons.account_balance, AppColors.primary);
  if (c.contains('llanta') || c.contains('arrastre')) return (Icons.tire_repair, const Color(0xFFA5C8FF));
  return (Icons.build, const Color(0xFFB0D500));
}

/// Costo anual estimado de la moto seleccionada, su ficha y los datos de propietario.
class GastosScreen extends StatelessWidget {
  const GastosScreen({
    super.key,
    required this.scans,
    required this.selected,
    required this.onSelect,
    required this.onChanged,
    required this.onScan,
  });

  final List<Scan> scans;
  final Scan? selected;
  final ValueChanged<Scan> onSelect;
  final Future<void> Function() onChanged;
  final VoidCallback onScan;

  Future<void> _pickMoto(BuildContext context) async {
    final scan = await showModalBottomSheet<Scan>(
      context: context,
      backgroundColor: AppColors.surface,
      showDragHandle: true,
      builder: (ctx) => ListView(shrinkWrap: true, children: [
        for (final s in scans)
          ListTile(
            leading: Icon(s.esMia ? Icons.star : Icons.two_wheeler, color: s.esMia ? AppColors.lime : AppColors.muted),
            title: Text(s.titulo),
            subtitle: Text([s.placa, if (s.createdAt != null) formatRelative(s.createdAt!.toLocal())].whereType<String>().join(' · ')),
            selected: s.id == selected?.id,
            onTap: () => Navigator.pop(ctx, s),
          ),
      ]),
    );
    if (scan != null) onSelect(scan);
  }

  Future<void> _delete(BuildContext context, Scan scan) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Eliminar escaneo?'),
        content: Text('Se borrará ${scan.titulo}${scan.esMia ? ' y sus avisos' : ''}.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('CANCELAR')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('ELIMINAR')),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await deleteScan(scan.id!);
      if (scan.esMia) await refreshNotifications();
      await onChanged();
    } catch (e) {
      if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final scan = selected;
    if (scan == null) {
      return ListView(padding: const EdgeInsets.all(20), children: [
        const EmptyState(Icons.receipt_long, 'Escanea una moto para ver cuánto cuesta tenerla al año.'),
        FilledButton.icon(onPressed: onScan, icon: const Icon(Icons.qr_code_scanner), label: const Text('ESCANEAR MOTO')),
      ]);
    }
    return RefreshIndicator(
      onRefresh: onChanged,
      child: ListView(
        key: ValueKey(scan.id), // reinicia el formulario al cambiar de moto
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        children: [
          _ResumenCard(scan: scan, onCambiar: scans.length > 1 ? () => _pickMoto(context) : null),
          const SizedBox(height: 16),
          _FichaCard(scan: scan),
          SectionHeader('Costos anuales', trailing: '${scan.costos.length} conceptos'),
          for (final c in scan.costos) ...[_CostoRow(cost: c), const SizedBox(height: 10)],
          if (scan.id != null) ...[
            SectionHeader('Mi moto', trailing: scan.esMia ? scan.placa : 'sin placa',
                trailingColor: scan.esMia ? AppColors.lime : AppColors.muted),
            _OwnerForm(scan: scan, onSaved: onChanged),
          ],
          const SizedBox(height: 20),
          if (scan.supuestos != null)
            Text('Supuestos: ${scan.supuestos}', style: const TextStyle(fontSize: 12, color: AppColors.muted)),
          const SizedBox(height: 6),
          const Text(
            'Valores estimados por IA. Verifica tarifas oficiales de SOAT, RTM e impuestos antes de tomar decisiones.',
            style: TextStyle(fontSize: 12, color: AppColors.muted),
          ),
          if (scan.id != null) ...[
            const SizedBox(height: 16),
            TextButton.icon(
              onPressed: () => _delete(context, scan),
              style: TextButton.styleFrom(foregroundColor: AppColors.error),
              icon: const Icon(Icons.delete_outline),
              label: const Text('ELIMINAR ESCANEO'),
            ),
          ],
        ],
      ),
    );
  }
}

class _ResumenCard extends StatelessWidget {
  const _ResumenCard({required this.scan, required this.onCambiar});

  final Scan scan;
  final VoidCallback? onCambiar;

  @override
  Widget build(BuildContext context) {
    final total = scan.totalAnualCop;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            const Icon(Icons.calendar_month, size: 20, color: AppColors.onSurfaceVariant),
            const SizedBox(width: 8),
            Expanded(child: MonoLabel('Estimación ${DateTime.now().year}', color: AppColors.onSurface, size: 13)),
            StatusPill('≈ ${formatCop((total / 12).round())}/mes'),
          ]),
          const SizedBox(height: 14),
          // Moto seleccionada (en el diseño: fila "galón extra" con acción de editar).
          Container(
            padding: const EdgeInsets.fromLTRB(12, 4, 4, 4),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.hairline),
            ),
            child: Row(children: [
              const Icon(Icons.two_wheeler, size: 18, color: AppColors.orange),
              const SizedBox(width: 8),
              Expanded(
                child: MonoLabel([scan.titulo, scan.placa].whereType<String>().join(' · '),
                    color: AppColors.primary, size: 11),
              ),
              if (onCambiar != null)
                TextButton.icon(onPressed: onCambiar, icon: const Icon(Icons.swap_horiz, size: 16), label: const Text('CAMBIAR'))
              else
                const SizedBox(height: 40),
            ]),
          ),
          const SizedBox(height: 16),
          const Text('Gasto total anual', style: TextStyle(color: AppColors.onSurfaceVariant)),
          Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Expanded(
              child: FittedBox(
                alignment: Alignment.centerLeft,
                fit: BoxFit.scaleDown,
                child: Text(formatCop(total), style: grotesk(size: 40)),
              ),
            ),
            const Padding(padding: EdgeInsets.only(bottom: 8), child: MonoLabel('COP', color: AppColors.onSurface)),
          ]),
          const SizedBox(height: 14),
          _CostBar(costos: scan.costos),
          const SizedBox(height: 12),
          Wrap(spacing: 16, runSpacing: 10, children: [
            for (final c in scan.costos.where((c) => c.valorCop > 0))
              Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                Row(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.circle, size: 8, color: costStyle(c.concepto).$2),
                  const SizedBox(width: 6),
                  MonoLabel(c.concepto.length > 14 ? '${c.concepto.substring(0, 13)}.' : c.concepto, size: 10),
                ]),
                const SizedBox(height: 2),
                Text(formatCop(c.valorCop), style: mono(size: 13, color: AppColors.onSurface)),
              ]),
          ]),
        ]),
      ),
    );
  }
}

/// Barra apilada con la proporción de cada concepto en el total.
class _CostBar extends StatelessWidget {
  const _CostBar({required this.costos});

  final List<Cost> costos;

  @override
  Widget build(BuildContext context) {
    final items = costos.where((c) => c.valorCop > 0).toList();
    if (items.isEmpty) return const SizedBox.shrink();
    return Semantics(
      label: 'Distribución del costo anual por concepto',
      child: Container(
        height: 12,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.background, width: 2),
        ),
        clipBehavior: Clip.antiAlias,
        child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          for (final (i, c) in items.indexed) ...[
            if (i > 0) const SizedBox(width: 2),
            Expanded(flex: c.valorCop, child: ColoredBox(color: costStyle(c.concepto).$2)),
          ],
        ]),
      ),
    );
  }
}

class _FichaCard extends StatelessWidget {
  const _FichaCard({required this.scan});

  final Scan scan;

  @override
  Widget build(BuildContext context) {
    final datos = [
      if (scan.cilindrajeCc != null) (nombre: 'Cilindraje', valor: '${scan.cilindrajeCc} cc'),
      if (scan.anio != null) (nombre: 'Año', valor: scan.anio!),
      ...scan.ficha,
    ];
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          initiallyExpanded: true,
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
          iconColor: AppColors.lime,
          collapsedIconColor: AppColors.lime,
          leading: const Icon(Icons.tune, color: AppColors.lime),
          title: Text('Características de la moto', style: grotesk(size: 17, weight: FontWeight.w600)),
          subtitle: MonoLabel(scan.modelo, color: AppColors.lime, size: 11),
          children: [
            LayoutBuilder(
              builder: (context, box) => Wrap(spacing: 8, runSpacing: 8, children: [
                for (final d in datos)
                  Container(
                    width: (box.maxWidth - 8) / 2,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.hairline),
                    ),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      MonoLabel(d.nombre, size: 10),
                      const SizedBox(height: 4),
                      Text(d.valor, style: mono(size: 13, color: AppColors.onSurface)),
                    ]),
                  ),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

class _CostoRow extends StatelessWidget {
  const _CostoRow({required this.cost});

  final Cost cost;

  @override
  Widget build(BuildContext context) {
    final (icon, color) = costStyle(cost.concepto);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(children: [
          IconTile(icon, color),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(cost.concepto, maxLines: 1, overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
              if (cost.detalle.isNotEmpty)
                Text(cost.detalle, maxLines: 2, overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
            ]),
          ),
          const SizedBox(width: 8),
          Text(cost.valorCop == 0 ? 'N/A' : formatCop(cost.valorCop),
              style: mono(size: 14, weight: FontWeight.w600, color: AppColors.onSurface)),
        ]),
      ),
    );
  }
}

/// "Mi moto": placa, ciudad y vencimientos de SOAT/RTM, que alimentan los avisos.
class _OwnerForm extends StatefulWidget {
  const _OwnerForm({required this.scan, required this.onSaved});

  final Scan scan;
  final Future<void> Function() onSaved;

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
      await widget.onSaved();
    } catch (e) {
      if (mounted) _show('No se pudo guardar: $e');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Widget _dateTile(String label, IconData icon, DateTime? value, ValueChanged<DateTime> onChanged) {
    final now = DateTime.now();
    return InkWell(
      borderRadius: BorderRadius.circular(12),
      onTap: () async {
        final d = await showDatePicker(
          context: context,
          initialDate: value ?? now,
          firstDate: DateTime(now.year - 2),
          lastDate: DateTime(now.year + 3),
        );
        if (d != null) setState(() => onChanged(d));
      },
      child: InputDecorator(
        decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon)),
        child: Text(value == null ? 'Sin fecha' : 'Vence el ${formatDateShort(value)}', style: mono(size: 14, color: AppColors.onSurface)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          const Text('Agrega la placa para recibir avisos de pico y placa, SOAT y técnico-mecánica.',
              style: TextStyle(color: AppColors.onSurfaceVariant, fontSize: 13)),
          const SizedBox(height: 16),
          TextField(
            controller: _placa,
            textCapitalization: TextCapitalization.characters,
            style: mono(size: 16, color: AppColors.onSurface),
            decoration: const InputDecoration(labelText: 'PLACA', hintText: 'ABC12D', prefixIcon: Icon(Icons.pin)),
          ),
          const SizedBox(height: 12),
          FutureBuilder<List<PicoPlaca>>(
            future: _ciudades,
            builder: (context, snap) {
              final ciudades = [for (final r in snap.data ?? const <PicoPlaca>[]) r.ciudad];
              return DropdownButtonFormField<String>(
                initialValue: ciudades.contains(_ciudad) ? _ciudad : null,
                isExpanded: true,
                dropdownColor: AppColors.surfaceHigh,
                decoration: const InputDecoration(labelText: 'CIUDAD DONDE CIRCULA', prefixIcon: Icon(Icons.location_on_outlined)),
                items: [for (final c in ciudades) DropdownMenuItem(value: c, child: Text(c))],
                onChanged: (c) => setState(() => _ciudad = c),
              );
            },
          ),
          const SizedBox(height: 12),
          _dateTile('SOAT', Icons.health_and_safety_outlined, _soat, (d) => _soat = d),
          const SizedBox(height: 12),
          _dateTile('TÉCNICO-MECÁNICA', Icons.fact_check_outlined, _rtm, (d) => _rtm = d),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: () => launchUrl(_runtUrl, mode: LaunchMode.externalApplication),
            icon: const Icon(Icons.open_in_new, size: 18),
            label: const Text('CONSULTAR EN EL RUNT'),
          ),
          const SizedBox(height: 10),
          FilledButton(onPressed: _saving ? null : _save, child: Text(_saving ? 'GUARDANDO…' : 'GUARDAR')),
        ]),
      ),
    );
  }
}
