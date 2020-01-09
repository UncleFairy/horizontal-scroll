import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'

import {
  dataSort,
  formatColumns,
  formatData,
  sortModelGenerator,
} from 'ColumnGroupScroll/utils'
import columnDefsModel, {
  defaultColDef,
} from 'ColumnGroupScroll/columnDefsModel'

import data from './data'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import './app.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 5,
      pageCount: 0,
      columnDefs: [],
      rowData: [],
      actualRowData: data,
    }
  }

  onGridReady = params => {
    this.gridApi = params.api

    this.preRenderFunction()
  }

  onSortChanged = () => {
    const sortState = this.gridApi.getSortModel()

    if (sortState.length == this.state.pageCount) return 0

    if (!sortState.length) {
      this.setRowData(this.state.rowData)
      return 0
    }

    this.gridApi.setSortModel(
      sortModelGenerator(
        sortState[0].colId.substr(0, sortState[0].colId.length - 1),
        sortState[0].sort,
        this.state.pageCount,
      ),
    )

    dataSort(
      this.state.actualRowData,
      sortState[0].colId.substr(0, sortState[0].colId.length - 1),
      this.state.pageCount,
      this.state.rowsPerPage,
      this.setRowData,
      sortState[0].sort || '',
    )
  }

  setStateActualRowData = actualRowData => this.setState({ actualRowData })

  setRowData = n => this.gridApi.setRowData(n)

  onWheel = e => {
    e.preventDefault()
    const container = document.getElementsByClassName('privet')[0]
    const containerScrollPosition = container.scrollLeft

    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
      behaviour: 'smooth',
    })
  }

  preRenderFunction = () => {
    const { rowsPerPage } = this.state
    const pageCount = Math.ceil(data.length / rowsPerPage)
    console.log(this.gridApi.getFilterModel())
    this.setState({
      pageCount,
      columnDefs: formatColumns(columnDefsModel, pageCount, rowsPerPage),
      rowData: formatData(this.state.actualRowData, rowsPerPage, pageCount),
    })
  }

  render() {
    const { columnDefs, rowData } = this.state

    return (
      <div className="privet">
        <div
          className="ag-theme-balham"
          style={{
            height: '300px',
            width: `${this.state.pageCount * 600}px`,
          }}
          onWheel={this.onWheel}
        >
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={rowData}
            onSortChanged={this.onSortChanged}
            onGridReady={this.onGridReady}
            suppressHorizontalScroll
          />
        </div>
      </div>
    )
  }
}

export default App

//
// onFilterChanged = () => {
//   const model = this.gridApi.getFilterModel()
//
//   if (_.isEmpty(model)) {
//     this.setStateActualRowData(data)
//     return
//   }
//
//   for (const i in model)
//     this.setState({
//       filterModel: {
//         ...this.state.filterModel,
//         [i.substr(0, i.length - 1)]: {
//           filter: model[i].filter,
//           filterType: model[i].filterType,
//         },
//       },
//     })
//
//   const filteredData = this.state.actualRowData.filter(item => {
//     for (let i in this.state.filterModel) {
//       switch (this.state.filterModel[i].filterType) {
//         case 'text':
//           if (item[i].includes(this.state.filterModel[i].filter)) return true
//           break
//         case 'number':
//           if (item[i] > this.state.filterModel[i].filter) return true
//           break
//         case 'date:':
//           if (item[i] > this.state.filterModel[i].filter) return true
//           break
//         default:
//           return false
//       }
//     }
//   })
//
//   this.setStateActualRowData(filteredData)
//
//   this.setRowData(
//       formatData(filteredData, this.state.rowsPerPage, this.state.pageCount),
//   )
// }

//State
//filterModel: { make: '', model: '', price: '' },