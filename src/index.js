import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { reducer } from './redux/reducer'
import { addRowData, changeGridHeight } from './redux/actions'
import { dataCreator } from './data'
import App from './App'

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

store.dispatch(addRowData(dataCreator(1000)))
store.dispatch(changeGridHeight(600))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
