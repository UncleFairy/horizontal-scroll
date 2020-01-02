import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'

import { formatColumns, formatData } from 'ColumnGroupScroll/utils'
import columnDefsModel from 'ColumnGroupScroll/columnDefsModel'

import data from './data'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 5,
      columnDefs: [],
      rowData: [],
    }
  }

  componentDidMount() {
    this.preRenderFunction()
  }

  preRenderFunction = () => {
    const { rowsPerPage } = this.state
    const pageCount = Math.ceil(data.length / rowsPerPage)

    this.setState({
      columnDefs: formatColumns(columnDefsModel, pageCount),
      rowData: formatData(data, rowsPerPage, pageCount),
    })
  }

  render() {
    const { columnDefs, rowData } = this.state

    return (
      <div
        className="ag-theme-balham"
        style={{
          height: '300px',
          width: '1000px',
        }}
      >
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    )
  }
}

export default App
