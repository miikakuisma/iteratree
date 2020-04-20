import React from 'react'
import { Button } from './lib'
import './Questionnaire.css'

class BigButton extends React.Component {
  constructor() {
    super()
    this.state = {
      buttonDown: false,
    }
  }

  render() {
    const { label, disabled, onPressed } = this.props
    const { buttonDown } = this.state
    return (
      <Button
        pose={buttonDown ? 'pressed' : 'released'}
        disabled={disabled}
        onTouchStart={() => {
          this.setState({ buttonDown: true })
        }}
        onTouchEnd={() => {
          this.setState({ buttonDown: false })
        }}
        onClick={onPressed}
      >{label}</Button>
    )
  }
}

export default BigButton;
