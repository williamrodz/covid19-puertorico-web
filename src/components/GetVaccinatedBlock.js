import React from 'react';
import '../vaccineBlocks.css'
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
        <div className="vaccineBlock statsBlock">
            <div className="vaccineCallToAction">{props.vaccineCallToAction}</div>
            <div className="flexRow vaccineInfoRow">
                <VaccineSource link={"https://www.cvs.com/immunizations/covid-19-vaccine"} logo={"https://sunrisemarketplace.com/wp-content/uploads/2020/03/3979_SMP-cvs-logo.jpg"} alt="CVS"/>
                <VaccineSource link={"https://www.walgreens.com/findcare/vaccination/covid-19"} logo={"https://www.walgreens.com/images/adaptive/si/1485908_WAG_Signature_logo_RGB_750x208.png"} alt="Walgreens"/>
            </div>
            <div className="flexRow vaccineInfoRow">
                <VaccineSource link={"https://www.dondemevacuno.com/"} logo={"https://static.wixstatic.com/media/271c9d_c78124804f5446c893af0831a4a17978~mv2.jpg"} alt="Walgreens"/>
                <VaccineSource link={"https://turnos.yoquierolavacuna.com/"} logo={"https://static.wixstatic.com/media/0ab51a_f6a118abff3a428d82698e91f1a7dcb5~mv2.png/v1/crop/x_290,y_71,w_322,h_159/fill/w_451,h_222,al_c,lg_1,q_85/Untitled%20design%20(5).webp"} alt="Yo quiero la vacuna"/>     
            </div>
        </div>
    )
}

export default VaccineBlock;