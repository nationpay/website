import React, { Component } from 'react';
import Ru from 'rutils'
import AboutFeature from './components/AboutFeature'

let aboutList = [
    {
        title: 'Tokenizing Service ',
        text: 'Extension of Deed, LLC, CLO or Real Estate Trust into a tokenized asset managment solution on blockchain. The extended form is a RealEstate-backed DAO, we call an RSO. Removing the barrier to asset backed tokenization - anyone can tokenize their corporate strucutre holding real estate with no third party necessary.',
        icon:'fa fa-trophy'

    },
    {
        title: 'RealSafe Marketplace - Lists all RSOs',
        text: 'The trading of an RSO commences the moment an owner creates a market by offering any amount of his apportioned tokens on the RealSafe Exchange.',
        icon:'fa fa-trophy'

    },
    {
        title: 'Blockchain Explorer API',
        text: 'Provides the structure to ensure vital RSO stats. are stored on blockchain. Anyone can create a RealSafe Explorer using the API.',
        icon:'fa fa-trophy'

    },
    {
        title: 'RealSafe Blockchain Explorer',
        text: 'For any RSO selected, displays: a) Number of outstanding tokens and owners b) Addreseses and estimated values of each asset c)Outstanding issues up for vote.',
        icon:'fa fa-trophy'

    },
    {
        title: 'RealSafe Wallet',
        text: 'Add an RSO, notarize and time-stamp, deed, trust and regulatory documents before uploading them. RSO voting strucutre. Raise funds as secondary Offerings. Privatize RSO or make it public.',
        icon:'fa fa-trophy'

    },
    {
        title: 'Compliance and safety ',
        text: 'RSO creator sets features to allow investor buy-in restrictions such as kyc compliance, min/max ownership limits, buy/sell freq. limits etc.',
        icon:'fa fa-trophy'

    },
    {
        title: 'RSO tokens',
        text: 'Unique symbols to represent each RSOs ownership. For example, the RSO named Lower Manhattan REIT has token symbol NYC1 on the RealSafe exchange',
        icon:'fa fa-trophy'

    },
    {
        title: 'Power and flexibility',
        text: "general partner/propery manager can set disclosable comissions whenever a trade is made of their token, converting the general partner into a fund manager. That's unbelieveable power.",
        icon:'fa fa-trophy'

    },
]

class Aboutus extends Component {

    constructor() {
        super();
    }

    render(){
        return(
			<section id="aboutus" className="aboutus-section section">
				<div className="container" >
					<div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                               We are RealSafe
                            </h2>
                            <p className="wow fadeIn description" data-wow-duration="1s">
                                RealSafe is a blockchain platform for fractionating asset ownership into exchange-tradable tokens while transforming complex financial deals and governance business into routine blockchain transactions. The result is a network of RealSafe Organizations (RSO)s, asset-backed decentralized autonomous oragnizations owned 100% by their token holders, traded and managed with security and transparency on the Ethereum blockchain.
                                <br/>Raise funds backed by a 4-family building with no risk of default or extend a portfolio of assets into a fully exchange-traded REIT. RealSafe RSOs feature automated distributions and separable voting and ownership tokens. RealSafe Platform offers these services:
                            </p>
                        </div>
                    </div>
					<div className="about-list row wow fadeIn" data-wow-duration="1s">
                        {
                            Ru.addIndex(Ru.map)(this.renderAboutFeature, aboutList)
                        }
					</div>
				</div>
			</section>
        )
    }

    renderAboutFeature(spec, i){
        return (
            <AboutFeature spec={ spec } key = { i } index = { i }  />
        )
    }
}

export default Aboutus;
