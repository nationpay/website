'use strict'

import React, { Component } from 'react'

import Aboutus from './components/Aboutus'
import Noforced from './components/Noforced'
import Ecosystem from './components/Ecosystem'


class HowItWorks extends Component{
  render(){
    return (
        <div className="sections-container">
        <Aboutus />
          <Noforced />
        <Ecosystem />
        </div>

    )
  }
}


export default HowItWorks
