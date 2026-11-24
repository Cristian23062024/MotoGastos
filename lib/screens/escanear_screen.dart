import 'package:camera/camera.dart';
import 'package:image_picker/image_picker.dart';
import 'package:material_ui/material_ui.dart';

import '../scan.dart';
import '../theme.dart';
import '../widgets.dart';

/// Visor de cámara para fotografiar la moto completa (o elegir una foto de la galería).
class EscanearScreen extends StatefulWidget {
  const EscanearScreen({super.key, required this.onScanned});

  final ValueChanged<Scan> onScanned;

  @override
  State<EscanearScreen> createState() => _EscanearScreenState();
}

class _EscanearScreenState extends State<EscanearScreen> with WidgetsBindingObserver {
  CameraController? _cam;
  String? _camError;
  bool _flash = false;
  bool _analyzing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initCamera();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cam?.dispose();
    super.dispose();
  }

  // La cámara se libera al salir de la app y se vuelve a abrir al regresar (requisito del plugin).
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.inactive) {
      _cam?.dispose();
      setState(() => _cam = null);
    } else if (state == AppLifecycleState.resumed && _cam == null) {
      _initCamera();
    }
  }

  Future<void> _initCamera() async {
    try {
      final cams = await availableCameras();
      if (cams.isEmpty) throw CameraException('NoCamera', 'Este dispositivo no tiene cámara.');
      final back = cams.firstWhere((c) => c.lensDirection == CameraLensDirection.back, orElse: () => cams.first);
      // 720p basta para identificar la moto y mantiene la petición a la IA pequeña.
      final cam = CameraController(back, ResolutionPreset.high,
          enableAudio: false, imageFormatGroup: ImageFormatGroup.jpeg);
      await cam.initialize();
      await cam.setFlashMode(FlashMode.off);
      if (!mounted) return await cam.dispose();
      setState(() {
        _cam = cam;
        _camError = null;
        _flash = false;
      });
    } on CameraException catch (e) {
      if (mounted) {
        setState(() => _camError = e.code.contains('AccessDenied')
            ? 'Permiso de cámara denegado. Actívalo en Ajustes o usa la galería.'
            : 'No se pudo abrir la cámara: ${e.description ?? e.code}');
      }
    } catch (e) {
      if (mounted) setState(() => _camError = 'No se pudo abrir la cámara. Usa la galería.');
    }
  }

  Future<void> _analyze(XFile file) async {
    setState(() => _analyzing = true);
    try {
      final scan = await analyzeAndSave(file);
      if (mounted) widget.onScanned(scan);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    } finally {
      if (mounted) setState(() => _analyzing = false);
    }
  }

  Future<void> _shoot() async {
    final cam = _cam;
    if (cam == null || _analyzing || cam.value.isTakingPicture) return;
    try {
      await _analyze(await cam.takePicture());
    } on CameraException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('No se tomó la foto: ${e.code}')));
    }
  }

  Future<void> _gallery() async {
    final file = await ImagePicker().pickImage(source: ImageSource.gallery, maxWidth: 1280, imageQuality: 80);
    if (file != null) await _analyze(file);
  }

  Future<void> _toggleFlash() async {
    final cam = _cam;
    if (cam == null) return;
    await cam.setFlashMode(_flash ? FlashMode.off : FlashMode.always);
    setState(() => _flash = !_flash);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
      child: Column(children: [
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(fit: StackFit.expand, children: [
              ColoredBox(color: AppColors.surfaceLow, child: _preview()),
              const _ViewfinderOverlay(),
              Positioned(
                top: 16,
                left: 16,
                child: StatusPill(_cam != null ? 'Visor activo' : 'Visor inactivo',
                    icon: Icons.circle, color: _cam != null ? AppColors.lime : AppColors.muted),
              ),
              const Positioned(
                top: 12,
                right: 12,
                child: StatusPill('Moto completa', icon: Icons.two_wheeler, color: AppColors.orange, solid: true),
              ),
              if (_analyzing)
                ColoredBox(
                  color: const Color(0xBF0D0F12),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    const CircularProgressIndicator(color: AppColors.lime),
                    const SizedBox(height: 16),
                    const MonoLabel('Analizando con IA…', color: AppColors.lime),
                    const SizedBox(height: 4),
                    Text('Identificando modelo y costos', style: TextStyle(color: AppColors.onSurface.withValues(alpha: 0.7))),
                  ]),
                ),
            ]),
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.hairline),
          ),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            _SideButton(icon: Icons.photo_library_outlined, label: 'Galería', onTap: _analyzing ? null : _gallery),
            _ShutterButton(onTap: _cam == null || _analyzing ? null : _shoot),
            _SideButton(
              icon: _flash ? Icons.flash_on : Icons.flash_off,
              label: 'Flash',
              onTap: _cam == null || _analyzing ? null : _toggleFlash,
              active: _flash,
            ),
          ]),
        ),
      ]),
    );
  }

  Widget _preview() {
    final cam = _cam;
    if (cam == null || !cam.value.isInitialized) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: _camError == null
              ? const CircularProgressIndicator()
              : Text(_camError!, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.muted)),
        ),
      );
    }
    final size = cam.value.previewSize!; // en horizontal: se invierte para el teléfono en vertical
    return FittedBox(
      fit: BoxFit.cover,
      clipBehavior: Clip.hardEdge,
      child: SizedBox(width: size.height, height: size.width, child: CameraPreview(cam)),
    );
  }
}

/// Marco de encuadre, indicaciones y velo inferior sobre la imagen de la cámara.
class _ViewfinderOverlay extends StatelessWidget {
  const _ViewfinderOverlay();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Stack(children: [
        const DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0x66111317), Color(0x00111317), Color(0x99111317)],
            ),
          ),
          child: SizedBox.expand(),
        ),
        const Positioned.fill(
          left: 16,
          right: 16,
          top: 70,
          bottom: 60,
          child: CustomPaint(painter: _BracketsPainter()),
        ),
        Center(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            const Row(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.crop_free, size: 14, color: AppColors.primary),
              SizedBox(width: 6),
              MonoLabel('Encuadre completo', color: AppColors.primary, size: 11),
            ]),
            const SizedBox(height: 12),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 32),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(color: const Color(0xCC1E2023), borderRadius: BorderRadius.circular(999)),
              child: const Text('Enfoca bien y con buena luz que se mire toda la moto',
                  textAlign: TextAlign.center, style: TextStyle(fontSize: 13)),
            ),
          ]),
        ),
        const Positioned(
          left: 0,
          right: 0,
          bottom: 24,
          child: Center(child: MonoLabel('Enfoque automático listo', color: AppColors.onSurface, size: 11)),
        ),
      ]),
    );
  }
}

/// Esquinas del marco en naranja de carreras.
class _BracketsPainter extends CustomPainter {
  const _BracketsPainter();

  @override
  void paint(Canvas canvas, Size size) {
    const len = 28.0;
    final p = Paint()
      ..color = AppColors.orange
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square;
    final w = size.width, h = size.height;
    for (final (x, y, dx, dy) in [(0.0, 0.0, 1, 1), (w, 0.0, -1, 1), (0.0, h, 1, -1), (w, h, -1, -1)]) {
      canvas.drawLine(Offset(x, y), Offset(x + len * dx, y), p);
      canvas.drawLine(Offset(x, y), Offset(x, y + len * dy), p);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _ShutterButton extends StatelessWidget {
  const _ShutterButton({required this.onTap});

  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Semantics(
        button: true,
        label: 'Tomar foto',
        child: GestureDetector(
          onTap: onTap,
          child: Container(
            width: 84,
            height: 84,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(shape: BoxShape.circle, color: AppColors.orange.withValues(alpha: 0.2)),
            child: DecoratedBox(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: onTap == null ? AppColors.surfaceHighest : AppColors.orange,
              ),
              child: const Icon(Icons.center_focus_strong, color: Colors.white, size: 30),
            ),
          ),
        ),
      );
}

class _SideButton extends StatelessWidget {
  const _SideButton({required this.icon, required this.label, required this.onTap, this.active = false});

  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final bool active;

  @override
  Widget build(BuildContext context) => Material(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: SizedBox(
            width: 64,
            height: 64,
            child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
              Icon(icon, color: active ? AppColors.lime : AppColors.onSurface),
              const SizedBox(height: 4),
              MonoLabel(label, color: AppColors.onSurface, size: 10),
            ]),
          ),
        ),
      );
}
