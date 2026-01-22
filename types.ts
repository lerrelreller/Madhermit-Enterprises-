
export type SynthType = 
  | 'SQUELCH' | 'CLAV' | 'LEAD' | 'BASS' | 'PERC' | 'WHISTLE' | 'GEAR' 
  | 'CHORD' | 'PAD' | 'ARPEGGIO'
  | 'BELL' | 'FLUTE' | 'PIANO' | 'STRING' | 'BRASS';

export interface FunkyTune {
  id: string;
  name: string;
  tempo: number;
  style: string;
  color: string;
  url: string;
  synthConfig?: {
    type: SynthType;
    note: number;
    sequence?: number[];
  };
  pattern: {
    bass: number[];
    rhythm: number[];
  };
}

export interface CrawlerResponse {
  tunes: FunkyTune[];
}
