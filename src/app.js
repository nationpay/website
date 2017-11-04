import React, { Component } from 'react'
import TopBar from './components/TopBar'
import Footer from './components/Footer'

import HomeScene from './scenes/Home'
import HowItWorksScene from './scenes/HowItWorks'
import ICOScene from './scenes/ICO'
import WhitePaperScene from './scenes/WhitePaper'



import {
  BrowserRouter as Router,
  HashRouter,
  Redirect,
  Switch,
  Route
} from 'react-router-dom'


let linksSpec = [
    {
        title: 'JOIN CROWDSALE',
        route: '/',
        isActive: false
    },
    {
      title: 'HOW IT WORKS',
      route: '/about_realsafe',
      isActive: false
    },
    {
        title: 'TOKEN',
        route: '/ico',
        isActive: false
    },
    {
        title: 'Roadmap',
        route: '/',
        isActive: false,
        anchorLink: '#roadmap',
        className: 'anchor-link'
    },
    {
        title: 'Team',
        route: '/',
        isActive: false,
        anchorLink: '#team',
        className: 'anchor-link'
    },
    {
        title: 'WhitePaper',
        route: '/whitepaper',
        isActive: false
    },
    {
        title: 'F.A.Q',
        route: '/faq',
        isActive: false
    },
]



class App extends Component {

  constructor() {
      super();
  }

  render(){
      return(
        <HashRouter>
          <div>
            <TopBar  linksSpec = { linksSpec } />
            {/*<Footer /> */}
            <Switch>
              <Route exact path="/" component={HomeScene}/>
              <Route path="/about_realsafe" component={HowItWorksScene}/>
              <Route path="/ico" component={ICOScene}/>
              <Route path="/whitepaper" component={WhitePaperScene}/>
              <Redirect to='/' />
            </Switch>
            <Footer />
          </div>
        </HashRouter>

      )
  }

}

export default App;
