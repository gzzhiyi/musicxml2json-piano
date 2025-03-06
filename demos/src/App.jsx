import React, { useState, useRef, useEffect } from 'react'
import _ from 'lodash'
import ReactJson from 'react-json-view'
import { Parser } from '../dist/index.esm.js'

export default function App() {
  const [xmlContent, setXmlContent] = useState(null)
  const [parsedData, setParsedData] = useState(null)
  const fileInputRef = useRef(null)

  function handleFileUpload(event) {
    const file = event?.target?.files?.[0] || event?.dataTransfer?.files?.[0]
    if (file && file.type === 'text/xml') {
      const reader = new FileReader()
      reader.onload = (e) => setXmlContent(e.target.result)
      reader.readAsText(file)
    } else {
      alert('Please upload a valid XML file')
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    handleFileUpload(event)
  }

  useEffect(() => {
    if (xmlContent) {
      const result = new Parser({ xmlStr: xmlContent, debug: true, speed: 1 })

      // 递归过滤掉所有以 _ 开头的键
      function removeUnderscoreKeys(obj) {
        if (_.isArray(obj)) {
          return obj.map(removeUnderscoreKeys)
        } else if (_.isObject(obj)) {
          return _.omitBy(_.mapValues(obj, removeUnderscoreKeys), (value, key) => key.startsWith('_'))
        }
        return obj
      }

      setParsedData(removeUnderscoreKeys(result)) // 存储解析后的 JSON
    }
  }, [xmlContent])

  return (
    <div>
      <div
        className="input-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h1>Upload XML File</h1>
        <input type="file" accept=".xml" onChange={handleFileUpload} ref={fileInputRef} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current.click()}>
          Select XML File
        </button>
      </div>
      {parsedData && (
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          <h2>Parsed XML:</h2>
          <ReactJson src={parsedData} theme="monokai" collapsed={2} />
        </div>
      )}
    </div>
  )
}
