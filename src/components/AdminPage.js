import React, {useState,useEffect} from 'react';
import { Navbar,Button,Form,Modal} from 'react-bootstrap';
import { FirebaseContext } from './Firebase';


import {printObject } from './Common/index.js'


const AddNewEntryButton = (props) =>{
  var textLabel = ""
  if (props.type === "add-after"){
    textLabel = "+Add after"
  }
  else {
    textLabel = "+Add New Entry"
  }

  return (
    <Button style={{width: '80px',height: props.height}}variant="success" onClick={props.showModal}>{textLabel}</Button>
  )
}

const isDataFresh = async () =>{

  return fetch("https://us-central1-covid19puertorico-1a743.cloudfunctions.net/checkDataFresh")
  .then(data=>data.json())
  .then(data=>data.dataFresh)
  .catch(error=>false)
}

const DataFreshBlock = (props)=>{
  return (
    <Button variant={props.dataFresh ? 'success' : 'warning'}>{props.dataFresh ? "Today's data has been scraped" : "Data is stale"}</Button>
  )
}


const AdminNavbar = (props) =>{
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">COVID Tracker PR Admin Interface</Navbar.Brand>
        <DataFreshBlock dataFresh={isDataFresh()}/>
        <Form inline>
          <AddNewEntryButton showModal={props.showModal}/>
        </Form>
      </Navbar>
    )
}

const IndexBlock = (props) =>{
  return(
    <>
      <Button key={props.displayText}
      variant='warning'
      style={{width:"100%",height: props.height}}
      onClick={()=>props.selectAssignedIndex()}
      >
        <p>{props.displayText}</p>
      </Button>
    </>
  )
}

const IndexGrid = (props) =>{

  var indexBlocks = []
  for (var i = 0; i < props.dataObjects.length; i++) {
    let indexText = props.dataObjects[i][props.indexChoice]
    let number = i
    indexBlocks.push(<IndexBlock key={number} height={'50px'} displayText={indexText} selectAssignedIndex={() => props.selectIndex(number)}/>)
  }

  return (
    <div style={{width: '50%',height: "100%",overflowY:"scroll", }}>
      {indexBlocks}
    </div>
  )
}

const FieldSpot = (props) =>{
  return(
    <div key={props.fieldTitle} style={{display: 'flex',flexDirection: 'row',width: '100%'}}>
      <div style={{backgroundColor: '#34495e',color: "white",width: '50%',textAlign: 'right'}}>{props.fieldTitle}: </div>
      <div style={{backgroundColor: '#34495e',color: "green",width: '50%',textAlign:  'left',cursor:'pointer'}}>
        {props.fieldValue}
      </div>
    </div>
  )
}

const FieldBox = (props) =>{
  var fieldSpots = []

  let fieldTitles = Object.keys(props.dataObject)


  for (var i = 0; i < fieldTitles.length; i++) {
    let fieldTitle = fieldTitles[i]
    let fieldValue = props.dataObject[fieldTitle]
    fieldSpots.push(<FieldSpot key={fieldTitle} fieldTitle={fieldTitle} fieldValue={fieldValue}/>)
  }

  return(
    <div style={{width: "100%"}}>
      {fieldSpots}
    </div>
  )
}

const InspectionGrid = (props) =>{

return (
  <div style={{width: '50%',height: "100%",backgroundColor:'#34495e',color: 'white'}}>
    <h3>Inspecting data:</h3>
    {props.selectedDataObject ? <FieldBox dataObject={props.selectedDataObject}/> : <h1>Select an entry on the left to begin</h1>}
  </div>
)

}

const MainGrid = (props) =>{
  return (
    <div style={{display:'flex',flexDirection: 'row',justifyContent:'center',alignItems: 'center',textAlign: 'center',height: '100%'}}>
      <IndexGrid indexChoice={'timestamp'} dataObjects={props.dataObjects} selectIndex={props.selectIndex}/>
      <InspectionGrid selectedDataObject={props.dataObjects[props.selectedIndex]}/>
    </div>
  )
}
const FormField = (props) => {
  return (
    <Form.Group key={props.label} controlId="formBasicEmail">
      <Form.Label>{props.label}</Form.Label>
      <Form.Control onChange={props.onChange} placeholder={props.placeholder} />
    </Form.Group>
  )
}

const NewDataEntryModal = (props) =>{
  var formGroups = []

  let fields = Object.keys(props.lastEntry)
  for (var i = 0; i < fields.length; i++) {
    let field = fields[i]
    formGroups.push(
      <FormField key={field} label={field} defaultValue={props.lastEntry[field]} placeholder={props.lastEntry[field]}
        onChange={(event)=>props.updateField(field,event.target.value)}/>)
  }

  let currentHistoricalData = props.currentHistoricalData
  var optionsList = []
  for (var j = 0; j < currentHistoricalData.length; j++) {
    optionsList.push(<option key={j}>{j}</option>)
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Manually add COVID-19 Data</Modal.Title>
        </Modal.Header>
        <Form>
          {formGroups}
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>After index:</Form.Label>
            <Form.Control
              onChange={(event)=>props.updateField("AFTERINDEX",event.target.value)}
              as="select" defaultValue={currentHistoricalData.length - 1}>
              {optionsList}
            </Form.Control>
          </Form.Group>
        </Form>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>Close</Button>
          <Button variant="primary" type="submit" onClick={props.submitButton}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  )
}
const AdminPage = (props) =>{

  const [UIstate, setUIState] = useState({selectedIndex:null,dataObjects:[{fruit:"banana",color:"yellow"},{fruit:"sesame",color:"black"}]});
  const [modalVisible, setModal] = useState(false);
  const [newDataObject,setNewDataObject] = useState({});


  const fetchData = async ()=>{

    const historicalDataRef = await props.firebase.getHistoricalDataRef()
    if (historicalDataRef.exists){
      const historicalData = historicalDataRef.data().all
      setUIState({...UIstate,dataObjects:historicalData})
      return historicalData
    }
  }

  useEffect(() =>{
    fetchData()
// eslint-disable-next-line
  },[props.firebase])

  const addNewDataObject = async (indexOfReference, newDataObjectToAdd) =>{
    let currentHistoricalData = await fetchData()
    let before = currentHistoricalData.slice(0,indexOfReference+1)
    let after = currentHistoricalData.slice(indexOfReference+1)

    let newHistoricalData = before.concat(newDataObjectToAdd).concat(after)

    let editResult = await props.firebase.setHistoricalData(newHistoricalData)

    return editResult

  }

  const isInteger = (stringCandidate) =>{
    let DIGITS_STRING = "0123456789"
    for (var i = 0; i < stringCandidate.length; i++) {
      let char = stringCandidate[i]
      if (DIGITS_STRING.indexOf(char) === -1){
        return false
      }
    }
    return true
  }

  const updateField = (field,newValue) =>{
    var updatedNewObject = {...newDataObject}
    updatedNewObject[field] = isInteger(newValue) ? parseInt(newValue) : newValue
    console.log(`Updating: ${field},${newValue}`)
    setNewDataObject(updatedNewObject)
  }

  const submitModalButton = async () =>{
    let numberOfExistingObjects = UIstate.dataObjects.length
    let numberOfRequiredFields = Object.keys(UIstate.dataObjects[numberOfExistingObjects - 1]).length
    console.log("numberOfRequiredFields",numberOfRequiredFields)
    let currentFieldsFilled = Object.keys(newDataObject).length - 1
    console.log("currentFieldsFilled",currentFieldsFilled)

    let allFieldsReady = numberOfRequiredFields === currentFieldsFilled

    if (allFieldsReady){
      //submitModal
      let indexOfReference = newDataObject.AFTERINDEX
      let payload = newDataObject
      delete payload.AFTERINDEX

      let submission = await addNewDataObject(indexOfReference, payload)
      setModal(false)
      alert(`Submitted new data object\n${printObject(submission)}`)
    }
    else{
      alert("Not all fields have been filled")
    }
  }



  const selectIndex = (i)=>{
    setUIState({...UIstate,selectedIndex:i})
    }

  return (


    <div style={{width: '100%',height: '80%'}}>
      <AdminNavbar showModal={()=>setModal(true)}/>
      <MainGrid dataObjects={UIstate.dataObjects} selectedIndex={UIstate.selectedIndex} selectIndex={selectIndex}/>
      <NewDataEntryModal show={modalVisible} updateField={updateField} handleClose={()=>setModal(false)}
        lastEntry={UIstate.dataObjects[UIstate.dataObjects.length - 1]}
        currentHistoricalData={UIstate.dataObjects}
        submitButton={submitModalButton}/>
    </div>
  )
}

export default function(){
  return (
    <div className="appContainer">
      <FirebaseContext.Consumer>
        {firebase => <AdminPage firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
  )
}
