import React, { useState } from 'react';
import { Check, Edit3, GraduationCap, School, Shield, Sparkles, User, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CyberAvatar, CYBER_AVATARS } from './CyberAvatar';
import { sound } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAvatarSelector?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAvatarSelector,
}) => {
  const {
    profile,
    setStudentName,
    setStudentParalelo,
    setTeacherName,
    getAverageGrade,
  } = useGame();

  const [name, setName] = useState(profile.name);
  const [paralelo, setParalelo] = useState(profile.studentParalelo || 'Paralelo A');
  const [teacher, setTeacher] = useState(profile.teacherName || 'Prof. Ariliz Aponte');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playVictory();
    if (name.trim()) setStudentName(name.trim());
    if (paralelo.trim()) setStudentParalelo(paralelo.trim());
    if (teacher.trim()) setTeacherName(teacher.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const avgGrade = getAverageGrade();
  const currentAvatarDef = CYBER_AVATARS.find((a) => a.id === profile.avatarId) || CYBER_AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/80 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Carnet del Estudiante</h3>
            <p className="text-xs text-slate-400">
              Datos académicos para reportes, boletas de notas y duelos
            </p>
          </div>
        </div>

        {/* Credential Card Preview */}
        <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-purple-950/40 to-slate-950 border border-indigo-500/40 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative group cursor-pointer" onClick={onOpenAvatarSelector}>
                <CyberAvatar id={profile.avatarId} size="lg" />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold shadow">
                  <Edit3 className="w-2.5 h-2.5" />
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  Estudiante Oficial
                </span>
                <h4 className="text-base font-bold text-white">{name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                    {paralelo}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Docente: <strong className="text-slate-200">{teacher}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Promedio</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {avgGrade > 0 ? avgGrade.toFixed(1) : '10.0'}
              </span>
              <span className="text-[10px] text-slate-500 block">/ 10.0</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Racha: 🔥 {profile.streakDays} días</span>
            <span>Ejercicios: 💯 {profile.totalExercisesSolved || 14}</span>
            <span>Medallas: 🏅 {profile.unlockedBadgeIds?.length || 3}</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nombre y Apellido del Estudiante</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sofía Mendoza"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-indigo-400" />
                <span>Paralelo / Curso</span>
              </label>
              <input
                type="text"
                value={paralelo}
                onChange={(e) => setParalelo(e.target.value)}
                placeholder="Ej: Paralelo A"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Docente Encargado/a</span>
              </label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Prof. Ariliz Aponte"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Avatar change shortcut button */}
        {onOpenAvatarSelector && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Avatar Activo:</span>
              <strong className="text-white">{currentAvatarDef.name}</strong>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAvatarSelector();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-indigo-300 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cambiar Avatar</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition border border-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar Carnet</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
