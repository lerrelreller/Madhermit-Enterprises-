
import { SynthType } from "../types";

export type ExtendedSynthType = SynthType;

interface LoopState {
  id: string;
  type: ExtendedSynthType;
  midiNote: number;
  sequence: number[];
  step: number;
  tempo: number;
  nextNoteTime: number;
}

export class SynthEngine {
  private ctx: AudioContext;
  private activeLoops: Map<string, LoopState> = new Map();
  private masterGain: GainNode;
  private schedulerTimerId?: number;
  private lookahead = 0.1;
  private scheduleInterval = 25;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    // Increased master volume slightly
    this.masterGain.gain.value = 0.6;
    this.startScheduler();
  }

  private startScheduler() {
    const run = () => {
      this.scheduler();
      this.schedulerTimerId = window.setTimeout(run, this.scheduleInterval);
    };
    run();
  }

  private scheduler() {
    const currentTime = this.ctx.currentTime;
    this.activeLoops.forEach((loop) => {
      while (loop.nextNoteTime < currentTime + this.lookahead) {
        this.scheduleNote(loop);
        this.advanceNote(loop);
      }
    });
  }

  private advanceNote(loop: LoopState) {
    const secondsPerBeat = 60.0 / loop.tempo;
    const sixteenthNoteDuration = secondsPerBeat / 4.0;
    loop.nextNoteTime += sixteenthNoteDuration;
    loop.step = (loop.step + 1) % loop.sequence.length;
  }

  private scheduleNote(loop: LoopState) {
    const velocity = loop.sequence[loop.step];
    if (velocity === 0) return;
    this.playStep(loop.type, loop.midiNote, velocity, loop.nextNoteTime);
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  private playStep(type: ExtendedSynthType, midiNote: number, velocity: number, time: number) {
    const freq = this.midiToFreq(midiNote);
    const g = this.ctx.createGain();
    g.connect(this.masterGain);
    g.gain.setValueAtTime(0, time);
    
    switch (type) {
      case 'GEAR': {
        // BOOSTED Cog Grind: Industrial friction
        [1, 1.01, 2.5, 4.2].forEach((h, i) => {
          const o = this.ctx.createOscillator();
          o.type = i % 2 === 0 ? 'sawtooth' : 'square';
          o.frequency.setValueAtTime(freq * h, time);
          o.detune.setValueAtTime(Math.random() * 30 - 15, time);
          
          const f = this.ctx.createBiquadFilter();
          f.type = 'bandpass';
          f.frequency.setValueAtTime(freq * 3, time);
          f.Q.setValueAtTime(8, time);
          
          o.connect(f);
          f.connect(g);
          o.start(time);
          o.stop(time + 0.4);
        });
        // High volume multiplier for Cog Grind
        g.gain.linearRampToValueAtTime(velocity * 1.8, time + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        break;
      }
      case 'BELL': {
        // FIX: Ramping parent gain immediately to make children audible
        g.gain.linearRampToValueAtTime(1.0, time + 0.001);
        const harmonics = [1, 2, 3, 4.2, 5.1, 7.3, 11];
        harmonics.forEach((h, i) => {
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * h, time);
          const hG = this.ctx.createGain();
          hG.gain.setValueAtTime(0, time);
          hG.gain.linearRampToValueAtTime((velocity * 0.6) / (i + 1), time + 0.005);
          hG.gain.exponentialRampToValueAtTime(0.0001, time + (4.0 / (i + 0.5)));
          osc.connect(hG);
          hG.connect(g);
          osc.start(time);
          osc.stop(time + 5.0);
        });
        break;
      }
      case 'PIANO': {
        // FIX: Ramping parent gain immediately
        g.gain.linearRampToValueAtTime(1.0, time + 0.001);
        [1, 2.01, 3.02, 4.03, 5.05, 6.08].forEach((h, i) => {
          const o = this.ctx.createOscillator();
          o.type = i === 0 ? 'triangle' : 'sine';
          o.frequency.setValueAtTime(freq * h, time);
          const hG = this.ctx.createGain();
          hG.gain.setValueAtTime(0, time);
          hG.gain.linearRampToValueAtTime((velocity * 0.8) / (i + 1), time + 0.004);
          hG.gain.exponentialRampToValueAtTime(0.0001, time + (1.5 / (i + 1)));
          o.connect(hG);
          hG.connect(g);
          o.start(time);
          o.stop(time + 2.0);
        });
        break;
      }
      case 'BRASS': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.Q.setValueAtTime(12, time);
        f.frequency.setValueAtTime(freq * 0.4, time);
        f.frequency.exponentialRampToValueAtTime(freq * 12, time + 0.05);
        f.frequency.exponentialRampToValueAtTime(freq * 1.8, time + 0.4);
        osc.connect(f);
        f.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 0.9, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
        osc.start(time);
        osc.stop(time + 0.7);
        break;
      }
      case 'CLAV': {
        const o = this.ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, time);
        const f = this.ctx.createBiquadFilter();
        f.type = 'highpass';
        f.frequency.setValueAtTime(450, time);
        o.connect(f);
        f.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 0.8, time + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        o.start(time);
        o.stop(time + 0.35);
        break;
      }
      case 'SQUELCH': {
        const o = this.ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(freq, time);
        const f = this.ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.Q.setValueAtTime(25, time);
        f.frequency.setValueAtTime(freq * 12, time);
        f.frequency.exponentialRampToValueAtTime(freq * 0.3, time + 0.25);
        o.connect(f);
        f.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 0.9, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
        o.start(time);
        o.stop(time + 0.5);
        break;
      }
      case 'WHISTLE': {
        const o = this.ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, time);
        o.frequency.exponentialRampToValueAtTime(freq * 1.05, time + 0.2);
        g.gain.linearRampToValueAtTime(velocity * 0.5, time + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
        o.connect(g);
        o.start(time);
        o.stop(time + 0.8);
        break;
      }
      case 'LEAD': {
        [0, 10, -10].forEach(detune => {
          const o = this.ctx.createOscillator();
          o.type = 'sawtooth';
          o.frequency.setValueAtTime(freq, time);
          o.detune.setValueAtTime(detune, time);
          o.connect(g);
          o.start(time);
          o.stop(time + 0.7);
        });
        g.gain.linearRampToValueAtTime(velocity * 0.6, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
        break;
      }
      case 'FLUTE': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        const lfo = this.ctx.createOscillator();
        const lfoG = this.ctx.createGain();
        lfo.frequency.setValueAtTime(6.0, time);
        lfoG.gain.setValueAtTime(freq * 0.04, time);
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        lfo.start(time);
        const noise = this.ctx.createBiquadFilter();
        noise.type = 'bandpass';
        noise.frequency.setValueAtTime(freq * 3, time);
        const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
        const d = b.getChannelData(0);
        for(let i=0; i<d.length; i++) d[i] = Math.random()*2-1;
        const nsrc = this.ctx.createBufferSource();
        nsrc.buffer = b;
        nsrc.connect(noise);
        noise.connect(g);
        osc.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 0.6, time + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, time + 1.0);
        osc.start(time);
        osc.stop(time + 1.0);
        nsrc.start(time);
        break;
      }
      case 'BASS': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 6, time);
        filter.frequency.exponentialRampToValueAtTime(freq * 0.7, time + 0.3);
        osc.connect(filter);
        filter.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 1.2, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
        osc.start(time);
        osc.stop(time + 0.6);
        break;
      }
      case 'PERC': {
        const o = this.ctx.createOscillator();
        o.type = midiNote < 50 ? 'triangle' : 'sine';
        o.frequency.setValueAtTime(freq * 3, time);
        o.frequency.exponentialRampToValueAtTime(1, time + 0.15);
        o.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 1.0, time + 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        o.start(time);
        o.stop(time + 0.15);
        break;
      }
      default: {
        const o = this.ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, time);
        o.connect(g);
        g.gain.linearRampToValueAtTime(velocity * 0.7, time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
        o.start(time);
        o.stop(time + 0.6);
      }
    }
  }

  public playOneShot(type: ExtendedSynthType, midiNote: number, velocity: number = 1.0) {
    if (!this.ctx) return;
    this.playStep(type, midiNote, velocity, this.ctx.currentTime);
  }

  public toggleLoop(id: string, type: ExtendedSynthType, midiNote: number, sequence: number[], tempo: number) {
    if (this.activeLoops.has(id)) {
      this.activeLoops.delete(id);
      return false;
    }
    const state: LoopState = { id, type, midiNote, sequence, step: 0, tempo, nextNoteTime: this.ctx.currentTime + 0.05 };
    this.activeLoops.set(id, state);
    return true;
  }

  public updateTempo(id: string, newTempo: number) {
    const state = this.activeLoops.get(id);
    if (state) state.tempo = newTempo;
  }
}
