import {
  has,
  hasIn,
  isArray,
  isEmpty,
  isObject
} from 'lodash'
import {
  ClefValue,
  PartwiseXML,
  PartXML,
  MeasureXML,
  MusicXML,
  BeamValue,
  DotValue,
  StemValue,
  Staffs,
  NoteData,
  SlurValue,
  ArticulationValue,
  TiedValue,
  DynamicsValue
} from '@/types'
import {
  noteToMidi,
  calculateRelativePosition
} from '@/core/utils'

function filterPart(part: PartXML | PartXML[]) {
  let parts: PartXML | PartXML[] = []

  if (isArray(part)) {
    parts = part
  } else if (isObject(part)) {
    parts.push(part)
  } else {
    return []
  }

  return parts
}

export function findAllParts(xml: MusicXML): PartXML[] {
  const partwise: PartwiseXML | undefined = xml?.['score-partwise']

  if (!partwise || !partwise.part || isEmpty(partwise?.part)) {
    return []
  }

  return filterPart(partwise.part)
}

/**
 * 查找所有<measure>
 */
export function findAllMeasures(partsXML: PartXML[]): MeasureXML[] {
  const getMeasure = (measureXML: MeasureXML | MeasureXML[], partId: string): MeasureXML[] => {
    if (isArray(measureXML)) {
      const arr: MeasureXML[] = []

      measureXML.map((item: MeasureXML) => {
        const o = { partId }

        if (isObject(item)) {
          arr.push({ ...o, ...item })
        } else {
          arr.push({ ...o })
        }
      })

      return arr
    }

    if (isObject(measureXML)) {
      return [measureXML]
    }

    return []
  }

  let arr: MeasureXML[] = []
  partsXML.map((item: PartXML) => {
    if (!isArray(item.measure)) {
      return
    }

    const measure: MeasureXML[] = getMeasure(item.measure, item._id || '')
    arr = arr.concat(measure)
  })

  return arr
}

/**
 * 获取演奏记号
 */
export function getArticulations(noteXML): ArticulationValue {
  if (has(noteXML, 'notations.articulations.staccato')) { // 跳音
    return 'staccato'
  }

  if (has(noteXML, 'notations.articulations.accent')) { // 重音
    return 'accent'
  }

  return null
}

/**
 * 获取时值横杆属性
 */
export function getBeam(noteXML): BeamValue[] {
  if (!has(noteXML, 'beam')) {
    return []
  }

  const arr: BeamValue[] = []

  if (isArray(noteXML.beam)) {
    noteXML.beam.map((item) => {
      arr.push(item['#text'])
    })
  } else {
    arr.push(noteXML.beam['#text'])
  }

  return arr
}

/**
 * 每个小节有几个拍
 */
export function getBeats(measureXML: MeasureXML): number {
  const { attributes } = measureXML
  return attributes?.time?.beats || 0
}

/**
 * 以哪种音符为一拍
 */
export function getBeatType(measureXML: MeasureXML): number {
  const { attributes } = measureXML
  return attributes?.time?.['beat-type'] || 0
}

/**
 * 获取每分钟多少拍子
*/

export function getBpm(measureXML: MeasureXML): number {
  const hasPerMinute = (item: unknown) => {
    return hasIn(item, 'direction-type.metronome.per-minute')
  }

  const { direction } = measureXML
  let bpm = 0

  if (isArray(direction)) {
    direction.map((item) => {
      if (hasPerMinute(item)) {
        bpm = item['direction-type'].metronome['per-minute']
      }
    })
  } else if (isObject(direction) && hasPerMinute(direction)) {
    bpm = direction['direction-type'].metronome['per-minute']
  }

  return bpm
}

export function getData(noteXML, staff: ClefValue): NoteData {
  const { pitch } = noteXML
  const { step, octave, alter } = pitch

  // 临时标记
  let accidental = null
  if (has(noteXML, 'accidental')) {
    accidental = noteXML.accidental
  }

  // 计算音符位置
  const position = calculateRelativePosition(step, octave, staff) || 0

  return {
    accidental,
    legerLine: position < -1 || position > 5,
    midiCode: noteToMidi(`${step}${alter ? '#' : ''}`, octave),
    pitch: {
      step,
      octave,
      alter: alter || 0
    },
    position
  }
}

/**
 * 获取附点
 */
export function getDot(noteXML): DotValue {
  if (!has(noteXML, 'dot')) {
    return null
  }

  if (isArray(noteXML.dot) && noteXML.dot.length >= 2) {
    return 'doubleDot'
  }

  return 'dot'
}

/**
 * 获取动态标记
 */
export function getDynamics(measureXML: MeasureXML): DynamicsValue {
  const { direction } = measureXML
  if (!direction || !isArray(direction)) {
    return null
  }

  let dynamics: DynamicsValue = null
  for (const item of direction) {
    if (has(item, 'direction-type.dynamics.mf')) {
      dynamics = 'mf'
    } else if (has(item, 'direction-type.dynamics.fff')) {
      dynamics = 'fff'
    }
  }

  return dynamics
}

export function getScoreType(xml: MusicXML): string {
  if (!isEmpty(xml['score-partwise'])) {
    return 'partwise'
  }

  if (!isEmpty(xml['score-timewise'])) {
    return 'timewise'
  }

  return ''
}

export function getSlur(noteXML): SlurValue {
  if (has(noteXML, 'notations.slur._type')) {
    return noteXML.notations.slur._type
  }

  return null
}

/**
 * 获取时值符干属性
 */
export function getStem(noteXML): StemValue {
  if (has(noteXML, 'stem')) {
    return noteXML.stem
  }

  return null
}

/**
 * 延音线
 */
export function getTied(noteXML): TiedValue[] | null {
  if (!has(noteXML, 'notations.tied')) {
    return null
  }

  const tied = noteXML.notations.tied

  const arr: TiedValue[] = []
  if (isArray(tied)) {
    tied.forEach((item) => {
      arr.push(item._type)
    })

    return arr
  }

  return [tied._type]
}

/**
 * 获取谱号
 */
export function getStaffs(measureXML: MeasureXML): Staffs {
  const { attributes } = measureXML
  if (!attributes) {
    return {}
  }

  const o: Staffs = {}

  if (isArray(attributes?.clef)) {
    attributes.clef.map((item) => {
      o[item._number] = item.sign
    })
  } else if (isObject(attributes?.clef)) {
    const { sign, _number } = attributes.clef
    o[_number] = sign
  }

  return o
}

/**
 * 是否和弦音符
 */
export function isChord(noteXML): boolean {
  return has(noteXML, 'chord')
}

/**
 * 是否休止符
 */
export function isRest(noteXML): boolean {
  return has(noteXML, 'rest')
}
