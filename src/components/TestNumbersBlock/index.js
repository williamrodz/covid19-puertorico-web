import React from 'react';

import {formatInteger, getLabels,getFigureWithTodaysCount } from '../Common/index.js'

let LABELS = getLabels()

const TestsNumbersBlock = (props) =>{

  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("#686de0",props.confirmedCasesLabel,props.confirmedCases,props.saludTimeSignature,props.newCasesToday,props.locale)}
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("#c7ecee",props.probableCasesLabel,props.probableCases,props.saludTimeSignature,props.newProbableCasesToday,props.locale)}
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].serologicalTests,modalBody:LABELS[UIstate.locale].serologicalTestsExplanation})"} className="infoCircle"/>

export default TestsNumbersBlock
