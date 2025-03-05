import { Note, NoteType, ClefValue } from '@/types'

/**
 * 计算音符时长
 */
export function calNoteDuration(note: Note, beats: number, beatType: number, bpm: number, bpmUnit: NoteType, speed: number): number {
  const { view, type, dot } = note

  if (!type) {
    return 0
  }

  const beatTime = (60 / bpm) / (beatType / noteTypeToNumber(bpmUnit)) * 1000 // 计算一节拍时值

  let duration = 0
  if (view === 'rest' && type === 'whole') { // 全休止符处理
    duration = beatTime * beats
  } else {
    duration = (beatType / noteTypeToNumber(type)) * beatTime
  }

  if (dot === 'dot') { // 附点
    duration = duration * 1.5
  } else if (dot === 'doubleDot') { // 复附点
    duration = duration * 1.75
  }

  return roundToThreeDecimals(duration / speed)
}

/**
 * 音符类型转成数字
 */
export function noteTypeToNumber(type: NoteType): number {
  const types = {
    'whole': 1,
    'half': 2,
    'quarter': 4,
    'eighth': 8,
    '16th': 16
  }

  if (!types[type]) {
    console.warn(`Note type [${type}] is invalid.`);
  }

  return types[type];
}

/**
 * 数字转成音符类型
 */
export function numberToNoteType(num: number): NoteType {
  const types = {
    1: 'whole',
    2: 'half',
    4: 'quarter',
    8: 'eighth',
    16: '16th'
  }

  if (!types[num]) {
    console.warn(`Note type [${num}] is invalid.`);
  }

  return types[num];
}

/**
 * 保留小数点后三位
 */
export function roundToThreeDecimals(number) {
  return Number(number.toFixed(3))
}

/**
 * 通过音阶和音调来计算对应的MIDI编号
 */
export function noteToMidi(note, octave) {
  const notes = {
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6,
    'G': 7,
    'G#': 8,
    'A': 9,
    'A#': 10,
    'B': 11
  }

  // 检查输入是否有效
  if (notes[note] === undefined || isNaN(octave)) {
    throw new Error('Invalid note or octave')
  }

  // 计算MIDI编号
  const midiNumber = (octave + 1) * 12 + notes[note]
  return midiNumber
}

/**
 * 计算音符在五线谱的位置
 */
export function calculateRelativePosition (noteStep: string, noteOctave: number, staff: ClefValue) {
  const step = 0.5
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

  let [baseNoteIndex, baseOctave] = [0, 0]

  if (staff === 'G') { // 高音谱
    baseNoteIndex = noteNames.indexOf('E')
    baseOctave = 5
  } else if (staff === 'F') { // 低音谱
    baseNoteIndex = noteNames.indexOf('G')
    baseOctave = 3
  } else {
    console.error('Invalid staff name.')
    return null
  }

  const noteIndex = noteNames.indexOf(noteStep)

  // 检查音符是否在列表中
  if (noteIndex === -1) {
    console.error('Invalid note name.')
    return null
  }

  // 计算相对的位置
  const position = ((noteIndex - baseNoteIndex) + ((noteOctave - baseOctave) * noteNames.length)) * -step
  return position
}

