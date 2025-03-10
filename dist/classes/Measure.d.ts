import { Clef, Dynamics, MeasureXML, Metronome, Note, Time, TimeSignature } from '@/types';
type PropsType = {
    dynamics: Dynamics | null;
    beats: number;
    beatType: number;
    beatUnit: number;
    bpm: number;
    id: string;
    isLast: boolean;
    speed: number;
    staffs: Clef[];
    startTime: number;
    xmlData: MeasureXML;
};
export default class Measure {
    dynamics: Dynamics | null;
    id: string;
    isLast: boolean;
    metronome: Metronome;
    notes: Note[];
    number: string;
    staffs: Clef[];
    time: Time | null;
    timeSignature: TimeSignature;
    private speed;
    private startTime;
    constructor({ dynamics, id, isLast, beats, beatType, beatUnit, bpm, speed, staffs, startTime, xmlData }: PropsType);
    private getNotes;
    private addNoteToList;
    private getNumber;
    private isChord;
    private calNoteDuration;
}
export {};
