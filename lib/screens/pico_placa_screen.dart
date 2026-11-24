import 'package:material_ui/material_ui.dart';

import '../pico_placa.dart';
import '../scan.dart';
import 'shell.dart';

class PicoPlacaScreen extends StatefulWidget {
  const PicoPlacaScreen({super.key});

  @override
  State<PicoPlacaScreen> createState() => _PicoPlacaScreenState();
}

class _PicoPlacaScreenState extends State<PicoPlacaScreen> {
  late Future<(List<PicoPlaca>, List<Scan>)> _data = _load();
  String? _ciudad;

  Future<(List<PicoPlaca>, List<Scan>)> _load() async {
    final (reglas, scans) = (await fetchPicoPlaca(), await fetchScans());
    return (reglas, scans.where((s) => s.esMia).toList());
  }

  Future<void> _refresh() async {
    setState(() => _data = _load());
    await _data;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pico y placa'), actions: const [AccountMenu()]),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: FutureBuilder(
          future: _data,
          builder: (context, snap) {
            if (snap.connectionState != ConnectionState.done) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snap.hasError) {
              return ListView(padding: const EdgeInsets.all(32), children: [
                Text('No se pudieron cargar las reglas.\n${snap.error}', textAlign: TextAlign.center),
              ]);
            }
            final (reglas, mias) = snap.data!;
            if (reglas.isEmpty) return ListView(children: const [ListTile(title: Text('Sin ciudades cargadas.'))]);
            // Por defecto, la ciudad de la primera moto propia.
            final ciudad = _ciudad ??
                mias.map((m) => m.ciudad).whereType<String>().firstOrNull ??
                reglas.first.ciudad;
            final regla = reglas.firstWhere((r) => r.ciudad == ciudad, orElse: () => reglas.first);
            return _RuleView(
              reglas: reglas,
              regla: regla,
              motos: mias.where((m) => m.ciudad == regla.ciudad).toList(),
              onCiudad: (c) => setState(() => _ciudad = c),
            );
          },
        ),
      ),
    );
  }
}

class _RuleView extends StatelessWidget {
  const _RuleView({required this.reglas, required this.regla, required this.motos, required this.onCiudad});

  final List<PicoPlaca> reglas;
  final PicoPlaca regla;
  final List<Scan> motos;
  final ValueChanged<String?> onCiudad;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final now = DateTime.now();
    final hoy = DateTime(now.year, now.month, now.day);
    final digitosHoy = regla.digitosEn(hoy);
    final proximos = [for (var i = 1; i <= 7; i++) hoy.add(Duration(days: i))];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        DropdownButtonFormField<String>(
          initialValue: regla.ciudad,
          decoration: const InputDecoration(labelText: 'Ciudad', border: OutlineInputBorder()),
          items: [for (final r in reglas) DropdownMenuItem(value: r.ciudad, child: Text(r.ciudad))],
          onChanged: onCiudad,
        ),
        const SizedBox(height: 16),
        Card(
          color: theme.colorScheme.primaryContainer,
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                Text('Hoy, ${diasSemana[hoy.weekday]} ${formatDate(hoy)}', style: theme.textTheme.titleMedium),
                const SizedBox(height: 4),
                Text(
                  !regla.aplicaMotos
                      ? 'No aplica para motos'
                      : regla.sinDatos(hoy)
                          ? 'Sin datos actualizados'
                          : digitosHoy.isEmpty
                          ? 'Sin restricción'
                          : 'Placas con ${regla.digitoLabel} ${digitosHoy.join(' y ')}',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.headlineSmall,
                ),
                if (regla.horario != null) Text(regla.horario!, textAlign: TextAlign.center),
              ],
            ),
          ),
        ),
        for (final m in motos)
          ListTile(
            leading: Icon(regla.restringe(m.placa!, hoy) ? Icons.block : Icons.check_circle,
                color: regla.restringe(m.placa!, hoy) ? theme.colorScheme.error : Colors.green),
            title: Text('${m.placa} · ${m.titulo}'),
            subtitle: Text(regla.restringe(m.placa!, hoy) ? 'Hoy tiene pico y placa' : 'Hoy puede circular'),
          ),
        if (regla.aplicaMotos) ...[
          const SizedBox(height: 16),
          Text('Próximos días (${regla.digitoLabel})', style: theme.textTheme.titleLarge),
          for (final d in proximos)
            ListTile(
              dense: true,
              title: Text('${diasSemana[d.weekday]} ${formatDate(d)}'),
              trailing: Text(regla.sinDatos(d)
                  ? 'Sin datos'
                  : regla.digitosEn(d).isEmpty
                      ? 'Sin restricción'
                      : regla.digitosEn(d).join(' y ')),
            ),
        ],
        const SizedBox(height: 16),
        Text(
          [
            if (regla.nota != null) regla.nota!,
            if (regla.actualizado != null) 'Actualizado el ${formatDate(regla.actualizado!.toLocal())}.',
            'Verifica siempre con la secretaría de movilidad de tu ciudad.',
          ].join(' '),
          style: theme.textTheme.bodySmall,
        ),
      ],
    );
  }
}
