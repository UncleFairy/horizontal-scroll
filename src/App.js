import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'

import {
  formatColumns,
  formatData,
  formatSortModel,
  formatFilterModel,
  sortModelGenerator,
  filterModelGenerator,
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

import containFilter from 'Filters/containFilter'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import './app.css'

import { changeCof, changeSortModel, changeFilterModel } from './redux/actions'
import { selectCof, dataSelector } from './redux/selector'
import { EMPTY_SORT_MODEL, EMPTY_FILTER_MODEL } from './constants'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 23,
      pageCount: 0,
      frameworkComponents: {
        flagRenderer,
        workTimeSquareRenderer,
        workTimeCubRenderer,
        containFilter,
      },
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.rowData !== this.props.rowData) {
  //     console.log({
  //       pageCount: Math.ceil(nextProps.rowData.length / this.state.rowsPerPage),
  //     })
  //     this.setState({
  //       pageCount: Math.ceil(nextProps.rowData.length / this.state.rowsPerPage),
  //     })
  //   }
  // }

  onGridReady = params => {
    this.gridApi = params.api
    this.gridApi.setGroupHeaderHeight(0)

    this.preRenderFunction()
  }

  preRenderFunction = () => {
    const { rowsPerPage } = this.state
    const { rowData } = this.props

    const pageCount = Math.ceil(rowData.length / rowsPerPage)

    this.setState({
      pageCount,
    })
  }

  onSortChanged = ({ api }) => {
    const { pageCount } = this.state
    const { changeSortModel } = this.props
    const sortState = api.getSortModel()

    if (sortState.length === pageCount) return

    if (!sortState.length) {
      changeSortModel(EMPTY_SORT_MODEL)
      return 0
    }

    const sortModel = formatSortModel(sortState)
    changeSortModel(sortModel)

    api.setSortModel(sortModelGenerator(sortModel, pageCount))
  }

  onFilterChanged = ({ api }) => {
    const { pageCount } = this.state
    const { changeFilterModel } = this.props

    const filterState = api.getFilterModel()
    const filterModel = formatFilterModel(filterState)

    if (!filterModel.length) {
      changeFilterModel(EMPTY_FILTER_MODEL)
      return
    }

    if (filterModel.length % pageCount === 0) return

    changeFilterModel(filterModel)

    // api.setFilterModel(filterModelGenerator(filterModel, pageCount))
  }

  onWheel = e => {
    e.preventDefault()
    const container = document.getElementsByClassName(
      'ag-body-horizontal-scroll-viewport',
    )[0]
    const containerScrollPosition = container.scrollLeft

    container.scrollTo({
      top: 0,
      left: containerScrollPosition + e.deltaY * 0.35,
      behaviour: 'smooth',
    })
  }

  render() {
    const { pageCount, rowsPerPage, frameworkComponents } = this.state
    const { rowData } = this.props

    const formatColumnDefs = formatColumns(
      columnDefsModel(true),
      pageCount,
      rowsPerPage,
    )

    const formatRowData = formatData(rowData, rowsPerPage, pageCount)

    return (
      <div onWheel={this.onWheel} style={{ overflow: 'hidden' }}>
        <button
          type="button"
          onClick={this.onClick}
          styles={{ display: 'none' }}
        >
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
            rowData={formatRowData}
            defaultColDef={defaultColDef}
            onSortChanged={this.onSortChanged}
            onFilterChanged={this.onFilterChanged}
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
  rowData: dataSelector(state),
  cof: selectCof(state),
})

const mapDispatchToProps = {
  changeCof,
  changeSortModel,
  changeFilterModel,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// 1. Save to Redux the sortModel
// 2. Grid rowData should be coming from a selector
// 3. If you have a reducer to save the sortModel, you can have a selector to get it
// 4. rowData selector should be using the sortModel selector

// 1. save sortState in this.state
