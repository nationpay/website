import React, { Component } from 'react';
import Ru from 'rutils'
import { Grid, Row , Col } from 'react-bootstrap';
import Guarantee from  './components/Guarantee'

let guarantees = [
    {
        image: 'assets/img/guarantees-img-1.png',
        text: 'Bank Officials interested in early adoption and partnership designed for testing, collaboration and publicity can pre-purchase a BankNet at 5000 tokens.   Please email us to establish your position at the bank so we can WhiteList your bank as a launch partner and token-prepurchaser.'
    },
    {
        image: 'assets/img/circle2.png',
        text: 'BankNets enable banks to enable their clients to move money between cash and credit accounts directly to token wallets on their phone.'
    },

    {
        image: 'assets/img/guarantees-img-1.png',
        text: 'The bank keeps the cash while the client gets to spend it.  The fees the bank sets are small becaseu they no longer have to pay Visa or MAsterCard for this arrangement. Everybody wins, the bank, the clients, the unbanked and the merchants.'
    },
]

class Prepurchased extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="prepurchased" className="prepurchased-section section" >
                <Grid>
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Pre-Purchase Rules
                            </h2>
                        </Col>
                    </Row>
                    <Row className="guarantees-list ">
                        <Col md={ 10 } mdOffset={ 1 }>
                            <Row className="main">
                                {
                                    Ru.addIndex(Ru.map)(this.renderGuarantee, guarantees)
                                }
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </section>
        )
    }

    renderGuarantee (spec, i) {
        return (
            <Guarantee spec={ spec } key = { i } index = { i }  />
        )
    }
}

export default Prepurchased;
