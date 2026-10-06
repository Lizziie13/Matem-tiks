import React from 'react';
import { Delete, CornerDownLeft, Trash2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface MathKeyboardProps {
  onInsert: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  canSubmit?: boolean;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({
  onInsert,
  onBackspace,
  onClear,
  onSubmit,
  canSubmit = true,
}) => {
  const handleKeyClick = (val: string) => {
    sound.playTap();
    onInsert(val);
  };

  const handleBackspace = () => {
    sound.playTap();
    onBackspace();
  };

  const handleClear = () => {
    sound.playTap();
    onClear();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 sm:p-3 shadow-xl">
      {/* Primary Algebra shortcuts bar */}
      <div className="grid grid-cols-6 gap-1.5 mb-2">
        <button
          type="button"
          onClick={() => handleKeyClick('x')}
          className="h-10 sm:h-11 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold text-base transition active:scale-95 flex items-center justify-center font-serif italic"
        >
          x
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('y')}
          className="h-10 sm:h-11 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-base transition active:scale-95 flex items-center justify-center font-serif italic"
        >
          y
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('²')}
          className="h-10 sm:h-11 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-base transition active:scale-95 flex items-center justify-center"
        >
          ²
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('³')}
          className="h-10 sm:h-11 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-bold text-base transition active:scale-95 flex items-center justify-center"
        >
          ³
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('(')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base transition active:scale-95 flex items-center justify-center font-mono"
        >
          (
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick(')')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base transition active:scale-95 flex items-center justify-center font-mono"
        >
          )
        </button>
      </div>

      {/* Main Numbers & Operations Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* Row 1 */}
        <button
          type="button"
          onClick={() => handleKeyClick('7')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('8')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('9')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('+')}
          className="h-10 sm:h-11 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-lg transition active:scale-95"
        >
          +
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => handleKeyClick('4')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('5')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('6')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('-')}
          className="h-10 sm:h-11 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-lg transition active:scale-95"
        >
          -
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => handleKeyClick('1')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('2')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('3')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          3
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-10 sm:h-11 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center justify-center transition active:scale-95"
          title="Borrar"
        >
          <Delete className="w-5 h-5" />
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={handleClear}
          className="h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 flex items-center justify-center transition active:scale-95"
          title="Limpiar campo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('0')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-base transition active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick('a')}
          className="h-10 sm:h-11 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 font-serif italic text-base transition active:scale-95"
        >
          a
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`h-10 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm transition active:scale-95 shadow-md ${
            canSubmit
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
          title="Validar Respuesta"
        >
          <CornerDownLeft className="w-5 h-5 mr-1" />
          <span>OK</span>
        </button>
      </div>
    </div>
  );
};
