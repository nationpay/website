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
                            <img src={'assets/img/ecosystem-img-1.png'} alt=""/></a>
                            <h3>RealSafe Tokenization System</h3>
                            <p>Asset Managers use RealSafe Wallet to create an RSO. RealSafe LLC provides free consults and attorney services.</p>
                        </div>
                        <div className="col-md-4">
                            <a href="" className="ecosystem-item">
                            <img src={'assets/img/ecosystem-img-2.png'}  alt=""/></a>
                            <h3>RealSafe Explorer</h3>
                            <p> a blockchain explorer using the RealSafe API to view information on all available RSOs</p>
                        </div>
                        <div className="col-md-4">
                            <a href="" className="ecosystem-item">
                            <img src={'assets/img/ecosystem-img-3.png'} alt=""/></a>
                            <h3>RealSafe Exchange</h3>
                            <p>The singular place for trading RSO/ETH pairs and the RST/Eth pair.</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Ecosystem;
