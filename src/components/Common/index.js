import React from 'react';

const LABELS_ES = {confirmedCases:"Casos positivos confirmados",molecularTests:"Prueba molecular",serologicalTests:"Prueba serológica",deaths:"Muertes",
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
                  last0daysText:"Desde el comienzo",
                  timeRangeSelectionText:'Rango de tiempo',
                  excessDeathsTableTitle:"Ilustración del exceso de muertes semanal",
                  excessDeathsTableDescription:"El CDC produjo la siguiente visualización que ilustra el número de muertes semanales que se espera (en azúl) en comparación con el número actual. Si hay más muertes que lo anticipado, el número actual sobrepasará la curva amarilla y conllevará un signo rojo de más (+). Puede comparar esta visualización con otras jurisdicciones de EEUU bajo \"Select a jurisdiction\".",
                  testDistribution:"Distribución de pruebas",
                  serological:"Serológica",
                  probableCasesLabel:"Casos positivos probables",
                  positiveCaseDistribution:"Distribución de casos positivos",
                  totalPositiveCasesLabel:"Casos positivos totales",
                  confirmed:"Confirm."
                  }
const LABELS_EN = {confirmedCases:"Confirmed positive cases",molecularTests:"Molecular Tests",serologicalTests:"Serological Tests",deaths:"Deaths",
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
                  last0daysText:"From the beginning",
                  timeRangeSelectionText:'Time range',
                  excessDeathsTableTitle:"Visualize weekly excess deaths ",
                  excessDeathsTableDescription:"",
                  testDistribution:"Test distribution",
                  serological:"Serological",
                  probableCasesLabel:"Probable positive cases",
                  positiveCaseDistribution:"Distribution of positive tests",
                  totalPositiveCasesLabel:"Total positive cases",
                  confirmed:"Confirmed"

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

export const getFigureWithTodaysCount = (color,label,figure,saludTimeSignature,newToday,locale) =>{
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
              <text>{`(+${formatInteger(newToday)}`} { `${locale === "es-pr" ? "hoy" : "today"})`}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  } else{
    return (<div style={{display:'flex',flexDirection:'column'}}>
              <text style={{fontSize: 45,fontWeight: 'bold',color:color}}>{number}</text>
              <text style={{color: 'grey'}}>{label}</text>
            </div>)
  }
}
