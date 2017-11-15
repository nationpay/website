import React, { Component } from 'react';

import { Grid, Row , Col } from 'react-bootstrap';

class Ico extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="ico" className="ico-section section" >
                <Grid className="text-center">
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                SIGN UP NOW FOR EARLY ACCESS
                            </h2>
                        </Col>
                    </Row>
                    <Row className="ico">
                        <Col md={ 12 }>
                            <div id ="getting-started" className="getting-started"> </div>
                        </Col>
                        <Col md={ 6 } mdOffset={ 3 }>
                            <div className="btn-cta">
                                <a href="https://ico.realsafe.co/#/register" target="_blank"  className="btn btn-app-download crowdsale">
                                    <i className="fa fa-sign-in"></i>
                                    REGISTER NOW
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </section>
        )
    }
}

export default Ico;
