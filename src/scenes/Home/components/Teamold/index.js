
'use strict'

import React, { Component } from 'react';

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
        office : 'Co-founder',
        linkedin: 'https://www.linkedin.com/in/ken-silverman/',
        bio: 'The creator of RealSafe, Mr. Silverman is a computer engineer with 20+ years experience designing Financial Technology Systems, Artificial Intelligence frameworks, and social commerce and social geolocation based real time transaction platforms. Mr. Silverman is the co-founder of one of the first artificial intelligence companies to use machine learning in predictive analytics. Ken served as co-founder and vice-president of technology at Webmind Inc. He is the Chairman and CTO of Spotwired. Mr. Silverman has years of experience in cutting edge FinTech applications and is currently active in Blockchain technology and ICO markets. He regularly contributes to Blockchain whitepapers and research theses ideas. A seasoned property manger with a portfolio of assets, RealSafe was born while discussing with James a way to pair foreign investors with extranational assets.',
        image: 'assets/img/team-2.png',
        type:'team'
    },
    {
        name:'Daniel Tiati Dang',
        office : 'Software Engineer',
        linkedin: 'https://www.linkedin.com/in/danieltiati/',
        bio: 'He is a passionate software developer with more than 3 years experiences designing and implementing software systems. He hold Telecommunication Engineering degree from Polytechnic University of Catalonia(Spain), and he has served in multiple software positions before specializing in the last years as Data and Backend Engineer. He love adventuring with cutting edge technologies, hoping to  contribute to the progress of society.',
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
        name:'Dr. Ben Goertzel',
        office : 'Advisor, AI guru and Singularity Coin Founder',
        bio: ' Dr. Goertzel is a pioneer in AGI, and the creator of OpenCog. Dr. Goertzel speaks regularly at the Boao Forum ("Davos of China") along with top CEOs from mainland China and chairs international conferences to present leading edge technical research on the future of Artificial Intelligence. Dr. Goertzel has published over 12+ books and 125+ research papers on Artificial Intelligence and is acknowledged internationally as a leading expert within even the top tier Artificial Intelligence talents. Dr. Goertzel is well respected and has done numerous projects in mainland China, the USA, and around the world.',
        image: 'assets/img/team-c.png',
        type:'advisor'
    },
    {
        name:'General Counsel',
        office : 'Corporate Extension Constructs, Regulatory Oversight, Terms and Conditions',
        bio: 'Several well known blockchain-experienced attorneys are being considered for this role.',
        image: 'assets/img/team-c.png',
        type:'advisor'
    },
    {
        name: 'Dr. Anzalee Khan',
        office : 'Advisor, Grant Writer, Statistician',
        bio: 'Dr. Khan-Rhodes is renown world-wide in the pharmaceutical industry as a leading investigator and applied statistician and big data scientist. Dr. Khan-Rhodes analyzes large data sets pertaining to inventing novel outcome measures in the pharmaceutical space and is the creator of the mini-PANS scale. Dr. Khan-Rhodes is an expert in analysis with R, SAS, SPSS, and Standard Setting. Dr. Khan-Rhodes has over 15 years of experience in psychometrics, testing and measurement, and statistical analysis in CNS trials. She served as a statistical and psychometric lead in Clinical Data Sciences at several eCOA and Rater Training vendor companies where she developed processes for clinical data validation and implemented statistical methods for evaluating rater training methodologies, clinical algorithms and data surveillance techniques. Dr. Khan is a former American Society of Clinical Psychopharmacology (ASCP) New Investigator Award recipient, International Congress of Schizophrenia Research (ICOSR) Young Investigator Award recipient and European Psychiatric Association (EPA) Travel Award recipient, and has recently completed a 5-year research grant from the US NIH to assess the relationship of genotypes and response to cognitive interventions. She has co-authored over 50 peer-reviewed publications and has contributed to book chapters and review articles on schizophrenia, Alzheimers, Autism, and other mental health areas.',
        image: 'assets/img/team-c.png',
        type:'advisor'
    }
]

class Team extends Component {

    constructor() {
        super();
    }

    render(){
        return(
            <section id="team" className="team-section section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                               Team
                            </h2>
                        </div>
                    </div>
                    <div className="row team-list">
                        {
                            Ru.addIndex(Ru.map)(this.renderPlayer, team)
                        }
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="section-heading wow fadeIn" data-wow-duration="1s">
                               Advisors
                            </h2>
                        </div>
                    </div>
                    <div className="row team-list">
                        {
                            Ru.addIndex(Ru.map)(this.renderAdvisors, advisors)
                        }
                    </div>
                </div>
            </section>
        )
    }

    renderAdvisors(spec, i) {
        return (
            <Player spec={ spec} key = { i } index={ i } />
        )
    }

    renderPlayer (spec, i) {
        return (
            <Player spec={ spec } key = { i } index = { i }  />
        )
    }
}

export default Team;
