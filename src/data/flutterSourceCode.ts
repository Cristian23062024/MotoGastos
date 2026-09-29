export const FLUTTER_DART_CODE = `// ============================================================================
// MotoGastos - Complete Flutter & Dart Source Code
// Supports: Material 3, Dark & Light Mode, Multi-device Responsive Layout,
// Trilingual i18n (Spanish, English, Japanese), Smooth PageTransitions,
// and All 5 Cockpit & Telemetry Screens.
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const MotoGastosApp());
}

// ----------------------------------------------------------------------------
// Internationalization & Localization Helper
// ----------------------------------------------------------------------------
enum AppLanguage { es, en, ja }

class I18n {
  static AppLanguage current = AppLanguage.es;

  static const Map<AppLanguage, Map<String, String>> _strings = {
    AppLanguage.es: {
      'app_name': 'MotoGastos',
      'online_status': 'ESTADO: EN LÍNEA',
      'connected': 'Conectado',
      'hello_rider': '¡Hola, Rider!',
      'performance': 'RENDIMIENTO',
      'autonomy': 'AUTONOMÍA',
      'estimation_title': 'Estimación y Trámites',
      'estimation_subtitle': 'SOAT, tecno e impuestos sincronizados para Colombia.',
      'avg_annual_cost': 'COSTO PROMEDIO ANUAL ESTIMADO',
      'scan_my_bike': 'Escanear mi moto',
      'choose_gallery': 'Elegir foto de la galería',
      'hud_mode': 'HUD AI OPTIC 2.4',
      'analyzing_title': 'Analizando tu moto',
      'analyzing_sub': 'Nuestra IA está identificando las características clave del vehículo',
      'target_locked': 'TARGET LOCKED',
      'step1': 'Forma y encuadre detectados',
      'step2': 'Marca y línea identificadas',
      'step3': 'Estimando cilindraje y año...',
      'ready': 'LISTO',
      'continue_btn': 'Continuar',
      'tech_specs': 'Ficha Técnica',
      'certainty': '92% CERTEZA',
      'displacement': 'CILINDRAJE',
      'model_year': 'AÑO MODELO',
      'soat_tariff': 'TARIFA SOAT',
      'dry_weight': 'PESO EN SECO',
      'avg_consumption': 'Consumo Promedio',
      'view_annual_expenses': 'Ver gastos anuales estimados',
      'annual_expenses': 'Gastos Anuales',
      'edit_values': 'EDITAR VALORES',
      'projection': 'PROYECCIÓN',
      'total_annual_cost': 'COSTO TOTAL ANUAL',
      'monthly_quota': 'CUOTA MENSUAL',
      'save': 'Guardar',
      'download_report': 'Descargar informe',
    },
    AppLanguage.en: {
      'app_name': 'MotoGastos',
      'online_status': 'STATUS: ONLINE',
      'connected': 'Connected',
      'hello_rider': 'Hello, Rider!',
      'performance': 'FUEL ECONOMY',
      'autonomy': 'RANGE',
      'estimation_title': 'Estimations & Procedures',
      'estimation_subtitle': 'SOAT, inspections & taxes synced for Colombia.',
      'avg_annual_cost': 'ESTIMATED AVG. ANNUAL COST',
      'scan_my_bike': 'Scan my motorcycle',
      'choose_gallery': 'Choose from gallery',
      'hud_mode': 'HUD AI OPTIC 2.4',
      'analyzing_title': 'Analyzing your bike',
      'analyzing_sub': 'Our AI is identifying key characteristics of your vehicle',
      'target_locked': 'TARGET LOCKED',
      'step1': 'Shape and framing detected',
      'step2': 'Brand and lineage identified',
      'step3': 'Estimating displacement and year...',
      'ready': 'READY',
      'continue_btn': 'Continue',
      'tech_specs': 'Spec Sheet',
      'certainty': '92% CERTAINTY',
      'displacement': 'DISPLACEMENT',
      'model_year': 'MODEL YEAR',
      'soat_tariff': 'SOAT TARIFF',
      'dry_weight': 'DRY WEIGHT',
      'avg_consumption': 'Avg. Consumption',
      'view_annual_expenses': 'View estimated annual expenses',
      'annual_expenses': 'Annual Expenses',
      'edit_values': 'EDIT VALUES',
      'projection': 'PROJECTION',
      'total_annual_cost': 'TOTAL ANNUAL COST',
      'monthly_quota': 'MONTHLY COST',
      'save': 'Save',
      'download_report': 'Download report',
    },
    AppLanguage.ja: {
      'app_name': 'MotoGastos',
      'online_status': 'ステータス: オンライン',
      'connected': '接続中',
      'hello_rider': 'こんにちは、ライダー！',
      'performance': '燃費性能',
      'autonomy': '航続距離',
      'estimation_title': '費用試算・公的手続き',
      'estimation_subtitle': 'コロンビアの自賠責(SOAT)・車検・税金と同期中。',
      'avg_annual_cost': '推定年間平均維持費',
      'scan_my_bike': 'バイクをスキャン',
      'choose_gallery': 'ギャラリーから選択',
      'hud_mode': 'HUD AI OPTIC 2.4',
      'analyzing_title': 'バイクを精密解析中',
      'analyzing_sub': '最新AIが車体の主要スペックと仕様を特定しています',
      'target_locked': 'ターゲット補足完了',
      'step1': '形状・構図の検出',
      'step2': 'メーカー・車種の特定',
      'step3': '排気量・年式の推定中...',
      'ready': '完了',
      'continue_btn': '続ける',
      'tech_specs': '仕様スペックシート',
      'certainty': '92% 判定精度',
      'displacement': '総排気量',
      'model_year': '年式モデル',
      'soat_tariff': '自賠責(SOAT)区分',
      'dry_weight': '乾燥重量',
      'avg_consumption': '平均燃費',
      'view_annual_expenses': '推定年間維持費を確認',
      'annual_expenses': '年間維持費',
      'edit_values': '数値を編集',
      'projection': '走行予測',
      'total_annual_cost': '年間合計維持費',
      'monthly_quota': '月額目安',
      'save': '保存',
      'download_report': 'レポート作成',
    },
  };

  static String t(String key) => _strings[current]?[key] ?? key;
}

// ----------------------------------------------------------------------------
// Theme Definition (Dark Cockpit + Racing Crimson)
// ----------------------------------------------------------------------------
class AppTheme {
  static const Color background = Color(0xFF0D131F);
  static const Color surfaceContainerLowest = Color(0xFF080E1A);
  static const Color surfaceContainerLow = Color(0xFF161C28);
  static const Color surfaceContainer = Color(0xFF1A202C);
  static const Color surfaceContainerHigh = Color(0xFF242A37);
  static const Color surfaceContainerHighest = Color(0xFF2F3542);
  static const Color primaryContainer = Color(0xFFFF5545);
  static const Color primary = Color(0xFFFFB4AA);
  static const Color secondary = Color(0xFF47E266);
  static const Color tertiary = Color(0xFFAAC7FF);
  static const Color textPrimary = Color(0xFFDDE2F4);
  static const Color textSecondary = Color(0xFFAD8883);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primaryContainer,
      colorScheme: const ColorScheme.dark(
        primary: primaryContainer,
        secondary: secondary,
        surface: background,
      ),
      fontFamily: 'Space Grotesk',
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: CupertinoPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        },
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF4F6FA),
      primaryColor: primaryContainer,
      colorScheme: const ColorScheme.light(
        primary: primaryContainer,
        secondary: Color(0xFF09BF49),
        surface: Colors.white,
      ),
      fontFamily: 'Space Grotesk',
    );
  }
}

// ----------------------------------------------------------------------------
// Main Application
// ----------------------------------------------------------------------------
class MotoGastosApp extends StatefulWidget {
  const MotoGastosApp({super.key});

  @override
  State<MotoGastosApp> createState() => _MotoGastosAppState();
}

class _MotoGastosAppState extends State<MotoGastosApp> {
  ThemeMode _themeMode = ThemeMode.dark;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  void setLanguage(AppLanguage lang) {
    setState(() {
      I18n.current = lang;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MotoGastos',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      home: HomeScreen(
        onToggleTheme: toggleTheme,
        onLanguageChanged: setLanguage,
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// SCREEN 1: Inicio (Home Cockpit)
// ----------------------------------------------------------------------------
class HomeScreen extends StatelessWidget {
  final VoidCallback onToggleTheme;
  final Function(AppLanguage) onLanguageChanged;

  const HomeScreen({
    super.key,
    required this.onToggleTheme,
    required this.onLanguageChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(60),
        child: _buildHeader(context),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Online status & Greetings
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        I18n.t('online_status'),
                        style: const TextStyle(
                          color: AppTheme.secondary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        I18n.t('hello_rider'),
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceContainerHigh.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppTheme.secondary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          I18n.t('connected'),
                          style: const TextStyle(fontSize: 12, color: AppTheme.textPrimary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Hero Motorcycle Card
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.surfaceContainer.withOpacity(0.8),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ],
                ),
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Yamaha R15 V4',
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 2),
                            Text(
                              '155cc · Modelo 2026',
                              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Deportiva',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 180,
                      child: Image.network(
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuD4nDl97HKxV-fdyUvch1_kAjQr8LIduTeF8sWW62jkUAGVYlE-js0oNaSEdXRpsfRioDU-1Q-voeQW-mlIeS1tstziMusBz7AfQ20Nfrw2Hlneay3CT6oJwO2xCrV8rc5G6k3_NYFY-kw7jQu7fP9d_07haVk1E1fAhtiWETJ5VDnUdOZos_uLfs0IsMED8-TBsvx6qJ8-ATZA28SK_8a6lEgtPXTTVKTFm_PIETH5ubqivKeQk-6R',
                        fit: BoxFit.contain,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceContainerLow.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                Text(
                                  I18n.t('performance'),
                                  style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  '38.4 km/L',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.secondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(width: 1, height: 36, color: Colors.white12),
                          Expanded(
                            child: Column(
                              children: [
                                Text(
                                  I18n.t('autonomy'),
                                  style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  '420 km',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Feature: Estimación y Trámites
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceContainer.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppTheme.tertiary.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.analytics, color: AppTheme.tertiary),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            I18n.t('estimation_title'),
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            I18n.t('estimation_subtitle'),
                            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Colors.white30),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Annual Average Cost Preview
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          I18n.t('avg_annual_cost'),
                          style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          '\$ 3.450.000 COP',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Container(
                      width: 36,
                      height: 36,
                      decoration: const BoxDecoration(
                        color: AppTheme.surfaceContainerHighest,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.trending_down, color: AppTheme.secondary, size: 20),
                    )
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Big Crimson CTA Button: Scan My Bike
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryContainer,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    elevation: 10,
                    shadowColor: AppTheme.primaryContainer.withOpacity(0.5),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const ScanScreen()),
                    );
                  },
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.camera_alt, color: Colors.white),
                      const SizedBox(width: 8),
                      Text(
                        I18n.t('scan_my_bike'),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward, color: Colors.white),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      color: AppTheme.background.withOpacity(0.9),
      child: SafeArea(
        bottom: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Image.network(
                  'https://lh3.googleusercontent.com/aida/AEtjO1VO1cBVHHpYEc9yoyMOxyCR_10AxpmFXIGS3WJ8gFeLBx1vEhzz7UiVBto-r0AXhSxPgjPzWomvr4E1k7F6kanUY9GQ-Q2xWoksiHpr0Erq2oeZNyAa1R3xgzSbDM00DAOlwJ9zKIv9LAkzZ49qBB-3x5Vdn06JWsDSmto4yjWsA3fmphSdmHPjhpbgArlia74BbWYpAatX3Oh8jcEmghMBqYENxL2bDRSoWEd0Slk9G6xA5Ek_2W_BBQ',
                  height: 32,
                ),
                const SizedBox(width: 10),
                const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'MOTOGASTOS',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppTheme.primary,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2.0,
                      ),
                    ),
                    Text(
                      'Inicio',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.language, size: 20),
                  onPressed: () {
                    final nextLang = I18n.current == AppLanguage.es
                        ? AppLanguage.en
                        : I18n.current == AppLanguage.en
                            ? AppLanguage.ja
                            : AppLanguage.es;
                    onLanguageChanged(nextLang);
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.dark_mode, size: 20),
                  onPressed: onToggleTheme,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// SCREEN 2: Escanear Moto (HUD AI Optic)
// ----------------------------------------------------------------------------
class ScanScreen extends StatelessWidget {
  const ScanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text('Escanear Moto'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceContainer,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppTheme.secondary, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text(I18n.t('hud_mode'), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const Row(
                  children: [
                    CircleAvatar(backgroundColor: AppTheme.surfaceContainer, child: Icon(Icons.flash_on, size: 18, color: Colors.white)),
                    SizedBox(width: 8),
                    CircleAvatar(backgroundColor: AppTheme.surfaceContainer, child: Icon(Icons.grid_on, size: 18, color: AppTheme.primary)),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUQxiMMMFEwzqSAdMP0Uk4x8yhSfoW2s2f-fSPu9JG7MYlbLYMVDVSqZzjYAwQZyCQMlyOccVuQKfq8LFJiG5iR7yaplm0cu7Yj5ZF_zW-2AXKYl2vpMK2nr4kV0O1b0D6KrPOxK80cBjS2ngZFrYcB240jIE2h9tfAnhWF12WO3XBxLUu2Q79p0wK0HD7pmCaty6zjIt12vWxLBWrVULxWBHyvUdHgxVvdKyx3xUM7w_RRygROBWq',
                      fit: BoxFit.cover,
                    ),
                    Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceContainerHigh.withOpacity(0.8),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text('AI SILHOUETTE LOCK', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AnalyzingScreen()),
                    );
                  },
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryContainer,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: AppTheme.primaryContainer.withOpacity(0.5), blurRadius: 20)
                      ],
                    ),
                    child: const Icon(Icons.camera_alt, color: Colors.white, size: 32),
                  ),
                ),
                const SizedBox(height: 12),
                TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AnalyzingScreen()),
                    );
                  },
                  icon: const Icon(Icons.photo_library, color: AppTheme.primary),
                  label: Text(I18n.t('choose_gallery'), style: const TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// SCREEN 3: Analizando Moto Con Radar
// ----------------------------------------------------------------------------
class AnalyzingScreen extends StatelessWidget {
  const AnalyzingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Analizando Moto Con Radar'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('ESCANEO INTELIGENTE · PASO 3 DE 3', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 16),
            Text(I18n.t('analyzing_title'), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(I18n.t('analyzing_sub'), textAlign: TextAlign.center, style: const TextStyle(color: AppTheme.textSecondary)),
            const SizedBox(height: 24),
            SizedBox(
              height: 260,
              child: Image.network(
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCX43jqOEtI9RH4fMOgGYfLzS6ojZMIDV63CkHzWg4m5PiJM9OLe9EO_3MTPlSkNlDvQQNEMvB2y0gRxK_0dxebWe7DHm8_jxJJbFeUeetZ9bC0IDslAMtjlvH9geX6VEczN_87U1g4CbYi-5YqoakCvz6iXZXIVq3hvcWr0XtnN9w54U5zi7uMZM-7DeQ4HaDwrkiRXgX-jWNkgABdj07Sw9nCwogLL0MsdEEy-jCuBfQNPb5nlkk_',
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 24),
            _buildCheckItem(I18n.t('step1'), 'Geometría y proporciones válidas', true),
            const SizedBox(height: 8),
            _buildCheckItem(I18n.t('step2'), 'Yamaha Supersport Series', true),
            const SizedBox(height: 8),
            _buildCheckItem(I18n.t('step3'), 'Comparando con base de datos global', false),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryContainer,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(26)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const SpecsScreen()),
                  );
                },
                child: Text(I18n.t('continue_btn'), style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCheckItem(String title, String subtitle, bool isDone) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceContainer.withOpacity(0.8),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          Icon(isDone ? Icons.check_circle : Icons.search, color: isDone ? AppTheme.secondary : AppTheme.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
              ],
            ),
          ),
          if (isDone)
            const Text('LISTO', style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold, fontSize: 11)),
        ],
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// SCREEN 4: Ficha Técnica (Specs Sheet)
// ----------------------------------------------------------------------------
class SpecsScreen extends StatelessWidget {
  const SpecsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Ficha Técnica De Moto'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Container(
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(18),
              ),
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceContainer,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text('92% CERTEZA', style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold, fontSize: 11)),
                      ),
                      const Text('FZ 150 · 2022', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 160,
                    child: Image.network(
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuArVTRYA34i5ai6VIFVwy7QZZ70u7vtHsdyZz1Lvt94dlVB09o_6qE3Nz65If_0OZ5Du1O-pHd1SHMrldNxdM_toGgcCU0fOqlrC1Te2l6oBPrMAbznctID4MDJDwktDRqZIcH3-1OIexl0wBl5fhM0r5ylczWs6FtpFZtVrIYKolWBX5YF8cRiGWu-mAc6Ls8UEMHQD0T0O8zjY5ySmfH4n1DhewzcWp_sFrKQNfNG_GdzmYGLA3ls',
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text('Yamaha FZ 150', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const Text('Uso urbano · 4 Tiempos', style: TextStyle(color: AppTheme.textSecondary, fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildMetric('CILINDRAJE', '149 cc', Icons.speed)),
                const SizedBox(width: 12),
                Expanded(child: _buildMetric('AÑO MODELO', '2022', Icons.calendar_today)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _buildMetric('TARIFA SOAT', '100–200 cc', Icons.verified_user)),
                const SizedBox(width: 12),
                Expanded(child: _buildMetric('PESO EN SECO', '127 kg', Icons.scale)),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryContainer,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(27)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const ExpensesScreen()),
                  );
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(I18n.t('view_annual_expenses'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceContainer,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: AppTheme.primary),
              const SizedBox(width: 6),
              Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// SCREEN 5: Gastos Anuales (Annual Expenses)
// ----------------------------------------------------------------------------
class ExpensesScreen extends StatelessWidget {
  const ExpensesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gastos Anuales'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Bike badge
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLow,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Yamaha FZ 150', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Bogotá D.C. · 2026', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('PROYECCIÓN', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                      Text('12.000 km', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.tertiary)),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Cost items
            _buildCostCard('SOAT', '\$343.300', Icons.verified_user),
            const SizedBox(height: 8),
            _buildCostCard('Tecnomecánica', '\$230.000', Icons.speed),
            const SizedBox(height: 8),
            _buildCostCard('Impuesto Vehicular', '\$127.500', Icons.percent),
            const SizedBox(height: 8),
            _buildCostCard('Gasolina Corriente', '\$5.147.368', Icons.local_gas_station),
            const SizedBox(height: 8),
            _buildCostCard('Mantenimiento', '\$750.000', Icons.build),
            const SizedBox(height: 16),

            // Cockpit Total Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.surfaceContainerLowest,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(color: AppTheme.primaryContainer.withOpacity(0.2), blurRadius: 20)
                ],
              ),
              child: Column(
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('COSTO TOTAL ANUAL', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                          Text('\$6.598.168', style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('CUOTA MENSUAL', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                          Text('\$549.847', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.secondary)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.bookmark_add, size: 18),
                          label: const Text('Guardar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryContainer),
                          onPressed: () {},
                          icon: const Icon(Icons.receipt_long, size: 18, color: Colors.white),
                          label: const Text('Descargar informe', style: TextStyle(color: Colors.white)),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCostCard(String title, String amount, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceContainer.withOpacity(0.75),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.primaryContainer, size: 20),
              const SizedBox(width: 12),
              Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
            ],
          ),
          Text(amount, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
`;
