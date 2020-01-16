export const addRowData = rowData => ({
  type: 'ADD_ROW_DATA',
  payload: {
    rowData,
  },
})

export const changeCof = cof => ({
  type: 'CHANGE_COF',
  payload: {
    cof,
  },
})

export const changeSortModel = sortModel => ({
  type: 'CHANGE_SORT_MODEL',
  payload: {
    sortModel,
  },
})

export const changeFilterModel = filterModel => ({
  type: 'CHANGE_FILTER_MODEL',
  payload: {
    filterModel,
  },
})
