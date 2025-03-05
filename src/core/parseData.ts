import { isArray, isEmpty, isObject } from 'lodash'
import MeasureClass from '@/core/Measure'
import NoteClass from '@/core/Note'
import {
  MeasureXML as MeasureXMLType,
  NoteXML as NoteXMLType,
  Measure,
  Note,
  NoteType,
  Staffs
} from '@/types'
import { calNoteDuration, roundToThreeDecimals } from '@/core/utils'
import {
  getArticulations,
  getBeam,
  getBeats,
  getBeatType,
  getBpm,
  getData,
  getDot,
  getDynamics,
  getSlur,
  getStaffs,
  getStem,
  getTied,
  isChord,
  isRest
} from '@/core/xmlHandler'

interface ReturnData {
  measureList: Measure[]
  noteList: Note[]
  totalDuration: number
}

/**
 * 解析数据
 */
export default function parseData(
  measureXML: MeasureXMLType[] = [],
  speed: number,
  bpmUnit: NoteType
): ReturnData {
  const mList: MeasureClass[] = []
  const nList: NoteClass[] = []

  const offsetTimeVal: number = 50 // 偏移值

  let globalStaffs: Staffs = {}
  let globalBpm: number // 默认使用60
  let globalBeats: number
  let globalBeatType: number

  let noteCount: number = 1 // 音符数量累计

  let totalDuration: number = 0 // 总时长

  measureXML.map((measure: MeasureXMLType) => {
    if (isEmpty(measure)) {
      return
    }

    const { _number, note } = measure

    let staffs = getStaffs(measure)
    if (isEmpty(staffs)) {
      staffs = globalStaffs
    }

    const bpm = getBpm(measure) || globalBpm
    const beats = getBeats(measure) || globalBeats
    const beatType = getBeatType(measure) || globalBeatType
    const dynamics = getDynamics(measure)

    // 设置全局
    globalStaffs = staffs
    globalBpm = bpm
    globalBeats = beats
    globalBeatType = beatType

    let mDuration: number = 0 // 小节时长

    const mId: string = `M_${_number}` // 生成小节ID

    let notes: NoteXMLType[] = []
    if (isEmpty(note)) {
      notes = []
    } else if (isArray(note)) {
      notes = note
    } else if (isObject(note)) {
      notes = [note]
    }

    // 操作下一个音符
    const _toNext = (noteClass: NoteClass) => {
      // 设置音符时间属性
      const duration = calNoteDuration(noteClass, beats, beatType, bpm, bpmUnit, speed)
      const start: number = totalDuration + mDuration
      const end: number = start + duration

      noteClass.setTime({
        start: roundToThreeDecimals(start),
        startRange: roundToThreeDecimals(start - offsetTimeVal),
        duration: roundToThreeDecimals(duration),
        end: roundToThreeDecimals(end),
        endRange: roundToThreeDecimals(end - offsetTimeVal)
      })

      mDuration += duration // 累计小节时长

      // 添加到音符列表
      nList.push(noteClass)
      noteCount++
    }

    notes.map((subItem) => {
      if (isChord(subItem)) { // 和弦
        const index: number = nList.length - 1 // 取最后一个节点元素
        const lastNode: NoteClass = nList[index]
        lastNode?.setView('chord')

        const data = getData(subItem, globalStaffs[subItem.staff])
        if (!isEmpty(data)) {
          lastNode?.appendData(data)
        }

        return
      }

      // 单音符
      if (isRest(subItem)) { // 休止符
        const noteClass = new NoteClass({
          id: `N_${noteCount}`,
          measureId: mId,
          staff: globalStaffs[subItem.staff],
          type: subItem.type,
          view: 'rest'
        })

        return _toNext(noteClass)
      }

      // 单音符
      const noteClass = new NoteClass({
        id: `N_${noteCount}`,
        measureId: mId,
        staff: globalStaffs[subItem.staff],
        type: subItem.type,
        view: 'single'
      })

      // 音符数据
      const data = getData(subItem, globalStaffs[subItem.staff])
      if (!isEmpty(data)) {
        noteClass.setData(data)
      }

      // 附点
      const dot = getDot(subItem)
      dot && noteClass.setDot(dot)

      // 连音
      const slur = getSlur(subItem)
      slur && noteClass.setSlur(slur)

      // 延长音
      const tied = getTied(subItem)
      tied && noteClass.setTied(tied)

      // 演奏记号
      const articulations = getArticulations(subItem)
      articulations && noteClass.setArticulation(articulations)

      // 时值符干
      const stem = getStem(subItem)
      stem && noteClass.setStem(stem)

      // 时值横杆
      const beam = getBeam(subItem)
      beam && noteClass.setBeam(beam)

      _toNext(noteClass)
    })

    // 添加到小节列表
    const measureClass = new MeasureClass({
      id: mId,
      num: _number || '',
      staffs: Object.values(globalStaffs),
      bpm,
      beats,
      beatType
    })

    measureClass.setDynamics(dynamics)

    const start: number = totalDuration
    const end: number = start + mDuration

    measureClass.setTime({
      start: roundToThreeDecimals(start),
      startRange: roundToThreeDecimals(start - offsetTimeVal),
      duration: roundToThreeDecimals(mDuration),
      end: roundToThreeDecimals(end),
      endRange: roundToThreeDecimals(end - offsetTimeVal)
    })

    mList.push(measureClass)
    totalDuration += mDuration // 总时长
  })

  return {
    measureList: mList,
    noteList: nList,
    totalDuration: roundToThreeDecimals(totalDuration)
  }
}
