import React, { Component } from 'react';

class Features extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="features" className="features-section section" >
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                About Nation Pay
                            </h2>
                        </div>
                        <div className="col-md-10 col-md-offset-1 description">
                            <p> NationPay provides banks with token economies in a setup that takes minutes to complete.  Bank accounts link to wallets effortlessly while clients enjoy the freedom of access to their accounts to buy and remit using only their mobile device.  The bank keeps the cash all the while the token is used in the economy increasing their profitability from float.   NationPay is secured by the Ethereum blockchain.  It is a cardless debit and credit card solution, plus remittance as Wallet to Wallet to ATM.  We invite you to watch our introductory video and particpate in our crowdsale.  NationPay is empowering banks to empower clients to empower everyone. </p>
                        </div>
                    </div>
                    <div className="row platform">
                        <div className="col-md-4 col-sm-6">
                            <ul className="list-left wow fadeInLeft animated" data-wow-duration="1s">
                                <li className="item">
                                    <h5>Goodbye Credit Cards</h5>
                                    <p>NationPay enables clients to buy from other clients through a secure app. as touchless wallet to wallet scanned visual transfer.  Value transfer is secured through bank-secured tokens.   Wallet links directly to client bank or credit card account.  Merchants are clients and clients are anyone from the same or different banks.</p>
                                </li>
                                <li className="item">
                                    <h5>Clients Empowered</h5>
                                    <p>Clients touch a button to transfer cash from bank or credit account to tokens in their wallet.  Bank enjoys the float while the tokens remain freely traded wallet to wallet in the larger token economy.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4 col-md-push-4 col-sm-6">
                            <ul className="list-right wow fadeInRight animated" data-wow-duration="1s">
                                <li className="item">
                                    <h5>Market-driven Remittance</h5>
                                    <p>Wallet to Wallet to ATM.  Nothing is faster.  Market determines trade pair ratio between tokens of different banks. Like Transfer-Wise, there is a market in both directions.  The market moves the price. The most efficient remittance platform ever conceived.  Allows anyone to particpate in the remitance chain through an open MarketPlace.  Open market makes fees near zero.</p>
                                </li>
                                <li className="item">
                                    <h5>Unbanked Empowered</h5>
                                    <p>Anyone can download the NationPay wallet app to freely receive tokens of any bank origin from anyone. Shop with tokens or redeem them for cash at any bank or client owned ATM with the NationPay logo.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-4 col-md-pull-4 text-center">
                            <img src={'assets/img/features_app.png'} className="image wow fadeInUp animated" alt="" data-wow-duration="1s"/>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Features;
