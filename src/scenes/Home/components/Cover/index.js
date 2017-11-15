import React, { Component } from 'react';
//import Styles from '../stylesheets/components/SearchBar.scss'
import autobind from 'autobind-decorator';

import ModalVideo from 'react-modal-video'

@autobind
class Cover extends Component {

    constructor() {
        super();

        this.state = {
            isOpen: false,
            displayVideo: ''
        }
    }

    openModal () {
       this.setState({isOpen: true})
       this.setState({ displayVideo: 'displayVideo'});
     }

    render(){
        return(
            <section id="home" className="cover-section section parallax-background section-inverse-color" data-stellar-background-ratio="0.4" style= {{ backgroundPosition: '50% 0px' }}>
                <div className="video-background-container parallax" data-stellar-ratio="0.4">
                    <video className={"video-background "+this.state.displayVideo }preload="auto" autoPlay loop muted>
                        <source type="video/mp4" src={'assets/img/video.mp4'} />
                    </video>
                    <a href="#features" className="anchor-link">
		                  <img src={'assets/img/arrow.png'} alt=""  className="arrow"/>
	                 </a>
                </div>
                <div className="black-dot-background-overlay"> </div>
                <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='R1INfu60wQY' onClose={() =>{ this.setState({isOpen: false}); this.setState({displayVideo:''})}} />
                  <div className="cover-play wow flip wowed animated" data-wow-iteration="5" data-wow-duration="0.15s">
                      <img onClick={this.openModal} src={ 'assets/img/play.png'} />
                  </div>
                <div className="wrap">
                    <div className="rs-content row" data-stellar-offset-parent="true">
                        <div className="rs-text col-lg-12 col-md-12 text-center wow bounceInDown wowed animated" data-wow-duration="1s" data-wow-delay="0.5s">
                            <h1 className="rs-title">Empowering Banks to Empower You</h1>
                            <p className="rs-description">Credit and Debit Card Solution without the card. Touchless, Instant Credit and Debit Payments. From Bank Account to Token Wallet. NationPay Token Economies Make all Banks Super Banks.</p>

                             <div className="btn-cta">
                                 <a  className="btn btn-app-download crowdsale">
                                     <i className="fa fa-sign-in"></i>
                                     Join crowdsale
                                 </a>
                                 <a href={ 'assets/doc/NationPay_the_Parallization_of_National_Currencies.pdf' }  target="_blank" className="btn btn-app-download">
                                     <i className="fa fa-download"></i>
                                     Download WhitePaper
                                 </a>
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Cover;
