'use strict'

import React, { PureComponent } from 'react'

import Ru from 'rutils'

import autobind from 'autobind-decorator'

import {
  withRouter
} from 'react-router-dom';

let pointerStyle = {
  cursor: 'pointer'
}

@withRouter
@autobind
class TopBar extends PureComponent {
    constructor(props){
        super(props)

        this.state = {
            activeRoute: '/',
            topBarClass: '',
            isActive: ''
        }

        this.linksSpec = []

        this.props.history.listen( (location, action) => {
            this.setState({activeRoute: location.pathname});
            this.linksSpec = this.updateLinkSpec(
                location.pathname,
                this.props.linksSpec
            )
        });

    }

    componentWillMount(){
        this.linksSpec = this.updateLinkSpec(
            this.state.activeRoute,
            this.props.linksSpec
        )
    }

    render(){
          return(
            <header className={  "header-section navbar-fixed-top navbar-default header-floating header-fixed " +  this.state.topBarClass } >
              <div className="container">
                  	<div className="navbar-header">
                          <button type="button" className="navbar-toggle" data-toggle="collapse"  data-target="#navigation">
                              <span className="sr-only">Toggle navigation</span>
                              <span className="icon-bar"></span>
                              <span className="icon-bar"></span>
                              <span className="icon-bar"></span>
                          </button>
                          <a
                          className = "navbar-logo"
                          style =  { pointerStyle }
                          href="/"
                          onClick={ () => {
                              this.manageTopBar('/')
                            } }
                          >
                         <img src={'assets/img/logo.png'}  alt=""/>
                                <span className="first">Nation</span>Pay
                          </a>
                      </div>

                      <div id="navigation" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                              {
                                  Ru.addIndex(Ru.map)(this.renderLink, this.linksSpec)
                              }
                        </ul>
                    </div>
              </div>
            </header>
        )
    }

    updateLinkSpec( activeRoute, linksSpec ){

        const mapper = linkSpec => {

            let { route } = linkSpec;

            let isActive = '';
            if (activeRoute !== '/') {
                 isActive = route === activeRoute;
            }

            return Ru.assoc('isActive', isActive, linkSpec)
        }

        return Ru.map( mapper, linksSpec )

    }

    manageTopBar (route) {
        if (route !== '/') {
            this.setState({topBarClass: 'floatingRoute'});
        } else {
            this.setState({topBarClass: ''});
        }
    }

    renderLink(spec, i){
        let {
            title,
            route,
            anchorLink,
            className,
            isUrl,
            isActive
        } =  spec


        let aProps = null

        if ( isUrl ) {

          aProps = {
            style: pointerStyle,
            href: route,
            target: '_blank',
          }

        }
        else{

          aProps = {
            style: pointerStyle,
            onClick: () => {
              this.props.history.push( route );
              this.manageTopBar( route );
            }
          }
        }

        // return (
        //   <li key={i} > <a className={ className } href={ anchorLink } {...aProps}>{title}</a> </li>
        // )
        return (
          <li key={i} className={(isActive)?'isActive':'' } > <a className={ className } href={ anchorLink } {...aProps}>{title}</a> </li>
        )
    }
}

export default TopBar
