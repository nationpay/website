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
                                            <span className="title">ICO</span>
                                            <p>Asset managers and owners want a better way to raise money. Extend assets into a tradable strucutre.  Pre-purchase now at a discount.</p>
                                            <div className="history-separator-l">
                                           </div>
                                       </div>
                                       <div className="roadmap-list-item-l wow fadeInLeft wowed animated col-sm-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">Establishment</span>
                                            <p>Cash Now - If you own or manage real estate and need cash but dont want to take a loan, simply create an RSO and sell off a portion of your tokens.</p>
                                            <div className="history-separator-r"></div>
                                       </div>
                                       <div className="roadmap-list-item wow fadeInRight wowed animated  col-sm-6 col-sm-offset-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">Development and Growth of the Ecosystem</span>
                                            <p>Enticing the world's best developers to foster the growth and ensure the security of RealSafe is the mission of the RealSafe Foundation
                                                      which will be established and supported by the .5% per year minting of new RealSafe coins.</p>
                                           <div className="history-separator-l"></div>
                                       </div>
                                       <div className="roadmap-list-item-l wow fadeInLeft wowed animated col-sm-6" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <span className="title">100% Decentralization</span>
                                            <p>A near final phase of RealSafe is to promote self-adding of RSOs with 25-50% of the 1100 RST add-fee going to a network of private auditors.  This will complete the fully autonomous model of RealSafe</p>
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
