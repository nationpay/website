import React, { Component } from 'react';

class Roadmap extends Component {

    constructor(props) {
        super(props);
    }

    render(){
        return(
            <section id="roadmap" className="roadmap-section section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Roadmap
                            </h2>
                        </div>
                    </div>
                    <div className="row">
                           <div  className="col-md-10 col-md-offset-1">
                               <div className="timeline">
                                   <div className="roadmap-list row">
                                       <div className="roadmap-list-item wow fadeInRight wowed animated col-sm-6 col-sm-offset-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">Current Product Development</span>
                                            <p>It is the Rare Blockchain Company these days that is developing pre-ICO.  Welcome to NationPay.</p>
                                            <div className="history-separator-l">
                                           </div>
                                       </div>
                                       <div className="roadmap-list-item-l wow fadeInLeft wowed animated col-sm-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">Friends of NationPay</span>
                                            <p>Out on the Road, NationPay is coming. First quarter 2018, starts by speaking at the banking and blockchain conferences around the world. Heads of financial newspapers are onboard as advisors to write about our product.  We forge early alliances with banks and bank officials. We gain strategic investment partners.</p>
                                            <div className="history-separator-r"></div>
                                       </div>
                                       <div className="roadmap-list-item wow fadeInRight wowed animated  col-sm-6 col-sm-offset-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">Development and Growth</span>
                                            <p>Middle 2018, heavy development continues.  Partner banks help refine NationPay features, tailored to the needs of all.  The NationPay testNet is functional by year end. The first BankNet goes live in second quarter 2019. </p>
                                           <div className="history-separator-l"></div>
                                       </div>
                                       <div className="roadmap-list-item-l wow fadeInLeft wowed animated col-sm-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">100% Decentralization</span>
                                            <p>After 5 to 7 years of live operation, NationPay LLc's control of the NationPay Reserve is handed off to the NationPay Foundation.  This completes the vision of NationPay to be a 100% decentralized, cardless banking platform for the banked and unbanked alike.  NationPay is established as  the largest banking-on-blockchain network on the planet by rapidly connecting the world's banking infrastructure to blockchain.</p>
                                            <div className="history-separator-r"></div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                    </div>
            </section>
        )
    }
}

export default Roadmap;
