import React, { Component } from 'react'

export default class ContainFilter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
    }

    this.onChange = this.onChange.bind(this)
  }

  isFilterActive() {
    return (
      this.state.text !== null &&
      this.state.text !== undefined &&
      this.state.text !== ''
    )
  }

  doesFilterPass() {
    return true
  }

  getModel() {
    return { filter: this.state.text }
  }

  setModel(model) {
    this.state.text = model ? model.filter : ''
  }

  onChange(event) {
    let newValue = event.target.value
    if (this.state.text !== newValue) {
      this.setState(
        {
          text: newValue,
        },
        () => {
          this.props.filterChangedCallback()
        },
      )
    }
  }

  render() {
    let style = {
      backgroundColor: 'white',
      width: '200px',
      height: '30px',
      marginTop: '6px',
    }

    return (
      <div style={style}>
        Filter: <input value={this.state.text} onChange={this.onChange} />
      </div>
    )
  }
}
