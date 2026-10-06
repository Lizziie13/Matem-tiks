import React from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Printer,
  School,
  X,
  FileText,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { GradeRecord, TopicProgress, UserProfile } from '../types/game';
import { TOPICS } from '../utils/mathQuestions';
import { sound } from '../utils/audio';

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  gradeRecords: GradeRecord[];
  topicProgress: Record<string, TopicProgress>;
  averageGrade: number;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  gradeRecords,
  topicProgress,
  averageGrade,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  const sobresalientes = gradeRecords.filter((r) => r.scoreOutOfTen >= 9.0).length;
  const aprobados = gradeRecords.filter((r) => r.scoreOutOfTen >= 5.0).length;
  const approvalRate =
    gradeRecords.length > 0 ? Math.round((aprobados / gradeRecords.length) * 100) : 0;

  const currentDateFormatted = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  const academicStatus =
    averageGrade >= 9.0
      ? 'SOBRESALIENTE'
      : averageGrade >= 7.0
      ? 'SATISFACTORIO'
      : averageGrade >= 5.0
      ? 'APROBADO'
      : 'EN REFUERZO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden text-slate-100 my-auto max-h-[96vh] flex flex-col">
        {/* Modal Toolbar (Hidden during print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Vista Previa del Reporte Académico en PDF
              </h3>
              <p className="text-xs text-slate-400">
                Usa la opción «Guardar como PDF» en la ventana de impresión de tu navegador.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar en PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Sheet */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div
            id="academic-report-print-sheet"
            className="printable-report-wrapper bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl max-w-3xl mx-auto font-sans"
            style={{ minHeight: '1000px' }}
          >
            {/* 1. Institutional Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif text-2xl font-black shrink-0">
                    ∑
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-900">
                      Algebrik Academy
                    </h1>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Plataforma Oficial de Evaluación Matemática
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <div className="font-mono font-bold text-slate-700">FOLIO: ALG-{new Date().getFullYear()}-{(profile.name || 'EST').slice(0, 3).toUpperCase()}</div>
                  <div>Emisión: {currentDateFormatted}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                  Boleta Oficial de Calificaciones y Progreso
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Álgebra: Productos Notables y Factorización · Escala Oficial sobre 10.0 Puntos
                </p>
              </div>
            </div>

            {/* 2. Student Data Box */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">
                  Estudiante
                </span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {profile.name}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">
                  Curso / Paralelo
                </span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {profile.studentParalelo || 'Paralelo A'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">
                  Docente Titular
                </span>
                <span className="font-bold text-sm text-slate-900 block mt-0.5">
                  {profile.teacherName || 'Prof. Ariliz Aponte'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold block">
                  Estado Académico
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold mt-0.5 ${
                    averageGrade >= 5.0
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {academicStatus}
                </span>
              </div>
            </div>

            {/* 3. Global KPI Summary */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <span>I. Resumen General de Rendimiento</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Promedio</span>
                  <span className="text-xl font-black font-mono text-slate-900 block mt-0.5">
                    {averageGrade.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 10</span>
                  </span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Exámenes</span>
                  <span className="text-xl font-black font-mono text-slate-900 block mt-0.5">
                    {gradeRecords.length}
                  </span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Sobresalientes</span>
                  <span className="text-xl font-black font-mono text-emerald-700 block mt-0.5">
                    {sobresalientes}
                  </span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Aprobados</span>
                  <span className="text-xl font-black font-mono text-blue-700 block mt-0.5">
                    {aprobados}
                  </span>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Efectividad</span>
                  <span className="text-xl font-black font-mono text-indigo-700 block mt-0.5">
                    {approvalRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Graded Exam Records Table */}
            <div className="mb-6 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                II. Registro Oficial de Exámenes Evaluados (Escala 10.0 Puntos)
              </h3>
              {gradeRecords.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500 italic">
                  Aún no se registran exámenes formales completados por el estudiante.
                </div>
              ) : (
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Fecha</th>
                        <th className="p-2.5">Contenido Temático Evaluado</th>
                        <th className="p-2.5 text-center">Aciertos</th>
                        <th className="p-2.5 text-center">Tiempo</th>
                        <th className="p-2.5 text-right">Nota (/10)</th>
                        <th className="p-2.5 text-center">Dictamen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {gradeRecords.map((record, index) => (
                        <tr key={record.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-mono text-slate-500">{index + 1}</td>
                          <td className="p-2.5 text-slate-600 whitespace-nowrap">{record.formattedDate}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{record.topicTitle}</td>
                          <td className="p-2.5 text-center font-mono">
                            {record.correctAnswers}/{record.totalQuestions}
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-600">
                            {Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-sm text-slate-900">
                            {record.scoreOutOfTen.toFixed(1)}
                          </td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                record.scoreOutOfTen >= 9.0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : record.scoreOutOfTen >= 5.0
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 5. Topic Mastery Progress Breakdown */}
            <div className="mb-6 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                III. Diagnóstico de Dominio por Contenido Temático
              </h3>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                    <tr>
                      <th className="p-2.5">Tema</th>
                      <th className="p-2.5 text-center">Ejercicios</th>
                      <th className="p-2.5 text-center">Aciertos</th>
                      <th className="p-2.5 text-center">Efectividad</th>
                      <th className="p-2.5 text-center">Nivel Dominio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {TOPICS.map((topic) => {
                      const prog = topicProgress[topic.id] || {
                        exercisesCompleted: 0,
                        correctCount: 0,
                        accuracy: 0,
                        masteryLevel: 1,
                      };
                      return (
                        <tr key={topic.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-900">
                            {topic.title}
                            <span className="block text-[10px] font-mono text-slate-500 font-normal">
                              {topic.formula}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-mono">{prog.exercisesCompleted}</td>
                          <td className="p-2.5 text-center font-mono">{prog.correctCount}</td>
                          <td className="p-2.5 text-center font-mono font-bold">
                            <span
                              className={
                                prog.accuracy >= 80
                                  ? 'text-emerald-700'
                                  : prog.accuracy >= 60
                                  ? 'text-blue-700'
                                  : prog.accuracy > 0
                                  ? 'text-amber-700'
                                  : 'text-slate-400'
                              }
                            >
                              {prog.exercisesCompleted > 0 ? `${prog.accuracy}%` : '0%'}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex justify-center text-amber-500 text-[11px]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                  key={s}
                                  className={s <= prog.masteryLevel ? 'text-amber-500' : 'text-slate-300'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Habits & Consistency Note */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-6 text-xs text-slate-700 print-avoid-break">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>Constancia y Hábitos de Práctica:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                El estudiante mantiene una racha activa de <strong>{profile.streakDays} días consecutivos</strong> de
                estudio con <strong>{profile.totalExercisesSolved || 14} ejercicios resueltos</strong> y{' '}
                <strong>{profile.unlockedBadgeIds?.length || 3} medallas de logro</strong> desbloqueadas.
                {averageGrade >= 7.0
                  ? ' Se felicita la perseverancia demostrada y el compromiso en la resolución sistemática de problemas algebraicos.'
                  : ' Se sugiere reforzar la práctica diaria asistida por voz y ejercicios paso a paso para consolidar las identidades notables.'}
              </p>
            </div>

            {/* 7. Pedagogical Signatures & Validation */}
            <div className="pt-8 border-t-2 border-slate-900 mt-6 print-avoid-break">
              <div className="grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="w-48 mx-auto border-b border-slate-800 pb-1 mb-1">
                    <span className="font-serif italic text-slate-600 text-[11px]">
                      {profile.teacherName || 'Prof. Ariliz Aponte'}
                    </span>
                  </div>
                  <strong className="block text-slate-900">{profile.teacherName || 'Prof. Ariliz Aponte'}</strong>
                  <span className="text-slate-500 text-[10px]">Docente Titular de Matemáticas</span>
                </div>

                <div>
                  <div className="w-48 mx-auto border-b border-slate-800 pb-1 mb-1">
                    <span className="text-transparent select-none">Firma</span>
                  </div>
                  <strong className="block text-slate-900">{profile.name}</strong>
                  <span className="text-slate-500 text-[10px]">Firma del Estudiante / Representante</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-200 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Registro digital verificado por la plataforma Algebrik · Documento emitido con fines académicos y de seguimiento pedagógico.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
