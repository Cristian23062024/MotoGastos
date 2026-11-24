import 'package:material_ui/material_ui.dart';

import 'notifications.dart';
import 'scan.dart';
import 'theme.dart';

/// Logo: moto dentro de un marco de escaneo (sin depender de imágenes remotas).
class AppLogo extends StatelessWidget {
  const AppLogo({super.key, this.size = 36});

  final double size;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: AppColors.surfaceHigh, borderRadius: BorderRadius.circular(size * 0.2)),
        child: Stack(alignment: Alignment.center, children: [
          Icon(Icons.crop_free, size: size * 0.8, color: AppColors.onSurface),
          Icon(Icons.two_wheeler, size: size * 0.45, color: AppColors.orange),
        ]),
      );
}

/// Cabecera de las pestañas: logo, título en mayúsculas y avatar con el menú de cuenta.
class AppHeader extends StatelessWidget implements PreferredSizeWidget {
  const AppHeader(this.title, {super.key});

  final String title;

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) => AppBar(
        toolbarHeight: 64,
        titleSpacing: 20,
        title: Row(children: [
          const AppLogo(),
          const SizedBox(width: 12),
          Text(title.toUpperCase(), style: grotesk(size: 20)),
        ]),
        actions: const [AccountMenu(), SizedBox(width: 12)],
      );
}

/// Avatar con el correo del usuario y la opción de cerrar sesión.
class AccountMenu extends StatelessWidget {
  const AccountMenu({super.key});

  Future<void> _signOut(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('¿Cerrar sesión?'),
        content: const Text('Dejarás de recibir los avisos de tus motos en este teléfono.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('CANCELAR')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('CERRAR SESIÓN')),
        ],
      ),
    );
    if (ok != true) return;
    await cancelNotifications(); // los avisos son del usuario, no del teléfono
    await supabase.auth.signOut();
  }

  @override
  Widget build(BuildContext context) => PopupMenuButton<void>(
        tooltip: 'Cuenta',
        itemBuilder: (context) => [
          PopupMenuItem(enabled: false, child: Text(supabase.auth.currentUser?.email ?? 'Sesión iniciada')),
          PopupMenuItem(
            onTap: () => _signOut(context),
            child: const ListTile(leading: Icon(Icons.logout), title: Text('Cerrar sesión')),
          ),
        ],
        child: const CircleAvatar(
          radius: 18,
          backgroundColor: AppColors.primary,
          child: Icon(Icons.person_outline, color: Color(0xFF5E1700), size: 20),
        ),
      );
}

/// Etiqueta en mayúsculas con fuente monoespaciada (títulos de sección, rótulos de datos).
class MonoLabel extends StatelessWidget {
  const MonoLabel(this.text, {super.key, this.color = AppColors.onSurfaceVariant, this.size = 12});

  final String text;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) => Text(text.toUpperCase(), style: mono(size: size, color: color));
}

/// Píldora de estado: fondo del color al 12 %, borde y texto del color.
class StatusPill extends StatelessWidget {
  const StatusPill(this.text, {super.key, this.color = AppColors.lime, this.icon, this.solid = false});

  final String text;
  final Color color;
  final IconData? icon;
  final bool solid;

  @override
  Widget build(BuildContext context) {
    final fg = solid ? const Color(0xFF1A1C1F) : color;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: solid ? color : color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: solid ? 1 : 0.5)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (icon != null) ...[Icon(icon, size: 16, color: fg), const SizedBox(width: 6)],
        Flexible(child: Text(text.toUpperCase(), style: mono(size: 12, weight: FontWeight.w600, color: fg))),
      ]),
    );
  }
}

/// Cuadro de ícono coloreado (filas de costos y vencimientos).
class IconTile extends StatelessWidget {
  const IconTile(this.icon, this.color, {super.key, this.size = 44});

  final IconData icon;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) => Container(
        width: size,
        height: size,
        decoration: BoxDecoration(color: color.withValues(alpha: 0.18), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: color, size: size * 0.5),
      );
}

/// Título de sección con texto opcional a la derecha ("5 REGISTROS", "AL DÍA").
class SectionHeader extends StatelessWidget {
  const SectionHeader(this.title, {super.key, this.trailing, this.trailingColor = AppColors.onSurfaceVariant});

  final String title;
  final String? trailing;
  final Color trailingColor;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(4, 24, 4, 12),
        child: Row(children: [
          Expanded(child: Text(title, style: grotesk(size: 20, weight: FontWeight.w600))),
          if (trailing != null) MonoLabel(trailing!, color: trailingColor, size: 11),
        ]),
      );
}

/// Mensaje centrado para estados vacíos o de error.
class EmptyState extends StatelessWidget {
  const EmptyState(this.icon, this.text, {super.key});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(40),
        children: [
          Icon(icon, size: 48, color: AppColors.muted),
          const SizedBox(height: 12),
          Text(text, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted)),
        ],
      );
}
