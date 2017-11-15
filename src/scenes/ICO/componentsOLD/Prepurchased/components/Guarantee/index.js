
'use strict'

import React, { PureComponent } from 'react';
import Ru from 'rutils';
import autobind from 'autobind-decorator';
import CollapseText from '../../../../../../components/CollapseText'

@autobind
class Guarantee extends PureComponent {

    constructor(props) {
        super(props);
    }

    render (){
        let classNameContainer = 'guarantees-item  col-md-4 wowed animated wow ';

        switch (this.props.index) {
            case 0:
                classNameContainer += ' fadeInLeft'
                break;
            case 1:
                classNameContainer += 'zoomIn'
                break;
            case 2:
                classNameContainer += 'fadeInRight'
                break;
            case 3:
                classNameContainer += 'fadeInLeft'
                break;
            case 4:
                classNameContainer += 'fadeInRight'
                break;
            default:
        }

        return (
            <div className={ classNameContainer } data-wow-duration="1s" data-wow-delay="0.5s">
                <div className="contain">
                    <img src={ this.props.spec.image }/>
                    <CollapseText text={ this.props.spec.text } size={ 100 } />
                </div>
            </div>
        )
    }
}

export default Guarantee;
