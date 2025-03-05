import { ClefValue, DynamicsValue, Time } from '@/types'

type PropsType = {
  id: string
  num: string
  staffs: ClefValue[]
  bpm: number
  beats: number
  beatType: number
}

export default class Measure {
  public id: string // 音符ID
  public num: string // 小节ID
  public staffs: ClefValue[]
  public bpm: number
  public beats: number
  public beatType: number
  public dynamics: DynamicsValue
  public time: Time | null // 时间

  constructor({
    id,
    num,
    staffs,
    bpm,
    beats,
    beatType
  }: PropsType) {
    // Props
    this.id = id
    this.num = num
    this.staffs = staffs
    this.bpm = bpm
    this.beats = beats
    this.beatType = beatType

    // Prototypes
    this.dynamics = null
    this.time = null
  }

  setDynamics(val: DynamicsValue) {
    this.dynamics = val
  }

  setTime(val: Time) {
    this.time = val
  }
}