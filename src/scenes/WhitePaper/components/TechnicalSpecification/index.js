import React, { Component } from 'react';

class TechnicalSpecification extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="tech" className="tech-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Technical Specification
                            </h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="desc-text">
                                <p>From Bank Account to Token Wallet to Wallet to .... Back to Bank Account</p>
                                <ul className="options">
                                    <li><span>From Minting to Burning, the entire lifecycle of a Bank Token starts with NationPay</span></li>
                                    <li><span>The Bottom Layer is the Ethereum Blockchain which, with sharding, is about to become exponentially fast and allow for a long sustainable, scaleable future. </span></li>
                                    <li><span>Each BankNet is a Token-Based Economy Backed by a Single Banking Network.</span></li>
<li><span>Clients of the Bank can Mint tokens right from their bank account to their wallet.</span></li>
<li><span>Clients can pass those tokens to other clients, non clients, family members in other countries - anyone with a wallet supporting erc-20 tokens.</span></li>
                                    <li><span>BankNet Tokens from different banks are tradable on the NationPay MarketPlace facilitating cross border swaps in a similar way that TransferWise does business but with far greater flexibility than just two currencies. </span></li>
                                    <li><span>A Wallet holder can be a merchant too.  So anone can buy stuff with a bank token, credit card free.</span></li>
                                    <li><span>Tokens can be from debit accounts or even credit acccounts supported by the bank. </span></li>
<li><span>Mint to Burn Cycle Example:  Bank client to an unbanked friend to a supermarket, back to the bank again. </span></li>

                                </ul>
                                <p>
   The key to this technology is <b>the NationPay Triangle</b>, a single line of REST code linking the client to online banking. In the middle is the bank's routine code to transfer cash out of the client account and into the bank's master account. 
Upon success an asynchronous method of just a few lines links online banking to the BankNet Smart Contract, minting tokens to the Client.  This completes the triangle for the minting process. The bank keeps the cash.  This gives the bank greater float while the client enjoys near fee-less, instant transactions and remittance.  After acountless transfers of the token for free across merchants, clients, friends and family, all without online payment processors and without credit card or debirt card fees, someone will want to retire the token.  This happens just like the minting triangle, but in reverse.  The process is called burning and allows the token to go to an ATM for cash to any unbanked or banked person, or directly back to cash inside any client's account performing the burn operation.  Adding to this wonderful technology is the concept of a wallet ATM.  NationPay branded ATMs allow remittance to be near free.  The NationPay Marketplace pulls it all together.   Please read the whitepaper and watch our video for more details.  Early investors and banking officials with more questions, please contact us directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default TechnicalSpecification;
