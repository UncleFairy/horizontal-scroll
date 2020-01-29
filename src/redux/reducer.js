export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_ROW_DATA':
      return Object.assign({}, state, { rowData: action.payload.rowData })
    case 'CHANGE_COF':
      return Object.assign({}, state, { cof: action.payload.cof })
    case 'CHANGE_SORT_MODEL':
      return Object.assign({}, state, { sortModel: action.payload.sortModel })
    case 'SET_COLUMN_DEFS':
      return Object.assign({}, state, { columnDefs: action.payload.columnDefs })
    case 'CHANGE_FILTER_MODEL':
      return Object.assign({}, state, {
        filterModel: action.payload.filterModel,
      })
    case 'CHANGE_GRID_HEIGHT':
      return Object.assign({}, state, {
        gridHeight: action.payload.gridHeight,
      })
    default:
      return state
  }
}
