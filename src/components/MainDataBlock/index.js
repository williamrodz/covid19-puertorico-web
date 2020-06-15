import React from 'react';

import {getFigureWithTodaysCount } from '../Common/index.js'


const MainDataBlock = (props) =>{


  return (
    <div className="statsBlock">
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("#fdcb6e",props.totalPositiveCasesLabel,props.confirmedCases+props.probableCases,props.saludTimeSignature,props.newCasesToday+props.newProbableCasesToday,props.locale)}
        </div>
        <div style={{display: 'flex',flexDirection: 'column'}}>
          {getFigureWithTodaysCount("red",props.deathsLabel,props.deaths,props.saludTimeSignature,props.newDeathsToday,props.locale)}
        </div>
    </div>
  )
}

//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].confirmedCases,modalBody:LABELS[UIstate.locale].confirmedCasesExplanation})"} className="infoCircle"/>
//          <Icon.InfoCircle onClick={()=>"setUIState({...UIstate,modalVisible:true,modalHeader:LABELS[UIstate.locale].deaths,modalBody:LABELS[UIstate.locale].deathsExplanation})"} className="infoCircle"/>


export default MainDataBlock
