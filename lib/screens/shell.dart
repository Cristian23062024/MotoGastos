import 'package:material_ui/material_ui.dart';

import '../notifications.dart';
import '../scan.dart';
import '../widgets.dart';
import 'escanear_screen.dart';
import 'gastos_screen.dart';
import 'listado_screen.dart';
import 'pico_placa_screen.dart';

/// Navegación principal tras iniciar sesión: Listado, Escanear, Gastos y Pico y placa.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  static const _titulos = ['Listado', 'Escanear', 'Gastos', 'Pico y placa'];

  int _tab = 0;
  late Future<List<Scan>> _scans = fetchScans();
  String? _selectedId; // moto mostrada en Gastos

  @override
  void initState() {
    super.initState();
    // Las reglas pueden haber cambiado en Supabase desde la última vez: reprograma al entrar.
    refreshNotifications().catchError((Object e) => debugPrint('No se pudieron programar avisos: $e'));
  }

  Future<void> _reload() async {
    setState(() => _scans = fetchScans());
    await _scans;
  }

  void _openGastos(Scan scan) => setState(() {
        _selectedId = scan.id;
        _tab = 2;
      });

  Future<void> _onScanned(Scan scan) async {
    _openGastos(scan);
    await _reload();
  }

  Widget _body(List<Scan> scans) => switch (_tab) {
        0 => ListadoScreen(scans: scans, onOpen: _openGastos, onRefresh: _reload),
        2 => GastosScreen(
            scans: scans,
            selected: scans.where((s) => s.id == _selectedId).firstOrNull ??
                scans.where((s) => s.esMia).firstOrNull ??
                scans.firstOrNull,
            onSelect: _openGastos,
            onChanged: _reload,
            onScan: () => setState(() => _tab = 1),
          ),
        _ => PicoPlacaScreen(scans: scans, onConfigure: _openGastos),
      };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppHeader(_titulos[_tab]),
      // La cámara solo vive mientras la pestaña Escanear está visible.
      body: _tab == 1
          ? EscanearScreen(onScanned: _onScanned)
          : FutureBuilder<List<Scan>>(
              future: _scans,
              builder: (context, snap) {
                if (snap.connectionState != ConnectionState.done) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snap.hasError) {
                  return RefreshIndicator(
                    onRefresh: _reload,
                    child: EmptyState(Icons.cloud_off, 'No se pudo cargar la información.\n${snap.error}'),
                  );
                }
                return _body(snap.data!);
              },
            ),
      bottomNavigationBar: DecoratedBox(
        decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0x0FFFFFFF)))),
        child: NavigationBar(
          selectedIndex: _tab,
          onDestinationSelected: (i) => setState(() => _tab = i),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.two_wheeler), label: 'LISTADO'),
            NavigationDestination(icon: Icon(Icons.qr_code_scanner), label: 'ESCANEAR'),
            NavigationDestination(icon: Icon(Icons.receipt_long), label: 'GASTOS'),
            NavigationDestination(icon: Icon(Icons.event_available), label: 'PICO Y PLACA'),
          ],
        ),
      ),
    );
  }
}
