import { has, isArray, isEmpty, isObject } from 'lodash'
import { noteTypeToNumber } from '@/utils'
import MeasureClass from '@/classes/Measure'
import {
  Clef,
  Dynamics,
  MeasureXML,
  Metronome,
  TimeSignature
} from '@/types'

type PropsType = {
  measures: MeasureXML[]
  speed?: number
}

export default class Part {
  public duration: number = 0
  public measures: MeasureClass[] = []
  public metronome: Metronome = { beatUnit: 4, bpm: 60 }
  public timeSignature: TimeSignature = { beats: 4, beatType: 4 }

  private staffs: Clef[] = []

  constructor({ measures, speed }: PropsType) {
    measures.forEach((measure, index) => {
      const staffs = this.getStaffs(measure)
      if (!isEmpty(staffs)) {
        this.setGlobalStaffs(staffs)
      }

      const metronome = this.getMetronome(measure)
      metronome && this.setGlobalMetronome(metronome)

      const timeSignature = this.getTimeSignature(measure)
      timeSignature && this.setGlobalTimeSignature(timeSignature)

      const dynamics = this.getDynamics(measure)

      const measureClass = new MeasureClass({
        dynamics,
        id: `M_${index + 1}`,
        beatUnit: this.metronome.beatUnit,
        bpm: this.metronome.bpm,
        beats: this.timeSignature.beats,
        beatType: this.timeSignature.beatType,
        isLast: index === measures.length - 1,
        speed: speed || 1,
        staffs: this.staffs,
        startTime: this.duration,
        xmlData: measure
      })

      this.duration += measureClass.time?.duration || 0
      this.measures.push(measureClass)
    })
  }

  private getDynamics(measureXML: MeasureXML): Dynamics | null {
    const { direction } = measureXML
    if (!direction || !isArray(direction)) {
      return null
    }

    let dynamics: Dynamics | null = null
    for (const item of direction) {
      if (has(item, 'direction-type.dynamics.mf')) {
        dynamics = 'mf'
      } else if (has(item, 'direction-type.dynamics.fff')) {
        dynamics = 'fff'
      }
    }

    return dynamics
  }

  private getMetronome(measureXML: MeasureXML): Metronome | null {
    const directions = isArray(measureXML?.direction) ? measureXML.direction : [measureXML?.direction]

    for (const item of directions) {
      const metronomeXML = item?.['direction-type']?.metronome

      if (metronomeXML) {
        return {
          beatUnit: noteTypeToNumber(metronomeXML['beat-unit']),
          bpm: metronomeXML['per-minute']
        }
      }
    }

    return null
  }

  private getStaffs(measureXML: MeasureXML): Clef[] {
    const o: Clef[] = []

    const { attributes } = measureXML
    if (!attributes) {
      return o
    }

    if (isArray(attributes?.clef)) {
      attributes.clef.map((item) => {
        o.push(item.sign)
      })
    } else if (isObject(attributes?.clef)) {
      const { sign } = attributes.clef
      o.push(sign)
    }

    return o
  }

  private getTimeSignature(measureXML: MeasureXML): TimeSignature | null {
    const timeXML = measureXML?.attributes?.time

    return isEmpty(timeXML) ? null : {
      beats: timeXML?.beats || 0,
      beatType: timeXML?.['beat-type'] || 0
    }
  }

  private setGlobalStaffs(staffs: Clef[]) {
    this.staffs = staffs
  }

  private setGlobalMetronome({ beatUnit, bpm }: Metronome) {
    this.metronome = { beatUnit, bpm }
  }

  private setGlobalTimeSignature({ beats, beatType }: TimeSignature) {
    this.timeSignature = { beats, beatType }
  }
}
