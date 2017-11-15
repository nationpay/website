
'use strict'

import React, { PureComponent } from 'react';
import Ru from 'rutils';
import autobind from 'autobind-decorator';
import { Col } from 'react-bootstrap';
import CollapseText from '../../../../../../components/CollapseText'

@autobind
class Player extends PureComponent {

    constructor(props) {
        super(props);
    }


    checkLinkedin(lk) {
        if(lk){
            return(
                <div className="social">
                    <a href={ lk } target="_blank" className="linkedin">  <i className="fa fa-linkedin" aria-hidden="true"></i></a>
                </div>
            )
        }
    }

    render (){
        let classNameContainer = 'team-list-item';
        let classNameRow = 'contain';

        if (this.props.spec.type === 'team') {
            switch (this.props.index) {
                case 0:
                    classNameContainer = 'wow fadeInLeft wowed animated team-list-item'
                    break;
                case 1:
                    classNameContainer = 'wow zoomIn wowed animated team-list-item'
                    break;
                case 2:
                    classNameContainer = 'wow fadeInRight wowed animated team-list-item'
                    break;
                default:
            }
        }

        return (
            <Col md= { 4 } className={ classNameContainer } data-wow-duration="1s" data-wow-delay="0.5s">
                <div className={ classNameRow }>
                    <div className="img" style={{ backgroundImage: `url( ${this.props.spec.image} )` }}></div>
                    <div className="about">
                        <div className="nameBlock">
                            <div className="name"> { this.props.spec.name }</div>
                            <div className="office">{ this.props.spec.office }</div>
                        </div>
                        { this.checkLinkedin(this.props.spec.linkedin) }
                    </div>
                    <CollapseText text={ this.props.spec.bio } size={315} />
                </div>
            </Col>
        )
    }
}

export default Player;
