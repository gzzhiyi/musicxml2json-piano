import PartClass from '@/classes/Part';
import { Measure, Note } from '@/types';
type PropsType = {
    debug?: boolean;
    speed?: number;
    xmlStr: string;
};
export default class Parser {
    parts: PartClass[];
    title: string;
    private _debug;
    private _oriXml;
    private _speed;
    constructor(props: PropsType);
    private getTitle;
    private filterParts;
    private getParts;
    getMeasureById(id: string): Measure | null;
    private getMeasures;
    getNoteById(id: string): Note | null;
}
export {};
