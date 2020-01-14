import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'

import {
  dataSort,
  formatColumns,
  formatData,
  sortModelGenerator,
} from 'ColumnGroupScroll/utils'
import {
  columnDefsModel,
  defaultColDef,
} from 'ColumnGroupScroll/columnDefsModel'
import {
  flagRenderer,
  workTimeSquareRenderer,
  workTimeCubRenderer,
} from 'Renderers'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import './app.css'
import { selectRowData } from './redux/selector'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 23,
      cof: true,
      pageCount: 0,
      columnDefs: [],
      rowData: [],
      actualRowData: [],
      frameworkComponents: {
        flagRenderer,
        workTimeSquareRenderer,
        workTimeCubRenderer,
      },
    }
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnAPi = params.columnApi
    this.gridApi.setGroupHeaderHeight(0)

    this.preRenderFunction()
  }

  setRowData = n => this.gridApi.setRowData(n)

  preRenderFunction = () => {
    const { rowsPerPage, cof } = this.state
    const { rowData } = this.props
    const pageCount = Math.ceil(rowData.length / rowsPerPage)

    this.setState({
      pageCount,
      columnDefs: formatColumns(columnDefsModel(cof), pageCount, rowsPerPage),
      actualRowData: formatData(rowData, rowsPerPage, pageCount),
      rowData,
    })
  }

  onSortChanged = () => {
    const { pageCount, actualRowData, rowsPerPage } = this.state
    const { rowData } = this.props
    const sortState = this.gridApi.getSortModel()

    // 1. Save to Redux the sortModel
    // 2. Grid rowData should be coming from a selector
    // 3. If you have a reducer to save the sortModel, you can have a selector to get it
    // 4. rowData selector should be using the sortModel selector

    // 1. save sortState in this.state

    if (sortState.length === pageCount) return 0

    if (!sortState.length) {
      this.setRowData(actualRowData)
      return 0
    }

    const columnToSort = sortState[0].colId.substr(
      0,
      sortState[0].colId.length - 2,
    )
    const sortType = sortState[0].sort

    this.gridApi.setSortModel(
      sortModelGenerator(columnToSort, sortType, pageCount),
    )

    dataSort(
      rowData,
      columnToSort,
      pageCount,
      rowsPerPage,
      sortType || '',
      this.setRowData,
    )
  }

  onWheel = e => {
    e.preventDefault()
    const container = document.getElementsByClassName(
      'ag-body-horizontal-scroll-viewport',
    )[0]
    const containerScrollPosition = container.scrollLeft

    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY,
      behaviour: 'smooth',
    })
  }

  onClick = () => {
    this.setState({ cof: !this.state.cof }, () =>
      this.setState({
        columnDefs: formatColumns(
          columnDefsModel(this.state.cof),
          this.state.pageCount,
          this.state.rowsPerPage,
        ),
        actualRowData: formatData(
          this.props.rowData,
          this.state.rowsPerPage,
          this.state.pageCount,
        ),
      }),
    )
  }

  render() {
    const { columnDefs, actualRowData, frameworkComponents } = this.state

    return (
      <div onWheel={this.onWheel} style={{ overflow: 'hidden' }}>
        <button onClick={this.onClick}>Switch cof value</button>
        <div
          className="ag-theme-balham"
          style={{
            height: `700px`,
            width: `100vw`,
          }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={actualRowData}
            onSortChanged={this.onSortChanged}
            onGridReady={this.onGridReady}
            onBodyScroll={this.onBodyScroll}
            frameworkComponents={frameworkComponents}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  rowData: selectRowData(state),
})

export default connect(mapStateToProps)(App)

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
