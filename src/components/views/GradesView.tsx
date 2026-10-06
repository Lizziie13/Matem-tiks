import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Edit2,
  Eye,
  FileSpreadsheet,
  GraduationCap,
  Medal,
  Printer,
  School,
  Trash2,
  User,
  X,
  FileText,
} from 'lucide-react';
import { GradeRecord } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { CyberAvatar } from '../CyberAvatar';
import { ProfileCustomizationModal } from '../ProfileCustomizationModal';
import { PDFReportModal } from '../PDFReportModal';
import { sound } from '../../utils/audio';

export const GradesView: React.FC = () => {
  const {
    profile,
    gradeRecords,
    topicProgress,
    getAverageGrade,
  } = useGame();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<GradeRecord | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'failed'>('all');

  const averageGrade = getAverageGrade();

  const handlePrint = () => {
    sound.playTap();
    setShowPdfModal(true);
  };

  const filteredRecords = gradeRecords.filter((rec) => {
    if (filter === 'approved') return rec.scoreOutOfTen >= 5.0;
    if (filter === 'failed') return rec.scoreOutOfTen < 5.0;
    return true;
  });

  const sobresalientes = gradeRecords.filter((r) => r.scoreOutOfTen >= 9.0).length;
  const aprobados = gradeRecords.filter((r) => r.scoreOutOfTen >= 5.0).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      {/* Official Academic Print Header (Visible during Print / PDF) */}
      <div className="hidden print:block p-4 border-b-2 border-slate-900 mb-6 text-slate-950">
        <div className="text-center pb-3 border-b">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Boleta Oficial de Calificaciones — Álgebra y Factorización
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Evaluación de Competencias Matemáticas · Escala Oficial sobre 10.0 Puntos
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3 text-xs">
          <div>
            <strong>Estudiante:</strong> {profile.name}
          </div>
          <div>
            <strong>Curso / Paralelo:</strong> {profile.studentParalelo || 'Paralelo A'}
          </div>
          <div>
            <strong>Docente:</strong> {profile.teacherName || 'Prof. Ariliz Aponte'}
          </div>
        </div>
      </div>

      {/* Top Header Card in UI */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <CyberAvatar id={profile.avatarId} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{profile.name}</h1>
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
                title="Editar datos del estudiante"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                {profile.studentParalelo || 'Paralelo A'}
              </span>
              <span className="text-xs text-slate-400">
                Docente: <strong className="text-slate-200">{profile.teacherName || 'Prof. Ariliz Aponte'}</strong>
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <Medal className="w-3 h-3" />
                <span>{profile.unlockedBadgeIds?.length || 3} Medallas</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Average Pill */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Promedio General
            </span>
            <div className="flex items-baseline gap-1 font-mono">
              <span
                className={`text-3xl font-black ${
                  averageGrade >= 9.0
                    ? 'text-emerald-400'
                    : averageGrade >= 7.0
                    ? 'text-blue-400'
                    : averageGrade >= 5.0
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {averageGrade.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500 font-bold">/ 10</span>
            </div>
          </div>

          <div className="h-9 w-px bg-slate-700 mx-2" />

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                sound.playTap();
                setShowPdfModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition active:scale-95 whitespace-nowrap"
              title="Generar boleta y reporte completo en PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reporte en PDF</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="text-[11px] text-slate-400 hover:text-indigo-300 text-center transition"
            >
              Editar Carnet
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Exámenes Rendidos</span>
          <span className="text-2xl font-black font-mono text-white mt-1 block">
            {gradeRecords.length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-emerald-400 font-medium block">Sobresalientes (9-10)</span>
          <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
            {sobresalientes}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-blue-400 font-medium block">Aprobados (≥ 5.0)</span>
          <span className="text-2xl font-black font-mono text-blue-400 mt-1 block">
            {aprobados}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] text-purple-400 font-medium block">Tasa de Aprobación</span>
          <span className="text-2xl font-black font-mono text-purple-400 mt-1 block">
            {gradeRecords.length > 0 ? Math.round((aprobados / gradeRecords.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* PDF Academic Report Banner Card */}
      <div className="no-print p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Boleta y Reporte Académico en PDF
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Imprimible
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Genera un informe institucional con tus notas sobre 10.0, progreso por temas y sello de validación docente.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setShowPdfModal(true);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Printer className="w-4 h-4" />
          <span>Generar Reporte PDF</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({gradeRecords.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aprobados ({aprobados})
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'failed'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Por Reforzar ({gradeRecords.length - aprobados})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Mostrando {filteredRecords.length} evaluaciones
        </span>
      </div>

      {/* Records Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {filteredRecords.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No se han registrado evaluaciones en este filtro. ¡Presenta un examen para registrar tu primera nota!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-lg border ${record.color} shrink-0`}
                  >
                    <span>{record.scoreOutOfTen.toFixed(1)}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{record.topicTitle}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {record.formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s
                      </span>
                      <span>
                        {record.correctAnswers}/{record.totalQuestions} aciertos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${record.color}`}
                  >
                    {record.status}
                  </span>

                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Ver detalles del examen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Detalle de Calificación</h3>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400 font-semibold uppercase">
                {selectedRecord.topicTitle}
              </span>
              <div className="text-4xl font-black font-mono mt-1 text-emerald-400">
                {selectedRecord.scoreOutOfTen.toFixed(1)} / 10
              </div>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${selectedRecord.color}`}
              >
                {selectedRecord.status}
              </span>
            </div>

            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span className="text-slate-400">Estudiante:</span>
                <span className="font-semibold text-white">{selectedRecord.studentName}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span className="text-slate-400">Fecha de evaluación:</span>
                <span className="font-semibold text-white">{selectedRecord.formattedDate}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span className="text-slate-400">Aciertos:</span>
                <span className="font-semibold text-white">
                  {selectedRecord.correctAnswers} de {selectedRecord.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/60">
                <span className="text-slate-400">Tiempo de resolución:</span>
                <span className="font-semibold text-white">
                  {selectedRecord.timeSpentSeconds} segundos
                </span>
              </div>
            </div>

            {selectedRecord.mistakes && selectedRecord.mistakes.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                  Errores cometidos ({selectedRecord.mistakes.length}):
                </h4>
                <div className="space-y-2">
                  {selectedRecord.mistakes.map((m, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs"
                    >
                      <div className="font-mono font-bold text-white">{m.expression}</div>
                      <div className="text-rose-400 mt-1">Tu respuesta: {m.userAnswer}</div>
                      <div className="text-emerald-400 font-mono font-semibold">
                        Correcta: {m.correctAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedRecord(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Student Profile & Credential Edit Modal */}
      <ProfileCustomizationModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Official Academic PDF Report Modal & Print View */}
      <PDFReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        profile={profile}
        gradeRecords={gradeRecords}
        topicProgress={topicProgress}
        averageGrade={averageGrade}
      />
    </div>
  );
};
