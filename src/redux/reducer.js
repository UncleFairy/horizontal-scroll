export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_ROW_DATA':
      return Object.assign({}, state, { rowData: action.payload.rowData })
    case 'CHANGE_COF':
      return Object.assign({}, state, { cof: action.payload.cof })
    case 'CHANGE_SORT_MODEL':
      return Object.assign({}, state, { sortModel: action.payload.sortModel })
    case 'CHANGE_FILTER_MODEL':
      return Object.assign({}, state, {
        filterModel: action.payload.filterModel,
      })
    default:
      return state
  }
}
