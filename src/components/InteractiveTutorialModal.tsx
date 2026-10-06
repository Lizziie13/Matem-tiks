import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Mic,
  Keyboard,
  Heart,
  Award,
  Swords,
  BrainCircuit,
  GraduationCap,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileCustomizer?: () => void;
}

interface TutorialStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  highlightText: string;
  features: string[];
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenProfileCustomizer,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps: TutorialStep[] = [
    {
      title: '¡Bienvenido a Algebrik!',
      subtitle: 'Tu Plataforma Gamificada de Álgebra',
      description:
        'Aprende, practica y domina Productos Notables y Factorización con retroalimentación inmediata, recompensas y duelos en vivo.',
      icon: <GraduationCap className="w-8 h-8 text-indigo-400" />,
      badge: 'Paso 1 de 6',
      color: 'from-indigo-600 to-purple-600',
      highlightText: 'Matemáticas interactivas en iPhone, Android y Ordenador',
      features: [
        'Productos notables: binomio al cuadrado, conjugados, cubos.',
        'Factorización: factor común, trinomios simples y compuestos.',
        'Diseño responsivo optimizado para pantallas táctiles y móviles.',
      ],
    },
    {
      title: 'Entrada por Voz y Teclado Táctil',
      subtitle: 'Responde de forma natural y sin complicaciones',
      description:
        'Algebrik te permite validar resultados al instante mediante dictado por voz en español o usando el teclado virtual algebraico.',
      icon: <Mic className="w-8 h-8 text-rose-400" />,
      badge: 'Paso 2 de 6',
      color: 'from-rose-600 to-pink-600',
      highlightText: 'Habla o escribe tus fórmulas fácilmente',
      features: [
        'Presiona el micrófono y di: «equis al cuadrado más seis equis más nueve».',
        'El sistema traduce tu voz a la fórmula matemática estándar (x² + 6x + 9).',
        'Teclado matemático en pantalla con potencias (²), variables y paréntesis.',
      ],
    },
    {
      title: 'Las 3 Vidas y Notas sobre 10.0',
      subtitle: 'Gamificación y Registro Académico Oficial',
      description:
        'Cuida tus vidas durante la práctica y rinde evaluaciones formales con boletas de calificaciones imprimibles en PDF.',
      icon: <Heart className="w-8 h-8 text-emerald-400 fill-emerald-400/20" />,
      badge: 'Paso 3 de 6',
      color: 'from-emerald-600 to-teal-600',
      highlightText: 'Aprende del error sin frustración',
      features: [
        'Inicias con 3 corazones. Se regeneran cada 15 min o con monedas ganadas.',
        'Exámenes calificados formalmente sobre 10.0 puntos con tiempo cronometrado.',
        'Genera y descarga en PDF tu boleta oficial con validación docente.',
      ],
    },
    {
      title: 'Duelo Rápido en Pantalla Dividida',
      subtitle: 'Compite en tiempo real con tus compañeros',
      description:
        'Dos estudiantes resuelven simultáneamente el mismo problema algebraico para ver quién responde primero.',
      icon: <Swords className="w-8 h-8 text-amber-400" />,
      badge: 'Paso 4 de 6',
      color: 'from-amber-600 to-orange-600',
      highlightText: 'Velocidad y agilidad mental pura',
      features: [
        'Duelo en Línea: Conéctate con un compañero en 2 celulares vía WebSocket.',
        'Misma Pantalla: Juega en el mismo celular o tableta en pantalla dividida.',
        'El primer jugador en acertar se lleva el punto de la ronda.',
      ],
    },
    {
      title: 'Ruta Adaptativa con Inteligencia Artificial',
      subtitle: 'Dificultad que evoluciona contigo en tiempo real',
      description:
        'La IA analiza tu efectividad por tema y ajusta automáticamente la complejidad de los ejercicios según tus necesidades.',
      icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
      badge: 'Paso 5 de 6',
      color: 'from-cyan-600 to-blue-600',
      highlightText: 'Práctica guiada en los temas que más te cuestan',
      features: [
        'Si aciertas, la dificultad sube (Nivel 1 Básico → Nivel 2 → Nivel 3 Desafío).',
        'Si tienes errores, la IA recalibra la dificultad y ofrece pistas paso a paso.',
        'Diagnóstico personalizado y trucos mnemotécnicos generados con IA.',
      ],
    },
    {
      title: 'Personaliza tu Perfil Ciber-Matemático',
      subtitle: 'Configura tu nombre, paralelo y avatar favorito',
      description:
        'Elige entre los 6 avatares estilo ciber-matemático (Gauss, Lovelace, Al-Juarismi, etc.), tu paralelo escolar y tu docente.',
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      badge: 'Paso 6 de 6',
      color: 'from-purple-600 to-indigo-600',
      highlightText: '¡Tu carnet estudiantil digital está listo!',
      features: [
        'Selecciona tu paralelo (ej: 1ro BGU A, 2do BGU B, 10mo EGB).',
        'Equipa tu avatar cyberpunk para duelos y reportes oficiales.',
        'Gana monedas, sube de nivel y desbloquea medallas de constancia.',
      ],
    },
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    sound.playTap();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    sound.playTap();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    sound.playVictory();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    localStorage.setItem('algebrik_tutorial_completed', 'true');
    onClose();
  };

  const handleOpenCustomizer = () => {
    sound.playTap();
    localStorage.setItem('algebrik_tutorial_completed', 'true');
    onClose();
    if (onOpenProfileCustomizer) {
      onOpenProfileCustomizer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-auto overflow-hidden">
        {/* Top Progress Track */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {step.badge}
            </span>
            <span className="text-xs font-mono text-slate-400">Tutorial Guiado</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
            title="Cerrar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 mt-4 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'flex-1 bg-indigo-500'
                  : idx < currentStep
                  ? 'w-6 bg-emerald-500'
                  : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Hero Card */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mx-auto shadow-xl">
            {step.icon}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              {step.subtitle}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">{step.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
              {step.description}
            </p>
          </div>

          {/* Highlight Badge */}
          <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-indigo-200 text-xs font-semibold">
            ✨ {step.highlightText}
          </div>

          {/* Key Bullet Features */}
          <div className="text-left p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            {step.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Saltar tour
            </button>
          )}

          <div className="flex items-center gap-2">
            {currentStep === steps.length - 1 && onOpenProfileCustomizer && (
              <button
                onClick={handleOpenCustomizer}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Personalizar Mi Perfil</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>{currentStep === steps.length - 1 ? '¡Comenzar!' : 'Siguiente'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
