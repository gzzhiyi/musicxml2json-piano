import { has, isArray, isEmpty } from 'lodash'
import { noteTypeToNumber } from '@/utils'
import NoteClass from '@/classes/Note'
import {
  Clef,
  Dynamics,
  MeasureXML,
  Metronome,
  Note,
  NoteXML,
  Time,
  TimeSignature
} from '@/types'

type PropsType = {
  dynamics: Dynamics | null
  beats: number
  beatType: number
  beatUnit: number
  bpm: number
  id: string
  isLast: boolean
  speed: number
  staffs: Clef[]
  startTime: number
  xmlData: MeasureXML
}

export default class Measure {
  public dynamics: Dynamics | null = null
  public id: string
  public isLast: boolean
  public metronome: Metronome
  public number: string
  public staffs: Partial<{ [key in Clef]: Note[] }> = {}
  public time: Time | null = null
  public timeSignature: TimeSignature

  private speed: number
  private startTime: number

  constructor({
    dynamics,
    id,
    isLast,
    beats,
    beatType,
    beatUnit,
    bpm,
    speed,
    staffs,
    startTime,
    xmlData
  }: PropsType) {
    // Props
    this.dynamics = dynamics
    this.id = id
    this.isLast = isLast
    this.speed = speed || 1
    this.startTime = startTime

    // Prototypes
    this.metronome = { beatUnit, bpm }
    this.timeSignature = { beats, beatType }
    this.number = this.getNumber(xmlData)

    staffs.forEach((staff) => {
      this.staffs[staff] = this.getNotes(xmlData, staff) || []
    })
  }

  private getNotes(measureXML: MeasureXML, staff: Clef): Note[] {
    const notesList: NoteClass[] = []
    let count = 1

    if (isEmpty(measureXML?.note)) { // 如果小节音符为空，自动补全音符
      const noteClass = new NoteClass({
        id: `N_${this.number}_${count}`
      })

      this.addNoteToList(noteClass, notesList)
      return notesList
    }

    const notesXML = isArray(measureXML.note) ? measureXML.note : [measureXML.note]
    notesXML.forEach((noteXML) => {
      if (this.isChord(noteXML)) {
        const lastNote = notesList[notesList.length - 1]
        lastNote.view = 'chord'

        const data = lastNote.getData(noteXML, staff)
        data && lastNote.appendData(data)
      } else {
        const noteClass = new NoteClass({
          id: `N_${this.number}_${count}`,
          xmlData: noteXML
        })

        const data = noteClass.getData(noteXML, staff)
        data && noteClass.appendData(data)

        this.addNoteToList(noteClass, notesList)
        count++
      }
    })

    return notesList
  }

  private addNoteToList(noteClass: NoteClass, notesList: NoteClass[]) {
    const startTime = this.time?.start || this.startTime
    const duration = this.calNoteDuration(noteClass)

    this.time = {
      start: startTime + duration,
      duration: (this.time?.duration || 0) + duration,
      end: startTime + duration
    }

    noteClass.appendTime(startTime, duration)
    notesList.push(noteClass)
  }

  private getNumber(measureXML: MeasureXML): string {
    return measureXML._number || ''
  }

  private isChord(noteXML: NoteXML): boolean {
    return has(noteXML, 'chord')
  }

  private calNoteDuration(note: Note): number {
    const { view, type, timeModification, notations, dot } = note

    if (!type) {
      return 0
    }

    const { beatUnit, bpm } = this.metronome
    const { beats, beatType } = this.timeSignature

    const beatTime = Math.floor(60 / bpm / (beatType / beatUnit) * 1000)
    let duration = view === 'rest' && type === 'whole' ? beatTime * beats : (beatType / noteTypeToNumber(type)) * beatTime

    if (!isEmpty(timeModification)) {
      const { tuplet } = notations
      const { actualNotes, normalNotes } = timeModification
      const radix = tuplet === 'stop' ? (Math.floor(100 / actualNotes) + (100 % actualNotes)) / 100 : Math.floor(100 / actualNotes) / 100

      duration = Math.floor(duration * normalNotes * radix)
    }

    if (dot === 'dot') {
      duration = Math.floor(duration * 1.5)
    } else if (dot === 'doubleDot') {
      duration = Math.floor(duration * 1.75)
    }

    return Math.round(duration / this.speed)
  }
}
