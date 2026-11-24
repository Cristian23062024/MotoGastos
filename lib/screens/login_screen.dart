import 'package:material_ui/material_ui.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../scan.dart';
import '../theme.dart';
import '../widgets.dart';

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
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceLow,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [BoxShadow(color: AppColors.orange.withValues(alpha: 0.25), blurRadius: 60, spreadRadius: 8)],
                      ),
                      child: const AppLogo(size: 56),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text('MotoGastos', textAlign: TextAlign.center, style: grotesk(size: 32)),
                  const SizedBox(height: 4),
                  const Text('Escanea y gestiona tu motocicleta',
                      textAlign: TextAlign.center, style: TextStyle(color: AppColors.onSurfaceVariant)),
                  const SizedBox(height: 32),
                  OutlinedButton.icon(
                    onPressed: _busy ? null : () => _oauth(OAuthProvider.google),
                    icon: const Icon(Icons.g_mobiledata, size: 28),
                    label: const Text('Continuar con Google'),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: _busy ? null : () => _oauth(OAuthProvider.github),
                    icon: const Icon(Icons.code),
                    label: const Text('Continuar con GitHub'),
                  ),
                  const SizedBox(height: 24),
                  const Row(children: [
                    Expanded(child: Divider()),
                    Padding(padding: EdgeInsets.symmetric(horizontal: 12), child: MonoLabel('o accede con magic link', size: 10)),
                    Expanded(child: Divider()),
                  ]),
                  const SizedBox(height: 20),
                  const Padding(padding: EdgeInsets.only(left: 4, bottom: 8), child: MonoLabel('Correo electrónico', size: 10)),
                  TextField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    autofillHints: const [AutofillHints.email],
                    decoration: const InputDecoration(hintText: 'piloto@correo.com', prefixIcon: Icon(Icons.mail_outline)),
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: _busy ? null : () => _run(_sendLink),
                    iconAlignment: IconAlignment.end,
                    icon: const Icon(Icons.bolt),
                    label: Text(_linkSent ? 'Reenviar Magic Link' : 'Enviar Magic Link'),
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
