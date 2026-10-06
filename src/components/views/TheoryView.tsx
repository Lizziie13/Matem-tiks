import React, { useState } from 'react';
import {
  BookOpen,
  Boxes,
  Calculator,
  ChevronRight,
  Info,
  Layers,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { TOPICS } from '../../utils/mathQuestions';
import { formatMathForDisplay } from '../../utils/mathEngine';

export const TheoryView: React.FC = () => {
  // Geometric visualization sliders
  const [valA, setValA] = useState(4);
  const [valB, setValB] = useState(2);

  // Quick Solver input
  const [solverInput, setSolverInput] = useState('(x + 4)^2');
  const [solverExplanation, setSolverExplanation] = useState<{
    rule: string;
    result: string;
    steps: string[];
  } | null>({
    rule: 'Binomio al Cuadrado: (a + b)² = a² + 2ab + b²',
    result: 'x² + 8x + 16',
    steps: [
      '1. Cuadrado del primer término: (x)² = x²',
      '2. Doble producto: 2 · (x) · (4) = 8x',
      '3. Cuadrado del segundo término: (4)² = 16',
      'Resultado final: x² + 8x + 16',
    ],
  });

  const handleSolve = () => {
    const raw = solverInput.trim().toLowerCase().replace(/\s+/g, '');

    // Check binomial squared: (x+k)^2 or (x-k)^2
    const binSqMatch = /^\(([a-z])([\+\-])(\d+)\)\^?2$/i.exec(raw);
    if (binSqMatch) {
      const v = binSqMatch[1];
      const sign = binSqMatch[2];
      const n = parseInt(binSqMatch[3], 10);
      const isMinus = sign === '-';
      const mid = 2 * n;
      const last = n * n;
      const res = `${v}² ${isMinus ? '-' : '+'} ${mid}${v} + ${last}`;

      setSolverExplanation({
        rule: `Binomio al Cuadrado: (${v} ${sign} ${n})²`,
        result: res,
        steps: [
          `1. Cuadrado del primero: (${v})² = ${v}²`,
          `2. Doble producto: 2 · (${v}) · (${isMinus ? '-' : ''}${n}) = ${isMinus ? '-' : '+'}${mid}${v}`,
          `3. Cuadrado del segundo: (${isMinus ? '-' : ''}${n})² = ${last}`,
          `Resultado: ${res}`,
        ],
      });
      return;
    }

    // Check difference of squares: x^2 - k
    const diffSqMatch = /^([a-z])\^?2-(\d+)$/i.exec(raw);
    if (diffSqMatch) {
      const v = diffSqMatch[1];
      const k = parseInt(diffSqMatch[2], 10);
      const root = Math.sqrt(k);
      if (Number.isInteger(root)) {
        setSolverExplanation({
          rule: `Diferencia de Cuadrados: a² - b² = (a + b)(a - b)`,
          result: `(${v} + ${root})(${v} - ${root})`,
          steps: [
            `1. Raíz cuadrada del primer término: √(${v}²) = ${v}`,
            `2. Raíz cuadrada del segundo término: √(${k}) = ${root}`,
            `3. Formamos la suma por la diferencia: (${v} + ${root})(${v} - ${root})`,
          ],
        });
        return;
      }
    }

    // Default friendly breakdown
    setSolverExplanation({
      rule: 'Análisis de Expresión Algebraica',
      result: formatMathForDisplay(solverInput),
      steps: [
        '1. Identifica si es un producto notable (multiplicación de binomios) o una factorización (suma de términos).',
        '2. Verifica si hay factores comunes numéricos o algebraicos en cada término.',
        '3. Aplica la fórmula correspondiente respetando rigurosamente la ley de signos.',
      ],
    });
  };

  const totalSide = valA + valB;
  const areaA2 = valA * valA;
  const areaAB = valA * valB;
  const areaB2 = valB * valB;
  const totalArea = totalSide * totalSide;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          Biblioteca de Conceptos & Demostraciones
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
          Fórmulas, Tips y Demostración Geométrica
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprende visualmente el origen de cada fórmula para no tener que memorizarla sin sentido.
        </p>
      </div>

      {/* 1. Interactive Geometric Proof */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">
            Demostración Geométrica Interactiva de (a + b)²
          </h2>
        </div>

        <p className="text-xs text-slate-300">
          ¿Por qué aparece el «doble producto» 2ab? Observa las 4 áreas geométricas que componen el
          cuadrado total de lado (a + b):
        </p>

        {/* Sliders for a and b */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div>
            <div className="flex justify-between text-xs font-bold text-indigo-300 mb-1">
              <span>Lado a: {valA}</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              value={valA}
              onChange={(e) => setValA(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-amber-300 mb-1">
              <span>Lado b: {valB}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={valB}
              onChange={(e) => setValB(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Dynamic SVG Geometric Area Proof */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
          <div className="relative">
            <svg
              width="260"
              height="260"
              viewBox="0 0 260 260"
              className="rounded-2xl border border-slate-700 shadow-lg bg-slate-950"
            >
              {/* Scale factors */}
              {(() => {
                const svgSize = 240;
                const scale = svgSize / (valA + valB);
                const aPx = valA * scale;
                const bPx = valB * scale;

                return (
                  <g transform="translate(10, 10)">
                    {/* Area a^2 (blue) */}
                    <rect
                      x="0"
                      y="0"
                      width={aPx}
                      height={aPx}
                      fill="#4f46e5"
                      fillOpacity="0.4"
                      stroke="#818cf8"
                      strokeWidth="2"
                    />
                    <text
                      x={aPx / 2}
                      y={aPx / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      a² ({areaA2})
                    </text>

                    {/* Area ab top-right (cyan) */}
                    <rect
                      x={aPx}
                      y="0"
                      width={bPx}
                      height={aPx}
                      fill="#0284c7"
                      fillOpacity="0.4"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x={aPx + bPx / 2}
                      y={aPx / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      ab ({areaAB})
                    </text>

                    {/* Area ab bottom-left (cyan) */}
                    <rect
                      x="0"
                      y={aPx}
                      width={aPx}
                      height={bPx}
                      fill="#0284c7"
                      fillOpacity="0.4"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <text
                      x={aPx / 2}
                      y={aPx + bPx / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      ab ({areaAB})
                    </text>

                    {/* Area b^2 bottom-right (amber) */}
                    <rect
                      x={aPx}
                      y={aPx}
                      width={bPx}
                      height={bPx}
                      fill="#d97706"
                      fillOpacity="0.4"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x={aPx + bPx / 2}
                      y={aPx + bPx / 2 + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      b² ({areaB2})
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Algebraic Formula Breakdown of the Area */}
          <div className="space-y-3 font-mono text-xs max-w-sm">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[11px] font-sans">
                Área Total = (a + b)²:
              </span>
              <span className="text-emerald-400 font-bold text-base">
                ({valA} + {valB})² = {totalSide}² = {totalArea}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-slate-400 block text-[11px] font-sans">
                Suma de las 4 sub-áreas:
              </span>
              <div className="text-slate-200 mt-1 space-y-1">
                <div>Cuadrado mayor: a² = {areaA2}</div>
                <div>Rectángulo 1: ab = {areaAB}</div>
                <div>Rectángulo 2: ab = {areaAB}</div>
                <div>Cuadrado menor: b² = {areaB2}</div>
                <div className="pt-1.5 border-t border-slate-700 text-indigo-300 font-bold">
                  Total: {areaA2} + 2({areaAB}) + {areaB2} = {totalArea}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Solver / Explainer */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">
            Solucionador y Explicador Paso a Paso
          </h2>
        </div>

        <p className="text-xs text-slate-300">
          Escribe una expresión (ej: <span className="font-mono text-indigo-300">(x + 5)^2</span> o{' '}
          <span className="font-mono text-indigo-300">x^2 - 49</span>) para ver cómo resolverla paso a
          paso:
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={solverInput}
            onChange={(e) => setSolverInput(e.target.value)}
            placeholder="Ej: (x + 3)^2"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSolve}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            Explicar
          </button>
        </div>

        {solverExplanation && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2 animate-in fade-in">
            <span className="font-bold text-purple-300 block">{solverExplanation.rule}</span>
            <div className="space-y-1.5 pl-2 border-l-2 border-purple-500/50">
              {solverExplanation.steps.map((st, i) => (
                <p key={i} className="text-slate-200 font-mono">
                  {st}
                </p>
              ))}
            </div>
            <div className="pt-2 text-emerald-400 font-bold font-mono text-sm">
              Solución: {solverExplanation.result}
            </div>
          </div>
        )}
      </div>

      {/* 3. Formulas Cheat Sheet */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Formulario Maestro & Tips Nemotécnicos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{topic.title}</span>
                <span className="text-[10px] text-indigo-400 uppercase font-mono font-bold">
                  Nivel {topic.level}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 font-mono text-xs font-bold text-indigo-300 border border-slate-800">
                {topic.formula}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
