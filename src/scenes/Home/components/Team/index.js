
'use strict'

import React, { Component } from 'react';

import { Grid, Row , Col } from 'react-bootstrap';

//import Styles from '../stylesheets/components/SearchBar.scss'
import Ru from 'rutils'

import Player from './components/Player'

let team = [
    {
        name:'James Yen',
        office : 'Co-funder - Managing Director',
        linkedin: 'https://www.linkedin.com/in/james-yen-463b6257/',
        bio: 'Mr. Yen is an ex-Wall Street Investment Banker and Ex-Hedge Fund Manager, having managed a $1.8 billion+ dollar portfolio at CIFC Asset Management LLC, the 3rd largest leveraged finance Hedge Fund and CLO in the United States. Mr. Yen has 10-years experience in sectors including financial technology and payment systems, having been the largest Institutional Leveraged Loan Investor to such companies as First Data, Vantiv, TransFirst, RBS WorldPay, EZE Software, Digital Insight, First American Payments, Gemalto, Fleetcorp, Verifone, and others. Mr. Yen has operating experience in sustainable trade facilitation in developing nations and is now a Development Investor with a track record in sourcing development projects around the world.',
        image: 'assets/img/team-1.png',
        type:'team'

    },
    {
        name:'Ken Silverman',
        office : 'Co-founder - CTO',
        linkedin: 'https://www.linkedin.com/in/ken-silverman-734506/',
        bio: 'The creator of NationPay, Ken is a computer engineer with 20+ years experience designing Financial Technology Systems, Artificial Intelligence frameworks, and social commerce and social geolocation based real time transaction platforms. Mr. Silverman is the co-founder of one of the first artificial intelligence companies to use machine learning in predictive analytics. Ken served as co-founder and vice-president of technology at Webmind Inc. now being called the earliest seed of SingularityNet.io  He is the Chairman and CTO of Spotwired. Mr. Silverman has years of experience in cutting edge FinTech applications and is currently active in Blockchain technology and ICO markets. He regularly contributes to Blockchain whitepapers and research theses ideas. A seasoned property manger with a portfolio of assets, NationPay was born while discussing with James a way to pair foreign investors with extranational assets.',
        image: 'assets/img/team-2.png',
        type:'team'
    },
    {
        name:'Daniel Tiati Dang',
        office : 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/danieltiati/',
        bio: 'He is a passionate software developer with more than 3 years experiences designing and implementing software systems. He holds a Telecommunication Engineering degree from Polytechnic University of Catalonia(Spain), and he has served in multiple software positions before specializing in the last years as Data and Backend Engineer. He love adventuring with cutting edge technologies, hoping to  contribute to the progress of society.',
        image: 'assets/img/dani.jpg',
        type:'team'
    },
    {
        name:'Alex Oviedo',
        office : 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/alexovi/',
        bio: 'Over 6 years of experience as a Full stack web developer. He is currently the Lead of UI/UX and product development, graduated as Computer Network Engineer from Polytechnic University of Catalonia (Spain). He has specialized in cloud computing and is responsible for the infrastructure of several projects. He was born in Ecuador and is a passionate about new technologies mainly in software development, cloud computing and UX.',
        image: 'assets/img/alex.jpg',
        type:'team'
    }
];

let advisors = [
    {
        name: 'Dr. Anzalee Khan',
        office : 'Advisor, Grant Writer, Statistician',
        bio: 'Anzalee is renown world-wide in the pharmaceutical industry as a leading investigator and applied statistician and big data scientist. Dr. Khan-Rhodes analyzes large data sets pertaining to inventing novel outcome measures in the pharmaceutical space and is the creator of the mini-PANS scale. Dr. Khan-Rhodes is an expert in analysis with R, SAS, SPSS, and Standard Setting. Dr. Khan-Rhodes has over 15 years of experience in psychometrics, testing and measurement, and statistical analysis in CNS trials. She served as a statistical and psychometric lead in Clinical Data Sciences at several eCOA and Rater Training vendor companies where she developed processes for clinical data validation and implemented statistical methods for evaluating rater training methodologies, clinical algorithms and data surveillance techniques. Dr. Khan is a former American Society of Clinical Psychopharmacology (ASCP) New Investigator Award recipient, International Congress of Schizophrenia Research (ICOSR) Young Investigator Award recipient and European Psychiatric Association (EPA) Travel Award recipient, and has recently completed a 5-year research grant from the US NIH to assess the relationship of genotypes and response to cognitive interventions. She has co-authored over 50 peer-reviewed publications and has contributed to book chapters and review articles on schizophrenia, Alzheimers, Autism, and other mental health areas.',
        image: 'assets/img/anzalee.jpg',
        type:'advisor'
    },
    {
        name: 'Zeev Kirsch, Esq.',
        office: 'Advisor, Company to Chain Documents, Regulatory Oversight, Terms and Conditions',
        bio: 'Zeev is Juris Doctorate in Law & Economics at Columbia Law School.  An attorney and opportunity strategist in the blockchain and fintech world, he consults on Token Generation and Issuance, Smart Contract Design, Securities Laws and Regs, Compliance, Entity Formation, & Venture Negotiation. Currently, Zeev is legal counsel for one of the leading providers of ICO services.  He his major of Math and Biology at SUNY Stonybrook. Zeev  enjoys reading about high tech and basic scientific research constantly as a daily news diet and occasionally writing about developing trends in science , engineering and futurist topics. He also thru-hiked the Appalachian trail in 2003.  An occasional bitcoin evangelist, publishes occasionally as early as 2013 http://transhumanity.net/transhumanism-and-money/',
        image: 'assets/img/zev.jpg',
        type: 'advisor'
    },
    {
        name:'Dr. Ben Goertzel',
        office : 'Advisor, AI guru and Singularity Coin Founder',
        bio: 'Ben is a pioneer in AGI, and the creator of OpenCog. Dr. Goertzel speaks regularly at the Boao Forum ("Davos of China") along with top CEOs from mainland China and chairs international conferences to present leading edge technical research on the future of Artificial Intelligence. Dr. Goertzel has published over 12+ books and 125+ research papers on Artificial Intelligence and is acknowledged internationally as a leading expert within even the top tier Artificial Intelligence talents. Dr. Goertzel is well respected and has done numerous projects in mainland China, the USA, and around the world.',
        image: 'assets/img/ben.jpg',
        type:'advisor'
    },
]


let partners = [
    {
        name:'launch Partner 1',
        office : 'Advisor, Grant Writer, Statistician',
        bio: ' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        image: 'assets/img/team-c.png',
        type:'partner'
    },
    {
        name:'launch Partner 2',
        office : 'Advisor, Grant Writer, Statistician',
        bio: ' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        image: 'assets/img/team-c.png',
        type:'partner'
    },
    {
        name: 'launch Partner 3',
        office : 'Advisor, Grant Writer, Statistician',
        bio: ' Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        image: 'assets/img/team-c.png',
        type:'partner'
    }
]

class Team extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="team" className="team-section section">
                <Grid className="container">
                    {/* Team */}
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                               Team
                            </h2>
                        </Col>
                    </Row>
                    <Row className="team-list">
                        {
                            Ru.addIndex(Ru.map)(this.renderPlayer, team)
                        }
                    </Row>

                    {/* Advisors */}
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                               Advisors
                            </h2>
                        </Col>
                    </Row>
                    <Row className="team-list">
                        {
                            Ru.addIndex(Ru.map)(this.renderAdvisors, advisors)
                        }
                    </Row>

                    {/* Partners */}
                    <Row>
                        <Col md={ 12 }>
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                                Partner Banks and Organizations
                            </h2>
                            <p>Visionary banks and organizations wishing to easily manage money for their members on blockchain please contact us directly. 50 slots are available for launch-partner status consideration.  All banks and candidate organizations will be considered.</p>
                        </Col>
                    </Row>
                    <Row className="partner-list text-center">
                        <Col md={ 10 }>
                            <Row className="partners">
                                {/* <Col md={ 3 } mdOffset= { 3 } className="partner-list-item">
                                    <div className="contain">
                                        <img src={ 'assets/img/procomon.jpg' } />
                                        <p>Developers in Panama since 1981 </p>
                                    </div>
                                </Col>
                                <Col md={ 3 } className="partner-list-item">
                                    <div className="contain">
                                        <p>Cal Silverman LLC</p>
                                        <p>Fine New York Stores and Restaurants</p>
                                    </div>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </section>
        )
    }

    // renderPartners(spec, i) {
    //     return (
    //         <Player spec={ spec } key = { i } index={ i } />
    //     )
    // }

    renderAdvisors(spec, i) {
        return (
            <Player spec={ spec } key = { i } index={ i } />
        )
    }

    renderPlayer (spec, i) {
        return (
            <Player spec={ spec } key = { i } index = { i }  />
        )
    }
}

export default Team;
