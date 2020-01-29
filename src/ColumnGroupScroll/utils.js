import _ from 'lodash'

import { EMPTY_ARRAY, EMPTY_FILTER_MODEL, EMPTY_SORT_MODEL } from '../constants'

export const formatColumns = (columns, pageCount) => {
  if (_.isEmpty(columns)) return EMPTY_ARRAY

  return Array.from({ length: pageCount }, (_, i) => ({
    headerName: `Group ${i + 1}`,
    children: columns.map(item => ({
      ...item,
      colId: `${item.field}_${i}`,
      field: `${item.field}_${i}`,
    })),
  }))
}

export const formatData = (rowData, rowsPerPage, pageCount) => {
  if (_.isEmpty(rowData)) return EMPTY_ARRAY

  const formatRowData = Array.from({ length: pageCount }, (_, i) =>
    rowData.slice(i * rowsPerPage, i * rowsPerPage + rowsPerPage).map(item => {
      const itemKeys = Object.keys(item)
      const formatItemKeys = Object.assign(
        ...itemKeys.map(field => ({ [field]: `${field}_${i}` })),
      )

      return renameProps(formatItemKeys, item)
    }),
  ).flat()

  return unionGroupData(formatRowData, rowsPerPage)
}

export const dataSort = (rowData, column, cof) => {
  if (_.isEmpty(rowData)) return EMPTY_ARRAY

  switch (cof) {
    case 'desc':
      return rowData.sort((a, b) => (a[column] > b[column] ? -1 : 1))
    case 'asc':
      return rowData.sort((a, b) => (a[column] > b[column] ? 1 : -1))
    default:
      return 0
  }
}

export const sortModelGenerator = ({ columnToSort, sort }, pageCount) => {
  if (_.isEmpty({ columnToSort, sort })) return EMPTY_SORT_MODEL

  let sortModel = []

  for (let i = 0; i < pageCount; i++) {
    sortModel = [...sortModel, { colId: `${columnToSort}_${i}`, sort }]
  }

  return sortModel
}

export const filterModelGenerator = (filterModel, pageCount) => {
  if (_.isEmpty(filterModel)) return EMPTY_FILTER_MODEL

  let filterState = {}

  filterModel.forEach(filter => {
    for (let i = 0; i < pageCount; i++) {
      filterState = {
        ...filterState,
        [`${filter.columnToFilter}_${i}`]: { ...filter },
      }
    }
  })

  return filterState
}

export const formatSortModel = sortState => {
  if (_.isEmpty(sortState)) return EMPTY_SORT_MODEL

  const columnToSort = sortState.colId.split('_')[0]
  const { sort } = sortState

  return { columnToSort, sort }
}

export const formatFilterModel = filterState => {
  if (_.isEmpty(filterState)) return EMPTY_FILTER_MODEL

  let filterModel = []

  for (let i in filterState) {
    filterModel = [
      ...filterModel,
      {
        ...filterState[i],
        columnToFilter: i.split('_')[0],
      },
    ]
  }

  filterModel = filterModel.sort((a, b) =>
    a['columnToFilter'] > b['columnToFilter'] ? -1 : 1,
  )

  return filterModel
}

export const getSingleFilter = (
  filterModel,
  columnsToFilter,
  pageCount,
  originalFilterModel,
) =>
  columnsToFilter
    .map(column =>
      filterModel.filter(filter => filter.columnToFilter === column),
    )
    .filter(array => array.length === pageCount || array.length === 1)
    .map(filterByColumn =>
      getUniqueValue(filterByColumn, originalFilterModel, pageCount),
    )
    .filter(filter => filter)

export const isFilterModelChanged = (filterModel, currentFilterModel) => {
  if (JSON.stringify(filterModel) !== JSON.stringify(currentFilterModel))
    return true
  return false
}

const getUniqueValue = (array, originalFilterModel, pageCount) => {
  const originalFilter = originalFilterModel.filter(
    filter => array[0].columnToFilter === filter.columnToFilter,
  )[0]

  if (!originalFilter) return array[0]

  if (array.length === pageCount - 1) return null

  if (pageCount === 1) return array[0]

  const newFilterValue = array.filter(
    filter => JSON.stringify(filter) !== JSON.stringify(originalFilter),
  )

  if (newFilterValue.length) return newFilterValue[0]
  return array[0]
}

export const getFilterColumns = columnDefsModel =>
  columnDefsModel
    .filter(column => column.filter === true)
    .map(column => column.field)

const fromEntries = entries =>
  entries.reduce((o, [key, value]) => ({ ...o, [key]: value }), {})

const renameProps = (replaces, obj) =>
  fromEntries(
    Object.entries(obj).map(([key, value]) => [
      replaces.hasOwnProperty(key) ? replaces[key] : key,
      value,
    ]),
  )

const unionGroupData = (formatRowData, step) => {
  if (_.isEmpty(formatRowData)) return EMPTY_ARRAY

  let groupFormatRowData = []

  for (let i = 0; i < step; i++) {
    let group = {}
    let rowChooserCounter = 0

    while (i + step * rowChooserCounter <= formatRowData.length) {
      group = Object.assign(group, formatRowData[i + step * rowChooserCounter])
      rowChooserCounter += 1
    }

    groupFormatRowData = [...groupFormatRowData, group]
  }

  return groupFormatRowData
}
