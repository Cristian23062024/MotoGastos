import 'package:material_ui/material_ui.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'scan.dart';
import 'notifications.dart';
import 'screens/login_screen.dart';
import 'screens/shell.dart';

// Se inyectan al compilar: flutter run --dart-define-from-file=.env
const _supabaseUrl = String.fromEnvironment('SUPABASE_URL');
const _supabaseKey = String.fromEnvironment('SUPABASE_PUBLISHABLE_KEY');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (_supabaseUrl.isEmpty || _supabaseKey.isEmpty) {
    runApp(const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Text(
              'Faltan SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY.\n'
              'Complétalas en .env y ejecuta:\nflutter run --dart-define-from-file=.env',
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    ));
    return;
  }
  await initNotifications();
  await Supabase.initialize(url: _supabaseUrl, publishableKey: _supabaseKey);
  runApp(const MotoGastosApp());
}

class MotoGastosApp extends StatelessWidget {
  const MotoGastosApp({super.key});

  @override
  Widget build(BuildContext context) {
    final seed = Colors.deepOrange;
    return MaterialApp(
      title: 'MotoGastos',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: seed),
      darkTheme: ThemeData(colorSchemeSeed: seed, brightness: Brightness.dark),
      home: StreamBuilder<AuthState>(
        stream: supabase.auth.onAuthStateChange,
        builder: (context, _) =>
            supabase.auth.currentSession == null ? const LoginScreen() : const MainShell(),
      ),
    );
  }
}
