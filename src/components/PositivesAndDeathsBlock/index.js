import React from 'react';

import {DataDiv,getDeltaAverageForDays } from '../Common/index.js'


const PositivesAndDeathsBlock = (props) =>{

  let totalPositivesDeltaAverage = getDeltaAverageForDays(props.historicalData,'totalPositive')
  let deathsDeltaAverage = getDeltaAverageForDays(props.historicalData,'deaths')


  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <DataDiv
            color="#fdcb6e"
            label={props.totalPositiveCasesLabel}
            figure={props.totalPositive}
            newToday={props.historicalData.newPositivesToday}
            twoWeekAverage= {totalPositivesDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          <DataDiv
            color="#e17055"
            label={props.deathsLabel}
            figure={props.deaths}
            newToday={props.historicalData.newDeathsToday}
            twoWeekAverage= {deathsDeltaAverage}
            saludTimeSignature={props.saludTimeSignature}
            locale={props.locale}/>
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].confirmedCases,modalBody:LABELS[UIstate.locale].confirmedCasesExplanation})"} className="infoCircle"/>
//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].deaths,modalBody:LABELS[UIstate.locale].deathsExplanation})"} className="infoCircle"/>


export default PositivesAndDeathsBlock
