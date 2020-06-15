import React, {useState,useEffect} from 'react';
import { Button, Alert,Modal,Dropdown} from 'react-bootstrap';
import LineChart from '../LineChart';
import Tableau from '../Tableau'
import { CSVLink } from "react-csv";
import * as Icon from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

import Navigation from '../NavigationBar'

import MainDataBlock from '../MainDataBlock'
import FatalityChartBlock from '../FatalityChartBlock'
import TestNumbersBlock from '../TestNumbersBlock'
import TestDistributionBlock from '../TestDistributionBlock'

import {formatInteger, getLabels } from '../Common/index.js'

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

const DISCLAIMER_ES = (<div>*La data provista fue obtenida del sitio web del Departamento de Salúd del coronavirus (<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) y está sujeta a cambio y/o clarificación.</div>)
const DISCLAIMER_EN = (<div>*The provided data was obtained from the Puerto Rico Department of Health's coronavirus website(<a href="http://www.salud.gov.pr/Pages/coronavirus.aspx" target="_blank" rel="noopener noreferrer">http://www.salud.gov.pr/Pages/coronavirus.aspx</a>) and is subject to change and/or clarification</div>)
const DISCLAIMER_DIV = {'en-us':DISCLAIMER_EN,'es-pr':DISCLAIMER_ES}

const ATTRIBUTES = ["serologicalTests","confirmedCases","molecularTests",'testsInProgress',"deaths"]
const ATTRIBUTE_CLASS_ORDER= ['primary','warning','success','secondary','danger']


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

  var anglified = saludTimeSignature.trim()
  anglified = anglified.replace(/\s/g,"_")

  var splitUp = anglified.split("_")
  var dayNumber = splitUp[2]
  var year = splitUp[6].replace(",","")
  var time = splitUp[7]
  var ampm = splitUp[8].replace(")","")



  return `Updated ${currentMonthEN} ${dayNumber}, ${year}, ${time} ${ampm}`

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




function getFigureWithTodaysCount(color,label,figure,saludTimeSignature,newToday,locale){
  var number = formatInteger(figure)

  const locationOfAl = saludTimeSignature.indexOf("al ")
  const dateNumberStart = locationOfAl + 3
  const dateNumberEnd = saludTimeSignature[dateNumberStart+1] === " " ? dateNumberStart+1 : dateNumberStart+2


  const saludDayOfMonth = parseInt(saludTimeSignature.substring(dateNumberStart,dateNumberEnd))
  const todaysDayOfMonth = (new Date()).getDate()

  const dateFromToday = saludDayOfMonth === todaysDayOfMonth


  if (dateFromToday){
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <text style={{fontSize: 45,fontWeight: 'bold',color:color}}>{number}</text>
              <text>{`(+${formatInteger(newToday)}`} { `${LABELS[locale].today})`}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  } else{
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <text style={{fontSize: 45,fontWeight: 'bold',color:color}}>{number}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  }
}

function createDataObject(data,UIstate){

  let xKey = 'timestamp'
  let yKey = `${UIstate.attributeToGraph}`
  let graphOptionAbsolute = UIstate.graphOptionAbsolute
  let graphOptionChange = UIstate.graphOptionChange
  let locale = UIstate.locale

  let today = new Date()
  let lowerTimeBound =  today.setDate(today.getDate()-UIstate.graphLastXdays);


  var formattedData = []
  var formattedDeltaData = []
  for (var i = 0; i < data.length; i++) {
    const entry = data[i]
    var xShorthand = entry[xKey]
    if (xKey === "timestamp"){
      const dateObj = new Date(entry[xKey])
      if (UIstate.graphLastXdays !== 0 && dateObj < lowerTimeBound){
        continue
      }

      xShorthand = UIstate.locale === "es-pr" ? `${dateObj.getDate()}-${MONTHS[locale][dateObj.getMonth()+1]}` : `${MONTHS[locale][dateObj.getMonth()+1]}-${dateObj.getDate()}`
    }

    var yValue = 0
    if (yKey ==="confirmedCases"){
      yValue = entry[yKey]
      yValue += entry.probableCases ? entry.probableCases : 0

    }
    else{
      yValue = entry[yKey]
    }

    if (!yValue){
      continue
    }
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
  "id": UIstate.attributeToGraph === "confirmedCases" ? LABELS[UIstate.locale].totalPositiveCasesLabel : LABELS[UIstate.locale][UIstate.attributeToGraph],
  "color":BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES[yKey]],
  "data": formattedData}

  const deltaObject = {
  "id": LABELS[UIstate.locale].change,
  "color":DELTA_LINE_COLOR,
  "data": formattedDeltaData}
  // console.log("formattedData",formattedData)
  // console.log("formattedDeltaData",formattedDeltaData)

  var dataList = []
  if (graphOptionAbsolute){
    dataList.push(dataObject)
  }

  if (graphOptionChange){
    dataList.push(deltaObject)
  }

  return dataList
}




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
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {props[`last${props.graphLastXdays}daysText`]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(7)}>{props.last7daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(14)}>{props.last14daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(30)}>{props.last30daysText}</Dropdown.Item>
        <Dropdown.Item onClick={()=>props.timeRangeSelectionFunction(0)}>{props.last0daysText}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </>
  )
}



const CoffeeButton = (props) =>{
  return (
    <a href="https://buymeacoff.ee/williama">
      <div id="bmc-wbtn"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center',width: "64px",height: "64px", background: 'rgb(255, 129, 63)',color: "white",borderRadius: "32px", position: 'fixed', left: "18px", bottom: "18px",boxShadow: "rgba(0, 0, 0, 0.4) 0px 4px 8px",zIndex: 999,cursor: 'pointer', fontWeight: 600, transition: "all 0.2s ease 0s", transform: 'scale(1)'}}>
          <img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style={{height: "40px", width: "40px", margin: 0, padding: 0}}/>
      </div>
    </a>
  )
}

const LoveStatement = (props) =>{
  const madeWith = props.locale === "es-pr" ? "Hecho con " : "Made with "
  const by = props.locale === "es-pr" ? "por" : "by"
  return (
    <div>
    {madeWith}<span style={{color: '#e25555'}}>&#9829;</span> {by} <a href="https://twitter.com/williamrodz" target="_blank" rel="noopener noreferrer" onClick={(event) => {event.preventDefault(); window.open("https://twitter.com/williamrodz");}}>William Rodríguez Jiménez</a>
    </div>
  )
}

export default function Home(props) {

    const [cookie, setCookie] = useCookies();
    // console.log("cookie",cookie)

    var buttonVariants = {}

    for (var i = 0; i < ATTRIBUTES.length; i++) {
      const attribute = ATTRIBUTES[i]
      var defaultButtonVariant = 'light'
      if (attribute === "confirmedCases"){
        defaultButtonVariant = 'warning'
      }
      buttonVariants[`${attribute}ButtonVariant`] = defaultButtonVariant
    }

    const [UIstate,setUIState] = useState({
                attributeToGraph:'confirmedCases',
                graphColors:[BOOTSTRAP_BUTTON_CLASSES_TO_COLORS[ATTRIBUTES_TO_CLASSES['confirmedCases']],DELTA_LINE_COLOR],
                graphOptionAbsolute:true,
                graphOptionChange:false,
                ...buttonVariants,
                alertVisible:cookie.ui ? cookie.ui.alertVisible : true,
                locale:'es-pr',
                graphLastXdays:14,
              })
    const [historicalData,setHistoricalData] = useState({
      all:[],
      newCasesToday: 0,
      newDeathsToday:0,
      newProbableCasesToday: 0,
    })
    const [today,setTodaysData] = useState({
      confirmedCases: cookie.today ? cookie.today.confirmedCases : 0,
      probableCases: cookie.today ? cookie.today.probableCases : 0,
      deaths:cookie.today ? cookie.today.deaths : 0,
      saludTimeSignature:cookie.today ? cookie.today.saludTimeSignature : "",
      timestamp:cookie.today ? cookie.today.timestamp : "",

    });



  useEffect(()=>{
    const fetchFirebaseData = async ()=>{

      var todaysDataFromFireBase = {}
      if (cookie.today && (new Date(cookie.today.timestamp)).getDate() === (new Date()).getDate() ){
        todaysDataFromFireBase = cookie.today
      } else{
        console.log("FETCHING TODAYS DATA")
        var todaysDataRef = await props.firebase.getTodaysData()
        todaysDataFromFireBase = todaysDataRef.exists ? {...todaysDataRef.data()} : null
      }


      const historicalDataRef = await props.firebase.getHistoricalData()
      console.log("FETCHING HISTORICAL DATA")
      var historicalDataFromFireBase = {}
      if (historicalDataRef.exists){
        const historicalData = historicalDataRef.data().all
        const lengthOfData = historicalData.length
        historicalDataFromFireBase = {
          all:historicalData,
          newCasesToday:historicalData[lengthOfData-2].confirmedCases && historicalData[lengthOfData-1].confirmedCases ? historicalData[lengthOfData-1].confirmedCases - historicalData[lengthOfData-2].confirmedCases : 0,
          newDeathsToday: historicalData[lengthOfData-1].deaths && historicalData[lengthOfData-2].deaths ? historicalData[lengthOfData-1].deaths - historicalData[lengthOfData-2].deaths : 0,
          newProbableCasesToday:historicalData[lengthOfData-2].probableCases && historicalData[lengthOfData-1].probableCases ? historicalData[lengthOfData-1].probableCases - historicalData[lengthOfData-2].probableCases : 0,
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

    fetchFirebaseData();
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

  const getDataForDownload = () =>{
    console.log("--Preparing data for future download--")

    const dataObjectForChart = createDataObject(historicalData.all,UIstate)
    var csv = [["fecha",UIstate.attributeToGraph]]
    for (var i = 0; i < dataObjectForChart.length; i++) {
      let data = dataObjectForChart[i].data
      if (i === 1){
        csv.push(["fecha","Cambio en "+UIstate.attributeToGraph])
      }
      for (var j = 0; j < data.length; j++) {
        let date = data[j].x
        let value = data[j].y
        csv.push([date,value])
      }
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
        <Navigation inPuertoRico={LABELS[UIstate.locale].inPuertoRico} clickEnglishButton={()=>saveNewLocale('en-us')} clickSpanishButton={()=>saveNewLocale('es-pr')}/>
        <div style={{display:'flex',flexDirection:'column',marginTop: 20,alignItems: 'center'}}>
          <InfoModal modalVisible={UIstate.modalVisible} modalHeader={UIstate.modalHeader} modalBody={UIstate.modalBody} handleShow={()=>setUIState({...UIstate,modalVisible:true})} handleClose={()=>setUIState({...UIstate,modalVisible:false})}/>
        </div>


        {UIstate.alertVisible ? <AlertHeader onClose={closeAlert} header={ALERT_HEADER[UIstate.locale]} body={ALERT_BODY[UIstate.locale]}/> : <div/>}
        <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin:20}}>
          <div className="statsRow">
            <MainDataBlock
              totalPositiveCasesLabel={LABELS[UIstate.locale].totalPositiveCasesLabel}
              confirmedCases={today.confirmedCases} newCasesToday={historicalData.newCasesToday}
              probableCases={today.probableCases} newProbableCasesToday={historicalData.newProbableCasesToday}
              deaths={today.deaths} newDeathsToday={historicalData.newDeathsToday} deathsLabel={LABELS[UIstate.locale].deaths}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
            <FatalityChartBlock deaths={today.deaths} confirmedCases={today.confirmedCases+today.probableCases} description={LABELS[UIstate.locale].fatalityRate}/>
          </div>
          <div className="statsRow">
            <TestNumbersBlock
              confirmedCases={today.confirmedCases} newCasesToday={historicalData.newCasesToday} confirmedCasesLabel={LABELS[UIstate.locale].confirmedCases}
              probableCases={today.probableCases} newProbableCasesToday={0} probableCasesLabel={LABELS[UIstate.locale].probableCasesLabel}
              deaths={today.deaths} newDeathsToday={historicalData.newDeathsToday} deathsLabel={LABELS[UIstate.locale].deaths}
              saludTimeSignature={today.saludTimeSignature}
              locale={UIstate.locale}
              />
            <TestDistributionBlock confirmedCases={today.confirmedCases} probableCases={today.probableCases} description={LABELS[UIstate.locale].positiveCaseDistribution}
                                  confirmed={LABELS[UIstate.locale].confirmed} probable={'Probable'}/>
          </div>
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
          timeRangeSelectionText={LABELS[UIstate.locale]['timeRangeSelectionText']}
          timeRangeSelectionFunction={chooseTimeRange}


          />


        <div className="attributeToGraphSelection">
          <Button onClick={()=>chooseButton('confirmedCases')} variant={UIstate.confirmedCasesButtonVariant}>{LABELS[UIstate.locale].totalPositiveCasesLabel}</Button>{' '}
          <Button onClick={()=>chooseButton('serologicalTests')} variant={UIstate.serologicalTestsButtonVariant}>{LABELS[UIstate.locale].serologicalTests}</Button>{' '}
          <Button onClick={()=>chooseButton('molecularTests')} variant={UIstate.molecularTestsButtonVariant}>{LABELS[UIstate.locale].molecularTests}</Button>{' '}
          <Button onClick={()=>chooseButton('deaths')} variant={UIstate.deathsButtonVariant}>{LABELS[UIstate.locale].deaths}</Button>{' '}
        </div>

        <div className="chartContainer">
          <LineChart data={dataObjectForChart} xAxisLabel={LABELS[UIstate.locale].date} yAxisLabel={UIstate.attributeToGraph === "confirmedCases" ? LABELS[UIstate.locale].totalPositiveCasesLabel : LABELS[UIstate.locale][UIstate.attributeToGraph]} graphColors={UIstate.graphColors}/>
        </div>
        <div style={{display:'flex',flexDirection:'row',textAlign: 'center',margin: 5}}>
          <div>{UIstate.locale === 'es-pr' ? today.saludTimeSignature : anglifySaludTimeSignature(today.saludTimeSignature)}</div>
        </div>
        <div style={{margin: 5,marginBottom: 20,display: 'flex',flexDirection: 'column',textAlign: 'center'}}>
          <CSVLink data={getDataForDownload()} filename={`${UIstate.attributeToGraph}${removeParentheses(today.saludTimeSignature)}.csv`}>
            <Button variant="success">{UIstate.locale === 'es-pr' ? 'Bajar data ' : "Download data "}<Icon.Download /></Button>
          </CSVLink>
          <div style={{fontSize: 13}}>{DISCLAIMER_DIV[UIstate.locale]}</div>
        </div>
        <Tableau title={LABELS[UIstate.locale].excessDeathsTableTitle} description={LABELS[UIstate.locale].excessDeathsTableDescription}/>
        <div style={{display: 'flex',flexDirection: 'column',height: "10vh",alignItems: 'center',textAlign: 'center',marginBottom: 40}}>
          <div style={{fontSize: 13,margin:10}}>&copy; 2020 <a href="https://github.com/williamrodz/covid19-puertorico-web/blob/master/LICENSE.txt">{UIstate.locale === 'es-pr' ? 'Licencia' : 'License'}</a></div>
          <LoveStatement style={{fontSize: 13,marginTop: 10}} locale={UIstate.locale}/>
          <CoffeeButton/>
        </div>

      </div>
    );

}
