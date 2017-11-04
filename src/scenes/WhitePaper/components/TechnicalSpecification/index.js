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
                                <p>RealSafe layer on Ethereum Blockchain</p>
                                <ul className="options">
                                    <li><span>RealSafe uses an existing base-chain with a strong foundation and near-term plans for million transaction per second scaleability to ensure security and speed for a long future.</span></li>
                                    <li><span>RealSafe Marketplace matches traders and executes all trades as wallet to wallet via a mediated temporary marketplace escrow address, constructing a real exchange-feel without any of the risk of exchange-owned assets.</span></li>
                                    <li><span>Each RSO has its own token type that may also be an erc-20 token.  Its construct is defined within the RealSafe protocol and mediated by a unique smart contracts controlling one RSO only.</span></li>
                                    <li><span>Each RSO maintains complete control over who can own their token, group rights, voting token sub-types and transational Issues such as secondary offerings, and auto-escrow-enforced buybacks. </span></li>
                                    <li><span>Each RSO has its own RealSafe Exchange-Owned Ethereum address to which signed messages are broadcast by the RealSafe exchange for recording RSO token transfers</span></li>
                                    <li><span>Wallet to wallet transfers are based on customizable RSO rules transacted through the contract governing that particular RSO.
                                      RealSafe wallet and the RealSafe Marketplace maximizes the security features of the Ethereum network by requiring unique contracts for each RSO to mediate every transaction supported by a central contract. </span></li>
                                </ul>
                                <p>RealSafe Marketplace: RealSafe transactions ride on top of the ETH chain and are paid for with RST.
                                   The Ethereum chain requires ETH to pay the fee.   RealSafe exchange preserves the luxury of recording every transaction on blockchain. Therefore every swap in the Marketplace is broadcast to the Ethereum network as wallet to wallet via a temporary escrow.
                                   To acheive this, the Marketplace uses part of the ETH fee to cover the gas required for the Ethereum network to complete the dual-transaction via the appropriate smart contracts.
                                   Trading an RSO token/ETH pair is a challenge met by several actions happening in concert.
                                   RSO may not be kept from being exchanged freely wallet to wallet, potentially violating any RSO restrictions set on them by their creator if those tokens were open to trading on an exchange outside the RealSafe platform.
                                   As such, it is the responsiblity of the RSO manager to determine not to list their erc-20 compliant token on any exchange outside the RealSafe platform.
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
