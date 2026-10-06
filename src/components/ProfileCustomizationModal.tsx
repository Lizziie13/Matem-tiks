import React, { useState } from 'react';
import {
  Check,
  Edit3,
  GraduationCap,
  School,
  Shield,
  Sparkles,
  User,
  X,
  Zap,
  Award,
  Layers,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CyberAvatar, CYBER_AVATARS, CyberAvatarDef } from './CyberAvatar';
import { sound } from '../utils/audio';

interface ProfileCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_PARALELOS = [
  '1ro BGU A',
  '1ro BGU B',
  '1ro BGU C',
  '2do BGU A',
  '2do BGU B',
  '3ro BGU A',
  '3ro BGU B',
  '10mo EGB A',
  '10mo EGB B',
  '9no EGB A',
  '9no EGB B',
];

export const ProfileCustomizationModal: React.FC<ProfileCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    profile,
    setStudentName,
    setStudentParalelo,
    setTeacherName,
    setAvatar,
    getAverageGrade,
  } = useGame();

  const [name, setName] = useState(profile.name);
  const [paralelo, setParalelo] = useState(profile.studentParalelo || '1ro BGU A');
  const [isCustomParalelo, setIsCustomParalelo] = useState(
    !COMMON_PARALELOS.includes(profile.studentParalelo || '1ro BGU A')
  );
  const [customParaleloText, setCustomParaleloText] = useState(
    COMMON_PARALELOS.includes(profile.studentParalelo || '1ro BGU A')
      ? ''
      : profile.studentParalelo || ''
  );
  const [teacher, setTeacher] = useState(profile.teacherName || 'Prof. Ariliz Aponte');
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId || 'cyber_gauss');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectAvatar = (avatarDef: CyberAvatarDef) => {
    sound.playTap();
    setSelectedAvatarId(avatarDef.id);
  };

  const handleSelectParalelo = (par: string) => {
    sound.playTap();
    setIsCustomParalelo(false);
    setParalelo(par);
  };

  const handleSave = () => {
    sound.playVictory();
    const finalParalelo = isCustomParalelo
      ? customParaleloText.trim() || '1ro BGU A'
      : paralelo.trim() || '1ro BGU A';

    if (name.trim()) setStudentName(name.trim());
    setStudentParalelo(finalParalelo);
    if (teacher.trim()) setTeacherName(teacher.trim());
    if (selectedAvatarId) setAvatar(selectedAvatarId);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const avgGrade = getAverageGrade();
  const currentAvatarDef =
    CYBER_AVATARS.find((a) => a.id === selectedAvatarId) || CYBER_AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
          title="Cerrar personalización"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Personalización de Perfil y Carnet
            </h3>
            <p className="text-xs text-slate-400">
              Configura tu identidad de estudiante, selecciona tu paralelo y elige tu avatar ciber-matemático.
            </p>
          </div>
        </div>

        {/* Live Credential Preview Card */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-purple-950/50 to-slate-950 border border-indigo-500/50 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <CyberAvatar id={selectedAvatarId} size="lg" />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
                  Carnet Oficial del Estudiante
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">{name || 'Tu Nombre'}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                    {isCustomParalelo ? customParaleloText || 'Paralelo' : paralelo}
                  </span>
                  <span className="text-xs text-slate-400">
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
            <span>🔥 Racha: {profile.streakDays} días</span>
            <span>⭐ Nivel: {profile.level}</span>
            <span>🪙 Monedas: {profile.coins}</span>
          </div>
        </div>

        {/* Form Sections */}
        <div className="mt-6 space-y-5">
          {/* 1. Student Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Nombre y Apellido del Estudiante</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Sofía Mendoza o Carlos Pérez"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
            />
          </div>

          {/* 2. Paralelo Selector (Chips + Custom input) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <School className="w-4 h-4 text-indigo-400" />
              <span>Selecciona tu Paralelo / Curso</span>
            </label>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_PARALELOS.map((par) => {
                const isSelected = !isCustomParalelo && paralelo === par;
                return (
                  <button
                    key={par}
                    type="button"
                    onClick={() => handleSelectParalelo(par)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {par}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  setIsCustomParalelo(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 border ${
                  isCustomParalelo
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Otro / Personalizado
              </button>
            </div>

            {/* Custom input if selected */}
            {isCustomParalelo && (
              <div className="animate-in fade-in">
                <input
                  type="text"
                  value={customParaleloText}
                  onChange={(e) => setCustomParaleloText(e.target.value)}
                  placeholder="Escribe tu curso y paralelo (ej: 1ro BGU C o Grado 10-A)"
                  className="w-full bg-slate-800/90 border border-purple-500/60 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
                />
              </div>
            )}
          </div>

          {/* 3. Teacher Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Docente de Matemáticas</span>
            </label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Prof. Ariliz Aponte"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition"
            />
          </div>

          {/* 4. Cyber-Mathematician Avatars Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Elige tu Avatar Ciber-Matemático</span>
              </label>
              <span className="text-[11px] text-indigo-400 font-semibold">
                Seleccionado: {currentAvatarDef.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {CYBER_AVATARS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;

                return (
                  <div
                    key={avatar.id}
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/70 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <CyberAvatar id={avatar.id} size="md" showGlow={isSelected} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-bold text-white truncate">{avatar.name}</h5>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0"
                          style={{
                            backgroundColor: `${avatar.primaryColor}22`,
                            color: avatar.primaryColor,
                          }}
                        >
                          {avatar.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">{avatar.title}</p>
                      <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                        {avatar.quote}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition border border-slate-700"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Perfil Guardado!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Guardar Personalización</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
