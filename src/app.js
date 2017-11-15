import React, { Component } from 'react'
import TopBar from './components/TopBar'
import Footer from './components/Footer'

import HomeScene from './scenes/Home'
import HowItWorksScene from './scenes/HowItWorks'
import ICOScene from './scenes/ICO'
import WhitePaperScene from './scenes/WhitePaper'

import Ru from 'rutils'


import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from 'react-router-dom'


class App extends Component {

  constructor(props) {
      super(props)
      this.linksSpec = [
        {
          type: 'url',
          item: {
            pointer: 'https://ico.realsafe.co/#/register',
            title: 'DANIEL AUTH',
            sameTab: false,
            icon: null,
            showIf: Ru.K(false),
            className: null
          }
        },
        {
          type: 'url',
          item: {
            pointer: 'https://ico.realsafe.co/#/register',
            title: 'JOIN CROWDSALE',
            sameTab: false,
            icon: null,
            showIf: Ru.K(false),
            className: null
          }
        },
        {
          type: 'custom',
          item: {
            onClickAction: Ru.I,
            title: 'JOIN CROWDSALE',
            icon: null,
            showIf: Ru.K(false),
            className: null
          }
        },
        {
          type: 'route',
          item: {
            pointer: '/',
            title: 'HOME',
            icon: null,
            showIf: Ru.K(true),
            className: null,
            isActive: true
          }
        },
        {
          type: 'route',
          item: {
            pointer: '/about_realsafe',
            title: 'HOW IT WORKS',
            icon: null,
            showIf: Ru.K(true),
            className: null,
            isActive: true
          }
        },
        {
          type: 'route',
          item: {
            pointer: '/ico',
            title: 'TOKEN',
            icon: null,
            showIf: Ru.K(true),
            className: null,
            isActive: true
          }
        },
        {
          type: 'anchor',
          item: {
            title: 'Roadmap',
            pointer: '/',
            path: '#roadmap',
            icon: null,
            showIf: Ru.K(false),
            className: 'anchor-link',
            isActive: false,
          }
        },
        {
          type: 'anchor',
          item: {
            title: 'Team',
            pointer: '/',
            path: '#team',
            icon: null,
            showIf: Ru.K(false),
            className: 'anchor-link',
            isActive: false,
          }
        },
        {
          type: 'route',
          item: {
            pointer: '/whitepaper',
            title: 'WhitePaper',
            icon: null,
            showIf: Ru.K(true),
            className: null,
            isActive: true
          }
        },
        {
          type: 'url',
          item: {
            pointer: 'https://ico.realsafe.co/',
            title: 'Sign In',
            sameTab: false,
            icon: null,
            showIf: Ru.K(true),
            className: null
          }
        },
        {
          type: 'route',
          item: {
            pointer: '/faq',
            title: 'F.A.Q',
            icon: null,
            showIf: Ru.K(false),
            className: null,
            isActive: true
          }
        }
      ]

      // this.linksSpec = [
      //     {
      //         title: 'JOIN CROWDSALE',
      //         route: 'http://34.216.30.37:3000/#/register',
      //         isUrl: true,
      //         isActive: false
      //     },
      //     {
      //       title: 'HOW IT WORKS',
      //       route: '/about_realsafe',
      //       isActive: false
      //     },
      //     {
      //         title: 'TOKEN',
      //         route: '/ico',
      //         isActive: false
      //     },
      //     {
      //         title: 'Roadmap',
      //         route: '/',
      //         isActive: false,
      //         anchorLink: '#roadmap',
      //         className: 'anchor-link'
      //     },
      //     {
      //         title: 'Team',
      //         route: '/',
      //         isActive: false,
      //         anchorLink: '#team',
      //         className: 'anchor-link'
      //     },
      //     {
      //         title: 'WhitePaper',
      //         route: '/whitepaper',
      //         isActive: false
      //     },
      //     {
      //         title: 'F.A.Q',
      //         route: '/faq',
      //         isActive: false
      //     },
      // ]
  }

    render(){
        return(
            <div>
                <TopBar  linksSpec = { this.linksSpec } />
                <Switch>
                    <Route exact path="/" component={HomeScene}/>
                    <Route path="/about_realsafe" component={HowItWorksScene}/>
                    <Route path="/ico" component={ICOScene}/>
                    <Route path="/whitepaper" component={WhitePaperScene}/>
                    <Redirect to='/' />
                </Switch>
                <Footer />
            </div>
        )
    }
}

export default App;
