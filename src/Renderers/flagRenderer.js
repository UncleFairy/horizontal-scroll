import React, { Component } from 'react'
import ReactCountryFlag from 'react-country-flag'

export default class CubeRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.valueCubed(),
    }
  }

  valueCubed() {
    switch (this.props.value) {
      case 'Boxter':
        return (
          <ReactCountryFlag
            countryCode="GE"
            svg
            style={{
              width: '2em',
              height: '2em',
            }}
            title="GE"
          />
        )
      case 'Celica':
        return (
          <ReactCountryFlag
            countryCode="JP"
            svg
            style={{
              width: '2em',
              height: '2em',
            }}
            title="JP"
          />
        )
      case 'Mondeo':
        return (
          <ReactCountryFlag
            countryCode="US"
            svg
            style={{
              width: '2em',
              height: '2em',
            }}
            title="US"
          />
        )
      default:
        return ''
    }
  }

  render() {
    return <span>{this.state.value}</span>
  }
}
