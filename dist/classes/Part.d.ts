import MeasureClass from '@/classes/Measure';
import { MeasureXML, Metronome, TimeSignature } from '@/types';
type PropsType = {
    measures: MeasureXML[];
    speed?: number;
};
export default class Part {
    duration: number;
    measures: MeasureClass[];
    metronome: Metronome;
    timeSignature: TimeSignature;
    private staffs;
    constructor({ measures, speed }: PropsType);
    private getDynamics;
    private getMetronome;
    private getStaffs;
    private getTimeSignature;
    private setGlobalStaffs;
    private setGlobalMetronome;
    private setGlobalTimeSignature;
}
export {};
