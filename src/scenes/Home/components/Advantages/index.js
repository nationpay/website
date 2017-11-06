import React, { Component } from 'react';

class Advantages extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="advantages" className="advantages-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Advantages
                            </h2>
                        </div>
                    </div>
                    <div className="row image">
                        <div className="col-md-8 col-md-offset-2">
                            <img src={'assets/img/advantages.png'} alt="" />
                        </div>
                    </div>
                    <div className="row advantages">
                        <div className="col-md-10 col-md-offset-1">
                            <div className="row">
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="0.25s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-lock" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>Pin Access</h3>
                                        <p>Spending tokens is like using your credit or debit card.  Unlike your credit card, the NationPay wallet is protected with a pin at all times. Banks save billions on credit card fraud.</p>
                                    </div>

                                </div>
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="0.75s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-money" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>Cash for Tokens at the ATM</h3>
                                        <p>Just look for the NationPay logo at your bank ATM.  Getting cash is easy with QR scan.  Simply send tokens to the ATM and get cash.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="1.25s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>Cash out at Foreign ATMs</h3>
                                        <p>If the ATM is not a client of the bank whose tokens you have, simply trade on the NationPay marketplace for tokens of the bank whose symbol is on the ATM.  It's that simple.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="1.75s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-times" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>No Physical Cards</h3>
                                        <p>No more credit or debit cards to carry.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="2.25s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-exchange" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>Tourism</h3>
                                        <p>Trade for tokens at a bank in a foreign country you are going to visit, then go to the ATM accepting those tokens to get cash in that currency.</p>
                                    </div>
                                </div>
                                <div className="col-md-4 item wow bounceInRight wowed animated" data-wow-duration="0.5s" data-wow-delay="2.75s">
                                    <div className="contain">
                                        <div className="img">
                                            <div className="circle">
                                                <i className="fa fa-rocket" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <h3>Remittance</h3>
                                        <p>Trade for tokens of a bank near where your family member lives in some foreign country.   Send the tokens wallet to wallet and the receiver just gets the cash at the ATM or any client local to the receiver accepting them, like a supermarket.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Advantages;
