import React from 'react';
import '../vaccineBlocks.css'

const VaccineBlock = (props) =>{
    return(
        <div className="vaccineBlock statsBlock">
            <div className="flexColumn vaccineInfoRow">
                <div className="flexRow">
                    <div className="flexColumn">
                        <div className="vaccineStatTitle">{props.administeredDosesText}</div>
                        <div className="vaccineStatValue">{props.administeredDoses}</div>
                    </div>
                    {/* <div className="flexColumn">
                        <div className="vaccineStatTitle">{props.percentageFullyVaccinatedText}</div>
                        <div className="vaccineStatValue">{props.percentageFullyVaccinated}</div>
                    </div>                       */}
                </div>              
                <div className="flexRow">
                    <div className="flexColumn">
                        <div className="vaccineStatTitle">{props.peopleWithAtLeastOneDoseText}</div>
                        <div className="vaccineStatValue">{props.peopleWithAtLeastOneDose}</div>
                    </div>
                    <div className="flexColumn">
                        <div className="vaccineStatTitle">{props.peopleWithTwoDosesText}</div>
                        <div className="vaccineStatValue">{props.peopleWithTwoDoses}</div>
                    </div>                       
                </div>
                                      

            </div>
     
        </div>
    )
}

export default VaccineBlock;