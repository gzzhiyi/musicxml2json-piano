# Donner MusicXML Piano

解析鼓谱MusicXML为JSON格式。请参考[W3C MusicXML](https://www.w3.org/2021/06/musicxml40/)。

## Install

### npm install

  ```bash
    npm i donner-musicxml-piano
  ```

### yarn install

  ```bash
    yarn add donner-musicxml-piano
  ```

## Start

```js
  import { Parser } from 'donner-musicxml-piano'

  async function loadXMLDoc() {
    // Load XML document...
  }

  const xmlDoc = await loadXMLDoc('/xml/example.xml')
  const Parser = new Parser(xmlDoc, { debug: true })

  // return a Query object -
  // { measures: [], notes: [], ... }
```
