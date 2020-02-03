import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { reducer } from './redux/reducer'
import { addRowData, changeGridHeight, setColumnDefs } from './redux/actions'
import { dataCreator } from './data'
import App from './App'
import { columnDefsModel } from './ColumnGroupScroll/columnDefsModel'

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

store.dispatch(addRowData(dataCreator(10000)))
store.dispatch(changeGridHeight(600))
store.dispatch(setColumnDefs(columnDefsModel(true)))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
