import React, { Component } from 'react'
import { AgGridReact } from 'ag-grid-react'

import data from './data'
import Scroll from './components1/Scroll'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { secator } from './components1/Scroll/utils'

class App extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state = {
      pageCount: 0,
      perPage: 5,
      columnDefs: [
        {
          headerName: 'Make',
          field: 'make',
        },
        {
          headerName: 'Model',
          field: 'model',
        },
        {
          headerName: 'Price',
          field: 'price',
        },
      ],
      rowData: [],
    }
  }
  perPage = 5

  handleRowDataChange = (beginNumber, number) => {
    console.log(beginNumber, number)
    this.setState({ rowData: secator(data, beginNumber, number) })
  }

  render() {
    return (
      <div>
        <div
          ref={this.myRef}
          className="ag-theme-balham"
          style={{
            height: '175px',
            width: '600px',
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            gridOptions={{
              suppressHorizontalScroll: true,
            }}
          />
        </div>

        <Scroll
          max={Math.floor(data.length / this.state.perPage) - 1}
          handleRowDataChange={this.handleRowDataChange}
          perPage={this.perPage}
        />
      </div>
    )
  }
}

export default App
