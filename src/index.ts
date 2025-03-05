import { XMLValidator } from 'fast-xml-parser'
import { filter, find } from 'lodash'
import {
  MusicXML as MusicXMLType,
  PartXML as PartXMLType,
  MeasureXML as MeasureXMLType,
  Measure as MeasureType,
  Note as NoteType,
  NoteType as NoteTypeType
} from '@/types'
import {
  numberToNoteType as _numberToNoteType,
  noteTypeToNumber as _noteTypeToNumber
} from '@/core/utils'
import {
  findAllParts,
  findAllMeasures,
  getScoreType
} from '@/core/xmlHandler'
import parseToJson from '@/core/parseToJson'
import parseData from '@/core/parseData'

interface Options {
  bpm?: number
  bpmUnit?: NoteTypeType
  debug?: boolean
  speed?: number
}

/**
 * Parser Class
 * @example
 * const parserData = new Parser()
 */
export class Parser {
  public xmlVersion = '' // XML版本
  public scoreVersion = '' // 曲谱版本
  public scoreType = '' // 曲谱类型
  public measures: MeasureType[] = [] // 小节
  public notes: NoteType[] = [] // 音符
  public totalDuration = 0

  public getMeasureById: Function = () => {}
  public getNoteById: Function = () => {}
  public getNotesByMeasureId: Function = () => {}

  private _speed = 1 // 速度
  private _bpmUnit: NoteTypeType = 'quarter' // BPM单位
  private _debug = false // 调试模式

  private _oriXml: MusicXMLType = {}
  private _oriParts: PartXMLType[] = []
  private _oriMeasures: MeasureXMLType[] = []

  constructor(xml: string, option?: Options) {
    if (!XMLValidator.validate(xml)) { // 校验是否合格的XML文件类型
      console.error(':: Not valid file type ::')
      return
    }

    // Options
    this._debug = option?.debug || this._debug
    this._speed = option?.speed || this._speed
    this._bpmUnit = option?.bpmUnit || this._bpmUnit

    // Original datas
    this._oriXml = parseToJson(xml) || {}
    this._oriParts = findAllParts(this._oriXml)
    this._oriMeasures = findAllMeasures(this._oriParts)

    // Class props
    this.xmlVersion = this._oriXml['?xml']?._version || ''
    this.scoreVersion = this._oriXml['score-partwise']?._version || this._oriXml['score-timewise']?._version || ''
    this.scoreType = getScoreType(this._oriXml)

    const { measureList, noteList, totalDuration } = parseData(this._oriMeasures, this._speed, this._bpmUnit)
    this.measures = measureList
    this.notes = noteList
    this.totalDuration = totalDuration

    // 实例方法
    this.getMeasureById = (id: string) => find(this.measures, { id })
    this.getNoteById = (id: string): NoteType | undefined => find(this.notes, { id })
    this.getNotesByMeasureId = (measureId: string): NoteType[] => filter(this.notes, { measureId })

    // Logs
    this._debug && console.log(this)
  }
}

export function numberToType(num: number): NoteTypeType {
  return _numberToNoteType(num)
}

export function typeToNumber(type: NoteTypeType): number {
  return _noteTypeToNumber(type)
}
