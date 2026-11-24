import 'package:material_ui/material_ui.dart';
import 'package:image_picker/image_picker.dart';

import '../scan.dart';
import 'scan_detail_screen.dart';
import 'shell.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<List<Scan>> _scans = fetchScans();
  bool _analyzing = false;

  Future<void> _refresh() async {
    setState(() => _scans = fetchScans());
    await _scans;
  }

  Future<void> _scan(ImageSource source) async {
    // Reducir la foto mantiene la petición a Gemini pequeña y rápida.
    final file = await ImagePicker().pickImage(source: source, maxWidth: 1280, imageQuality: 80);
    if (file == null) return;
    setState(() => _analyzing = true);
    try {
      final scan = await analyzeAndSave(file);
      if (!mounted) return;
      _refresh();
      await _open(scan);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    } finally {
      if (mounted) setState(() => _analyzing = false);
    }
  }

  Future<void> _open(Scan scan) async {
    // El detalle puede borrar el escaneo o cambiar sus datos de propietario.
    await Navigator.push(context, MaterialPageRoute(builder: (_) => ScanDetailScreen(scan: scan)));
    if (mounted) _refresh();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis motos'),
        actions: const [AccountMenu()],
      ),
      body: Column(
        children: [
          if (_analyzing) const LinearProgressIndicator(),
          Expanded(
            child: RefreshIndicator(
              onRefresh: _refresh,
              child: FutureBuilder<List<Scan>>(
                future: _scans,
                builder: (context, snap) {
                  if (snap.connectionState != ConnectionState.done) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (snap.hasError) return _message('No se pudo cargar el historial.\n${snap.error}');
                  final scans = snap.data!;
                  if (scans.isEmpty) {
                    return _message('Aún no has escaneado motos.\nToma una foto o elige una de tu galería.');
                  }
                  return ListView.separated(
                    itemCount: scans.length,
                    separatorBuilder: (_, _) => const Divider(height: 1),
                    itemBuilder: (context, i) {
                      final s = scans[i];
                      return ListTile(
                        leading: CircleAvatar(child: Icon(s.esMia ? Icons.verified : Icons.two_wheeler)),
                        title: Text(s.titulo),
                        subtitle: Text([s.placa, s.anio, if (s.cilindrajeCc != null) '${s.cilindrajeCc} cc']
                            .whereType<String>()
                            .join(' · ')),
                        trailing: Text(formatCop(s.totalAnualCop)),
                        onTap: () => _open(s),
                      );
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: _analyzing ? null : () => _scan(ImageSource.camera),
                  icon: const Icon(Icons.photo_camera),
                  label: const Text('Cámara'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _analyzing ? null : () => _scan(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Galería'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ListView para que RefreshIndicator funcione también en estados vacíos.
  Widget _message(String text) => ListView(
        padding: const EdgeInsets.all(32),
        children: [Text(text, textAlign: TextAlign.center)],
      );
}
