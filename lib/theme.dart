import 'package:google_fonts/google_fonts.dart';
import 'package:material_ui/material_ui.dart';

/// Tokens del sistema de diseño "Apex Telemetry" (Diseño/apex_telemetry/DESIGN.md).
abstract final class AppColors {
  static const background = Color(0xFF111317);
  static const surfaceLow = Color(0xFF1A1C1F);
  static const surface = Color(0xFF1E2023); // tarjetas
  static const surfaceHigh = Color(0xFF282A2D);
  static const surfaceHighest = Color(0xFF333538);
  static const onSurface = Color(0xFFE2E2E6);
  static const onSurfaceVariant = Color(0xFFE6BEB2);
  static const muted = Color(0xFF8E95A2);
  static const orange = Color(0xFFFF571A); // acción principal y alertas
  static const primary = Color(0xFFFFB59E);
  static const lime = Color(0xFFCAF300); // estados "OK" y visor
  static const blue = Color(0xFF2492FF);
  static const error = Color(0xFFFFB4AB);
  static const hairline = Color(0x14FFFFFF); // rgba(255,255,255,0.08)
  static const border = Color(0x1FFFFFFF); // rgba(255,255,255,0.12)
}

/// Etiquetas técnicas en JetBrains Mono, en mayúsculas y con números tabulares.
TextStyle mono({double size = 12, FontWeight weight = FontWeight.w500, Color color = AppColors.onSurfaceVariant}) =>
    GoogleFonts.jetBrainsMono(
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: size * 0.05,
      fontFeatures: const [FontFeature.tabularFigures()],
    );

TextStyle grotesk({double size = 22, FontWeight weight = FontWeight.w700, Color color = AppColors.onSurface}) =>
    GoogleFonts.spaceGrotesk(fontSize: size, fontWeight: weight, color: color, letterSpacing: -size * 0.015);

ThemeData buildTheme() {
  final scheme = const ColorScheme.dark(
    primary: AppColors.orange,
    onPrimary: Colors.white,
    primaryContainer: AppColors.orange,
    onPrimaryContainer: Colors.white,
    secondary: AppColors.lime,
    onSecondary: Color(0xFF2A3400),
    tertiary: Color(0xFFA5C8FF),
    surface: AppColors.background,
    onSurface: AppColors.onSurface,
    onSurfaceVariant: AppColors.onSurfaceVariant,
    surfaceContainerLow: AppColors.surfaceLow,
    surfaceContainer: AppColors.surface,
    surfaceContainerHigh: AppColors.surfaceHigh,
    surfaceContainerHighest: AppColors.surfaceHighest,
    outline: Color(0xFFAD897E),
    outlineVariant: AppColors.hairline,
    error: AppColors.error,
  );
  final base = ThemeData(colorScheme: scheme, brightness: Brightness.dark);
  final text = GoogleFonts.interTextTheme(base.textTheme).apply(
    bodyColor: AppColors.onSurface,
    displayColor: AppColors.onSurface,
  );
  final rounded12 = RoundedRectangleBorder(borderRadius: BorderRadius.circular(12));
  return base.copyWith(
    scaffoldBackgroundColor: AppColors.background,
    textTheme: text.copyWith(
      headlineLarge: grotesk(size: 28),
      headlineMedium: grotesk(size: 22, weight: FontWeight.w600),
      headlineSmall: grotesk(size: 18, weight: FontWeight.w600),
      titleLarge: grotesk(size: 18, weight: FontWeight.w600),
      titleMedium: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.onSurface),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.background,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      titleTextStyle: grotesk(size: 20),
    ),
    cardTheme: CardThemeData(
      color: AppColors.surface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.hairline),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.orange,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(52),
        shape: rounded12,
        textStyle: mono(size: 14, weight: FontWeight.w600, color: Colors.white),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.onSurface,
        minimumSize: const Size.fromHeight(52),
        side: const BorderSide(color: AppColors.border),
        shape: rounded12,
        textStyle: mono(size: 14, weight: FontWeight.w600, color: AppColors.onSurface),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: AppColors.primary, textStyle: mono(size: 12, weight: FontWeight.w600)),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.surfaceLow,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      labelStyle: mono(size: 12),
      hintStyle: GoogleFonts.inter(color: AppColors.muted),
      prefixIconColor: AppColors.onSurfaceVariant,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.border)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.orange)),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: AppColors.background,
      indicatorColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      height: 72,
      iconTheme: WidgetStateProperty.resolveWith(
        (s) => IconThemeData(color: s.contains(WidgetState.selected) ? AppColors.orange : AppColors.onSurfaceVariant),
      ),
      labelTextStyle: WidgetStateProperty.resolveWith(
        (s) => mono(size: 10, color: s.contains(WidgetState.selected) ? AppColors.orange : AppColors.onSurface),
      ),
    ),
    dividerTheme: const DividerThemeData(color: AppColors.hairline, space: 1),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: AppColors.surfaceHigh,
      contentTextStyle: GoogleFonts.inter(color: AppColors.onSurface),
      behavior: SnackBarBehavior.floating,
    ),
    progressIndicatorTheme: const ProgressIndicatorThemeData(color: AppColors.orange),
    dialogTheme: const DialogThemeData(backgroundColor: AppColors.surface),
    popupMenuTheme: const PopupMenuThemeData(color: AppColors.surfaceHigh),
  );
}
