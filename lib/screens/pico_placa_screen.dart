import 'package:material_ui/material_ui.dart';

import '../pico_placa.dart';
import '../scan.dart';
import '../theme.dart';
import '../widgets.dart';

/// Restricción de hoy por ciudad, estado de tus motos y vencimientos de SOAT/RTM.
class PicoPlacaScreen extends StatefulWidget {
  const PicoPlacaScreen({super.key, required this.scans, required this.onConfigure, this.loadReglas = fetchPicoPlaca});

  final List<Scan> scans;
  final ValueChanged<Scan> onConfigure; // abre la moto en Gastos para editar sus datos
  final Future<List<PicoPlaca>> Function() loadReglas;

  @override
  State<PicoPlacaScreen> createState() => _PicoPlacaScreenState();
}

class _PicoPlacaScreenState extends State<PicoPlacaScreen> {
  late Future<List<PicoPlaca>> _reglas = widget.loadReglas();
  String? _ciudad;

  Future<void> _refresh() async {
    setState(() => _reglas = widget.loadReglas());
    await _reglas;
  }

  @override
  Widget build(BuildContext context) {
    final mias = widget.scans.where((s) => s.esMia).toList();
    return RefreshIndicator(
      onRefresh: _refresh,
      child: FutureBuilder<List<PicoPlaca>>(
        future: _reglas,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) return const Center(child: CircularProgressIndicator());
          if (snap.hasError) return EmptyState(Icons.cloud_off, 'No se pudieron cargar las reglas.\n${snap.error}');
          final reglas = snap.data!;
          if (reglas.isEmpty) return const EmptyState(Icons.location_off, 'Sin ciudades cargadas.');
          final ciudad = _ciudad ?? mias.map((m) => m.ciudad).whereType<String>().firstOrNull ?? reglas.first.ciudad;
          final regla = reglas.firstWhere((r) => r.ciudad == ciudad, orElse: () => reglas.first);
          final now = DateTime.now();
          final hoy = DateTime(now.year, now.month, now.day);
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
            children: [
              DropdownButtonFormField<String>(
                initialValue: regla.ciudad,
                isExpanded: true,
                dropdownColor: AppColors.surfaceHigh,
                decoration: const InputDecoration(labelText: 'CIUDAD', prefixIcon: Icon(Icons.location_on_outlined)),
                items: [for (final r in reglas) DropdownMenuItem(value: r.ciudad, child: Text(r.ciudad))],
                onChanged: (c) => setState(() => _ciudad = c),
              ),
              const SizedBox(height: 16),
              _HoyCard(regla: regla, hoy: hoy, motos: mias.where((m) => m.ciudad == regla.ciudad).toList()),
              if (regla.aplicaMotos) ...[
                SectionHeader('Próximos días', trailing: regla.digitoLabel),
                Card(
                  child: Column(children: [
                    for (final (i, d) in [for (var i = 1; i <= 7; i++) hoy.add(Duration(days: i))].indexed) ...[
                      if (i > 0) const Divider(),
                      ListTile(
                        dense: true,
                        title: Text('${diasSemana[d.weekday]} ${d.day}', style: const TextStyle(fontSize: 14)),
                        trailing: MonoLabel(
                          regla.sinDatos(d)
                              ? 'Sin datos'
                              : regla.digitosEn(d).isEmpty
                                  ? 'Libre'
                                  : regla.digitosEn(d).join(' · '),
                          color: regla.digitosEn(d).isEmpty ? AppColors.lime : AppColors.orange,
                          size: 13,
                        ),
                      ),
                    ],
                  ]),
                ),
              ],
              _Vencimientos(motos: mias, onConfigure: widget.onConfigure),
              const SizedBox(height: 16),
              _AlertasCard(
                motos: mias,
                onConfigure: () {
                  final target = mias.firstOrNull ?? widget.scans.firstOrNull;
                  if (target != null) widget.onConfigure(target);
                },
              ),
              const SizedBox(height: 16),
              Text(
                [
                  if (regla.nota != null) regla.nota!,
                  if (regla.actualizado != null) 'Actualizado el ${formatDateShort(regla.actualizado!.toLocal())}.',
                  'Verifica siempre con la secretaría de movilidad de tu ciudad.',
                ].join(' '),
                style: const TextStyle(fontSize: 12, color: AppColors.muted),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _HoyCard extends StatelessWidget {
  const _HoyCard({required this.regla, required this.hoy, required this.motos});

  final PicoPlaca regla;
  final DateTime hoy;
  final List<Scan> motos;

  @override
  Widget build(BuildContext context) {
    final digitos = regla.digitosEn(hoy);
    final estado = !regla.aplicaMotos
        ? 'No aplica para motos'
        : regla.sinDatos(hoy)
            ? 'Sin datos actualizados'
            : digitos.isEmpty
                ? 'Sin restricción'
                : null;
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.hairline),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF23261A), AppColors.surface, Color(0xFF2A1F1A)],
        ),
      ),
      child: Column(children: [
        StatusPill('Pico y placa hoy · ${diasSemana[hoy.weekday]}', icon: Icons.verified_user_outlined, color: AppColors.lime),
        const SizedBox(height: 20),
        const MonoLabel('Dígitos restringidos', color: AppColors.primary, size: 13),
        const SizedBox(height: 12),
        if (estado != null)
          Text(estado.toUpperCase(), textAlign: TextAlign.center, style: grotesk(size: 26, color: AppColors.lime))
        else
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 12,
            runSpacing: 12,
            children: [
              for (final (i, d) in digitos.indexed) ...[
                if (i > 0 && digitos.length == 2) Text('y', style: grotesk(size: 26, color: AppColors.primary)),
                Container(
                  width: digitos.length > 2 ? 52 : 64,
                  height: digitos.length > 2 ? 52 : 64,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(color: AppColors.surfaceHighest, borderRadius: BorderRadius.circular(12)),
                  child: Text('$d', style: grotesk(size: digitos.length > 2 ? 28 : 36)),
                ),
              ],
            ],
          ),
        if (regla.horario != null && estado == null) ...[
          const SizedBox(height: 10),
          MonoLabel(regla.horario!, size: 11),
        ],
        const SizedBox(height: 20),
        if (motos.isEmpty)
          const Text('Marca una moto como tuya en Gastos para saber si puede circular.',
              textAlign: TextAlign.center, style: TextStyle(color: AppColors.onSurfaceVariant))
        else
          for (final m in motos) ...[
            StatusPill(
              '${m.placa} · ${regla.restringe(m.placa!, hoy) ? 'Restringida' : 'Habilitada'}',
              icon: Icons.two_wheeler,
              color: regla.restringe(m.placa!, hoy) ? AppColors.orange : AppColors.lime,
              solid: true,
            ),
            const SizedBox(height: 8),
            Text(
              regla.restringe(m.placa!, hoy)
                  ? '${m.titulo} no puede circular hoy en ${regla.ciudad}.'
                  : '${m.titulo} puede circular libremente hoy en ${regla.ciudad}.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.onSurfaceVariant),
            ),
            const SizedBox(height: 12),
          ],
      ]),
    );
  }
}

class _Vencimientos extends StatelessWidget {
  const _Vencimientos({required this.motos, required this.onConfigure});

  final List<Scan> motos;
  final ValueChanged<Scan> onConfigure;

  @override
  Widget build(BuildContext context) {
    final docs = [
      for (final m in motos) ...[
        (doc: 'SOAT', icon: Icons.health_and_safety_outlined, color: AppColors.orange, moto: m, vence: m.soatVence),
        (doc: 'Tecnomecánica', icon: Icons.build_circle_outlined, color: AppColors.lime, moto: m, vence: m.rtmVence),
      ],
    ];
    final alDia = docs.every((d) => d.vence != null && diasHasta(d.vence!) > 30);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      SectionHeader('Vencimientos legales',
          trailing: motos.isEmpty ? null : (alDia ? 'Al día' : 'Revisar'),
          trailingColor: alDia ? const Color(0xFFA5C8FF) : AppColors.orange),
      if (motos.isEmpty)
        const Card(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Text('Agrega la placa y las fechas de SOAT y técnico-mecánica de tu moto en Gastos › Mi moto.',
                style: TextStyle(color: AppColors.onSurfaceVariant)),
          ),
        ),
      for (final d in docs) ...[
        _DueCard(
          titulo: motos.length > 1 ? '${d.doc} · ${d.moto.placa}' : d.doc,
          icon: d.icon,
          color: d.color,
          vence: d.vence,
          onTap: () => onConfigure(d.moto),
        ),
        const SizedBox(height: 10),
      ],
    ]);
  }
}

class _DueCard extends StatelessWidget {
  const _DueCard({required this.titulo, required this.icon, required this.color, required this.vence, required this.onTap});

  final String titulo;
  final IconData icon;
  final Color color;
  final DateTime? vence;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final dias = vence == null ? null : diasHasta(vence!);
    final (pill, pillColor, solid, nota) = switch (dias) {
      null => ('Sin fecha', AppColors.muted, false, 'Agregar fecha'),
      < 0 => ('Vencido', AppColors.error, true, 'Renovar ya'),
      <= 30 => ('Vence en $dias días', AppColors.orange, true, 'Renovación próxima'),
      _ => ('Vigente · $dias días', AppColors.lime, false, 'Al día'),
    };
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(children: [
            IconTile(icon, color, size: 48),
            const SizedBox(width: 14),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(titulo, maxLines: 1, overflow: TextOverflow.ellipsis, style: grotesk(size: 18, weight: FontWeight.w600)),
                const SizedBox(height: 2),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(vence == null ? '—' : formatDateShort(vence!), style: mono(size: 13, color: AppColors.onSurface)),
                ),
              ]),
            ),
            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
              StatusPill(pill, color: pillColor, solid: solid),
              const SizedBox(height: 6),
              Text(nota, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
            ]),
          ]),
        ),
      ),
    );
  }
}

class _AlertasCard extends StatelessWidget {
  const _AlertasCard({required this.motos, required this.onConfigure});

  final List<Scan> motos;
  final VoidCallback onConfigure;

  @override
  Widget build(BuildContext context) => Card(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 10, 10),
          child: Row(children: [
            Icon(motos.isEmpty ? Icons.notifications_off_outlined : Icons.notifications_active_outlined,
                color: const Color(0xFFA5C8FF)),
            const SizedBox(width: 12),
            Expanded(
              child: Text(motos.isEmpty ? 'Sin motos propias: no hay alertas' : 'Alertas de pico y placa activas',
                  style: const TextStyle(fontSize: 14)),
            ),
            TextButton(
              onPressed: onConfigure,
              style: TextButton.styleFrom(
                backgroundColor: AppColors.surfaceHigh,
                foregroundColor: AppColors.onSurface,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('CONFIGURAR'),
            ),
          ]),
        ),
      );
}
