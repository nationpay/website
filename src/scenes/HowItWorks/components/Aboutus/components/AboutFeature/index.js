'use strict'

import React, { PureComponent } from 'react';
import Ru from 'rutils';
import autobind from 'autobind-decorator';
import CollapseText from '../../../../../../components/CollapseText'

@autobind
class AboutFeature extends PureComponent {

    constructor(props) {
        super(props);
    }

    render (){
        return (
            <div className="about-list-item col-md-6">
                <div className="general_img">
                <i className={ this.props.spec.icon }></i>
                </div>
                <h3>{ this.props.spec.title }</h3>
                <CollapseText text={this.props.spec.text} size={200} />
            </div>
        )
    }
}

export default AboutFeature;
