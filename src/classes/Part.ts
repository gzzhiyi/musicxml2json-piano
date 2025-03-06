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

  private staffs: Clef[] = []
  private beats = 4
  private beatType = 4
  private beatUnit = 4
  private bpm = 60

  constructor({ measures, speed }: PropsType) {
    measures.forEach((measure, index) => {
      const staffs = this.getStaffs(measure)
      if (!staffs) {
        return
      }

      this.setGlobalStaffs(staffs)

      const metronome = this.getMetronome(measure)
      metronome && this.setGlobalMetronome(metronome)

      const timeSignature = this.getTimeSignature(measure)
      timeSignature && this.setGlobalTimeSignature(timeSignature)

      const dynamics = this.getDynamics(measure)

      const measureClass = new MeasureClass({
        dynamics,
        id: `M_${index + 1}`,
        beatUnit: this.beatUnit,
        bpm: this.bpm,
        beats: this.beats,
        beatType: this.beatType,
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

  private getStaffs(measureXML: MeasureXML): Clef[] | null {
    const { attributes } = measureXML
    if (!attributes) {
      return null
    }

    const o: Clef[] = []

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
    this.beatUnit = beatUnit
    this.bpm = bpm
  }

  private setGlobalTimeSignature({ beats, beatType }: TimeSignature) {
    this.beats = beats
    this.beatType = beatType
  }
}
