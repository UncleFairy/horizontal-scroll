import React, { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { arrayOf, func, number, shape } from 'prop-types'

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
  pageCountSelector,
  rowsPerPageSelector,
  selectFilterModel,
  selectGridHeight,
  selectRowDataLength,
} from './redux/selector'
import {
  EMPTY_SORT_MODEL,
  EMPTY_FILTER_MODEL,
  ONE_PAGE,
  ZERO_HEIGHT,
} from './constants'

const App = ({
  rowData,
  gridHeight,
  pageCount,
  rowsPerPage,
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
  allRowDataLength,
}) => {
  const gridRef = useRef(null)

  const frameworkComponents = {
    flagRenderer,
    workTimeSquareRenderer,
    workTimeCubRenderer,
    containFilter,
  }
  const formatColumnDefs = formatColumns(columnDefsModel(true), pageCount)
  const formatRowData = formatData(rowData, rowsPerPage, pageCount)

  const onGridReady = ({ api }) => api.setGroupHeaderHeight(ZERO_HEIGHT)

  const onSortChanged = ({ api }) => {
    const sortState = api.getSortModel()

    if (sortState.length === pageCount && pageCount !== ONE_PAGE) return

    if (!sortState.length) {
      changeSortModel(EMPTY_SORT_MODEL)
      return
    }

    const sortModel = formatSortModel(sortState[0])
    changeSortModel(sortModel)

    api.setSortModel(sortModelGenerator(sortModel, pageCount))
  }

  const onFilterChanged = ({ api }) => {
    const filterState = api.getFilterModel()
    const filterModel = formatFilterModel(filterState)

    // if (_.isEmpty(filterModel) && rowData.length !== allRowDataLength) return

    if (!filterModel.length) {
      changeFilterModel(EMPTY_FILTER_MODEL)
      return
    }

    if (filterModel.length % pageCount === 0) return

    changeFilterModel(filterModel)
    // scrollToLeft()

    // api.setFilterModel(filterModelGenerator(filterModel, pageCount))
  }

  const onWheel = e => {
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

  const scrollToLeft = () => {
    const container = document.getElementsByClassName(
      'ag-body-horizontal-scroll-viewport',
    )[0]
    container.scrollLeft = 0
  }

  const onGridSizeChanged = () => changeGridHeight(gridRef.current.clientHeight)

  return (
    <div onWheel={onWheel} style={{ overflow: 'hidden' }} ref={gridRef}>
      <div
        className="ag-theme-balham"
        style={{
          height: `${gridHeight}px`,
          width: `100%`,
        }}
      >
        <AgGridReact
          columnDefs={formatColumnDefs}
          rowData={formatRowData}
          defaultColDef={defaultColDef}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridSizeChanged}
          domLayout="autoHeight"
          frameworkComponents={frameworkComponents}
        />
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  rowData: dataSelector(state),
  rowsPerPage: rowsPerPageSelector(state),
  gridHeight: selectGridHeight(state),
  pageCount: pageCountSelector(state),
  allRowDataLength: selectRowDataLength(state),
  filter: selectFilterModel(state),
})

const mapDispatchToProps = {
  changeCof,
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
}

App.propTypes = {
  rowData: arrayOf(shape()),
  allRowDataLength: number.isRequired,
  gridHeight: number.isRequired,
  rowsPerPage: number.isRequired,
  pageCount: number.isRequired,
  changeSortModel: func.isRequired,
  changeFilterModel: func.isRequired,
  changeGridHeight: func.isRequired,
}

App.defaultProps = {
  rowData: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
