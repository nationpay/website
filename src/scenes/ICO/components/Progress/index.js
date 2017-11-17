

import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import { Grid, Row , Col } from 'react-bootstrap';

class Progress extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="progress" className="progress-section section" >
                <Grid className="text-center">
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                ICO Coming Soon
                            </h2>
                        </Col>
                    </Row>
                    <Row className="wrap">
                        <Col md={ 12 } className="wow fadeIn wowed animated" data-wow-duration="1s" data-wow-delay="0.5s">
                                <p className="join-now"> Join now to get early-bird price</p>
                             {/*
                            <div className="stat-sum-total section-title--blue">Total:
                            <span className="stats-btc-total">1228</span> ETH
                            </div>
                            <div className="stat-sum-label-holder">
                                <div className="stat-sum-label" style={{width: "calc(377 / 1500 * 100%)"}}>Pre-sale</div>
                                <div className="stat-sum-label">Sale</div>
                            </div>

                            <div className="stat-sum-holder">
                                <div className="stat-sum-current stat-sum-current-bar" style={{ width: "calc(81.8667%)"}}></div>
                                <div className="stat-sum-presale" style={{width: "calc(377 / 1500 * 100%)"}}></div>
                            </div>
                            <div className="stat-sum-legend-holder">
                                <div className="stat-sum-label" style= {{width: "calc(377 / 1500 * 100%)"}}>377 ETH raised
                                    <div className="stat-sum-money">$1,508,000</div>
                                </div>
                                <div className="stat-sum-label">+<span className="stats-btc-plus">851</span> ETH
                                    <div className="stat-sum-money">&nbsp;$<span className="stats-usd-plus">3,072,440</span></div>
                                </div>
                            </div>   */}
                            <Collapsible  trigger="Token Pricing">
                                <p>First 3,000,000 NPT - Private Investment Discount, 1 NPT = $0.50  </p>
                                <p>Next 3,500,000 NPT - Early Adopter discount, 1 NPT = $0.75  </p>
                                <p>Next 3,500,000 NPT - Final discount, 1 NPT = $1.00  </p>
                                <p>Final 30,000,000 NPT - Nominal Price, 1 NPT = $1.50  </p>
                             </Collapsible>
                        </Col>
                    </Row>
                    <Row className="ico">
                        <Col md={ 6 } mdOffset={ 3 }>
                            <div className="btn-cta">
                                <a href="https://ico.nationpay.io/" target="_blank" className="btn btn-app-download crowdsale">
                                    <i className="fa fa-sign-in"></i>
                                    JOIN crowdsale
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Grid>
        </section>
        )
    }
}

export default Progress;
