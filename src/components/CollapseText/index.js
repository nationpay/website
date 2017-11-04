
'use strict'

import React, { PureComponent } from 'react';
import Ru from 'rutils';
import autobind from 'autobind-decorator';

@autobind
class CollapseText extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            icon:      ''
        }
    }

    expandedText() {
        if (this.state.expanded) {
            this.setState({
                expanded: false,
                icon: 'right'
            });
        } else {
            this.setState({
              expanded: true,
              icon: 'left'
            });
        }
    }

    getMoreTextDiv(myText, size) {
        if (myText.length <= size || this.state.expanded === true) {
            return myText;
        } else {
            this.setState({
                icon: 'right'
            });
            return myText.substr(0, size)+'...';
        }
    }

    checkOpen(icon) {
        const aPropsIcon = {
            className: `icon fa fa-angle-double-${icon}`
        }

        const aPropsLink = {
            onClick: this.expandedText,
        }

        return (
            <a { ...aPropsLink }>
                <i { ...aPropsIcon } aria-hidden='true'></i>
            </a>
        )
    }

    render (){

        let icon = this.checkOpen( this.state.icon );

        return (
            <p>
                { this.getMoreTextDiv(this.props.text, this.props.size) }
                { icon }
            </p>
        )
    }
}

export default CollapseText;
