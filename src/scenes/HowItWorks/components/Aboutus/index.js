import React, { Component } from 'react';
import Ru from 'rutils'
import AboutFeature from './components/AboutFeature'

let aboutList = [
    {
        title: 'Integrating with Banks ',
        text: 'Thes imple step here is integrating with online banking.',
        icon:'fa fa-trophy'

    },
    {
        title: 'Building the NationPay Wallet',
        text: 'BankNet creation,  accounts and account screens.',
        icon:'fa fa-trophy'

    },
    {
        title: 'Building the Blockchain Explorer and API',
        text: 'The valuable category spend data is available here.  But only banks have the KYC on their cusomters, the world can see the categories and spend trends with our advanced artifical intellence based blockchain explorer.  ',
        icon:'fa fa-trophy'

    },

    {
        title: 'NationPay MarketPlace',
        text: 'The heart of commerce rests in cross border trade and the NationPay Marketplace makes great remittance platforms like TransferWise seem archaic.',
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
                               We are NationPay
                            </h2>
                            <p className="wow fadeIn description" data-wow-duration="1s">
                                Empowering Banks to Empower You. NationPay provides banks with token economies in a setup that takes minutes to complete. Wallets link to bank accounts effortlessly while clients enjoy the freedom of access to their accounts to buy and remit using only their mobile device. The bank keeps the cash all the while the token is used in the economy increasing bank profitability from float. NationPay is secured by the Ethereum blockchain. It is a cardless debit and credit card solution, plus remittance as Wallet to Wallet to ATM. We invite you to watch our introductory video and particpate in our crowdsale. NationPay is empowering banks to empower clients to empower everyone. The goals are:
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
