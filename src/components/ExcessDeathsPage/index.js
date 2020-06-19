import React, {useState} from 'react';

import Navigation from '../NavigationBar'
import Tableau from '../Tableau'

import { CoffeeButton,LoveStatement,getLabels } from '../Common/index.js'

let LABELS = getLabels()


export default function ExcessDeaths(props) {
    const [UIstate,setUIState] = useState({
                locale:'es-pr',
              })


    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',backgroundColor: 'white'}}>
        <Navigation inPuertoRico={LABELS[UIstate.locale].inPuertoRico} clickEnglishButton={()=>setUIState({...UIstate,locale:'en-us'})} clickSpanishButton={()=>setUIState({...UIstate,locale:'es-pr'})}
          excessDeaths={LABELS[UIstate.locale].excessDeaths}/>
        <Tableau title={LABELS[UIstate.locale].excessDeathsTableTitle} description={LABELS[UIstate.locale].excessDeathsTableDescription}/>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">{UIstate.locale === 'es-pr' ? 'Licencia' : 'License'}</a></div>
          <LoveStatement style={{fontSize: 13,marginTop: 10}} locale={UIstate.locale}/>
          <CoffeeButton/>
        </div>

      </div>
    );

}
