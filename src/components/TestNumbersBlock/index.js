import React from 'react';

import { DataDiv,getDeltaAverageForDays } from '../Common/index.js'


const TestsNumbersBlock = (props) =>{

  let molecularDeltaAverage = getDeltaAverageForDays(props.historicalData,'molecularPositive')
  let serelogicalDeltaAverage = getDeltaAverageForDays(props.historicalData,'serologicalPositive')




  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <DataDiv
            color="#686de0"
            label={props.confirmedCasesLabel}
            figure={props.today.molecularPositive}
            newToday={props.historicalData.newMolecularPositiveToday}
            twoWeekAverage={molecularDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <DataDiv
            color="#c7ecee"
            label={props.probableCasesLabel}
            figure={props.today.serologicalPositive}
            newToday={props.historicalData.newSerologicalPositiveToday}
            twoWeekAverage={serelogicalDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})"} className="infoCircle"/>

export default TestsNumbersBlock
