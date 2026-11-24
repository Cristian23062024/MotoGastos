import 'package:material_ui/material_ui.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../scan.dart';

// Deep link al que vuelven el magic link y OAuth; debe estar en Supabase > Authentication > URL Configuration.
const _redirectUrl = 'com.motogastos.motogastos://login-callback';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  bool _linkSent = false;
  bool _busy = false;

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  String get _emailText => _email.text.trim();

  Future<void> _run(Future<void> Function() action) async {
    setState(() => _busy = true);
    try {
      await action();
    } on AuthException catch (e) {
      _show(e.message);
    } catch (e) {
      _show('Error de conexión: $e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _show(String msg) {
    if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  Future<void> _sendLink() async {
    if (!_emailText.contains('@')) return _show('Escribe un correo válido.');
    await supabase.auth.signInWithOtp(email: _emailText, emailRedirectTo: _redirectUrl);
    setState(() => _linkSent = true);
    _show('Te enviamos un enlace a $_emailText. Ábrelo en este teléfono.');
  }

  Future<void> _oauth(OAuthProvider provider) =>
      _run(() => supabase.auth.signInWithOAuth(provider, redirectTo: _redirectUrl));

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(Icons.two_wheeler, size: 72, color: theme.colorScheme.primary),
                  const SizedBox(height: 8),
                  Text('MotoGastos', textAlign: TextAlign.center, style: theme.textTheme.headlineMedium),
                  Text('Escanea tu moto y conoce cuánto cuesta al año',
                      textAlign: TextAlign.center, style: theme.textTheme.bodyMedium),
                  const SizedBox(height: 32),
                  TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.email],
                    decoration: const InputDecoration(labelText: 'Correo', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  FilledButton.icon(
                    onPressed: _busy ? null : () => _run(_sendLink),
                    icon: const Icon(Icons.mail),
                    label: Text(_linkSent ? 'Reenviar enlace' : 'Enviar enlace de acceso'),
                  ),
                  const SizedBox(height: 24),
                  const Row(children: [
                    Expanded(child: Divider()),
                    Padding(padding: EdgeInsets.symmetric(horizontal: 8), child: Text('o continúa con')),
                    Expanded(child: Divider()),
                  ]),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: _busy ? null : () => _oauth(OAuthProvider.google),
                    icon: const Icon(Icons.g_mobiledata),
                    label: const Text('Google'),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    onPressed: _busy ? null : () => _oauth(OAuthProvider.github),
                    icon: const Icon(Icons.code),
                    label: const Text('GitHub'),
                  ),
                  if (_busy) const Padding(padding: EdgeInsets.only(top: 16), child: LinearProgressIndicator()),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
