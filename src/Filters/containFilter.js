import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { DelayInput } from 'react-delay-input'
import _ from 'lodash'

export default forwardRef(({ api, filterChangedCallback, column }, ref) => {
  const inputRef = useRef()
  const [filterText, setFilterText] = useState('')

  useEffect(() => filterChangedCallback(), [filterText, filterChangedCallback])

  const style = {
    margin: '2px 0',
    width: '200px',
    height: '30px',
  }
  const onChange = e => {
    const newValue = e.target.value
    if (filterText !== newValue) {
      setFilterText(newValue)
    }
  }

  useImperativeHandle(ref, () => ({
    doesFilterPass: () => true,

    getModel: () => {
      if (filterText) return { filter: filterText }
    },
    setModel: model => {
      console.log(model, column.colId)
      if (!_.isEmpty(model)) setFilterText(model.filter)
      else setFilterText('')
    },
    isFilterActive: () =>
      filterText !== '' && filterText !== undefined && filterText !== null,
  }))

  return (
    <div style={style}>
      Filter:{' '}
      <DelayInput
        minLength={1}
        delayTimeout={300}
        value={filterText}
        ref={inputRef}
        onChange={onChange}
        className="form-control"
      />
    </div>
  )
})
