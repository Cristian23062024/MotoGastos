# MotoGastos

App móvil en Flutter para motociclistas en Colombia. Escaneas tu moto con la cámara, la app identifica el modelo y te muestra su ficha técnica y una estimación de lo que cuesta mantenerla al año: SOAT, revisión tecnomecánica e impuestos.

**Pantallas:** Inicio, Escanear moto, Analizando, Ficha técnica y Gastos.

También tiene modo claro/oscuro y está en español, inglés y japonés.

> Estado: prototipo visual. Los datos (precios, especificaciones) son de ejemplo y el escaneo todavía no usa IA real.

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `lib/` | La app Flutter (código principal en `lib/main.dart`) |
| `test/` | Pruebas de Flutter |
| `android/`, `ios/`, `web/` | Proyectos de cada plataforma generados por Flutter |
| `src/` | Prototipo web original en React + Vite (opcional) |

## Requisitos

- [Git](https://git-scm.com/)
- [Flutter](https://docs.flutter.dev/get-started/install) 3.x (incluye Dart). Comprueba la instalación con `flutter doctor`.
- Google Chrome para ejecutar en web, o un emulador/dispositivo Android o iOS.
- Opcional, solo para el prototipo React: [Node.js](https://nodejs.org/) 20 o superior.

## Montar el proyecto desde GitHub

```bash
# 1. Clonar el repositorio
git clone https://github.com/Cristian23062024/MotoGastos.git
cd MotoGastos

# 2. Descargar las dependencias de Flutter
flutter pub get

# 3. Ver los dispositivos disponibles
flutter devices

# 4. Ejecutar la app
flutter run -d chrome        # en el navegador
flutter run                  # en el emulador o móvil conectado
```

Con la app en marcha, en la terminal: `r` recarga en caliente, `R` reinicia y `q` cierra.

### Pruebas

```bash
flutter test
flutter analyze
```

### Prototipo web en React (opcional)

```bash
npm install
npm run dev     # abre http://localhost:3000
```

## Variables de entorno

No hacen falta para ejecutar la app. El archivo `.env.example` sirve de plantilla por si más adelante se integra la API de Gemini: cópialo como `.env` y pon tu clave. El `.env` está en `.gitignore` y nunca debe subirse al repositorio.
