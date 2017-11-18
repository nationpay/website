import React, { Component } from 'react';

class Ecosystem extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="ecosystem" className="ecosystem-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Ecosystem
                            </h2>
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="col-md-4">
                            <a href="" className="ecosystem-item">
                            <img src={'assets/img/social-sharing.png'} alt=""/></a>
                            <h3>NationPay Wallet</h3>
                            <p> Make a BankNet or open many accounts in one wallet</p>
                        </div>
                        <div className="col-md-4">
                            <a href="" className="ecosystem-item">
                            <img src={'assets/img/social-sharing.png'}  alt=""/></a>
                            <h3>NationPayExplorer</h3>
                            <p>Reporting on what categories people shopped in, from a single user up to the whole banking region.</p>
                        </div>
                        <div className="col-md-4">
                            <a href="" className="ecosystem-item">
                            <img src={'assets/img/social-sharing.png'} alt=""/></a>
                            <h3>NationPay MarketPlace</h3>
                            <p>The heart of the NationPay economy rests on this marketplace and since tokens are erc-20, they are tradable anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Ecosystem;
