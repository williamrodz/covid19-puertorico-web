import React from 'react';

import {Navbar,Nav} from 'react-bootstrap';
import logo from '../../logo192.png';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";


const Logo = (props) =>{

  return (
    <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
      <img src={logo} alt="Logo" width='54px' title="Logo COVID Tracker PR &copy; Lissette Rodríguez "/>
      <div style={{color: 'yellow',fontWeight: 'bold'}}>COVID-19</div>
      <div style={{marginLeft: 5}}>{props.inPuertoRico}</div>
    </div>
  )
}

const FacebookButton = (props)=>{
  return(
  <FacebookShareButton url="covidtrackerpr.com">
    <FacebookIcon size={'35px'} round={true}/>
  </FacebookShareButton>
  )
}

const TwitterButton = (props)=>{
  return(
  <a href="https://twitter.com/intent/tweet?text=Visualiza%20la%20curva%20de%20COVID-19%20en%20Puerto%20Rico%3A&url=http%3A%2F%2Fcovidtrackerpr.com">
    <TwitterIcon size={'35px'} round={true}/>
  </a>
  )
}


export default function Navigation(props){
  return (
    <div style={{width: "100%"}}>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="#home" style={{fontSize: "20px"}}><Logo inPuertoRico={props.inPuertoRico}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" style={{fontSize: "15px"}}>
            <div style={{display: 'flex',flexDirection: 'row'}}>
              <FacebookButton/>
              <TwitterButton/>
            </div>
            <Nav.Link href="/">Dashboard</Nav.Link>
            <Nav.Link href="/excessDeaths">{props.excessDeaths}</Nav.Link>

          </Nav>
          <Nav style={{fontSize: "15px"}}>
            <Nav.Link eventKey={2} onClick={()=>props.clickSpanishButton()}>Español</Nav.Link>
            <Nav.Link eventKey={1} onClick={()=>props.clickEnglishButton()}>
              English
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
