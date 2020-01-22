import React, { Component } from 'react'

export default class CubRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.valueSquared(),
    }
  }

  valueSquared() {
    if (isNaN(this.props.value)) return ''
    return (((((this.props.value / 3) * 4) / 2) * 3) / 4) * 7
  }

  render() {
    return <span>{this.state.value}</span>
  }
}
