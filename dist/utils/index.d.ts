import { Clef, NoteType } from '@/types';
export declare function noteTypeToNumber(type: NoteType): number;
export declare function numberToNoteType(num: number): NoteType;
export declare function calculateRelativePosition(noteStep: string, noteOctave: number, staff: Clef): number | null;
export declare function noteToMidi(note: any, octave: any): any;
