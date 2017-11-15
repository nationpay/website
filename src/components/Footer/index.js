import React, { Component } from 'react';

import { Grid, Row , Col } from 'react-bootstrap';

import Alert from 'react-alert'

import sv from '../../services'

import Ru from 'rutils'

console.log('services::: ', sv);

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
          email: ''
        }

        this.alertOptions = {
          offset: 20,
          position: 'top right',
          theme: 'light',
          time: 5000,
          transition: 'fade'
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.showAlert = this.showAlert.bind(this)
    }

    handleChange(e) {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }


    handleSubmit(e) {
        e.preventDefault();

        console.log('this.state:::', this.state);


        let { email } = this.state

        sv
        .subscribe(email)
        .then( Ru.when( Ru.I, () => {
          this.setState({ email: '' }, () => this.showAlert('Email subscribed successfully!', 'success') )
        }) )
        .catch(err => {
          console.log( 'Err-Login', err );
          this.showAlert(err.description || 'Cannot reach the server', 'error')
        })
    }

    showAlert( msg, type ){

      console.log('msg::: ', msg)

       this.msg.show( msg, {
         time: 10000,
         type: type
       })
     }

    render(){
        return(
            <footer className="footer_menu_section footer-section" >
                <div className="background-overlay" ></div>
                <Alert ref={a => this.msg = a} {...this.alertOptions} />
		              <Grid>
                    <Row>
                        <Col md={ 4 } mdOffset={ 4 }>
                            <img src={ 'assets/img/logo.png'}/>
                        </Col>
                        <Col md={ 4 } className="footer-form text-left">
                            <h3 className="title">Stay up to date</h3>
                            <form name="form" className="form" onSubmit={this.handleSubmit}>
                                <input
                                  className="input"
                                  type="email"
                                  name="email"
                                  value = {this.state.email}
                                  placeholder="Enter your email"
                                  onChange={this.handleChange}
                                  />
                                <button className="button">Subscribe</button>
                            </form>
                        </Col>
                    </Row>

					<ul className="social-media-links wow fadeIn animated" data-wow-duration="1s">
						<li>
							<a href="https://www.facebook.com/NationPay/" target="new">
								<i className="fa fa-facebook"></i>
							</a>
						</li>
						{/*<li>
							<a href="https://twitter.com/" target="new">
								<i className="fa fa-twitter"></i>
							</a>
						</li>
						<li>
							<a href="https://www.instagram.com/" target="new">
								<i className="fa fa-linkedin"></i>
							</a>
						</li> */}
						<li>

							<a href="https://telegram.me/nationpay" target="new">
								<i className="fa fa-telegram"></i>
							</a>
						</li>
						<li>
							<a href="https://nationpay.slack.com" target="new">
								<i className="fa fa-slack"></i>
							</a>
						</li>
					</ul>

                    <Row className="footer-border text-center">
                        <Col md= { 12 }>
                             <div className="copyright_with_menu">Copyright © 2017 RealSafe. All Rights Reserved.</div>
                        </Col>
                        <Col md={ 12 }>
                             <div className="copyright_with_menu">Terms of Use | Privacy Policy </div>
                        </Col>
                    </Row>
				</Grid>
			</footer>
        )
    }
}

export default Footer;
