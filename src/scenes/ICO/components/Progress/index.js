

import React, { Component } from 'react';

class Progress extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="progress" className="progress-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Token sale progress
                            </h2>
                        </div>
                    </div>
                    <div className="row wrap" data-stellar-offset-parent="true">
                        <div className="col-md-12 wow fadeIn wowed animated" data-wow-duration="1s" data-wow-delay="0.5s">
                            <div className="stat-sum-total section-title--blue">Total:
                            <span className="stats-btc-total">1228</span> ETH
                            </div>
                            <div className="stat-sum-label-holder">
                                <div className="stat-sum-label" style={{ width: "calc(377 / 1500 * 100%)" }}>Pre-sale</div>
                                <div className="stat-sum-label">Sale</div>
                            </div>

                            <div className="stat-sum-holder">
                                <div className="stat-sum-current stat-sum-current-bar" style={{ width: "calc(81.8667%)" }}></div>
                                <div className="stat-sum-presale" style={{ width: "calc(377 / 1500 * 100%)" }}></div>
                            </div>
                            <div className="stat-sum-legend-holder">
                                <div className="stat-sum-label" style= {{ width: "calc(377 / 1500 * 100%)" }}>377 ETH raised
                                    <div className="stat-sum-money">$1,508,000</div>
                                </div>
                                <div className="stat-sum-label">+<span className="stats-btc-plus">851</span> ETH
                                    <div className="stat-sum-money">&nbsp;$<span className="stats-usd-plus">3,072,440</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ico">
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

export default Progress;
