import React from 'react';
import { Check, Heart, Shield, Sparkles, Store } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import { CyberAvatar, CYBER_AVATARS } from '../CyberAvatar';

interface ShopItem {
  id: string;
  name: string;
  type: 'avatar' | 'theme' | 'consumable';
  price: number;
  icon: string;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Cyber Avatars
  {
    id: 'cyber_gauss',
    name: 'Gauss Cyber-Príncipe',
    type: 'avatar',
    price: 0,
    icon: '👑',
    description: 'Arquitecto Polinomial. Equipado con visor de fórmulas de alta velocidad.',
  },
  {
    id: 'cyber_lovelace',
    name: 'Ada Cyber-Lovelace',
    type: 'avatar',
    price: 150,
    icon: '💎',
    description: 'Hacker de Binomios. Neural headset con decodificación de binomios al cuadrado.',
  },
  {
    id: 'cyber_khwarizmi',
    name: 'Al-Juarismi 3000',
    type: 'avatar',
    price: 200,
    icon: '📜',
    description: 'Fundador de Algoritmos. Ocular cibernético con runas de factorización.',
  },
  {
    id: 'cyber_quantum_bot',
    name: 'Algebrik-Bot 9000',
    type: 'avatar',
    price: 280,
    icon: '🤖',
    description: 'IA Cuántica de Factorización. Sensor con visor LED curvo de diferencias de cuadrados.',
  },
  {
    id: 'cyber_pythagoras',
    name: 'Pitágoras Cyber-Monje',
    type: 'avatar',
    price: 250,
    icon: '📐',
    description: 'Maestro de la Matriz Cuadrática. Proyector holográfico de teoremas.',
  },
  {
    id: 'cyber_valkyrie',
    name: 'Valkiria Factorizadora',
    type: 'avatar',
    price: 320,
    icon: '⚡',
    description: 'Centinela de Productos Notables. Casco aerodinámico con visor cian.',
  },

  // Themes
  {
    id: 'cosmic',
    name: 'Tema Galáctico Cósmico',
    type: 'theme',
    price: 0,
    icon: '🌌',
    description: 'Estilo espacial con tonos índigo y nebulosas.',
  },
  {
    id: 'chalkboard',
    name: 'Pizarra Clásica',
    type: 'theme',
    price: 180,
    icon: '📋',
    description: 'Sensación nostálgica de tiza y pizarrón escolar verde esmeralda.',
  },
  {
    id: 'neon',
    name: 'Neón Cyberpunk',
    type: 'theme',
    price: 300,
    icon: '⚡',
    description: 'Brillos fluorescentes cian y magenta de alta energía.',
  },
];

export const ShopView: React.FC = () => {
  const { profile, buyItem, setAvatar, setTheme, refillHearts } = useGame();

  const handleBuy = (item: ShopItem) => {
    sound.playTap();
    if (profile.inventory.includes(item.id)) {
      if (item.type === 'avatar') setAvatar(item.id);
      if (item.type === 'theme') setTheme(item.id);
      return;
    }

    const ok = buyItem(item.id, item.price);
    if (ok) {
      if (item.type === 'avatar') setAvatar(item.id);
      if (item.type === 'theme') setTheme(item.id);
    } else {
      sound.playIncorrect();
    }
  };

  const handleRefillHearts = () => {
    sound.playTap();
    if (profile.coins >= 100 && profile.hearts < profile.maxHearts) {
      buyItem('refill-temp', 100);
      refillHearts();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Recompensas & Personalización
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
            Tienda de Álgebra
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Canjea las monedas que ganas resolviendo ejercicios y completando exámenes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono font-bold text-base shadow">
          <span>🪙</span>
          <span>{profile.coins} Monedas</span>
        </div>
      </div>

      {/* Consumable Life Refill Card */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Poción de Vida Completa (3 Vidas)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Restaura al instante tus 3 corazones para continuar practicando sin interrupciones.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefillHearts}
          disabled={profile.coins < 100 || profile.hearts >= profile.maxHearts}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 whitespace-nowrap"
        >
          {profile.hearts >= profile.maxHearts ? 'Vidas Llenas (3/3)' : 'Recargar por 100 🪙'}
        </button>
      </div>

      {/* Avatars Section */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Avatares Ciber-Matemáticos para tu Perfil y Duelos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SHOP_ITEMS.filter((i) => i.type === 'avatar').map((item) => {
            const isOwned = profile.inventory.includes(item.id) || item.price === 0;
            const isEquipped = profile.avatarId === item.id;
            const def = CYBER_AVATARS.find((a) => a.id === item.id);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition ${
                  isEquipped
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <CyberAvatar id={item.id} size="md" showGlow={isEquipped} />
                    <div className="flex items-center gap-1.5">
                      {def && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                          style={{
                            backgroundColor: `${def.primaryColor}22`,
                            color: def.primaryColor,
                          }}
                        >
                          {def.rarity}
                        </span>
                      )}
                      {isEquipped && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          Equipado
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  {def && (
                    <p className="text-[10px] text-slate-400 italic mt-1">{def.quote}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {item.price === 0 ? 'Gratis' : `${item.price} 🪙`}
                  </span>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!isOwned && profile.coins < item.price}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isEquipped
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : isOwned
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                        : profile.coins >= item.price
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isEquipped ? 'En uso' : isOwned ? 'Equipar' : 'Comprar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Themes Section */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Estilos y Temas Visuales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SHOP_ITEMS.filter((i) => i.type === 'theme').map((item) => {
            const isOwned = profile.inventory.includes(item.id) || item.price === 0;
            const isEquipped = profile.themeId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition ${
                  isEquipped
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.icon}</span>
                    {isEquipped && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        Activo
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {item.price === 0 ? 'Gratis' : `${item.price} 🪙`}
                  </span>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!isOwned && profile.coins < item.price}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isEquipped
                        ? 'bg-slate-800 text-slate-400 cursor-default'
                        : isOwned
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                        : profile.coins >= item.price
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isEquipped ? 'En uso' : isOwned ? 'Aplicar' : 'Comprar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
