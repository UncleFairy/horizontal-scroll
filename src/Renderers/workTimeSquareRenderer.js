import React, { Component } from 'react'

export default class SquareRenderer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.valueSquared(),
    }
  }

  valueSquared() {
    if (isNaN(this.props.value)) return ''
    return `${Math.ceil(((this.props.value / 2) * 3) / 4 / 140)} days`
  }

  render() {
    return <span>{this.state.value}</span>
  }
}
