import React, { Component } from 'react';

class Noforced extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="noforced" className="noforced-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                No Credit Cards  No Debit Cards. Unbank the Banked. Keep the Banks Happy
                            </h2>
                            <p className="wow fadeIn description" data-wow-duration="1s">Almost everyone in the blockchain space has talked about decentralizing banks.  But perhaps only 3 people on the planet have realized that by including the banks, you accelerate that process.  The place to start is getting the money out of the bank accounts.  To do that and keep the banks happy, you get clients to mint tokens while the cash stays in the bank.  It is a simply elegant concept.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="options">
                                <li>Bank accounts linked to token wallets.</li>
                                <li>Banks set the fees for minting and burning but are incentivzed to keep those fees extremely low.</li>
                                <li>Local bank token economies expand to a world economy of users on blockchain, cardless and free.</li>
                              
                                <li>Unprecendented commerce on blockchain results.</li>
                                <li>Scales to world level by using the bank infrasturcutre.</li>
                                <li>Atms become wallet ATMs like bitcoin ATM network but without the fees due to zero volatility in token related to what people buy things in.  Bank tokens are pegged to their local fiat derivative.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Noforced;
