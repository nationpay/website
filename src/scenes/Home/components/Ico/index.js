import React, { Component } from 'react';

class Ico extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="ico" className="ico-section section" >
                <div className="container text-center">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Join Nation Pay
                            </h2>
                        </div>
                    </div>
                    <div className="row ico">
                        <div className="col-md-12">
                            <div id ="getting-started" className="getting-started"> </div>
                        </div>
                        <div className="col-md-6 col-md-offset-3">
                            <div className="btn-cta">
                                <a  className="btn btn-app-download crowdsale">
                                    <i className="fa fa-sign-in"></i>
                                    JOIN crowdsale
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Ico;
