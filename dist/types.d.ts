export type Accidental = 'sharp' | 'flat' | 'natural';
export type Articulation = 'accent' | 'staccato';
export type Beam = 'begin' | 'continue' | 'end';
export type Clef = 'G' | 'F';
export type Dot = 'dot' | 'doubleDot';
export type Dynamics = 'mf' | 'fff';
export type NoteType = 'whole' | 'half' | 'quarter' | 'eighth' | '16th' | '32nd' | '64th';
export type NoteView = 'single' | 'chord' | 'rest';
export type Slur = 'start' | 'continue' | 'end';
export type Stem = 'up' | 'down';
export type Tied = 'start' | 'continue' | 'stop';
export type Tuplet = 'start' | 'stop';
export type MusicXML = {
    'score-partwise'?: PartwiseXML;
};
type PartwiseXML = {
    part?: PartXML[];
    work?: {
        'work-title': string;
    };
};
export type PartXML = {
    measure?: MeasureXML | MeasureXML[];
};
type ClefXML = {
    sign: Clef;
    _number: string;
};
type TimeSignatureXML = {
    beats?: number;
    'beat-type': number;
};
type MeasureAttributesXML = {
    clef?: ClefXML;
    time?: TimeSignatureXML;
};
export type MeasureXML = {
    _number?: string;
    attributes?: MeasureAttributesXML;
    note?: NoteXML[];
    [propName: string]: any;
};
export type NoteXML = {
    pitch?: Pitch;
    staff: number;
    type: NoteType;
    [propName: string]: any;
};
export type Measure = {
    dynamics: Dynamics | null;
    id: string;
    isLast: boolean;
    metronome: Metronome;
    number: string;
    staffs: Partial<{
        [key in Clef]: Note[];
    }>;
    time: Time | null;
    timeSignature: TimeSignature;
};
export type Metronome = {
    beatUnit: number;
    bpm: number;
};
export type Notations = {
    articulations: Articulation | null;
    slur: Slur | null;
    tied: Tied | null;
    tuplet: Tuplet | null;
};
export type Note = {
    beam: Beam[] | null;
    data: NoteData[] | null;
    dot: Dot | null;
    id: string;
    name: string;
    notations: Notations;
    stem: Stem | null;
    time: Time | null;
    timeModification: TimeModification | null;
    type: NoteType;
    view: NoteView;
};
export interface NoteData {
    accidental: Accidental | null;
    legerLine: boolean;
    midiCode: number;
    pitch: Pitch;
    position: number;
}
export type Part = {
    duration: number;
    measures: Measure[];
};
export type Pitch = {
    step: string;
    octave: number;
    alter: number;
};
export interface Time {
    start: number;
    duration: number;
    end: number;
}
export type TimeModification = {
    actualNotes: number;
    normalNotes: number;
};
export type TimeSignature = {
    beats: number;
    beatType: number;
};
export {};
