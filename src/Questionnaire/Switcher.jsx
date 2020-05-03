import React from 'react'
import PropTypes from 'prop-types'
import { Zoomer } from './lib'
import './Questionnaire.css'

const propTypes = {
  isVisible: PropTypes.bool.isRequired
}

class Switcher extends React.Component {
  
  render() {
    const { isVisible } = this.props
    return (
      <Zoomer className="switcher zoomer" pose={isVisible ? 'visible' : 'hidden'}>
      </Zoomer>
    )
  }
}

Switcher.propTypes = propTypes;
export default Switcher;
