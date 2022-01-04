import React from 'react';
import * as Icon from 'react-bootstrap-icons';


const LABELS_ES = {confirmedCases:"Casos positivos confirmados",
                  antigenTests:"Prueba de antígeno",
                  molecularTests:"Prueba molecular",serologicalTests:"Prueba serológica",deaths:"Muertes",
                  percentInfected:"Porciento de puertorriqueños infectados",fatalityRate:"Tasa de muertes",date:"Fecha",
                  confirmedCasesExplanation:"Es el número de casos positivos atribuidos a una sola persona. Antes del 5 de mayo del 2020, el Departmento de Salúd publicaba el número de pruebas positivas que no necesariamente correspondía al número de personas que probaron positivo al COVID-19.",
                  molecularTestsExplanation:"Éste es el número de casos positivos del COVID-19 de acuerdo a pruebas moleculares. Éstas detectan directamente el ARN (ácido ribonucleico), es decir, el material genético del virus, en las muestras tomadas de secreciones respiratorias del paciente.",
                  serologicalTestsExplanation:"Este dato representa el número de casos positivos del COVID-19 de acuerdo a pruebas serólogicas. La prueba serológica detecta nuestra respuesta inmunológica contra el patógeno. Éstas son referidas como \"pruebas rápidas\", pues ofrecen resultados en 10 minutos.",
                  deathsExplanation:"Este número representa el número de muertes atribuídas a COVID-19 en Puerto Rico.",
                  percentInfectedExplanation:"Este número representa el número de casos positivos dividido entre 3.194 millón (cifra de población de Puerto Rico).",
                  fatalityRateExplanation:"Este número representa el número de muertes atribuidas al COVID-19 dividido entre los casos positivos únicos.",
                  today:'hoy', change:"Cambio",
                  inPuertoRico:" en Puerto Rico",
                  last7daysText:'Últimos 7 días',
                  last14daysText:'Últimos 14 días',
                  last30daysText:'Últimos 30 días',
                  last60daysText:'Últimos 60 días',
                  last90daysText:'Últimos 90 días',
                  last180daysText:'Últimos 6 meses',
                  last365daysText:'Pasado año',                  
                  last0daysText:"Desde el comienzo",
                  timeRangeSelectionText:'Rango de tiempo',
                  excessDeathsTableTitle:"Ilustración del exceso de muertes semanal",
                  excessDeathsTableDescription:"El CDC produjo la siguiente visualización que ilustra el número de muertes semanales que se espera (en azúl) en comparación con el número actual. Si hay más muertes que lo anticipado, el número actual sobrepasará la curva amarilla y conllevará un signo rojo de más (+). Puede comparar esta visualización con otras jurisdicciones de EEUU bajo \"Select a jurisdiction\".",
                  testDistribution:"Distribución de pruebas",
                  serological:"Serológica",
                  confirmedCasesLabel:"Casos confirmados por prueba molecular",
                  antigenCasesLabel:"Casos probables por prueba de antígeno",
                  probableCasesLabel:"Casos probables por prueba serológica",
                  positiveCaseDistribution:"Distribución de pruebas positivas",
                  totalPositiveCasesLabel:"Pruebas positivas totales",
                  confirmed:"Confirmado",
                  excessDeaths:"Muertes en exceso",
                  totalPositive:"Total de pruebas positivas",
                  molecularPositive:"Positivos por prueba molecular",
                  antigenPositive:"Positivos por prueba de antígeno",
                  serologicalPositive:"Positivos por prueba serológica",
                  aboveAverage:"sobre promedio",
                  belowAverage:"bajo promedio",
                  of:"de",
                  twoWeeks:"dos semanas",
                  siteDescription:"COVID Tracker PR es un website para visualizar el número y crecimiento de los casos de COVID-19 o el coronavirus nuevo del 2019 en Puerto Rico. ",
                  vaccineCallToAction:"¡Vacúnate o coordina una cita!",
                  administeredDosesText:"Vacunas administradas",
                  peopleWithAtLeastOneDoseText:"Personas con una dosis",
                  peopleWithTwoDosesText:"Personas con dosis completada",
                  percentageFullyVaccinatedText:"Porciento de población apta (5 años o más) con serie de dosis completada"
                }
const LABELS_EN = {confirmedCases:"Confirmed positive cases",
                  antigenTests:"Antigen Tests",
                  molecularTests:"Molecular Tests",serologicalTests:"Serological Tests",deaths:"Deaths",
                  percentInfected:"Percent of PR population infected ",fatalityRate:"Fatality rate",date:"Date",
                  confirmedCasesExplanation: "This is the number of positive cases attributed to a single person. Before May 5, 2020, the PR Department of Health published the number of positive tests that did not necessarily correspond to the number of people who tested positive for COVID-19. (e.g multiple tests per person)" ,
                  molecularTestsExplanation: "This is the number of positive cases of COVID-19 according to molecular tests. These directly detect RNA (ribonucleic acid), the genetic material of the virus, in samples taken from the patient's respiratory secretions." ,
                  serologicalTestsExplanation: "This data represents the number of positive cases of COVID-19 according to serological tests. The serological test detects our immune response against the pathogen. These are referred to as \"quick tests\", as they offer results in 10 minutes. ",
                  deathsExplanation: "This represents the number of deaths attributed to COVID-19 in Puerto Rico.",
                  percentInfectedExplanation:"This number represents the number of positive cases divided by 3.194 million (our figure of for the current population of Puerto Rico).",
                  fatalityRateExplanation:"This number represents the percentage of deaths attributed to COVID-19 over the number of unique positive cases.",
                  today:'today',change:"Change",
                  inPuertoRico:" in Puerto Rico",
                  last7daysText:'Last 7 days',
                  last14daysText:'Last 14 days',
                  last30daysText:'Last 30 days',
                  last60daysText:'Last 60 days',
                  last90daysText:'Last 90 days',
                  last180daysText:'Last 6 months',
                  last365daysText:'Last year',
                  last0daysText:"From the beginning",
                  timeRangeSelectionText:'Time range',
                  excessDeathsTableTitle:"Visualize weekly excess deaths ",
                  excessDeathsTableDescription:"",
                  testDistribution:"Test distribution",
                  serological:"Serological",
                  probableCasesLabel:"Probable positive cases by serelogical test",
                  confirmedCasesLabel:"Confirmed cases by molecular test",
                  antigenCasesLabel:"Probable cases by antigen test",
                  positiveCaseDistribution:"Distribution of positive tests",
                  totalPositiveCasesLabel:"Total positive tests",
                  confirmed:"Confirmed",
                  excessDeaths:"Excess Deaths",
                  totalPositive:"Total positive tests",
                  molecularPositive:"Positives by molecular test",
                  antigenPositive:"Positives by antigen test",
                  serologicalPositive:"Positives by serological test",
                  aboveAverage:"above average",
                  belowAverage:"below average",
                  of:"of",
                  twoWeeks:"two weeks",
                  siteDescription:"COVID Tracker PR is a website used to follow and visualize the number of COVID-19 or 2019 novel coronavirus in Puerto Rico. ",
                  vaccineCallToAction:"Get your vaccine or plan your appointment!",  
                  administeredDosesText:"Administered vaccines",
                  peopleWithAtLeastOneDoseText:"People with one dose",
                  peopleWithTwoDosesText:"People with completed dose series",
                  percentageFullyVaccinatedText:"Percentage of eligible population (at least 5 years old) with completed vaccine series"

                }



const LABELS = {'en-us':LABELS_EN,'es-pr':LABELS_ES}

export const formatInteger = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getPercent = (amount,total,decimals) => {
  var quotient = amount / total * 100
  return quotient.toFixed(decimals) + '%'
}

export const getLabels = () => {
  return LABELS
}

export const getDeltaAverageForDays = (historicalData,dataPoint) =>{
  let DAYS_FOR_AVERAGE = 14

  let totalDaysAvailable = historicalData.all.length

  var deltaSum = 0
  var i = 1
  while (i < DAYS_FOR_AVERAGE && totalDaysAvailable - i > 1){
    let dataForDay = historicalData.all[totalDaysAvailable - i]
    let dataForDayBefore = historicalData.all[totalDaysAvailable - (i + 1)]
    deltaSum += dataForDay[dataPoint] - dataForDayBefore[dataPoint]
    i += 1
  }

  var deltaAverage = deltaSum / DAYS_FOR_AVERAGE
  deltaAverage = deltaAverage.toFixed(1)
  return deltaAverage
}

export const DataDiv = (props) =>{
  var number = formatInteger(props.figure ? props.figure : "0")
  const dateObject = getDateObjectFromEntry({saludTimeSignature: props.saludTimeSignature})
  const saludDayOfMonth = dateObject.dayOfMonth
  const todaysDayOfMonth = (new Date()).getDate()

  const dateFromToday = saludDayOfMonth === todaysDayOfMonth
  const deltaAboveAverage = props.newToday > props.twoWeekAverage

  const arrow = deltaAboveAverage ? <Icon.ArrowUp style={{color: 'red'}} /> : <Icon.ArrowDown style={{color: '#b8e994'}} />

  return (<div style={{display:'flex',flexDirection:'column'}}>
            <div style={{color: 'grey'}}>{props.label}</div>
            <div style={{fontSize: 45,fontWeight: 'bold',color:props.color}}>{number}</div>
            {dateFromToday && props.newToday?
              <div>{`(+${formatInteger(props.newToday)}`} { `${props.locale === "es-pr" ? "hoy" : "today"})`}
              {arrow}
              </div>
                : null}
            {deltaAboveAverage ?
              <div style={{color:'#e17055'}}>{`${LABELS[props.locale].aboveAverage}`}<br/>{`${LABELS[props.locale].of} ${LABELS[props.locale].twoWeeks}`}</div>
              : <div style={{color:'grey'}}>{`${LABELS[props.locale].belowAverage}`}<br/>{`${LABELS[props.locale].of} ${LABELS[props.locale].twoWeeks}`}</div>}
          </div>
  )
}

export const CoffeeButton = (props) =>{
  return (
    <a href="https://buymeacoff.ee/williama">
      <div id="bmc-wbtn"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center',width: "64px",height: "64px", background: 'rgb(255, 129, 63)',color: "white",borderRadius: "32px", position: 'fixed', left: "18px", bottom: "18px",boxShadow: "rgba(0, 0, 0, 0.4) 0px 4px 8px",zIndex: 999,cursor: 'pointer', fontWeight: 600, transition: "all 0.2s ease 0s", transform: 'scale(1)'}}>
          <img src="https://cdn.buymeacoffee.com/widget/assets/coffee%20cup.svg" alt="Buy Me A Coffee" style={{height: "40px", width: "40px", margin: 0, padding: 0}}/>
      </div>
    </a>
  )
}

export const SiteDescription = (props) =>{
  return (
    <div>
    {LABELS[props.locale].siteDescription}
    </div>
  )
}



export const LoveStatement = (props) =>{
  const madeWith = props.locale === "es-pr" ? "Hecho con " : "Made with "
  const by = props.locale === "es-pr" ? "por" : "by"
  return (
    <div style={props.style}>
    {madeWith}<span style={{color: '#e25555'}}>&#9829;</span> {by} <a href="https://twitter.com/williamrodz" target="_blank" rel="noopener noreferrer" onClick={(event) => {event.preventDefault(); window.open("https://twitter.com/williamrodz");}}>William Rodríguez Jiménez</a>
    </div>
  )
}

export const printObject = (object) =>{
  var stringVersion = ""
  let keys = Object.keys(object)
  console.log("Printing object...")
  console.log("Keys are: "+keys)

  for (var i = 0; i < keys.length; i++) {
    let key = keys[i]
    stringVersion += `${key}:${object[key]}`
  }
  return stringVersion
}


let MONTHS_ES_LIST = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
let MONTHS_ES_TO_NUMBER = {}
MONTHS_ES_LIST.map( (month,i)=>MONTHS_ES_TO_NUMBER[month] = i)


export function getDateObjectFromEntry(entry){
  var jsDate;
  var dayOfMonth;
  var monthNumber;
  var year;
  if (entry.timestamp){
    jsDate = new Date(entry.timestamp)
    dayOfMonth = jsDate.getDate();
    monthNumber = jsDate.getMonth();
    year = jsDate.getYear();
  }
  else if (entry.saludTimeSignature.indexOf(" de ") !== -1){
    let dateSplit = entry.saludTimeSignature.split(" de ");
    dayOfMonth = parseInt(dateSplit[0].substring(dateSplit[0].length - 3));
    let monthInSpanish = dateSplit[1];
    monthNumber = MONTHS_ES_TO_NUMBER[monthInSpanish];
    year = parseInt(dateSplit[2]);
    jsDate = new Date(year,monthNumber - 1,dayOfMonth)
  } else if (entry.saludTimeSignature.indexOf("/") !== -1){
    let slashedDate = entry.saludTimeSignature.split(" ")[2]
    let dateComponents = slashedDate.split("/")
    monthNumber = parseInt(dateComponents[0]);
    dayOfMonth = parseInt(dateComponents[1]);
    year = parseInt(dateComponents[2]);
    jsDate = new Date(year,monthNumber - 1,dayOfMonth)    
  } else {
    console.log(`Date format is invalid.`)
  }

  return {jsDate:jsDate,year:year,monthNumber:monthNumber,dayOfMonth:dayOfMonth}

}