import { createSelector } from 'reselect'
import _ from 'lodash'

import { dataSort } from 'ColumnGroupScroll/utils'
import { addRowData } from './actions'
import { ONE_PAGE } from '../constants'

export const selectRowData = ({ rowData }) => rowData

export const selectRowDataLength = ({ rowData }) => rowData.length

export const selectSortModel = ({ sortModel }) => sortModel

export const selectFilterModel = ({ filterModel }) => filterModel

export const selectGridHeight = ({ gridHeight }) => gridHeight

export const dataSelector = createSelector(
  selectSortModel,
  selectFilterModel,
  selectRowData,
  (sortModel = {}, filterModel = [], rowData) => {
    let data = [...rowData]

    if (!_.isEmpty(filterModel)) {
      filterModel.forEach(({ columnToFilter, filter }) => {
        data = data.filter(row =>
          row[columnToFilter].toString().includes(filter),
        )
      })
    }

    if (!_.isEmpty(sortModel)) {
      const { columnToSort, sort } = sortModel
      data = dataSort(data, columnToSort, sort)
    }

    return data
  },
)

export const rowsPerPageSelector = createSelector(
  selectGridHeight,
  dataSelector,
  (height, rowData) => {
    if (Math.floor((height - 100) / 28) > rowData.length) return rowData.length
    return Math.floor((height - 100) / 28)
  },
)

export const pageCountSelector = createSelector(
  rowsPerPageSelector,
  dataSelector,
  (rowsPerPage = 1, rowData) => {
    if (rowData.length <= rowsPerPage) return ONE_PAGE
    return Math.ceil(rowData.length / rowsPerPage)
  },
)
