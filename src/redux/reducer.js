export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_ROW_DATA':
      return Object.assign({}, state, { rowData: action.payload.rowData })
    default:
      return state
  }
}
