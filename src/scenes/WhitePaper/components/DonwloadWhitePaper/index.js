import React, { Component } from 'react';

class DonwloadWhitePaper extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="dwp" className="dwp-section section" >
                <div className="container text-center">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                            WHITEPAPER
                            </h2>
                        </div>
                    </div>

                    <div className="row ico">
                        <div className="col-md-6 col-md-offset-3">
                            <div className="btn-cta">
                                <a href={ 'assets/doc/NationPay_the_Parallization_of_National_Currencies.pdf' }  target="_blank"  className="btn btn-app-download crowdsale">
                                    <i className="fa fa-sign-in"></i>
                                    Donwload whitepaper
                                </a>
                                <img src={'assets/img/whitepaper.png'} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default DonwloadWhitePaper;
