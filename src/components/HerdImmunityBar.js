import React, { } from 'react';
import '../vaccineBlocks.css'

import ProgressBar from 'react-bootstrap/ProgressBar'

/* functions */
const hexToRGB = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16))
const mixColour = (c1, c2, pc) => RGBToHex(Math.round(mix(c1[0], c2[0], pc)), Math.round(mix(c1[1], c2[1], pc)), Math.round(mix(c1[2], c2[2], pc)))
const RGBToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
const mix = (s, e, pc) => s + ((pc) * (e - s))
/* elements */
/* colours */
const red = hexToRGB("#FF0000")
const amber = hexToRGB("#FF9900")
const green = hexToRGB("#33FF00")
/* do stuff */
const getColor = (value) => {
  	value = value === 100 ? 0 : value + 1;
  	/* top bar */
    return  value < 50
    	? mixColour(red, amber, (value / 50))
    	: mixColour(amber, green, ((value - 50) / 50))
}

const Bar = (props) =>{

    let percentInteger = parseInt(props.percentageFullyVaccinated);
    let normalizedToHerdPercentage = (percentInteger / 70) * 100
    let herdImmunityReached = percentInteger >= 70

    return(
        <div className="herd-immunity-block statsBlock">
            <span className="herd-immunity-title">{props.percentageFullyVaccinatedText}</span>
            <div className="herd-immunity-bar">
                <ProgressBar>
                    <ProgressBar striped animated variant={herdImmunityReached ? "success":"warning"} now={percentInteger} key={1} label={props.percentageFullyVaccinated}/>
                </ProgressBar>
                {/* <div style={{color:herdImmunityReached ? 'white' : 'black',width:`${props.percentageFullyVaccinated}`, backgroundColor: herdImmunityReached ? 'green' : getColor(normalizedToHerdPercentage)}} className="current-herd-progress">{props.percentageFullyVaccinated === "0.0%" ? "loading..." : props.percentageFullyVaccinated}</div> */}
                <div title="Herd immunity" className="herd-immunity-marker"></div>
            </div>                    
        </div>        
    )
}

export default Bar;