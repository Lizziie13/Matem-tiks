import React from 'react';

export interface CyberAvatarDef {
  id: string;
  name: string;
  title: string;
  quote: string;
  primaryColor: string;
  glowColor: string;
  rarity: 'Común' | 'Raro' | 'Épico' | 'Legendario';
}

export const CYBER_AVATARS: CyberAvatarDef[] = [
  {
    id: 'cyber_gauss',
    name: 'Gauss Cyber-Príncipe',
    title: 'Arquitecto Polinomial',
    quote: '«Los polinomios son los circuitos del universo cuántico.»',
    primaryColor: '#38bdf8',
    glowColor: '#6366f1',
    rarity: 'Legendario',
  },
  {
    id: 'cyber_lovelace',
    name: 'Ada Cyber-Lovelace',
    title: 'Hacker de Binomios',
    quote: '«Factorizar es compilar la realidad a su estado más puro.»',
    primaryColor: '#f43f5e',
    glowColor: '#d946ef',
    rarity: 'Legendario',
  },
  {
    id: 'cyber_khwarizmi',
    name: 'Al-Juarismi 3000',
    title: 'Fundador de Algoritmos',
    quote: '«Reducir términos semejantes es el camino a la armonía.»',
    primaryColor: '#10b981',
    glowColor: '#06b6d4',
    rarity: 'Épico',
  },
  {
    id: 'cyber_quantum_bot',
    name: 'Algebrik-Bot 9000',
    title: 'IA Cuántica de Factorización',
    quote: '«Cálculo completado: diferencia de cuadrados verificada.»',
    primaryColor: '#8b5cf6',
    glowColor: '#ec4899',
    rarity: 'Épico',
  },
  {
    id: 'cyber_pythagoras',
    name: 'Pitágoras Cyber-Monje',
    title: 'Maestro de la Matriz Cuadrática',
    quote: '«Todo número oculta un cuadrado perfecto esperando despertar.»',
    primaryColor: '#f59e0b',
    glowColor: '#ef4444',
    rarity: 'Raro',
  },
  {
    id: 'cyber_valkyrie',
    name: 'Valkiria Factorizadora',
    title: 'Centinela de Productos Notables',
    quote: '«Ningún trinomio compuesto escapará sin ser factorizado.»',
    primaryColor: '#06b6d4',
    glowColor: '#3b82f6',
    rarity: 'Raro',
  },
];

interface CyberAvatarProps {
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  className?: string;
}

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  id = 'cyber_gauss',
  size = 'md',
  showGlow = true,
  className = '',
}) => {
  // Normalize id: if user had 'gauss' or 'lovelace' from previous version, map to cyber avatar
  let cleanId = id;
  if (id === 'gauss') cleanId = 'cyber_gauss';
  else if (id === 'lovelace') cleanId = 'cyber_lovelace';
  else if (id === 'khwarizmi') cleanId = 'cyber_khwarizmi';
  else if (id === 'pythagoras') cleanId = 'cyber_pythagoras';
  else if (id === 'cyber') cleanId = 'cyber_quantum_bot';

  const avatar = CYBER_AVATARS.find((a) => a.id === cleanId) || CYBER_AVATARS[0];

  const sizePixels = {
    sm: 36,
    md: 48,
    lg: 72,
    xl: 96,
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      {/* Background glow halo */}
      {showGlow && (
        <div
          className="absolute -inset-1 rounded-2xl opacity-50 blur-sm pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(circle, ${avatar.primaryColor}88 0%, ${avatar.glowColor}22 70%, transparent 100%)`,
          }}
        />
      )}

      {/* SVG Vector Graphic */}
      <svg
        viewBox="0 0 100 100"
        width={sizePixels}
        height={sizePixels}
        className="relative z-10 rounded-2xl shadow-inner overflow-hidden border"
        style={{
          borderColor: `${avatar.primaryColor}88`,
          background: '#090d16',
        }}
      >
        <defs>
          <linearGradient id={`grad-${avatar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={avatar.primaryColor} />
            <stop offset="100%" stopColor={avatar.glowColor} />
          </linearGradient>

          <filter id={`neonGlow-${avatar.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Futuristic Background Grid */}
        <line x1="15" y1="25" x2="85" y2="25" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="15" y1="50" x2="85" y2="50" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="15" y1="75" x2="85" y2="75" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="30" y1="10" x2="30" y2="90" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="70" y1="10" x2="70" y2="90" stroke="#1e293b" strokeWidth="0.8" />

        {/* Distinctive Cyber Characters */}
        {avatar.id === 'cyber_gauss' && (
          <g>
            {/* Cyber Hoodie */}
            <path d="M 22 95 Q 50 65 78 95 Z" fill="#1e1b4b" stroke={avatar.primaryColor} strokeWidth="1" />
            <circle cx="50" cy="48" r="23" fill="#0f172a" stroke="#312e81" strokeWidth="1.5" />
            
            {/* Cyber Hair */}
            <path d="M 27 42 Q 50 18 73 42 Q 62 26 50 28 Q 38 26 27 42 Z" fill={avatar.primaryColor} opacity="0.8" />

            {/* Glowing Cybernetic Visor Scanning Formulas */}
            <rect x="30" y="42" width="40" height="12" rx="4" fill="#0369a1" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <line x1="32" y1="48" x2="68" y2="48" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
            <text x="50" y="51" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              x² + 2ax
            </text>

            {/* Circuit Line on Face */}
            <path d="M 40 56 L 40 68 L 47 71" fill="none" stroke={avatar.primaryColor} strokeWidth="1" opacity="0.8" />
            <circle cx="47" cy="71" r="1.5" fill="#38bdf8" />

            {/* Holographic floating badge */}
            <circle cx="78" cy="24" r="7" fill="#1e1b4b" stroke={avatar.primaryColor} strokeWidth="1" />
            <text x="78" y="27" fill={avatar.primaryColor} fontSize="8" fontWeight="bold" textAnchor="middle">
              ∑
            </text>
          </g>
        )}

        {avatar.id === 'cyber_lovelace' && (
          <g>
            {/* High collar cyber jacket */}
            <path d="M 24 95 Q 50 68 76 95 Z" fill="#4c0519" stroke={avatar.primaryColor} strokeWidth="1" />
            <circle cx="50" cy="48" r="22" fill="#18181b" stroke="#831843" strokeWidth="1.5" />

            {/* Cybernetic Braid with Neon Fiber Optics */}
            <circle cx="28" cy="44" r="8" fill="#be185d" opacity="0.7" />
            <circle cx="72" cy="44" r="8" fill="#be185d" opacity="0.7" />
            <path d="M 32 30 Q 50 20 68 30 Z" fill="#f43f5e" />

            {/* Dual Holographic Smart Glasses */}
            <circle cx="41" cy="46" r="8" fill="#831843" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <circle cx="59" cy="46" r="8" fill="#831843" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <line x1="49" y1="46" x2="51" y2="46" stroke={avatar.primaryColor} strokeWidth="2" />
            <text x="41" y="48" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              (a+b)
            </text>
            <text x="59" y="48" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              ²
            </text>

            {/* Cyber Headset Antennas */}
            <line x1="24" y1="44" x2="16" y2="34" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <circle cx="16" cy="34" r="2" fill={avatar.primaryColor} />
            <line x1="76" y1="44" x2="84" y2="34" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <circle cx="84" cy="34" r="2" fill={avatar.primaryColor} />
          </g>
        )}

        {avatar.id === 'cyber_khwarizmi' && (
          <g>
            {/* Gilded cyber collar */}
            <path d="M 20 95 Q 50 64 80 95 Z" fill="#064e3b" stroke={avatar.primaryColor} strokeWidth="1.2" />
            <circle cx="50" cy="48" r="22" fill="#022c22" stroke="#047857" strokeWidth="1.5" />

            {/* Futuristic Cyber Keiyeh / Cowl */}
            <path d="M 28 30 Q 50 14 72 30 L 76 65 Q 50 78 24 65 Z" fill="#065f46" opacity="0.6" />

            {/* Ocular Cyber-Monocle & Retinal Hologram */}
            <circle cx="58" cy="46" r="9" fill="#047857" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <circle cx="58" cy="46" r="4" fill="#6ee7b7" />
            <circle cx="42" cy="46" r="3" fill="#a7f3d0" />

            {/* Algebraic Rune on forehead */}
            <text x="50" y="32" fill={avatar.primaryColor} fontSize="8" fontWeight="bold" textAnchor="middle">
              √x
            </text>

            {/* Holographic matrix circles */}
            <circle cx="58" cy="46" r="14" fill="none" stroke={avatar.primaryColor} strokeWidth="0.8" strokeDasharray="2 2" />
          </g>
        )}

        {avatar.id === 'cyber_quantum_bot' && (
          <g>
            {/* Robotic chassis */}
            <path d="M 25 95 L 35 68 L 65 68 L 75 95 Z" fill="#2e1065" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <rect x="30" y="28" width="40" height="38" rx="10" fill="#0f0728" stroke={avatar.primaryColor} strokeWidth="2" />

            {/* Glowing Curved LED Visor Display */}
            <rect x="35" y="38" width="30" height="15" rx="5" fill="#3b0764" stroke="#ec4899" strokeWidth="1" />
            <text x="50" y="48" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              [x²-y²]
            </text>

            {/* Quantum Core Sensor */}
            <circle cx="50" cy="78" r="5" fill="#ec4899" filter={`url(#neonGlow-${avatar.id})`} />

            {/* Robot Antennas */}
            <line x1="38" y1="28" x2="32" y2="16" stroke={avatar.primaryColor} strokeWidth="2" />
            <circle cx="32" cy="16" r="2.5" fill="#ec4899" />
            <line x1="62" y1="28" x2="68" y2="16" stroke={avatar.primaryColor} strokeWidth="2" />
            <circle cx="68" cy="16" r="2.5" fill="#ec4899" />
          </g>
        )}

        {avatar.id === 'cyber_pythagoras' && (
          <g>
            {/* Cyber-Robe */}
            <path d="M 22 95 Q 50 65 78 95 Z" fill="#451a03" stroke={avatar.primaryColor} strokeWidth="1" />
            <circle cx="50" cy="48" r="22" fill="#1c1917" stroke="#78350f" strokeWidth="1.5" />

            {/* Techno Hood */}
            <path d="M 26 42 Q 50 16 74 42 L 72 70 Q 50 82 28 70 Z" fill="#78350f" opacity="0.6" />

            {/* Glowing Neon Triangle over Left Eye (Pythagorean Theorem) */}
            <polygon points="40,38 34,54 48,54" fill="none" stroke={avatar.primaryColor} strokeWidth="1.5" filter={`url(#neonGlow-${avatar.id})`} />
            <circle cx="41" cy="49" r="2.5" fill="#fef08a" />
            <circle cx="59" cy="49" r="3" fill="#f59e0b" />

            {/* Matrix Data Stream */}
            <text x="66" y="38" fill={avatar.primaryColor} fontSize="5" fontFamily="monospace">a²</text>
            <text x="66" y="44" fill={avatar.primaryColor} fontSize="5" fontFamily="monospace">+</text>
            <text x="66" y="50" fill={avatar.primaryColor} fontSize="5" fontFamily="monospace">b²</text>
          </g>
        )}

        {avatar.id === 'cyber_valkyrie' && (
          <g>
            {/* Cyber Armor with Pauldrons */}
            <path d="M 18 95 L 34 68 L 66 68 L 82 95 Z" fill="#083344" stroke={avatar.primaryColor} strokeWidth="1.2" />
            <circle cx="50" cy="48" r="22" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />

            {/* Cyber Valkyrie Helmet Wings */}
            <polygon points="26,38 12,24 24,48" fill="#0284c7" opacity="0.9" />
            <polygon points="74,38 88,24 76,48" fill="#0284c7" opacity="0.9" />

            {/* Sleek Cyan Aerodynamic Visor */}
            <polygon points="34,44 66,44 58,56 42,56" fill="#0369a1" stroke={avatar.primaryColor} strokeWidth="1.5" />
            <text x="50" y="52" fill="#ffffff" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              ax+b
            </text>
          </g>
        )}

        {/* Ambient Holographic Particle Dots */}
        <circle cx="20" cy="20" r="1" fill={avatar.primaryColor} opacity="0.7" />
        <circle cx="82" cy="78" r="1.2" fill={avatar.glowColor} opacity="0.8" />
        <circle cx="16" cy="72" r="0.8" fill={avatar.primaryColor} opacity="0.6" />
      </svg>
    </div>
  );
};
