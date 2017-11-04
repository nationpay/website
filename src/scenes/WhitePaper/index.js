'use strict'

import React, { Component } from 'react'

import TechnicalSpecification from './components/TechnicalSpecification'

import DonwloadWhitePaper from './components/DonwloadWhitePaper'

class WhitePaper extends Component{
  render(){
    return (
        <div className="sections-container">
            <TechnicalSpecification />
            <DonwloadWhitePaper />
        </div>
    )
  }
}

export default WhitePaper
