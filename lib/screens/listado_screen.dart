import 'package:material_ui/material_ui.dart';

import '../scan.dart';
import '../theme.dart';
import '../widgets.dart';

/// Historial de escaneos con búsqueda por modelo o placa.
class ListadoScreen extends StatefulWidget {
  const ListadoScreen({super.key, required this.scans, required this.onOpen, required this.onRefresh});

  final List<Scan> scans;
  final ValueChanged<Scan> onOpen;
  final Future<void> Function() onRefresh;

  @override
  State<ListadoScreen> createState() => _ListadoScreenState();
}

class _ListadoScreenState extends State<ListadoScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final q = _query.trim().toLowerCase();
    final scans = q.isEmpty
        ? widget.scans
        : widget.scans.where((s) => '${s.titulo} ${s.placa ?? ''}'.toLowerCase().contains(q)).toList();
    return RefreshIndicator(
      onRefresh: widget.onRefresh,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
        children: [
          TextField(
            onChanged: (v) => setState(() => _query = v),
            decoration: const InputDecoration(
              hintText: 'Buscar por modelo o placa...',
              prefixIcon: Icon(Icons.search),
            ),
          ),
          const SizedBox(height: 16),
          if (widget.scans.isEmpty)
            const EmptyState(Icons.qr_code_scanner, 'Aún no has escaneado motos.\nVe a Escanear y toma una foto.')
          else if (scans.isEmpty)
            const EmptyState(Icons.search_off, 'Sin resultados.')
          else
            for (final s in scans) ...[_MotoCard(scan: s, onTap: () => widget.onOpen(s)), const SizedBox(height: 12)],
        ],
      ),
    );
  }
}

class _MotoCard extends StatelessWidget {
  const _MotoCard({required this.scan, required this.onTap});

  final Scan scan;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        // La moto propia se resalta con borde naranja, como el "vehículo conectado" del diseño.
        side: BorderSide(color: scan.esMia ? AppColors.orange.withValues(alpha: 0.6) : AppColors.hairline),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(scan.titulo, style: grotesk(size: 18, weight: FontWeight.w600)),
                const SizedBox(height: 10),
                Wrap(spacing: 12, runSpacing: 6, crossAxisAlignment: WrapCrossAlignment.center, children: [
                  if (scan.createdAt != null)
                    Row(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.schedule, size: 14, color: AppColors.onSurfaceVariant),
                      const SizedBox(width: 4),
                      Text(formatRelative(scan.createdAt!.toLocal()),
                          style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
                    ]),
                  if (scan.placa != null) MonoLabel(scan.placa!, color: AppColors.lime, size: 11),
                ]),
              ]),
            ),
            Column(children: [
              Icon(scan.esMia ? Icons.star : Icons.star_border,
                  color: scan.esMia ? AppColors.lime : AppColors.onSurfaceVariant,
                  semanticLabel: scan.esMia ? 'Mi moto' : null),
              const SizedBox(height: 12),
              const Icon(Icons.chevron_right, color: AppColors.onSurfaceVariant),
            ]),
          ]),
        ),
      ),
    );
  }
}
