
// Original XML
export interface PartwiseXML {
  part?: []
  _version? : string
}

export interface MusicXML {
  '?xml'?: { _version?: string }
  'score-partwise'?: PartwiseXML
}

export interface PartXML {
  _id?: string
  measure?: MeasureXML[]
}

export interface MeasureXML {
  _number?: string
  note?: NoteXML[]
  attributes?: {
    clef?: {
      sign: ClefValue
      _number: string
    }
    time?: {
      beats?: number
    }
  }
  [propName: string]: any
}

export interface NoteXML {
  type: NoteType
  pitch? : Pitch
  staff: number
  [propName: string]: any
}

// 临时标记
export type AccidentalValue = 'sharp' | 'flat' | 'natural' | null

// 演奏标记
export type ArticulationValue = 'accent' | 'staccato' | null

// 时值横杆类型
export type BeamValue = 'begin' | 'continue' | 'end' | null

// 曲谱标记
export type ClefValue = 'G' | 'F' | null

// 附点类型
export type DotValue = 'dot' | 'doubleDot' | null

// 动态标记
export type DynamicsValue = 'mf' | 'fff' | null

// 小节
export type Measure = {
  bpm: number
  beats: number
  beatType: number
  dynamics: DynamicsValue
  id: string
  num: string
  staffs: ClefValue[]
  time: Time | null
}

// 乐理符号
export type Notations = {
  articulations: ArticulationValue // 演奏标记
  slur: SlurValue // 连音线
  tied: TiedValue[] | null // 延音线
}

// 音符
export type Note = {
  beam: BeamValue[] | null // 符杠
  data: NoteData[] | null
  dot: DotValue // 附点
  id: string // 音符ID
  measureId: string // 小节ID
  notations: Notations // 乐理符号
  staff: ClefValue // 归属谱的序号
  stem: StemValue // 符干
  time: Time | null // 时间
  type: NoteType // 音符类型
  view: NoteView // 音符显示
}

// 音符数据
export type NoteData = {
  accidental: AccidentalValue | null // 临时标记
  legerLine: boolean // 加线
  midiCode: number // 对应的MIDI Code
  pitch: Pitch
  position: number // 五线谱位置（从第五线开始为0）
}

// 音符类型
export type NoteType = 'whole' | 'half' | 'quarter' | 'eighth' | '16th'

// 音符显示类型
export type NoteView = 'single' | 'chord' | 'rest'

// 音高
export type Pitch = {
  step: string
  octave: number
  alter: number
}

// 连音类型
export type SlurValue = 'start' | 'continue' | 'stop' | null

// 谱号属性
export type Staffs = {
  [key: string]: ClefValue
}

// 符干方向
export type StemValue = 'up' | 'down' | null

// 延音线
export type TiedValue = 'start' | 'continue' | 'stop'

// 时间属性
export type Time = {
  start: number // 开始时间（毫秒）
  startRange: number // 开始时间范围（毫秒）
  duration: number // 持续时间（毫秒）
  end: number // 结束时间（毫秒）
  endRange: number // 结束时间范围（毫秒）
}
