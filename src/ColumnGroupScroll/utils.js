import _ from 'lodash'

import {
  EMPTY_ARRAY,
  EMPTY_FILTER_MODEL,
  EMPTY_SORT_MODEL,
  ONE_FILTER,
} from '../constants'

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
  // @TODO filter one column function
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

export const getSingleFilter = (filterModel, columnsToFilter, pageCount) => {
  console.log(
    columnsToFilter
      .map(column =>
        filterModel.filter(filter => filter.columnToFilter === column),
      )
      .filter(array => {
        console.log(
          array,
          array.length === pageCount || array.length === 1,
          pageCount,
          'filter',
        )
        return array.length === pageCount || array.length === 1
      })
      .map(filterByColumn => getUniqueValue(filterByColumn)),
    'getSingleFilter',
  )
  return columnsToFilter
    .map(column =>
      filterModel.filter(filter => filter.columnToFilter === column),
    )
    .filter(array => array.length === pageCount || array.length === 1)
    .map(filterByColumn => getUniqueValue(filterByColumn))
}

export const isFilterModelChanged = (filterModel, currentFilterModel) => {
  if (JSON.stringify(filterModel) !== JSON.stringify(currentFilterModel))
    return true
  return false
}

export const getFilterColumns = columnDefsModel =>
  columnDefsModel
    .filter(column => column.filter === true)
    .map(column => column.field)

const getUniqueValue = array => {
  if (
    JSON.stringify(array[0]) !== JSON.stringify(array[1]) &&
    JSON.stringify(array[0]) !== JSON.stringify(array[2])
  )
    return array[0]

  if (
    JSON.stringify(array[0]) !== JSON.stringify(array[1]) &&
    JSON.stringify(array[1]) !== JSON.stringify(array[2])
  )
    return array[1]

  if (
    JSON.stringify(array[0]) !== JSON.stringify(array[2]) &&
    JSON.stringify(array[2]) !== JSON.stringify(array[1])
  )
    return array[2]

  for (let i = 3; i < array.length; i++) {
    if (JSON.stringify(array[i]) !== JSON.stringify(array[0])) return array[i]
  }

  return array[0]
}

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

// if (
//     JSON.stringify(array[0]) !== JSON.stringify(array[1]) &&
//     JSON.stringify(array[0]) !== JSON.stringify(array[2])
// )
//   return array[0]
// if (JSON.stringify(array[2])) return array[1]
// if (
//     JSON.stringify(array[0]) === JSON.stringify(array[1]) &&
//     JSON.stringify(array[2])
// )
//   return array[2]
//
// let node = {}
// for (let i = 3; i < array.length; i++) {
//   if (JSON.stringify(array[i]) !== JSON.stringify(array[0])) {
//     node = { ...array[i] }
//     return
//   }
//   return node
// }
// return array[0]
