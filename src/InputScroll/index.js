import React, { useState, useEffect } from 'react'

import './styles.css'

function Scroll({ max, handleRowDataChange, perPage }) {
  const [value, setValue] = useState(0)

  useEffect(() => handleRowDataChange(value, value + perPage), [])

  const change = e => {
    setValue(e.target.value)
    handleRowDataChange(
      e.target.value * perPage,
      e.target.value * perPage + perPage,
    )
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <input
        type="range"
        name="scroll"
        style={{ width: '600px', margin: 0, padding: 0 }}
        step={1}
        min={0}
        value={value}
        max={max}
        onChange={change}
      />
    </div>
  )
}

export default Scroll
