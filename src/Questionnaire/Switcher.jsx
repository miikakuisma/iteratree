import React from 'react'
import PropTypes from 'prop-types'
import { Zoomer } from './lib'
import './Questionnaire.css'

class Switcher extends React.Component {
  
  static propTypes = {
    isVisible: PropTypes.bool.isRequired
  }

  render() {
    const { isVisible } = this.props
    return (
      <Zoomer className="switcher zoomer" pose={isVisible ? 'visible' : 'hidden'}>
      </Zoomer>
    )
  }
}

export default Switcher;
