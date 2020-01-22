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

import {
  changeCof,
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
} from './redux/actions'
import {
  dataSelector,
  rowsPerPageSelector,
  selectGridHeight,
} from './redux/selector'
import { EMPTY_SORT_MODEL, EMPTY_FILTER_MODEL, ONE_PAGE } from './constants'

class App extends Component {
  constructor(props) {
    super(props)
    this.gridRef = React.createRef()
    this.state = {
      pageCount: 0,
      frameworkComponents: {
        flagRenderer,
        workTimeSquareRenderer,
        workTimeCubRenderer,
        containFilter,
      },
    }
  }

  // static getDerivedStateFromProps(newProps, prevState) {
  //   if (newProps.rowData.length !== prevState.props.rowData.length) {
  //     return {
  //       pageCount: Math.ceil(newProps.rowData.length / prevState.rowsPerPage),
  //     }
  //   }
  //
  //   return null
  // }

  onGridReady = ({ api }) => {
    api.setGroupHeaderHeight(0)

    this.preRenderFunction()
  }

  preRenderFunction = () => {
    const { rowData, rowsPerPage } = this.props

    if (rowData.length <= rowsPerPage)
      this.setState({
        pageCount: ONE_PAGE,
      })
    else
      this.setState({
        pageCount: Math.ceil(rowData.length / rowsPerPage),
      })
  }

  onSortChanged = ({ api }) => {
    const { pageCount } = this.state
    const { changeSortModel } = this.props
    const sortState = api.getSortModel()

    if (sortState.length === pageCount && pageCount !== ONE_PAGE) return

    if (!sortState.length) {
      changeSortModel(EMPTY_SORT_MODEL)
      return 0
    }

    const sortModel = formatSortModel(sortState[0])
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

  onGridSizeChanged = () => {
    const { changeGridHeight } = this.props

    changeGridHeight(this.gridRef.current.clientHeight)
  }

  render() {
    const { pageCount, frameworkComponents } = this.state
    const { rowData, rowsPerPage, gridHeight } = this.props

    const formatColumnDefs = formatColumns(columnDefsModel(true), pageCount)
    const formatRowData = formatData(rowData, rowsPerPage, pageCount)

    return (
      <div
        onWheel={this.onWheel}
        style={{ overflow: 'hidden' }}
        ref={this.gridRef}
      >
        <div
          className="ag-theme-balham"
          style={{
            height: `${gridHeight}px`,
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
            onGridSizeChanged={this.onGridSizeChanged}
            domLayout="autoHeight"
            frameworkComponents={frameworkComponents}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  rowData: dataSelector(state),
  rowsPerPage: rowsPerPageSelector(state),
  gridHeight: selectGridHeight(state),
})

const mapDispatchToProps = {
  changeCof,
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

// 1. Save to Redux the sortModel
// 2. Grid rowData should be coming from a selector
// 3. If you have a reducer to save the sortModel, you can have a selector to get it
// 4. rowData selector should be using the sortModel selector

// 1. save sortState in this.state
