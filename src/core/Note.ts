import { sortBy } from 'lodash'
import {
  ArticulationValue,
  BeamValue,
  ClefValue,
  DotValue,
  Notations,
  NoteData,
  NoteType,
  NoteView,
  SlurValue,
  StemValue,
  Time,
  TiedValue
} from '@/types'

type PropsType = {
  id: string
  measureId: string
  staff: ClefValue
  type: NoteType
  view: NoteView
}

export default class Note {
  public beam: BeamValue[] | null // 符杠
  public data: NoteData[] | null
  public dot: DotValue // 附点
  public id: string // 音符ID
  public measureId: string // 小节ID
  public notations: Notations
  public staff: ClefValue // 归属谱的序号
  public stem: StemValue // 符干
  public time: Time | null // 时间
  public type: NoteType // 音符类型
  public view: NoteView // 音符显示

  constructor({
    id,
    measureId,
    staff,
    type,
    view
  }: PropsType) {
    // Props
    this.id = id
    this.measureId = measureId
    this.staff = staff
    this.type = type
    this.view = view

    // Prototypes
    this.beam = null
    this.data = null
    this.dot = null
    this.notations = {
      articulations: null,
      slur: null,
      tied: null
    }
    this.stem = null
    this.time = null
  }

  setArticulation(val: ArticulationValue) {
    this.notations.articulations = val
  }

  setView(val: NoteView) {
    this.view = val
  }

  setBeam(val: BeamValue[]) {
    this.beam = val
  }

  setDot(val: DotValue) {
    this.dot = val
  }

  setSlur(val: SlurValue) {
    this.notations.slur = val
  }

  setTied(val: TiedValue[]) {
    this.notations.tied = val
  }

  setStem(val: StemValue) {
    this.stem = val
  }

  setData(val: NoteData) {
    this.data = [val]
  }

  setTime(val: Time) {
    this.time = val
  }

  appendData(val: NoteData) {
    if (!this.data) {
      return
    }

    this.data.push(val)
    this.data = sortBy(this.data, 'position')
  }
}