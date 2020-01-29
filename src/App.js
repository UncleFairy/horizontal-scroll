import React, { useRef, useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { connect } from 'react-redux'
import { arrayOf, func, number, shape } from 'prop-types'

import {
  formatColumns,
  formatData,
  formatSortModel,
  formatFilterModel,
  sortModelGenerator,
  getSingleFilter,
  isFilterModelChanged,
  getFilterColumns,
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

import {
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
} from './redux/actions'
import {
  dataSelector,
  pageCountSelector,
  rowsPerPageSelector,
  selectGridHeight,
  allGroupsFilterModelSelector,
  selectFilterModel,
} from './redux/selector'
import {
  EMPTY_ARRAY,
  EMPTY_SORT_MODEL,
  ONE_FILTER,
  ONE_PAGE,
  ZERO_HEIGHT,
} from './constants'

const App = ({
  rowData,
  gridHeight,
  filterModel,
  originalFilterModel,
  pageCount,
  rowsPerPage,
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
}) => {
  const gridRef = useRef(null)
  const [gridApi, setGridApi] = useState(null)

  const frameworkComponents = {
    flagRenderer,
    workTimeSquareRenderer,
    workTimeCubRenderer,
  }
  const formatColumnDefs = formatColumns(columnDefsModel(true), pageCount)
  const formatRowData = formatData(rowData, rowsPerPage, pageCount)

  useEffect(() => {
    if (gridApi) gridApi.setFilterModel(filterModel)
  }, [filterModel, gridApi])

  const onGridReady = ({ api }) => {
    api.setGroupHeaderHeight(ZERO_HEIGHT)
    setGridApi(api)
  }

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
    const currentFilterModel = formatFilterModel(filterState)

    if (
      currentFilterModel.length === ONE_FILTER &&
      pageCount === ONE_PAGE &&
      rowData.length === EMPTY_ARRAY.length &&
      !isFilterModelChanged(formatFilterModel(filterModel), currentFilterModel)
    )
      return

    if (
      currentFilterModel.length === ONE_FILTER &&
      isFilterModelChanged(formatFilterModel(filterModel), currentFilterModel)
    ) {
      scrollToLeft()
      changeFilterModel(currentFilterModel)
      return
    }

    if (
      !isFilterModelChanged(formatFilterModel(filterModel), currentFilterModel)
    )
      return

    const columnsToFilter = getFilterColumns(columnDefsModel(true))
    const singleFilterModel = getSingleFilter(
      currentFilterModel,
      columnsToFilter,
      pageCount,
      originalFilterModel,
    )

    scrollToLeft()
    changeFilterModel(singleFilterModel)
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
          frameworkComponents={frameworkComponents}
          domLayout="autoHeight"
        />
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  rowData: dataSelector(state),
  rowsPerPage: rowsPerPageSelector(state),
  pageCount: pageCountSelector(state),
  gridHeight: selectGridHeight(state),
  filterModel: allGroupsFilterModelSelector(state),
  originalFilterModel: selectFilterModel(state),
})

const mapDispatchToProps = {
  changeSortModel,
  changeFilterModel,
  changeGridHeight,
}

App.propTypes = {
  rowData: arrayOf(shape()),
  filterModel: shape(),
  originalFilterModel: arrayOf(shape()),
  gridHeight: number.isRequired,
  rowsPerPage: number.isRequired,
  pageCount: number.isRequired,
  changeSortModel: func.isRequired,
  changeFilterModel: func.isRequired,
  changeGridHeight: func.isRequired,
}

App.defaultProps = {
  rowData: [],
  filterModel: {},
  originalFilterModel: [],
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
