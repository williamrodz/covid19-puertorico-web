import React from 'react';
import '../vaccineBlock.css'
const VaccineSource = (props) =>{
    return(
        <div className="vaccineSource">
            <a href={props.link}>
                <img className="vaccineSourceImage" src={props.logo} alt={props.alt}/>
            </a>
        </div>
    )
}

const VaccineBlock = (props) =>{
    return(
        <div className="vaccineBlock">
            <div className="vaccineCallToAction">{props.vaccineCallToAction}</div>
            <div className="flexRow vaccineInfoRow">
                <VaccineSource link={"https://www.cvs.com/immunizations/covid-19-vaccine"} logo={"https://sunrisemarketplace.com/wp-content/uploads/2020/03/3979_SMP-cvs-logo.jpg"} alt="CVS"/>
                <VaccineSource link={"https://www.walgreens.com/findcare/vaccination/covid-19"} logo={"https://www.walgreens.com/images/adaptive/si/1485908_WAG_Signature_logo_RGB_750x208.png"} alt="Walgreens"/>
                <VaccineSource link={"https://www.dondemevacuno.com/"} logo={"https://static.wixstatic.com/media/271c9d_c78124804f5446c893af0831a4a17978~mv2.jpg"} alt="Walgreens"/>

            </div>
        </div>
    )
}

export default VaccineBlock;