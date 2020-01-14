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

import { changeCof, changeSortModel } from './redux/actions'
import { selectRowData, selectCof } from './redux/selector'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 23,
      pageCount: 0,
      columnDefs: [],
      actualRowData: [],
      frameworkComponents: {
        flagRenderer,
        workTimeSquareRenderer,
        workTimeCubRenderer,
      },
    }
  }

  componentWillReceiveProps({ cof }) {
    if (cof !== this.props.cof) {
      this.setState({ columnDefs: columnDefsModel(cof) })
    }
  }

  setStateActualRowData = rowData =>
    this.setState({
      actualRowData: rowData,
    })

  onGridReady = params => {
    this.gridApi = params.api
    this.gridApi.setGroupHeaderHeight(0)

    this.preRenderFunction()
  }

  preRenderFunction = () => {
    const { rowsPerPage } = this.state
    const { rowData, cof } = this.props

    const pageCount = Math.ceil(rowData.length / rowsPerPage)

    this.setState({
      pageCount,
      columnDefs: columnDefsModel(cof),
      actualRowData: [...rowData],
    })
  }

  onSortChanged = () => {
    const { pageCount, actualRowData, rowsPerPage } = this.state
    const { rowData, changeSortModel } = this.props
    const sortState = this.gridApi.getSortModel()

    changeSortModel(sortState)

    if (sortState.length === pageCount) return 0

    if (!sortState.length) {
      this.setStateActualRowData(rowData)
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
      actualRowData,
      columnToSort,
      pageCount,
      rowsPerPage,
      sortType || '',
      this.setStateActualRowData,
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
    const { cof } = this.state
    const { changeCof } = this.props

    this.setState({ cof: !cof })
    changeCof(!cof)
  }

  render() {
    const {
      columnDefs,
      actualRowData,
      pageCount,
      rowsPerPage,
      frameworkComponents,
    } = this.state

    const formatColumnDefs = formatColumns(columnDefs, pageCount, rowsPerPage)
    const formatActualRowData = formatData(
      actualRowData,
      rowsPerPage,
      pageCount,
    )

    return (
      <div onWheel={this.onWheel} style={{ overflow: 'hidden' }}>
        <button type="button" onClick={this.onClick}>
          Switch cof value
        </button>
        <div
          className="ag-theme-balham"
          style={{
            height: `700px`,
            width: `100vw`,
          }}
        >
          <AgGridReact
            columnDefs={formatColumnDefs}
            rowData={formatActualRowData}
            defaultColDef={defaultColDef}
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
  cof: selectCof(state),
})

const mapDispatchToProps = {
  changeCof,
  changeSortModel,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// 1. Save to Redux the sortModel
// 2. Grid rowData should be coming from a selector
// 3. If you have a reducer to save the sortModel, you can have a selector to get it
// 4. rowData selector should be using the sortModel selector

// 1. save sortState in this.state

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
