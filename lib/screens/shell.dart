import 'package:material_ui/material_ui.dart';

import '../notifications.dart';
import '../scan.dart';
import 'home_screen.dart';
import 'pico_placa_screen.dart';

/// Navegación principal tras iniciar sesión.
class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _tab = 0;

  @override
  void initState() {
    super.initState();
    // Las reglas pueden haber cambiado en Supabase desde la última vez: reprograma al entrar.
    refreshNotifications().catchError((Object e) => debugPrint('No se pudieron programar avisos: $e'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _tab, children: const [HomeScreen(), PicoPlacaScreen()]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.two_wheeler), label: 'Mis motos'),
          NavigationDestination(icon: Icon(Icons.traffic), label: 'Pico y placa'),
        ],
      ),
    );
  }
}

/// Menú de cuenta con el correo del usuario y la opción de cerrar sesión.
class AccountMenu extends StatelessWidget {
  const AccountMenu({super.key});

  Future<void> _signOut(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Cerrar sesión?'),
        content: const Text('Dejarás de recibir los avisos de tus motos en este teléfono.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Cerrar sesión')),
        ],
      ),
    );
    if (ok != true) return;
    await cancelNotifications(); // los avisos son del usuario, no del teléfono
    await supabase.auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<void>(
      tooltip: 'Cuenta',
      icon: const Icon(Icons.account_circle),
      itemBuilder: (context) => [
        PopupMenuItem(enabled: false, child: Text(supabase.auth.currentUser?.email ?? 'Sesión iniciada')),
        PopupMenuItem(
          onTap: () => _signOut(context),
          child: const ListTile(leading: Icon(Icons.logout), title: Text('Cerrar sesión')),
        ),
      ],
    );
  }
}
