import { createSelector } from 'reselect'
import _ from 'lodash'

import { dataSort } from 'ColumnGroupScroll/utils'

export const selectRowData = ({ rowData }) => rowData

export const selectCof = ({ cof }) => cof

export const selectSortModel = ({ sortModel }) => sortModel

export const selectFilterModel = ({ filterModel }) => filterModel

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
