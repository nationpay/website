import React, { Component } from 'react';
import Ru from 'rutils'
import Guarantee from  './components/Guarantee'

let guarantees = [
    {
        image: 'assets/img/guarantees-img-1.png',
        text: 'Pre-ICO and ICO pre-purchasing of RealSafe RSOs and asset-registrations are paid for with Ether.'
    },
    {
        image: 'assets/img/circle2.png',
        text: 'The RealSafe token (RST) is unaffiliated with any particular RSO. 1100 RST pre-buys 1 RSO with 1 asset-registration credit, its own token-type and near-infinitely fracional tradability on RealSafe Exchange.'
    },
    {
        image: 'assets/img/circle2.png',
        text: 'RealSafe LLC is creating the distributed network through which RSOs operate independently, responsible for their own regulation and compliance.'
    },
    {
        image: 'assets/img/circle2.png',
        text: 'RealSafe is a facilitator of fractionated asset management on blockchain. Each RSO is independently controlled and operated by the management team elected by it.'
    },
    {
        image: 'assets/img/guarantees-img-1.png',
        text: 'RealSafe Wallet allows transfers of RST, Etheruem and RSO tokens. RSO kyc feature allows RSO transfers to be restrictable to kyc-compliant wallet addresses.'
    },
]

class Prepurchased extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="prepurchased" className="prepurchased-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Pre-Purchase an RSO Economy
                            </h2>
                        </div>
                    </div>
                    <div className="row guarantees-list ">
                        <div className="col-md-10 col-md-offset-1">
                            <div className="row main">
                                {
                                    Ru.addIndex(Ru.map)(this.renderGuarantee, guarantees)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    renderGuarantee (spec, i) {
        return (
            <Guarantee spec={ spec } key = { i } index = { i }  />
        )
    }
}

export default Prepurchased;
