import { XMLParser } from 'fast-xml-parser'
import { MusicXML } from '@/types'

/**
 * 删除'<?GP'标记
 * @param {string} str
 * @returns
 */
function removeGPTags(str) {
  const xmlTagPattern = /<\?xml[^?]*\?>/g
  while (xmlTagPattern.test(str)) {
    str = str.replace(xmlTagPattern, '')
  }

  str = str.replace(/<\?GP|\?>/g, '')

  return str
}

/**
 * Parse MusicXML to JSON
 * @param {string} musicXML - MusicXML strings
 * @returns
 */
export default function parseToJson(musicXML: string): MusicXML {
  const cleanedStr = removeGPTags(musicXML)

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    preserveOrder: false
  })

  return parser.parse(cleanedStr)
}
