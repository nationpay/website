'use strict'

import React, { Component } from 'react'

import Cover from './components/Cover'

import Features from './components/Features'

import Advantages from './components/Advantages'


import Ico from './components/Ico'

import Roadmap from './components/Roadmap'

import Team from './components/Team'

class Home extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <div className="sections-container">
                <Cover />
                <Features/ >
                <Advantages />
                <Ico />
                <Roadmap />
                <Team />
            </div>
        )
    }
}

export default Home
