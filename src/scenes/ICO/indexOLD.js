'use strict'

import React, { Component } from 'react'

import Progress from './components/Progress'

import TokenDistribution from './components/TokenDistribution'

import Prepurchased from './components/Prepurchased'

class ICO extends Component{
  render(){
    return (
        <div className="sections-container">
            <Progress />
            <Prepurchased />
            <TokenDistribution />
        </div>
    )
  }
}

export default ICO
