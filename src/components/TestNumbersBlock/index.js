import React from 'react';

import { DataDiv,getDeltaAverageForDays } from '../Common/index.js'


const TestsNumbersBlock = (props) =>{

  let molecularDeltaAverage = getDeltaAverageForDays(props.historicalData,'molecularPositive')
  let antigenDeltaAverage = getDeltaAverageForDays(props.historicalData,'antigenPositive')


  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <DataDiv
            color="blue"
            label={props.confirmedCasesLabel}
            figure={props.today.molecularPositive}
            newToday={props.historicalData.newMolecularPositiveToday}
            twoWeekAverage={molecularDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>
          <DataDiv
            color="686de0"
            label={props.antigenCasesLabel}
            figure={props.today.antigenPositive}
            newToday={props.historicalData.newAntigenPositive}
            twoWeekAverage={antigenDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>            
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})"} className="infoCircle"/>

export default TestsNumbersBlock
