import React, { Component } from 'react';

class TokenDistribution extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="tdistribution" className="tdistribution-section section" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                RealSafe Token (RST) Distribution
                            </h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="social-text">
                                 <p><span># Coins Minted </span>110,000,000 RSTs will be pre-mined on or before ICO date. Date of ICO to be announced.</p>
                                <p>A maximum amount of 73,500,000 RST tokens granted to RSO pre-purchasing contributors. </p>
                                <p>50% matched addition to tokens granted to pre-purchasers will be distributed as:</p>
                                <ul className="social-numb-list">
                                    <li><span>30% of matching tokens reserved for developers (priortized by time invested and earliest in over 2 years), ICO creators and advisors</span>.</li>
                                    <li><span>20% to the founders</span></li>
                                    <li><span>10% held for referral-based and pre-ICO deals</span></li>
                                    <li><span>40% held for the RealSafe Reserve</span></li>
                                    <li><span>Unsold RST remains in RealSafe Reserve Contract, used according to the rules of the Reserve</span></li>
                                    <li><span>Reserve rules: 20% frozen, 20% auditor incentives, 20% future advisors/development, 30% incentives to keep the RealSafe network flourishing, 10% charity</span></li>
                                    <li><span>PoS: RST provides voting rights in most foundation decisions.  RSO owners will receive some reserve tokens year to year relative to their total portfolio value</span></li>
                                </ul>
                                <ul className="options">
                                    <li><span>Tokens Granted </span>At least $2,000,000 must be raised or the ICO period is extended to up to 90 days.  There is no minimum to be raised to consider the ICO a success because all monies raised bring the RealSafe platform closer to completion.  Whatever tokens are not granted will remain in the RealSafe Reserve Contract -  If ICO is maxed., 15,000,000 tokens will remain in Reserve</li>
                                    <li><span>Reserve marketplace Liquidity Function </span> The RealSafe RSO marketplace allows Ether to directly pay for fees to facilitate normal RSO trading. The MarketPlace contract uses fees to buy RST tokens, raising the price of RST as the popularity of the network increases.</li>
                                    <li><span>Reserve as it relates to RST price </span> Reserve contract will not offer RSTs to effect RST value - only in the event that at any price, there simply are not enough RSTs available to conduct normal RSO trading.</li>
                                    <li><span>Reserve Supplementary ICO function </span> Up to 20% of the Reserve may be sold off in a subsequent offering with proceeds to benefit the RealSafe Foundation if the total ether raised after completion of initial ICO is under $10,000,000</li>
                                    <li><span>Ether that is raised </span>At least 50% will remain as ETH and as much as 50% will be converted to dollars or Euros initially to ensure there are funds in both fiat and crypto to pay developers
                                     through RealSafe LLC for initial development and platform maintenance for several years to come. </li>
                                    <li><span>RealSafe Foundation </span>will operate the RealSafe Market Place and use RealSafe LLC to build the first RealSafe Explorer, RealSafe Tokenization Service, Audit service and RealSafe Wallet.</li>
                                    <li><span>RealSafe Foundation </span>will  control the Reserve Contract, which will be able to mint a maximum of .5% per year RSTs. Minting will occur only if market cap. of RST is increasing or stable</li>
                                    <li><span>Reserve Rules </span>Year to year usage in sll categories: x% of first year plus x% of additional year growth from fees.</li>
                                    <li><span>At least 20% of the Reserve </span>is used to remain held frozen for health of the RST.  As the resreve grows, so does the amount frozen.  </li>
                                    <li><span>At least 20% of the Reserve </span>to support auditors and other function to help the network fourish.</li>
                                    <li><span>At least 20% of the Reserve </span>to support the developers, (through NationPay LLC for the first 5 years) advisors and partners needed to make the RealSafe network flourish.</li>
                                    <li><span>A maximum of 20% of the Reserve RST </span>unforseen incentives, promotional faucet distros. to the world's largest corporate owners.  Max. of 5% to all Ether holders over 5 years.  </li>
                                    <li><span>A maximum of 10% of the Reserve </span>will be used for proportional Proof of Value to combined sub-token owners.</li>
                                    <li><span>A maximum of 10% of the Reserve </span>will be used for charitable causes.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default TokenDistribution;
