import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  onlineStatus: string;
  connected: string;
  helloRider: string;
  sport: string;
  urban: string;
  fourStroke: string;
  performance: string;
  autonomy: string;
  estimationAndProcedures: string;
  estimationDescription: string;
  avgAnnualCostEstimated: string;
  scanMyBike: string;
  chooseFromGallery: string;
  
  // Scanner screen
  scanBikeHeader: string;
  hudAiOptic: string;
  toggleFlash: string;
  toggleGrid: string;
  frameThreeQuarters: string;
  aiSilhouetteLock: string;
  optimalDistance: string;
  fpsLabel: string;
  detectingGeometryPlate: string;
  goodLightingTip: string;
  compatibleBikeTypes: string;
  capturePhoto: string;
  bikeIdentified: string;
  match: string;
  
  // Analyzing screen
  smartScanStep: string;
  analyzingYourBike: string;
  analyzingSubtitle: string;
  confidence: string;
  aiVision: string;
  targetLocked: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  ready: string;
  takesFewSeconds: string;
  continueBtn: string;
  
  // Specs screen
  aiDiagnostic: string;
  techSpecs: string;
  certainty: string;
  displacement: string;
  modelYear: string;
  soatTariff: string;
  dryWeight: string;
  avgConsumption: string;
  urbanCycle: string;
  optimalA: string;
  viewEstimatedAnnualExpenses: string;
  
  // Expenses screen
  annualExpenses: string;
  editValues: string;
  calcInfo: string;
  projection: string;
  soatTitle: string;
  technomechanical: string;
  vehicleTax: string;
  regularGasoline: string;
  maintenance: string;
  legalNote: string;
  totalAnnualCost: string;
  monthlyQuota: string;
  saveToGarage: string;
  saved: string;
  downloadReport: string;
  generatingPdf: string;
  reportReady: string;
  
  // Modal / Customizer
  customizeValuesTitle: string;
  projectionAnnualKm: string;
  gasPriceGallon: string;
  annualMaintenance: string;
  cityLabel: string;
  applyChanges: string;
  cancel: string;
  resetDefault: string;
  
  // Download Modal / Report
  officialReportTitle: string;
  generatedDate: string;
  vehicle: string;
  annualEstimate: string;
  monthlyEstimate: string;
  printOrSave: string;
  close: string;
  
  // Flutter source code viewer
  viewFlutterCode: string;
  flutterCodeModalTitle: string;
  flutterCodeSubtitle: string;
  copyFlutterCode: string;
  copiedFlutterCode: string;
  devicePreview: string;
  toggleTheme: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    appName: 'MotoGastos',
    tagline: 'Gastos Anuales',
    onlineStatus: 'Estado: En línea',
    connected: 'Conectado',
    helloRider: '¡Hola, Rider!',
    sport: 'Deportiva',
    urban: 'Uso urbano',
    fourStroke: '4 Tiempos',
    performance: 'Rendimiento',
    autonomy: 'Autonomía',
    estimationAndProcedures: 'Estimación y Trámites',
    estimationDescription: 'SOAT, tecno e impuestos sincronizados para Colombia.',
    avgAnnualCostEstimated: 'Costo Promedio Anual Estimado',
    scanMyBike: 'Escanear mi moto',
    chooseFromGallery: 'Elegir foto de la galería',
    
    // Scanner
    scanBikeHeader: 'Escanear Moto',
    hudAiOptic: 'HUD AI OPTIC 2.4',
    toggleFlash: 'Alternar Linterna',
    toggleGrid: 'Modo Retícula HUD',
    frameThreeQuarters: 'Encuadra la moto de tres cuartos',
    aiSilhouetteLock: 'AI SILHOUETTE LOCK',
    optimalDistance: 'DISTANCIA ÓPTIMA',
    fpsLabel: '60 FPS',
    detectingGeometryPlate: 'Detectando geometría y placa...',
    goodLightingTip: 'Buena luz y la placa visible ayudan a identificar mejor la marca, el modelo y el cilindraje.',
    compatibleBikeTypes: 'Compatible con deportivas, naked, scooters y touring.',
    capturePhoto: 'Capturar fotografía de la moto',
    bikeIdentified: 'Moto Identificada',
    match: 'Match',
    
    // Analyzing
    smartScanStep: 'Escaneo Inteligente · Paso 3 de 3',
    analyzingYourBike: 'Analizando tu moto',
    analyzingSubtitle: 'Nuestra IA está identificando las características clave del vehículo',
    confidence: 'CONFIDENCE',
    aiVision: 'AI VISION SCANNING',
    targetLocked: 'TARGET LOCKED',
    step1Title: 'Forma y encuadre detectados',
    step1Subtitle: 'Geometría y proporciones válidas',
    step2Title: 'Marca y línea identificadas',
    step2Subtitle: 'Yamaha Supersport Series',
    step3Title: 'Estimando cilindraje y año...',
    step3Subtitle: 'Comparando con base de datos global',
    ready: 'Listo',
    takesFewSeconds: 'Esto toma solo unos segundos.',
    continueBtn: 'Continuar',
    
    // Specs
    aiDiagnostic: 'Diagnóstico IA',
    techSpecs: 'Ficha Técnica',
    certainty: 'Certeza',
    displacement: 'Cilindraje',
    modelYear: 'Año Modelo',
    soatTariff: 'Tarifa SOAT',
    dryWeight: 'Peso en Seco',
    avgConsumption: 'Consumo Promedio',
    urbanCycle: 'Ciclo urbano: 42 km/l',
    optimalA: 'A+ Óptimo',
    viewEstimatedAnnualExpenses: 'Ver gastos anuales estimados',
    
    // Expenses
    annualExpenses: 'Gastos Anuales',
    editValues: 'Editar valores',
    calcInfo: 'Información de cálculo',
    projection: 'Proyección',
    soatTitle: 'SOAT',
    technomechanical: 'Tecnomecánica',
    vehicleTax: 'Impuesto Vehicular',
    regularGasoline: 'Gasolina Corriente',
    maintenance: 'Mantenimiento',
    legalNote: 'Tarifas calculadas con proyección legal 2026 para Bogotá D.C. Ajustadas al IPC/UVT estimado y precio promedio nacional de gasolina corriente.',
    totalAnnualCost: 'Costo Total Anual',
    monthlyQuota: 'Cuota Mensual',
    saveToGarage: 'Guardar',
    saved: 'Guardado',
    downloadReport: 'Descargar informe',
    generatingPdf: 'Generando PDF...',
    reportReady: '¡Reporte Listo!',
    
    // Customize
    customizeValuesTitle: 'Ajustar Parámetros de Gasto',
    projectionAnnualKm: 'Kilómetros proyectados al año',
    gasPriceGallon: 'Precio galón gasolina (COP)',
    annualMaintenance: 'Presupuesto anual mantenimiento (COP)',
    cityLabel: 'Ciudad / Región',
    applyChanges: 'Aplicar Cambios',
    cancel: 'Cancelar',
    resetDefault: 'Restablecer',
    
    // Official Report
    officialReportTitle: 'Informe Oficial de Gastos - MotoGastos',
    generatedDate: 'Fecha de Emisión',
    vehicle: 'Vehículo',
    annualEstimate: 'Estimación Anual Total',
    monthlyEstimate: 'Cuota Mensual Promedio',
    printOrSave: 'Imprimir / Descargar PDF',
    close: 'Cerrar',
    
    // Flutter
    viewFlutterCode: 'Ver Código Dart / Flutter',
    flutterCodeModalTitle: 'Código Fuente Flutter (Dart)',
    flutterCodeSubtitle: 'Aplicación nativa completa con widgets Material 3, soporte dark mode y arquitectura responsiva',
    copyFlutterCode: 'Copiar Código Dart',
    copiedFlutterCode: '¡Código Copiado al Portapapeles!',
    devicePreview: 'Simulador de Dispositivo',
    toggleTheme: 'Cambiar Tema',
  },
  
  en: {
    appName: 'MotoGastos',
    tagline: 'Annual Expenses',
    onlineStatus: 'Status: Online',
    connected: 'Connected',
    helloRider: 'Hello, Rider!',
    sport: 'Sport',
    urban: 'Urban use',
    fourStroke: '4-Stroke',
    performance: 'Fuel Economy',
    autonomy: 'Range',
    estimationAndProcedures: 'Estimations & Procedures',
    estimationDescription: 'SOAT, inspections and vehicle taxes synced for Colombia.',
    avgAnnualCostEstimated: 'Estimated Avg. Annual Cost',
    scanMyBike: 'Scan my motorcycle',
    chooseFromGallery: 'Choose from gallery',
    
    // Scanner
    scanBikeHeader: 'Scan Motorcycle',
    hudAiOptic: 'HUD AI OPTIC 2.4',
    toggleFlash: 'Toggle Flashlight',
    toggleGrid: 'HUD Reticle Mode',
    frameThreeQuarters: 'Frame bike at three-quarters view',
    aiSilhouetteLock: 'AI SILHOUETTE LOCK',
    optimalDistance: 'OPTIMAL DISTANCE',
    fpsLabel: '60 FPS',
    detectingGeometryPlate: 'Detecting geometry and license plate...',
    goodLightingTip: 'Good lighting and visible plate help identify make, model and engine displacement.',
    compatibleBikeTypes: 'Compatible with sport, naked, scooters and touring bikes.',
    capturePhoto: 'Capture motorcycle photo',
    bikeIdentified: 'Bike Identified',
    match: 'Match',
    
    // Analyzing
    smartScanStep: 'Smart Scan · Step 3 of 3',
    analyzingYourBike: 'Analyzing your bike',
    analyzingSubtitle: 'Our AI is identifying key characteristics of your vehicle',
    confidence: 'CONFIDENCE',
    aiVision: 'AI VISION SCANNING',
    targetLocked: 'TARGET LOCKED',
    step1Title: 'Shape and framing detected',
    step1Subtitle: 'Valid geometry and proportions',
    step2Title: 'Brand and lineage identified',
    step2Subtitle: 'Yamaha Supersport Series',
    step3Title: 'Estimating displacement and year...',
    step3Subtitle: 'Comparing against global database',
    ready: 'Ready',
    takesFewSeconds: 'This takes only a few seconds.',
    continueBtn: 'Continue',
    
    // Specs
    aiDiagnostic: 'AI Diagnostic',
    techSpecs: 'Spec Sheet',
    certainty: 'Certainty',
    displacement: 'Displacement',
    modelYear: 'Model Year',
    soatTariff: 'SOAT Tariff',
    dryWeight: 'Dry Weight',
    avgConsumption: 'Avg. Consumption',
    urbanCycle: 'Urban cycle: 42 km/l',
    optimalA: 'A+ Optimal',
    viewEstimatedAnnualExpenses: 'View estimated annual expenses',
    
    // Expenses
    annualExpenses: 'Annual Expenses',
    editValues: 'Edit values',
    calcInfo: 'Calculation info',
    projection: 'Projection',
    soatTitle: 'SOAT Insurance',
    technomechanical: 'Technomechanical Test',
    vehicleTax: 'Vehicle Tax',
    regularGasoline: 'Regular Gasoline',
    maintenance: 'Maintenance',
    legalNote: 'Rates calculated with 2026 legal projection for Bogotá D.C. Adjusted for estimated CPI/UVT and national average gasoline price.',
    totalAnnualCost: 'Total Annual Cost',
    monthlyQuota: 'Monthly Cost',
    saveToGarage: 'Save',
    saved: 'Saved',
    downloadReport: 'Download report',
    generatingPdf: 'Generating PDF...',
    reportReady: 'Report Ready!',
    
    // Customize
    customizeValuesTitle: 'Adjust Expense Parameters',
    projectionAnnualKm: 'Projected Kilometers per Year',
    gasPriceGallon: 'Gasoline price per gallon (COP)',
    annualMaintenance: 'Annual maintenance budget (COP)',
    cityLabel: 'City / Region',
    applyChanges: 'Apply Changes',
    cancel: 'Cancel',
    resetDefault: 'Reset',
    
    // Official Report
    officialReportTitle: 'Official Expense Report - MotoGastos',
    generatedDate: 'Issue Date',
    vehicle: 'Vehicle',
    annualEstimate: 'Total Annual Estimate',
    monthlyEstimate: 'Average Monthly Cost',
    printOrSave: 'Print / Save PDF',
    close: 'Close',
    
    // Flutter
    viewFlutterCode: 'View Dart / Flutter Code',
    flutterCodeModalTitle: 'Flutter (Dart) Source Code',
    flutterCodeSubtitle: 'Full production-ready native app with Material 3 widgets, dark mode support and responsive architecture',
    copyFlutterCode: 'Copy Dart Code',
    copiedFlutterCode: 'Code Copied to Clipboard!',
    devicePreview: 'Device Simulator',
    toggleTheme: 'Toggle Theme',
  },
  
  ja: {
    appName: 'MotoGastos',
    tagline: '年間維持費',
    onlineStatus: 'ステータス: オンライン',
    connected: '接続中',
    helloRider: 'こんにちは、ライダー！',
    sport: 'スポーツ',
    urban: '市街地走行',
    fourStroke: '4ストローク',
    performance: '燃費性能',
    autonomy: '航続距離',
    estimationAndProcedures: '費用試算・公的手続き',
    estimationDescription: 'コロンビアの自賠責(SOAT)・車検・税金とリアルタイム同期。',
    avgAnnualCostEstimated: '推定年間平均維持費',
    scanMyBike: 'バイクをスキャン',
    chooseFromGallery: 'ギャラリーから写真を選択',
    
    // Scanner
    scanBikeHeader: 'バイクをスキャン',
    hudAiOptic: 'HUD AI OPTIC 2.4',
    toggleFlash: 'フラッシュ切替',
    toggleGrid: 'HUDレティクルモード',
    frameThreeQuarters: '斜め前方3/4から撮影してください',
    aiSilhouetteLock: 'AI シルエットロック',
    optimalDistance: '最適撮影距離',
    fpsLabel: '60 FPS',
    detectingGeometryPlate: '幾何構造とナンバープレートを解析中...',
    goodLightingTip: '明るい照明と鮮明な車体アングルにより、メーカー・排気量の識別精度が向上します。',
    compatibleBikeTypes: 'スポーツ、ネイキッド、スクーター、ツアラーに対応。',
    capturePhoto: 'バイクを撮影',
    bikeIdentified: 'バイクを特定しました',
    match: '一致率',
    
    // Analyzing
    smartScanStep: 'AIスマートスキャン · ステップ 3 / 3',
    analyzingYourBike: 'バイクを精密解析中',
    analyzingSubtitle: '最新AIが車体の主要スペックと仕様を特定しています',
    confidence: '信頼度',
    aiVision: 'AI VISION スキャン中',
    targetLocked: 'ターゲット補足完了',
    step1Title: '形状・構図の検出',
    step1Subtitle: '車体ジオメトリとプロポーション正常',
    step2Title: 'メーカー・車種ラインの特定',
    step2Subtitle: 'Yamaha Supersport シリーズ',
    step3Title: '排気量および年式の推定中...',
    step3Subtitle: 'グローバル車両データベースと照合中',
    ready: '完了',
    takesFewSeconds: '解析には数秒かかります。',
    continueBtn: '続ける',
    
    // Specs
    aiDiagnostic: 'AI診断結果',
    techSpecs: '仕様スペックシート',
    certainty: '判定精度',
    displacement: '総排気量',
    modelYear: '年式モデル',
    soatTariff: '自賠責(SOAT)区分',
    dryWeight: '乾燥重量',
    avgConsumption: '平均燃費',
    urbanCycle: '市街地モード: 42 km/l',
    optimalA: 'A+ 最適',
    viewEstimatedAnnualExpenses: '推定年間維持費を確認',
    
    // Expenses
    annualExpenses: '年間維持費',
    editValues: '数値を編集',
    calcInfo: '計算基準情報',
    projection: '年間走行予測',
    soatTitle: 'SOAT (強制保険)',
    technomechanical: '定期車検・点検',
    vehicleTax: '車両税',
    regularGasoline: 'レギュラーガソリン',
    maintenance: '定期消耗品・整備費',
    legalNote: '2026年ボゴタ首都特別区の法定基準に基づく試算。インフレ率(IPC/UVT)および全国平均ガソリン価格を反映。',
    totalAnnualCost: '年間合計維持費',
    monthlyQuota: '月額目安',
    saveToGarage: '保存',
    saved: '保存完了',
    downloadReport: 'レポートをダウンロード',
    generatingPdf: 'PDF作成中...',
    reportReady: 'レポート出力完了！',
    
    // Customize
    customizeValuesTitle: '維持費パラメーターの調整',
    projectionAnnualKm: '年間想定走行距離 (km)',
    gasPriceGallon: 'ガソリン1ガロン価格 (COP)',
    annualMaintenance: '年間整備予算 (COP)',
    cityLabel: '都市 / 地域',
    applyChanges: '設定を適用',
    cancel: 'キャンセル',
    resetDefault: '初期値に戻す',
    
    // Official Report
    officialReportTitle: '公式維持費レポート - MotoGastos',
    generatedDate: '発行日',
    vehicle: '対象車両',
    annualEstimate: '年間推定総額',
    monthlyEstimate: '月平均推定維持費',
    printOrSave: '印刷 / PDF保存',
    close: '閉じる',
    
    // Flutter
    viewFlutterCode: 'Dart / Flutterコードを見る',
    flutterCodeModalTitle: 'Flutter (Dart) ソースコード',
    flutterCodeSubtitle: 'Material 3、ダークモード、レスポンシブ設計完備のネイティブFlutterコード',
    copyFlutterCode: 'Dartコードをコピー',
    copiedFlutterCode: 'クリップボードにコピーしました！',
    devicePreview: '端末シミュレーター',
    toggleTheme: 'テーマ切替',
  }
};
