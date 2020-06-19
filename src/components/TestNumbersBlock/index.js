import React from 'react';

import { getFigureWithTodaysCount } from '../Common/index.js'


const TestsNumbersBlock = (props) =>{

  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("#686de0",props.confirmedCasesLabel,props.molecularPositive,props.saludTimeSignature,props.newMolecularPositiveToday,props.locale)}
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("#c7ecee",props.probableCasesLabel,props.serologicalPositive,props.saludTimeSignature,props.newSerologicalPositiveToday,props.locale)}
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})"} className="infoCircle"/>

export default TestsNumbersBlock
