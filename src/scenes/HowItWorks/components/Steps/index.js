import React, { Component } from 'react';

class Steps extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="steps" className="steps-section section" >
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn">
                                How NationPay Works
                            </h2>
                        </div>
                    </div>
                    <div className="steps">
                        <div id="step1" className="row text-center step-1">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div className="number">
                                    <p>1</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 col-sm-4 text">
                                <h2>First BankNet Goes Live</h2>
                                <p>It all starts when a Bank creates a BankNet on the NationPay wallet.  It costs 5000 NPT to do this.  The bank selects the fees for up to 3 signatories for minting and burning operations. Round-trip total fee for the use of a token with indefinte trading along the way is estimated to be at or under 1% in total. This can include many clients trading the same token, just like cash.  </p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' }></img>
                            </div>
                            <div className="col-md-1 line"></div>
                        </div>

                        <div id="step2" className="row text-center step-2">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div className="number">
                                    <p>2</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12  col-sm-4 text">
                                <h2>Client adds Token Wallet Account on Phone</h2>
                                <p>Any person can add the BankNet as a token wallet account, but only a client can mint tokens from their bank account at that bank to this token wallet account or burn tokens back to that bank account. This can be a debit or credit account.  NationPay handles minting the same way in each case.</p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' }></img>
                            </div>
                            <div className="col-md-1 line"></div>
                        </div>

                        <div id="step3" className="row text-center step-3">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div  className="number">
                                    <p>3</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12  col-sm-4 text">
                                <h2>Minting</h2>
                                <p>Client mints tokens from their bank account by making a REST request through their wallet to their online banking.  This triggers the NationPay Triangle technology whereby tokens are minted into the NationPay wallet and cash moved form the client account to a master account at the bank.</p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' } ></img>
                            </div>
                            <div className="col-md-1 line"></div>
                        </div>
                        <div id="step4" className="row text-center step-4">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div  className="number">
                                    <p>4</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12  col-sm-4 text">
                                <h2>Purchase and Remittance Economy</h2>
                                <p>The Client can send the token to unbanked friends or family around the world, or trade the token for tokens of a foreign bank needed by a friend and then send those tokens to the friend. The client, or anyone who has the tokens, can use them to shop at any merchant store who is a client of that bank, like a supermarket or a restaurant.  All cardless, touchless and feeless, just scan a QR code. Even if the client receives tokens from a credit bank account, the merchant still receives the token instantly, no 25 day waiting period.</p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' } ></img>
                            </div>
                            <div className="col-md-1 line"></div>
                        </div>
                        <div id="step5" className="row text-center step-last">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div  className="number">
                                    <p>5</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 col-sm-4 text">
                                <h2>Burning</h2>
                                <p>Tokens can change hands many times just like a dollar bill. In the end, someone may deposit that token back to their bank account.  This happens by a burn operation.  If the token does not correspond to the desired bank, simply trade for a token accepted by the client's bank using the NationPay Marketplace.  </p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' } ></img>
                            </div>
                            <div className="col-md-1 line"></div>
                        </div>
            			<div id="step5" className="row text-center step-last">
                            <div className="col-md-2 col-md-offset-1 col-sm-2 col-sm-offset-2">
                                <div  className="number">
                                    <p>6</p>
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 col-sm-4 text">
                                <h2>From One to Many</h2>
                                <p>Just one bank with one BankNet represents a complete economy, including merchants, ATMs and clients who give cash for tokens. But if you find yourself with foreign tokens far away from any BankNet node, they can be traded for btc or ether right from the app, creating perfect markets with even just one live BankNet. NationPay will shine the moment it goes live by hosting just one and then thousands of BankNets and millions of users in synchrony.</p>
                            </div>
                            <div className="col-md-2 col-sm-2">
                                <img className="icon-hiw" src={ 'assets/img/check.png' } ></img>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Steps;
