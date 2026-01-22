
import React, { useState, useEffect, useRef } from 'react';
import { FunkyTune, SynthType } from './types';
import { SynthEngine, ExtendedSynthType } from './services/synthService';

const BRASS_FOUNDATION: FunkyTune[] = [
  { id: "bf1", name: "Valve Slap", tempo: 95, style: "Mechanical Bass", color: "#b87333", url: "", synthConfig: { type: 'BASS', note: 31, sequence: [1, 0, 0, 1, 0, 0.8, 1, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "bf2", name: "Cog Grind", tempo: 100, style: "Industrial Kick", color: "#cd7f32", url: "", synthConfig: { type: 'GEAR', note: 36, sequence: [1, 1, 0.5, 1, 1, 0.5, 1, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "bf3", name: "Steam Snare", tempo: 110, style: "Pneumatic Hit", color: "#a0522d", url: "", synthConfig: { type: 'PERC', note: 40, sequence: [0, 1, 0, 1, 0, 1, 0, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "bf4", name: "Alloy Clav", tempo: 105, style: "Metallic Funk", color: "#d2691e", url: "", synthConfig: { type: 'CLAV', note: 48, sequence: [1, 0.5, 1, 1, 0.5, 1, 1, 0.8] }, pattern: { bass: [], rhythm: [] } },
  { id: "bf5", name: "Boiler Squelch", tempo: 90, style: "Liquid Copper", color: "#8b4513", url: "", synthConfig: { type: 'SQUELCH', note: 41, sequence: [1, 0, 1, 0, 1, 0, 1, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "bf6", name: "Rivet Snap", tempo: 115, style: "Cold Iron", color: "#708090", url: "", synthConfig: { type: 'PERC', note: 72, sequence: [1, 0.8, 1, 0.8, 1, 0.8, 1, 0.8] }, pattern: { bass: [], rhythm: [] } },
];

const CLOCKWORK_ORPHEUM: FunkyTune[] = [
  { id: "co1", name: "Apex Whistle", tempo: 100, style: "High Pressure", color: "#ffc300", url: "", synthConfig: { type: 'WHISTLE', note: 72, sequence: [1, 0, 0.5, 0, 0, 1, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "co2", name: "Grand Master", tempo: 108, style: "Architect Lead", color: "#ffd700", url: "", synthConfig: { type: 'LEAD', note: 60, sequence: [1, 1, 0, 1, 0, 1, 1, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "co3", name: "Brass Chime", tempo: 120, style: "Geometric Tone", color: "#f5deb3", url: "", synthConfig: { type: 'WHISTLE', note: 84, sequence: [1, 0, 1, 0, 1, 0, 1, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "co4", name: "Torsion Keys", tempo: 92, style: "Resonant Steel", color: "#daa520", url: "", synthConfig: { type: 'CLAV', note: 55, sequence: [0.8, 1, 0.8, 1, 0, 1, 1, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "co5", name: "Piston Flare", tempo: 112, style: "Solar Valve", color: "#ffec8b", url: "", synthConfig: { type: 'LEAD', note: 67, sequence: [1, 0, 0, 1, 1, 0, 0, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "co6", name: "Mercury Coil", tempo: 102, style: "Fluid Synth", color: "#fafad2", url: "", synthConfig: { type: 'SQUELCH', note: 52, sequence: [1, 1, 1, 0, 1, 1, 1, 0] }, pattern: { bass: [], rhythm: [] } },
];

const HARMONIC_AETHER: FunkyTune[] = [
  { id: "ha1", name: "Arcane Major", tempo: 95, style: "Electronic Chord", color: "#6a5acd", url: "", synthConfig: { type: 'CHORD', note: 48, sequence: [1, 0, 0, 0, 1, 0, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ha2", name: "Spectral Pad", tempo: 100, style: "Ethereal Sweep", color: "#483d8b", url: "", synthConfig: { type: 'PAD', note: 60, sequence: [1, 0, 0, 0, 1, 0, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ha3", name: "Crystal Grid", tempo: 110, style: "Electronic Arp", color: "#1e90ff", url: "", synthConfig: { type: 'CHORD', note: 53, sequence: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5] }, pattern: { bass: [], rhythm: [] } },
  { id: "ha4", name: "Void Resonant", tempo: 85, style: "Deep Harmony", color: "#000080", url: "", synthConfig: { type: 'PAD', note: 41, sequence: [1, 0, 0, 0, 1, 0, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ha5", name: "Gold Ratio", tempo: 108, style: "Perfect Fifth", color: "#b8860b", url: "", synthConfig: { type: 'CHORD', note: 65, sequence: [1, 0, 0.5, 0, 1, 0, 0.5, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ha6", name: "Obsidian Soul", tempo: 98, style: "Mood Texture", color: "#2f4f4f", url: "", synthConfig: { type: 'PAD', note: 57, sequence: [1, 0, 0, 0, 0, 1, 0, 0] }, pattern: { bass: [], rhythm: [] } },
];

const ANCIENT_CONCLAVE: FunkyTune[] = [
  { id: "ac1", name: "Cathedral Bell", tempo: 90, style: "Classic Bronze", color: "#d4af37", url: "", synthConfig: { type: 'BELL', note: 60, sequence: [1, 0, 0, 0.5, 1, 0, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ac2", name: "Royal Flute", tempo: 100, style: "Woodwind Relic", color: "#228b22", url: "", synthConfig: { type: 'FLUTE', note: 72, sequence: [1, 0, 1, 0, 1, 0, 1, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "ac3", name: "Ivory Hammer", tempo: 110, style: "Grand Piano", color: "#ffffff", url: "", synthConfig: { type: 'PIANO', note: 48, sequence: [1, 0.5, 1, 0, 1, 0.5, 1, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "ac4", name: "Ether Strings", tempo: 85, style: "Orchestral Sweep", color: "#800000", url: "", synthConfig: { type: 'STRING', note: 55, sequence: [1, 0, 0, 0, 1, 0, 0, 0] }, pattern: { bass: [], rhythm: [] } },
  { id: "ac5", name: "Coronation Brass", tempo: 105, style: "Majestic Horns", color: "#ffd700", url: "", synthConfig: { type: 'BRASS', note: 48, sequence: [1, 1, 0.5, 1, 1, 1, 0.5, 1] }, pattern: { bass: [], rhythm: [] } },
  { id: "ac6", name: "Monk Chime", tempo: 80, style: "Ancient Resonator", color: "#4b0082", url: "", synthConfig: { type: 'BELL', note: 67, sequence: [1, 0, 0, 1, 0, 0, 0.8, 0] }, pattern: { bass: [], rhythm: [] } },
];

const MAGNUM_OPUS = [
  { id: "mo1", name: "The Gilded Compass", items: ["bf1", "ac1", "ha1"], tempo: 95, description: "Slap, Bell & Chords" },
  { id: "mo2", name: "The Grand Design", items: ["co2", "ac4", "ha2"], tempo: 105, description: "Lead, Strings & Sweep" },
  { id: "mo3", name: "Orpheum Sonata", items: ["ac3", "ac2", "ha3"], tempo: 112, description: "Piano, Flute & Grid" },
  { id: "mo4", name: "Alchemy of Ages", items: ["ac5", "bf4", "ha4"], tempo: 98, description: "Brass, Alloy & Void" },
];

const ALL_TUNES = [...BRASS_FOUNDATION, ...CLOCKWORK_ORPHEUM, ...HARMONIC_AETHER, ...ANCIENT_CONCLAVE];

const App: React.FC = () => {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const [activeCompositions, setActiveCompositions] = useState<Set<string>>(new Set());
  const [tempos, setTempos] = useState<Record<string, number>>(() => {
    return ALL_TUNES.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.tempo }), {});
  });
  const [compTempos, setCompTempos] = useState<Record<string, number>>(() => {
    return MAGNUM_OPUS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.tempo }), {});
  });
  const [unlocked, setUnlocked] = useState(false);
  const engineRef = useRef<SynthEngine | null>(null);

  const init = () => {
    if (!engineRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      engineRef.current = new SynthEngine(ctx);
    }
    setUnlocked(true);
  };

  const playQuickHit = (type: ExtendedSynthType, note: number) => {
    if (!unlocked) init();
    engineRef.current?.playOneShot(type, note, 1.0);
  };

  const togglePad = (tune: FunkyTune, targetTempo?: number) => {
    if (!unlocked) init();
    if (!engineRef.current) return;
    const config = tune.synthConfig!;
    
    // Provide tactile audio feedback
    engineRef.current.playOneShot(config.type as ExtendedSynthType, config.note, 1.0);

    const useTempo = targetTempo !== undefined ? targetTempo : tempos[tune.id];
    const isNowActive = engineRef.current.toggleLoop(tune.id, config.type as ExtendedSynthType, config.note, config.sequence || [1], useTempo);
    
    setActiveIds(prev => {
      const next = new Set(prev);
      if (isNowActive) next.add(tune.id);
      else next.delete(tune.id);
      return next;
    });
  };

  const toggleComposition = (comp: typeof MAGNUM_OPUS[0]) => {
    if (!unlocked) init();
    if (!engineRef.current) return;

    const isCurrentlyActive = activeCompositions.has(comp.id);
    const targetTempo = compTempos[comp.id];
    
    comp.items.forEach(id => {
      const tune = ALL_TUNES.find(t => t.id === id);
      if (tune) {
        const isPadActive = activeIds.has(id);
        if (isCurrentlyActive) {
          if (isPadActive) togglePad(tune);
        } else {
          if (!isPadActive) togglePad(tune, targetTempo);
        }
      }
    });

    setActiveCompositions(prev => {
      const next = new Set(prev);
      if (isCurrentlyActive) next.delete(comp.id);
      else next.add(comp.id);
      return next;
    });
  };

  const changeTempo = (id: string, val: number) => {
    setTempos(prev => ({ ...prev, [id]: val }));
    engineRef.current?.updateTempo(id, val);
  };

  const changeCompTempo = (compId: string, val: number) => {
    setCompTempos(prev => ({ ...prev, [compId]: val }));
    const comp = MAGNUM_OPUS.find(c => c.id === compId);
    if (comp) {
      comp.items.forEach(itemId => {
        if (activeIds.has(itemId)) {
          changeTempo(itemId, val);
        }
      });
    }
  };

  const Pad: React.FC<{ tune: FunkyTune }> = ({ tune }) => {
    const isActive = activeIds.has(tune.id);
    const tempo = tempos[tune.id];
    return (
      <div className="flex flex-col items-center gap-3">
        <div 
          onClick={() => togglePad(tune)}
          className={`relative w-full aspect-square rounded-[2rem] cursor-pointer transition-all duration-300 border-4 flex flex-col items-center justify-center p-4 overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] ${isActive ? 'border-[#ffc300] bg-[#3a2a1a] scale-105' : 'border-[#4a3a2a] bg-[#1a0f0a] hover:border-[#b87333]'}`}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
               <path d="M50 5 L95 85 L5 85 Z" fill="none" stroke="#ffc300" strokeWidth="0.5" />
            </svg>
          </div>
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#ffc300]">
                <path d="M50 20 L60 50 L50 80 L40 50 Z" fill="currentColor" />
              </svg>
            </div>
          )}
          <div className="z-10 text-center">
            <h4 className={`text-[10px] font-black uppercase tracking-tighter leading-tight ${isActive ? 'text-[#ffc300]' : 'text-[#b87333]'}`}>{tune.name}</h4>
            <p className="mono text-[6px] opacity-40 uppercase tracking-widest mt-1">{tune.style}</p>
          </div>
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-[#4a3a2a] rounded-full"></div>
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#4a3a2a] rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-[#4a3a2a] rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-[#4a3a2a] rounded-full"></div>
        </div>
        <div className="w-full px-2">
          <input 
            type="range" min="40" max="240" 
            value={tempo} 
            onChange={(e) => changeTempo(tune.id, Number(e.target.value))}
            className="w-full accent-[#ffc300] bg-[#2a1a0a] h-1 rounded-full appearance-none"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen relative bg-[#0f0a05] overflow-hidden text-[#d2b48c] font-sans selection:bg-[#ffc300] selection:text-black">
      
      {/* Steampunk Visual Overlays */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] opacity-[0.05] animate-spin-slow text-[#ffc300]">
          <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M50 0 L55 10 L65 10 L70 0 L80 5 L75 15 L85 20 L95 15 L100 25 L90 30 L95 40 L100 45 L100 55 L90 60 L95 70 L100 75 L95 85 L85 80 L80 90 L70 100 L60 90 L55 100 L45 100 L40 90 L30 100 L20 95 L25 85 L15 80 L5 85 L0 75 L10 70 L5 60 L0 55 L0 45 L10 40 L5 30 L0 25 L5 15 L15 20 L20 10 L30 0 L40 10 L45 0 Z M50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30 Z" fill="currentColor"/></svg>
        </div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] opacity-[0.05] animate-spin-slow-reverse text-[#b87333]">
           <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M50 0 L55 10 L65 10 L70 0 L80 5 L75 15 L85 20 L95 15 L100 25 L90 30 L95 40 L100 45 L100 55 L90 60 L95 70 L100 75 L95 85 L85 80 L80 90 L70 100 L60 90 L55 100 L45 100 L40 90 L30 100 L20 95 L25 85 L15 80 L5 85 L0 75 L10 70 L5 60 L0 55 L0 45 L10 40 L5 30 L0 25 L5 15 L15 20 L20 10 L30 0 L40 10 L45 0 Z M50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30 Z" fill="currentColor"/></svg>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.15]">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <path d="M50 5 L95 95 L5 95 Z" stroke="#ffc300" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="60" r="10" stroke="#ffc300" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="60" r="3" fill="#ffc300" className="animate-pulse" />
          </svg>
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#ffc30033] to-transparent"></div>
      </div>

      {!unlocked && (
        <div onClick={init} className="fixed inset-0 z-[100] bg-[#0f0a05] flex flex-col items-center justify-center p-8 cursor-pointer">
           <div className="p-12 rounded-[4rem] border-4 border-[#b87333] bg-[#1a0f0a] shadow-[0_0_100px_rgba(184,115,51,0.3)] text-center max-w-sm w-full">
              <h2 className="funk-title text-5xl mb-6 text-[#ffc300] leading-none uppercase">CLOCKWORK<br/>FUNK</h2>
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#ffc300] flex items-center justify-center animate-bounce mb-8">
                 <svg className="w-12 h-12 text-[#ffc300]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
              </div>
              <p className="mono text-[10px] tracking-[0.4em] text-[#b87333] uppercase font-bold">OPERATE THE VALVES</p>
           </div>
        </div>
      )}

      <header className="flex-none pt-12 pb-6 px-6 text-center relative z-20">
          <h1 className="funk-title text-4xl text-[#ffc300] tracking-tighter leading-none mb-3 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            SOMETIMES ALL<br /><span className="text-[#b87333]">YOU NEED IS FUNK</span>
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-70">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#cd7f32]"></div>
            <p className="mono text-[10px] font-black uppercase tracking-[0.5em] text-[#cd7f32] animate-pulse">
              Funk est ordo ex chao
            </p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#cd7f32]"></div>
          </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 relative z-10 pb-44 no-scrollbar">
        <div className="max-w-md mx-auto flex flex-col gap-14">
          
          {/* Section I: The Brass Foundation */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">I. The Brass Foundation</h3>
               <div className="w-4 h-4 text-[#ffc300]">
                  <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="8"/></svg>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {BRASS_FOUNDATION.map(tune => <Pad key={tune.id} tune={tune} />)}
            </div>
          </section>

          {/* Section II: The Clockwork Orpheum */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">II. The Clockwork Orpheum</h3>
               <div className="w-4 h-4 text-[#ffc300]">
                  <svg viewBox="0 0 100 100"><path d="M50 10 L90 90 L10 90 Z" stroke="currentColor" fill="none" strokeWidth="8"/></svg>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {CLOCKWORK_ORPHEUM.map(tune => <Pad key={tune.id} tune={tune} />)}
            </div>
          </section>

          {/* Section III: The Harmonic Aether */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">III. The Harmonic Aether</h3>
               <div className="w-5 h-5 text-[#ffc300]">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="4" />
                    <circle cx="50" cy="50" r="15" stroke="currentColor" fill="none" strokeWidth="4" />
                  </svg>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {HARMONIC_AETHER.map(tune => <Pad key={tune.id} tune={tune} />)}
            </div>
          </section>

          {/* Section IV: The Ancient Conclave */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">IV. The Ancient Conclave</h3>
               <div className="w-5 h-5 text-[#ffc300]">
                  <svg viewBox="0 0 100 100">
                     <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {ANCIENT_CONCLAVE.map(tune => <Pad key={tune.id} tune={tune} />)}
            </div>
          </section>

          {/* Section V: The Magnum Opus */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">V. The Magnum Opus</h3>
               <div className="w-5 h-5 text-[#ffc300]">
                  <svg viewBox="0 0 100 100">
                    <rect x="25" y="25" width="50" height="50" stroke="currentColor" fill="none" strokeWidth="8" transform="rotate(45 50 50)" />
                  </svg>
               </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {MAGNUM_OPUS.map(comp => {
                const isActive = activeCompositions.has(comp.id);
                const currentTempo = compTempos[comp.id];
                return (
                  <div key={comp.id} className="flex flex-col gap-4">
                    <div 
                      onClick={() => toggleComposition(comp)}
                      className={`relative w-full p-6 rounded-[2.5rem] border-4 cursor-pointer transition-all duration-300 flex items-center justify-between shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] ${isActive ? 'border-[#ffc300] bg-[#3a2a1a] scale-[1.02]' : 'border-[#4a3a2a] bg-[#1a0f0a] hover:border-[#b87333]'}`}
                    >
                      <div className="flex flex-col">
                        <h4 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-[#ffc300]' : 'text-[#b87333]'}`}>{comp.name}</h4>
                        <p className="mono text-[7px] opacity-40 uppercase tracking-[0.2em] mt-1">{comp.description}</p>
                      </div>
                      <div className="flex gap-2">
                         {comp.items.map(itemId => (
                           <div key={itemId} className={`w-2 h-2 rounded-full border ${activeIds.has(itemId) ? 'bg-[#ffc300] border-[#ffc300] shadow-[0_0_8px_#ffc300]' : 'border-white/10'}`}></div>
                         ))}
                      </div>
                      <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 bg-[#1a0f0a] flex items-center justify-center transition-transform duration-500 ${isActive ? 'rotate-180 border-[#ffc300]' : 'border-[#4a3a2a]'}`}>
                         <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isActive ? 'text-[#ffc300]' : 'text-[#4a3a2a]'}`} fill="currentColor">
                            <path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z"/>
                         </svg>
                      </div>
                    </div>
                    {/* Composition Master Tempo Slider */}
                    <div className={`px-8 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                       <div className="flex justify-between items-center mono text-[8px] text-[#ffc300] uppercase mb-2">
                          <span className="tracking-[0.3em]">MASTER VALVE TEMPO</span>
                          <span className="font-bold text-lg">{currentTempo}</span>
                       </div>
                       <input 
                          type="range" min="40" max="240" 
                          value={currentTempo} 
                          onChange={(e) => changeCompTempo(comp.id, Number(e.target.value))}
                          className="w-full accent-[#ffc300] bg-[#2a1a0a] h-1.5 rounded-full appearance-none cursor-pointer"
                       />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section VI: Quick SFX Valves */}
          <section>
            <div className="flex items-center justify-between mb-6 border-b border-[#b8733333] pb-2">
               <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-[#ffc300]">VI. Manual Valves</h3>
               <div className="w-5 h-5 text-[#ffc300]">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="4" />
                  </svg>
               </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "HIT 1", type: "PIANO", note: 48, icon: "🎹" },
                { label: "HIT 2", type: "PIANO", note: 60, icon: "🎹" },
                { label: "STAB 1", type: "BRASS", note: 48, icon: "🎺" },
                { label: "STAB 2", type: "BRASS", note: 55, icon: "🎺" }
              ].map((hit, i) => (
                <button 
                  key={i}
                  onMouseDown={() => playQuickHit(hit.type as ExtendedSynthType, hit.note)}
                  className="w-full aspect-square rounded-2xl bg-[#1a0f0a] border-2 border-[#4a3a2a] hover:border-[#ffc300] active:scale-95 active:border-[#ffc300] transition-all flex flex-col items-center justify-center gap-1 shadow-inner group overflow-hidden"
                >
                  <span className="text-xl group-active:scale-125 transition-transform">{hit.icon}</span>
                  <span className="mono text-[8px] opacity-40 font-bold tracking-tighter">{hit.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-center py-10 opacity-20">
             <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full border border-[#ffc300]"></div>
                ))}
             </div>
          </div>
        </div>
      </main>

      <footer className="flex-none px-8 py-10 relative z-20 border-t border-[#b8733333] bg-[#0f0a05] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-center gap-6">
          <div className="w-16 h-16 bg-[#1a0f0a] rounded-2xl border-2 border-[#b87333] flex items-center justify-center shadow-inner overflow-hidden relative">
             <div className="absolute inset-0 opacity-10 flex items-center justify-center animate-spin-slow">
               <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#ffc300]">
                 <path d="M50 0 L55 10 L65 10 L70 0 L80 5 L75 15 L85 20 L95 15 L100 25 L90 30 L95 40 L100 45 L100 55 L90 60 L95 70 L100 75 L95 85 L85 80 L80 90 L70 100 L60 90 L55 100 L45 100 L40 90 L30 100 L20 95 L25 85 L15 80 L5 85 L0 75 L10 70 L5 60 L0 55 L0 45 L10 40 L5 30 L0 25 L5 15 L15 20 L20 10 L30 0 L40 10 L45 0 Z M50 30 A 20 20 0 1 0 50 70 A 20 20 0 1 0 50 30 Z" fill="currentColor"/>
               </svg>
             </div>
             <div className="grid grid-cols-3 gap-1 z-10">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${activeIds.size > 0 ? 'bg-[#ffc300] animate-pulse' : 'bg-[#4a3a2a]'}`} style={{ animationDelay: `${i*100}ms` }}></div>
                ))}
             </div>
          </div>
          <div className="flex flex-col">
            <p className="mono text-lg text-[#ffc300] font-black uppercase tracking-widest leading-none">
              {activeIds.size > 0 ? `${activeIds.size} VALVES ENGAGED` : 'ARCHITECT STANDBY'}
            </p>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#b87333] mt-2">Harmonizing the Clockwork Soul</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
        .funk-title { font-family: 'Bungee Shade', cursive; }
        .mono { font-family: 'Space Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; outline: none; }
        body { background-color: #0f0a05; overflow: hidden; height: 100vh; width: 100vw; position: fixed; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffc300;
          cursor: pointer;
          border: 4px solid #1a0f0a;
          box-shadow: 0 0 15px rgba(255, 195, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default App;
