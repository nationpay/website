import React, { Component } from 'react';
import { Grid, Row , Col } from 'react-bootstrap';

class TokenDistribution extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="tdistribution" className="tdistribution-section section" >
                <Grid>
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Token Distribution of RST
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={ 10 } mdOffset={ 1 }>
                            <img className="img-te" src={'assets/img/token_structure.png'}/>
                        </Col>

                        <Col md={ 12 }>
                            <div className="social-text">
                                 <p>120,000,000 RSTs will exist after ICO if fully subscribed, plus .5% annual minting.</p>
                                 <p>Max of 40,000,000 RST tokens minted to participants.  Max of 80,000,000 RST tokens minted as matching grants.</p>
                                <p>Tokens are only minted when payments are received, so the Reserve is never inflated artifically.</p>
<br/><span><b>Particpants</b></span>
<p><b>Investors</b> Persons buying tokens for anticpated future value, either non-US under SEC Reg S or accredited US investors under regs. 506 D and C respectively. In compliance with 506 D, tokens granted to US persons will be frozen in the investor's wallet for a period of one year.</p>
<p><b>Pre-Purchasers</b> Persons who are company officers or directors pre-purchasing tokens to put their company onto the platform when completed. Just email us with the name of the company, llc, lp or corp. and your position there to get whitelisted.</p>
<p><b>Donors</b> Investors who do not verify their KYC within 120 days of partipating, lose 2 eth as donation and corresponding tokens minted to the donor pool.  Balance of eth is returned to investor.  For non us residents, verification is a valid passport for nationality and ID for residence. For US investors, under Reg. D, Rule 506 with amendement Rule 506(c), verification is based on emailing accreditation status, such as net worth and liquidity documents and having them approved.  Please see Terms for complete rules.</p>
                                
<br/>
                                <span> <b>2:1 Matched Token Minting</b></span> 
<p> </p>
                                <ul className="social-numb-list">
                                    <li><span>25% reserved for developers (priortized by time invested and earliest in over 5 years), ICO creators and deals pertaining to ICO and pre-ICO</span>.</li>
                                    <li><span>25% to the founders</span></li>
                                    <li><span>25% advisors/launch partners</span></li>
                                    <li><span>25% held for the RealSafe Reserve less any referrals</span></li>
                                    <li><span>Tokens are minted instead of pre-mined so there will be no additional tokens at end of ICO, however, one more ICO may take palce in 6 months, and yearly minting of a tiny .5% is planned used to maintain the network. </span></li>
                                    <li><span>PoS: RST provides voting rights in some RealSafe Reserve spending decisions.  RSO owners may receive some reserve tokens year to year relative to both their total portfolio value and RSTs they may hold.</span></li>
                                </ul>
                                <span>  Reserve Rules - Year to Year</span><br/>
                                <span>90% of fees collected in ether for trading and purchase of RSOs are used to buy RST. the RST is put into the Reserve.</span><br/>
                                <span> Max. of 15% of the total Reserve can be spent each year, and never more than what is received in fees. </span><br/>
                                <br/><span><b>Use of Total Yearly Reserve Spend</b></span>

                                <ul className="social-numb-list">
                                    <li>20% 3rd party gatekeeper network, KYC of all registrants (face recognition verify to link name, ID email)</li>
                                    <li><span>20%  </span>to support auditors and other function to help the network fourish.</li>
                                    <li><span>20% </span>to support the developers, (through NationPay LLC for the first 5 years) advisors and partners needed to make the RealSafe network flourish.</li>
                                    <li><span>20% of the Reserve RST </span>unforseen incentives, promotional faucet distros. to the world's largest corporate owners.  Max. of 5% to all Ether holders over 5 years.  </li>
                                    <li><span>Phase 2 SEC permitting: 6.5% </span>granted to RSO owners as proportional Proof of Ownership reward.</li>
                                    <li><span>Phase 2 SEC permitting: 6.5% </span>granted to RST owners as proportional Proof of Stake reward.</li>
                                    <li><span>7% </span>will be used for charitable causes.</li>

                                </ul>
                                <ul className="options">
                                    <li><b>Soft-Cap Total</b> At least $4,000,000 must be raised or another higher priced round ICO  will happen in 6 months.  There is no minimum to be raised to consider the ICO a success because all monies raised bring the RealSafe platform closer to completion. We are dedicated to building RealSafe with or without ICO funding.</li>
                                    <li><b>Reserve marketplace Liquidity Function </b> The RealSafe RSO marketplace allows Ether to directly pay for fees to facilitate normal RSO trading. The MarketPlace contract uses 90% of fees to buy RST tokens, raising the price of RST as the popularity of the network increases.</li>
                                    <li><b>Ether raised at ICO </b>At least 50% will remain as ETH and as much as 50% will be converted to dollars or Euros initially to ensure there are funds in both fiat and crypto to pay developers
                                     through RealSafe LLC for initial development and platform maintenance for several years to come. </li>
                                    <li><b>RealSafe Foundation </b>By 2023 a foundation will be formed with purpose of operating the RealSafe MarketPlace and to tkae over the function of RealSafe LLC to build and maintain the RealSafe platform, the RealSafe Explorer, RealSafe Tokenization Service, Audit Service, RS Wallet and RealSafe Wallet KYC Gatekeeper Service.</li>
                                    <li><b>Reserve Control</b> the Reserve Wallet and Smart Contract, both controlled by RealSafe LLC will be handed off to the RealSafe Foundation which will continue in the spirit of RealSafe LLCs mission to put the world's companies onto blockchain for a more secure and easier way of proving and transfering ownership.</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </section>
        )
    }
}

export default TokenDistribution;
