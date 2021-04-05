import React from 'react';

import {Navbar,Nav} from 'react-bootstrap';
import logo from '../../logo192.png';

import {
  TwitterIcon,
} from "react-share";


import {getLabels } from '../Common/index.js'

let LABELS = getLabels()


const Logo = (props) =>{

  return (
    <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <img src={logo} alt="Logo" width='54px' title="Logo COVID Tracker PR &copy; Lissette Rodríguez "/>
      <div style={{color: 'yellow',fontWeight: 'bold'}}>COVID-19</div>
      <div style={{marginLeft: 5}}>{props.inPuertoRico}</div>
    </div>
  )
}

/*const FacebookButton = (props)=>{
  return(
  <FacebookShareButton url="covidtrackerpr.com">
    <FacebookIcon size={'35px'} round={true}/>
  </FacebookShareButton>
  )
}*/

const TwitterButton = (props)=>{

  //let tweetLink = 'https://twitter.com/intent/tweet?text=Visualiza%20la%20curva%20de%20COVID-19%20en%20Puerto%20Rico%3A&url=http%3A%2F%2Fcovidtrackerpr.com'
  
  return(
  <a href="https://twitter.com/COVIDTrackerPR">
    <TwitterIcon size={'35px'} round={true}/>
    <div>Follow daily updates</div>
  </a>
  )
}


export default function Navigation(props){
  return (
    <div style={{width: "100%"}}>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="/" style={{fontSize: "20px"}}><Logo inPuertoRico={props.inPuertoRico}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" style={{fontSize: "15px"}}>
            <div style={{display: 'flex',flexDirection: 'row'}}>
              {/* {<FacebookButton/>} */}
              <TwitterButton/>
            </div>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/excessDeaths">{LABELS[props.locale].excessDeaths}</Nav.Link>
            <Nav.Link href="/api"><div>API</div></Nav.Link>
            <Nav.Link href="https://www.prcovidideathon.com"><div style={{borderRadius:5,width:100,textAlign:'center',background:'rgb(34,193,195) linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',color:'white'}}>IDEATHON</div></Nav.Link>


          </Nav>
          <Nav style={{fontSize: "15px"}}>
            <Nav.Link eventKey={'español'} onClick={props.clickSpanishButton}>Español</Nav.Link>
            <Nav.Link eventKey={'english'} onClick={props.clickEnglishButton}>English</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
