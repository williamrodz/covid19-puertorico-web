import React, {useState,useEffect} from 'react';
import { Button, Alert,Modal,Dropdown} from 'react-bootstrap';
import LineChart from '../LineChart';
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

import Navigation from '../NavigationBar'

import PositivesAndDeathsBlock from '../PositivesAndDeathsBlock'
import TestNumbersBlock from '../TestNumbersBlock'
import GetVaccinatedBlock from '../GetVaccinatedBlock';
import VaccineStatsBlock from '../VaccineStatsBlock';
import HerdImmunityBar from '../HerdImmunityBar';

import {SiteDescription, CoffeeButton,LoveStatement,getLabels, formatInteger,getDateObjectFromEntry } from '../Common/index.js'

let LABELS = getLabels()


const ALERT_HEADER = {'en-us':'Puerto Rico Department of Health changes definition of positive cases (6/11/20)',
                    'es-pr':'Departamento de Salud cambia definición de casos positivos (11-junio-20)'}
const ALERT_BODY_ES =
(<p>
  El 11 de junio de 2020 el Departmento de Salud de Puerto Rico comenzó a hacer una distinción
  entre casos positivos 'confirmados' y casos positivos 'probables'. Antes combinaba ambas cifras
  en el número de casos positivos únicos. También paró de proveer la distinción entre el origen
  de las pruebas positivas (molecular o serológica).
</p>)
const ALERT_BODY_EN =
(<p>
  On June 11th, 2020, the Puerto Rico Department of Health redefined its figure of positive COVID-19 cases,
  now making a distinction between "confirmed" positive cases and "probable" positive cases, which were
  before grouped into one figure, unique positive cases. It also stopped providing a breakdown of positive
  cases from either a molecular test origin or a serological test origin.
</p>)

const ALERT_BODY = {'en-us':ALERT_BODY_EN,'es-pr':ALERT_BODY_ES}

const MONTHS_ES = {1:"enero",2:"febrero",3:"marzo",4:"abril",5:"mayo",6:"junio",7:"julio",8:"agosto",9:"septiembre",10:"octubre",11:"noviembre",12:"diciembre"}
const MONTHS_EN = {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9 : "September", 10: "October", 11: "November", 12: "December"}
const MONTHS = {'en-us':MONTHS_EN,'es-pr':MONTHS_ES}

const GRAPHING_DESCRIPTION_ES = {instructions:"Qué graficar:",dataPerDay:"Data por día",changePerDay:"Cambio por día"}
const GRAPHING_DESCRIPTION_EN = {instructions:"What to graph:",dataPerDay:"Data per day",changePerDay:"Change per day"}
const GRAPHING_DESCRIPTION = {'en-us':GRAPHING_DESCRIPTION_EN,'es-pr':GRAPHING_DESCRIPTION_ES}

const DISCLAIMER_ES = (<div>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="https://covid19datos.salud.gov.pr/" target="_blank" rel="noopener noreferrer">https://covid19datos.salud.gov.pr/</a>) y está sujeta a cambio y/o clarificación.</div>)
const DISCLAIMER_EN = (<div>*The provided data was obtained from the Puerto Rico Department of Health's coronavirus website(<a href="https://covid19datos.salud.gov.pr/" target="_blank" rel="noopener noreferrer">https://covid19datos.salud.gov.pr/</a>) and is subject to change and/or clarification</div>)
const DISCLAIMER_DIV = {'en-us':DISCLAIMER_EN,'es-pr':DISCLAIMER_ES}

const ATTRIBUTES = ["totalPositive","molecularPositive","antigenPositive","deaths"]
const ATTRIBUTE_CLASS_ORDER= ['primary','warning','success','danger']


const BOOTSTRAP_BUTTON_CLASSES_TO_COLORS = {'warning':'rgb(255, 193, 7)','primary':'rgb(0, 123, 255)','success':'rgb(40, 167, 69)','secondary':'rgb(108, 117, 125)','danger':'rgb(220, 53, 69)',}

// const ATTRIBUTES_TO_CLASSES =
var ATTRIBUTES_TO_CLASSES = []
ATTRIBUTES.forEach((item, i) => {
  ATTRIBUTES_TO_CLASSES[item] = ATTRIBUTE_CLASS_ORDER[i]
});

const DELTA_LINE_COLOR = 'purple'

// eslint-disable-next-line
const PR_POPULATION = 3.194*(10**6)


function anglifySaludTimeSignature(saludTimeSignature){
  const currentMonth = (new Date ()).getMonth() + 1
  const currentMonthEN = MONTHS_EN[currentMonth]
  var dayNumber;
  var year;
  if (saludTimeSignature.indexOf("de") !== -1){
    var splitUp = saludTimeSignature.trim().split("de")
    dayNumber = splitUp[0].substring(saludTimeSignature.indexOf(",")+ 2).trim()
    year = splitUp[2].trim();
  }
  else  if (saludTimeSignature.indexOf("/") !== -1){
    let slashedDate = saludTimeSignature.split(" ")[2]
    let components = slashedDate.split("/")
    dayNumber = components[1]
    year = components[2]
  } else {
    dayNumber = "XX"
    year = "XXXX"
  }


  // time no longer reported by Salud's end
  // var time = splitUp[7]
  // var ampm = splitUp[8] 

  return `Updated ${currentMonthEN} ${dayNumber}, ${year}`

}




function removeParentheses(string){
  var output = ""
  for (var i = 0; i < string.length; i++) {
    let char = string[i]
    if (char === ")" || char === "("){
      continue
    }
    else{
      output+=char
    }
  }
  return output
}

function getSlashedDateFromDate(date,locale){

  let espagnol = `${date.dayOfMonth}-${MONTHS[locale][date.monthNumber]}` 
  let anglais = `${MONTHS[locale][date.monthNumber]}-${date.dayOfMonth}`
  return locale === "es-pr" ? espagnol : anglais;
}

function createDataObject(data,UIstate){

  let yKey = `${UIstate.attributeToGraph}`
  let graphOptionAbsolute = UIstate.graphOptionAbsolute
  let graphOptionChange = UIstate.graphOptionChange

  let today = new Date()
  let lowerTimeBound =  today.setDate(today.getDate()-UIstate.graphLastXdays);

  var formattedData = []
  var formattedDeltaData = []
  console.log(`Supposed to graph last ${UIstate.graphLastXdays} days`)
  console.log(`Not admitting anything before  ${new Date(lowerTimeBound)}`)

  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    const dateInfo = getDateObjectFromEntry(entry);
    console.log(`dateInfo is `,dateInfo)

    if (UIstate.graphLastXdays !== 0 && dateInfo.jsDate < lowerTimeBound){
      continue
    } else {
      console.log(`Admitting ${dateInfo.jsDate}`)
    }

    let xShorthand = getSlashedDateFromDate(dateInfo,UIstate.locale);
    var yValue = entry[yKey]

    if (i >= 1){
      const prevEntry = data[i-1]
      const prevYvalue = prevEntry[yKey]
      const delta = yValue - prevYvalue
      if (isNaN(delta)){
        continue
      }
      const formattedDelta = {"x":xShorthand,"y":delta}
      formattedDeltaData.push(formattedDelta)
    }

    const formattedEntry = {"x":xShorthand,"y":yValue}
    formattedData.push(formattedEntry)
  }

  const dataObject = {
  // Hacky
  "id": LABELS[UIstate.locale][UIstate.attributeToGraph],
  "color":BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[yKey]],
  "data": formattedData}

  const deltaObject = {
  "id": LABELS[UIstate.locale].change,
  "color":DELTA_LINE_COLOR,
  "data": formattedDeltaData}

  var dataList = []
  if (graphOptionAbsolute){
    dataList.push(dataObject)
  }

  if (graphOptionChange){
    dataList.push(deltaObject)
  }

  return dataList
}


// const PuertoRicoHeatmap = (props) =>{
//   return (
//     <div style={{display: 'flex',flexDirection: 'column'}}>
//       <img style={{width: '100%'}} alt="Mapa con numeros de casos positivos de COVID-19 por pueblo de Puerto Rico" src="http://www.salud.gov.pr/PublishingImages/Pages/coronavirus/Mapa%20Casos%20Confirmados.png"/>
//     </div>
//   )
// }

const AlertHeader = (props) =>
   (
  <Alert style={{width: "80%"}}variant="primary" onClose={props.onClose} dismissible>
         <Alert.Heading>{props.header}</Alert.Heading>
         {props.body}
  </Alert>
)


function InfoModal(props) {

  return (
    <>
      <Modal show={props.modalVisible} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>props.handleClose()}>OK</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



const TimeRangeSelector = (props) =>{

return (
  <>
    <div>
      {props.timeRangeSelectionText}:
    </div>
    <Dropdown>
      <Dropdown.Toggle variant="warning" id="dropdown-basic">
        {props[`last${props.graphLastXdays}daysText`]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(7)}>{props.last7daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(14)}>{props.last14daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(30)}>{props.last30daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(60)}>{props.last60daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(90)}>{props.last90daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(180)}>{props.last180daysText}</Dropdown.Item>        
        {/* <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(365)}>{props.last365daysText}</Dropdown.Item> */}
        {/* <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(0)}>{props.last0daysText}</Dropdown.Item> */}
      </Dropdown.Menu>
    </Dropdown>
  </>
  )
}


export default function Home(props) {

    const [cookie, setCookie] = useCookies();
    // console.log("cookie",cookie)

    var buttonVariants = {}

    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i]
      var defaultButtonVariant = 'light'
      if (attribute === "totalPositive"){
        defaultButtonVariant = 'warning'
      }
      buttonVariants[`${attribute}ButtonVariant`] = defaultButtonVariant
    }

    const [UIstate,setUIState] = useState({
                attributeToGraph:'totalPositive',
                graphColors:[BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES['totalPositive']],DELTA_LINE_COLOR],
                graphOptionAbsolute:false,
                graphOptionChange:true,
                ...buttonVariants,
                alertVisible:cookie.ui ? cookie.ui.alertVisible : false,
                locale:'es-pr',
                graphLastXdays:14,
              })
    const [historicalData,setHistoricalData] = useState({
      all:[],
      newPositivesToday: 0,
      newDeathsToday:0,
      newSerologicalPositiveToday: 0,
    })
    const [today,setTodaysData] = useState({
      totalPositive:  0,
      molecularPositive:  0,
      serologicalPositive:  0,
      deaths: 0,
      saludTimeSignature:"",
      timestamp: "",
    });

    const [todaysVaccinationData, setTodaysVaccinationData] = useState({
      peopleWithAtLeastOneDose:0,
      peopleWithTwoDoses:0,
    });



  useEffect(()=>{
    const fetchFirebaseData = async ()=>{
      var todaysDataFromFireBase = {}
      var todaysDataRef = await props.firebase.getTodaysDataRef()
      todaysDataFromFireBase = todaysDataRef.exists ? {...todaysDataRef.data()} : null

      const historicalDataRef = await props.firebase.getHistoricalDataRef()
      var historicalDataFromFireBase = {}
      if (historicalDataRef.exists){
        const historicalData = historicalDataRef.data().all
        const lengthOfData = historicalData.length
        historicalDataFromFireBase = {
          all:historicalData,
          newPositivesToday:historicalData[lengthOfData-2].totalPositive && historicalData[lengthOfData-1].totalPositive ? historicalData[lengthOfData-1].totalPositive - historicalData[lengthOfData-2].totalPositive : 0,
          newDeathsToday: historicalData[lengthOfData-1].deaths && historicalData[lengthOfData-2].deaths ? historicalData[lengthOfData-1].deaths - historicalData[lengthOfData-2].deaths : 0,
          newMolecularPositiveToday:historicalData[lengthOfData-2].molecularPositive && historicalData[lengthOfData-1].molecularPositive ? historicalData[lengthOfData-1].molecularPositive - historicalData[lengthOfData-2].molecularPositive : 0,
          newAntigenPositiveToday:historicalData[lengthOfData-2].antigenPositive && historicalData[lengthOfData-1].antigenPositive ? historicalData[lengthOfData-1].antigenPositive - historicalData[lengthOfData-2].antigenPositive : 0,
          }
      }
      setHistoricalData({...historicalDataFromFireBase})
      setTodaysData({...todaysDataFromFireBase})

      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0,0,0,0)

      setCookie("today",{...todaysDataFromFireBase,expirationDate:tomorrow},{expires:tomorrow})

    }

    const getTodaysVaccinationData = async () =>{
      console.log("fetching")
      var todaysVaccinationDataRef = await props.firebase.getTodaysVaccinationData();
      if (todaysVaccinationDataRef.exists){
        const todaysVaccinationData = todaysVaccinationDataRef.data()
        console.log("todays vax data:",todaysVaccinationData)
        setTodaysVaccinationData(todaysVaccinationData);
      }
    }    

    fetchFirebaseData();
    getTodaysVaccinationData();
// eslint-disable-next-line
  },[props.firebase])



  const chooseButton = (attributeToGraph)=>{
    var newState = UIstate
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i];
      const stateItem = `${attribute}ButtonVariant`

      if (attribute === attributeToGraph){
        const variantClass = ATTRIBUTES_TO_CLASSES[attribute]
        newState[stateItem] = variantClass
        newState.attributeToGraph = attribute
        newState.graphColors = [BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[attribute]],DELTA_LINE_COLOR]
      } else{
        newState[stateItem] = 'light'
      }
    }
    setUIState({...UIstate},{...newState})
  }

  const toggleGraphOption = (option) =>{
    const absoluteCurrentToggle = UIstate.graphOptionAbsolute
    const changeCurrentToggle = UIstate.graphOptionChange

    if (option === 'absolute'){
      if (changeCurrentToggle){
        setUIState({...UIstate,graphOptionAbsolute:!absoluteCurrentToggle})
      }
    }
    else if (option === 'change'){
      if (absoluteCurrentToggle){
        setUIState({...UIstate,graphOptionChange:!changeCurrentToggle})
      }
    }

  }

  const getHistoricalDataBackup = () =>{
    let keys = {}
    var columnIndex = 0
    for (var i = 0; i < historicalData.all.length; i++) {
      let entry = historicalData.all[i]
      let entryKeys = Object.keys(entry)
      for (var j = 0; j < entryKeys.length; j++) {
        let entryKey = entryKeys[j]

        if (entryKey in keys === false){
          keys[entryKey] = columnIndex
          columnIndex += 1
        }
      }
    }
    // [alpha,beta, gamma]
    let listOfKeys = Object.keys(keys)
    var csv = [[...listOfKeys]]

    // go again through every entry
    for (var e = 0; e < historicalData.all.length; e++) {
      let entry = historicalData.all[e]
      var newRow = []

      for (var k = 0; k < listOfKeys.length; k++) {
        let key = listOfKeys[k]
        if (key in entry){
          newRow.push(entry[key])
        }
        else{
          newRow.push("")
        }
      }
      csv.push(newRow)
    }
    return csv
  }

  const closeAlert = async () =>{
    setUIState({...UIstate,alertVisible:false})
    setCookie("ui",{...UIstate,alertVisible:false})
  }

  const saveNewLocale = (newLocale) =>{
    setUIState({...UIstate,locale:newLocale})
    setCookie("ui",{...UIstate,locale:newLocale})

  }
  const chooseTimeRange = (days) =>{
    setUIState({...UIstate,graphLastXdays:days})
  }



    const dataObjectForChart = createDataObject(historicalData.all,UIstate)

    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',backgroundColor: 'white'}}>
        <Navigation 
        locale={UIstate.locale}
        inPuertoRico={LABELS[UIstate.locale].inPuertoRico} clickEnglishButton={()=>saveNewLocale('en-us')} clickSpanishButton={()=>saveNewLocale('es-pr')}
          excessDeaths={LABELS[UIstate.locale].excessDeaths}/>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <InfoModal modalVisible={UIstate.modalVisible} modalHeader={UIstate.modalHeader} modalBody={UIstate.modalBody} handleShow={()=>setUIState({...UIstate,modalVisible:true})} handleClose={()=>setUIState({...UIstate,modalVisible:false})}/>
        </div>


        {UIstate.alertVisible ? <AlertHeader onClose={closeAlert} header={ALERT_HEADER[UIstate.locale]} body={ALERT_BODY[UIstate.locale]}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',width: "100%"}}>
        <div className="statsRow">
            <HerdImmunityBar
              percentageFullyVaccinatedText={LABELS[UIstate.locale].percentageFullyVaccinatedText}
              percentageFullyVaccinated={((parseInt(todaysVaccinationData.peopleWithTwoDoses) /  3076212) * 100).toFixed(1) + "%"}/>          
          </div>            
          {/* <div className="statsRow">
          </div>   */}
          <div className="statsRow">
            <GetVaccinatedBlock vaccineCallToAction={LABELS[UIstate.locale].vaccineCallToAction}/>
            <VaccineStatsBlock  
              peopleWithAtLeastOneDoseText={LABELS[UIstate.locale].peopleWithAtLeastOneDoseText}
              peopleWithTwoDosesText={LABELS[UIstate.locale].peopleWithTwoDosesText}
              peopleWithAtLeastOneDose={formatInteger(todaysVaccinationData.peopleWithAtLeastOneDose)}
              peopleWithTwoDoses={formatInteger(todaysVaccinationData.peopleWithTwoDoses)}
              percentageFullyVaccinated={((parseInt(todaysVaccinationData.peopleWithTwoDoses) / 2799926) * 100).toFixed(1) + "%"}
              percentageFullyVaccinatedText={LABELS[UIstate.locale].percentageFullyVaccinatedText}
            />
          </div>
          <div className="statsRow">
            <PositivesAndDeathsBlock
              totalPositiveCasesLabel={LABELS[UIstate.locale].totalPositiveCasesLabel}
              totalPositive={today.totalPositive}
              serologicalPositive={today.serologicalPositive}
              deaths={today.deaths} deathsLabel={LABELS[UIstate.locale].deaths}
              historicalData = {historicalData}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
          </div>
          <div className="statsRow">
            <TestNumbersBlock
              today={today}
              historicalData={historicalData}
              totalPositiveLabel={LABELS[UIstate.locale].totalPositive}
              confirmedCasesLabel={LABELS[UIstate.locale].confirmedCasesLabel}
              antigenCasesLabel={LABELS[UIstate.locale].antigenCasesLabel}
              deathsLabel={LABELS[UIstate.locale].deaths}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
            {/* <TestDistributionBlock
              today={today}
              description={LABELS[UIstate.locale].positiveCaseDistribution}
              confirmed={LABELS[UIstate.locale].confirmed}
              probable={'Probable'}
              totalPositive={today.totalPositive}
              serologicalPositive={today.serologicalPositive}              
              molecularPositive={today.molecularPositive} 
              antigenPositive={today.antigenPositive}              
              /> */}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5, fontSize: "14px"}}>
          <div>{UIstate.locale === 'es-pr' ? today.saludTimeSignature : anglifySaludTimeSignature(today.saludTimeSignature ?today.saludTimeSignature : "" )}</div>
        </div>

        <div style={{textAlign:'center',marginTop: 10}}>{GRAPHING_DESCRIPTION[UIstate.locale].instructions}</div>
        <div style={{display:'flex',flexDirection:'row'}}>
          <Button onClick={()=>toggleGraphOption('absolute')} variant={UIstate.graphOptionAbsolute ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].dataPerDay}</Button>{' '}
          <Button onClick={()=>toggleGraphOption('change')} variant={UIstate.graphOptionChange ? 'primary' : 'light'}>{GRAPHING_DESCRIPTION[UIstate.locale].changePerDay}</Button>{' '}
        </div>
        <TimeRangeSelector graphLastXdays={UIstate.graphLastXdays}
          last0daysText={LABELS[UIstate.locale]['last0daysText']}
          last7daysText={LABELS[UIstate.locale]['last7daysText']}
          last14daysText={LABELS[UIstate.locale]['last14daysText']}
          last30daysText={LABELS[UIstate.locale]['last30daysText']}
          last60daysText={LABELS[UIstate.locale]['last60daysText']}
          last90daysText={LABELS[UIstate.locale]['last90daysText']}
          last180daysText={LABELS[UIstate.locale]['last180daysText']}
          last365daysText={LABELS[UIstate.locale]['last365daysText']}
          timeRangeSelectionText={LABELS[UIstate.locale]['timeRangeSelectionText']}
          timeRangeSelectionFunction={chooseTimeRange}

          />


        <div className="attributeToGraphSelection">
          <Button onClick={()=>chooseButton('totalPositive')} variant={UIstate.totalPositiveButtonVariant}>{LABELS[UIstate.locale].totalPositiveCasesLabel}</Button>{' '}
          <Button onClick={()=>chooseButton('molecularPositive')} variant={UIstate.molecularPositiveButtonVariant}>{LABELS[UIstate.locale].molecularTests}</Button>{' '}
          <Button onClick={()=>chooseButton('antigenPositive')} variant={UIstate.antigenPositiveButtonVariant}>{LABELS[UIstate.locale].antigenTests}</Button>{' '}
          <Button onClick={()=>chooseButton('deaths')} variant={UIstate.deathsButtonVariant}>{LABELS[UIstate.locale].deaths}</Button>{' '}
        </div>

        <div className="chartContainer">
          <LineChart data={dataObjectForChart} xAxisLabel={LABELS[UIstate.locale].date} yAxisLabel={LABELS[UIstate.locale][UIstate.attributeToGraph]} graphColors={UIstate.graphColors}/>
        </div>

        <div style={{margin: 5,marginBottom: 20,display: 'flex',flexDirection: 'column',textAlign: 'center'}}>

          <CSVLink data={getHistoricalDataBackup()} filename={`COVID Tracker PR Data ${removeParentheses(today.saludTimeSignature)}.csv`}>
            <Button variant="success" style={{fontSize: 14}}>{UIstate.locale === 'es-pr' ? 'Bajar data ' : "Download data "}<Icon.Download /></Button>
          </CSVLink>

          <div style={{fontSize: 13}}>{DISCLAIMER_DIV[UIstate.locale]}</div>
        </div>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <SiteDescription locale={UIstate.locale}/>
          <div style={{fontSize: 13,margin:10}}>&copy; 2021 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">{UIstate.locale === 'es-pr' ? 'Licencia' : 'License'}</a></div>
          <LoveStatement style={{fontSize: 13,marginTop: 10}} locale={UIstate.locale}/>
          <CoffeeButton/>
        </div>

      </div>
    );

}
