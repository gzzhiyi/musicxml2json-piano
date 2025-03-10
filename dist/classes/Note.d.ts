import { Beam, Clef, Dot, Notations, Note as NoteT, NoteData, NoteType, NoteView, NoteXML, Stem, Time, TimeModification } from '@/types';
type PropsType = {
    id: string;
    staff?: Clef;
    xmlData?: NoteXML;
};
interface NoteInterface extends NoteT {
    appendData(data: NoteData): void;
    getData(noteXML: NoteXML, staff: Clef): NoteData | null;
}
export default class Note implements NoteInterface {
    beam: Beam[] | null;
    data: NoteData[] | null;
    dot: Dot | null;
    id: string;
    name: string;
    notations: Notations;
    staff: Clef | null;
    stem: Stem | null;
    time: Time | null;
    timeModification: TimeModification | null;
    type: NoteType;
    view: NoteView;
    constructor({ id, staff, xmlData }: PropsType);
    private getArticulations;
    private getBeam;
    getData(noteXML: NoteXML, staff: Clef): NoteData | null;
    private getDot;
    private getView;
    private getNotations;
    private getSlur;
    private getStem;
    private getTied;
    private getTimeModification;
    private getTuplet;
    private getType;
    appendData(data: NoteData): void;
    appendTime(start: number, duration: number): void;
}
export {};
