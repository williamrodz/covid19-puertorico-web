import React, {useState,useEffect} from 'react';
import { Navbar,Button,Form,Modal} from 'react-bootstrap';
import { FirebaseContext } from './Firebase';



const AdminNavbar = (props) =>{
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">COVID Tracker PR Admin Interface</Navbar.Brand>
        <Form inline>
          <Button variant="success" onClick={props.showModal}>+Add New Entry</Button>
        </Form>
      </Navbar>
    )
}

const IndexBlock = (props) =>{
  return(
    <Button key={props.displayText}
    variant='warning'
    style={{width:"100%",height: '50px'}}
    onClick={()=>props.selectAssignedIndex()}
    >
      <p>{props.displayText}</p>
    </Button>
  )
}

const IndexGrid = (props) =>{

  var indexBlocks = []
  for (var i = 0; i < props.dataObjects.length; i++) {
    let indexText = props.dataObjects[i][props.indexChoice]
    let number = i
    indexBlocks.push(<IndexBlock key={number} displayText={indexText} selectAssignedIndex={() => props.selectIndex(number)}/>)
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
      <Form.Control placeholder={props.placeholder} />
    </Form.Group>
  )
}
const CustomModal = (props) =>{
  var formGroups = []

  let fields = Object.keys(props.lastEntry)
  for (var i = 0; i < fields.length; i++) {
    let field = fields[i]
    formGroups.push(<FormField label={field} placeholder={props.lastEntry[field]}/>)
  }

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Manually add COVID-19 Data</Modal.Title>
        </Modal.Header>
        <Form>
          {formGroups}
        </Form>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>Close</Button>
          <Button variant="primary" type="submit">
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


  console.log("Props are",props)
  const fetchData = async ()=>{

    const historicalDataRef = await props.firebase.getHistoricalData()
    console.log("FETCHING HISTORICAL DATA")
    var historicalDataFromFireBase = {}
    if (historicalDataRef.exists){
      const historicalData = historicalDataRef.data().all
      console.log("New data is ",historicalData)
      setUIState({...UIstate,dataObjects:historicalData})
    }
  }




  useEffect(() =>{
    fetchData()

  },[props.firebase])



  const selectIndex = (i)=>{
    setUIState({...UIstate,selectedIndex:i})
    }

  return (


    <div style={{width: '100%',height: '80%'}}>
      <AdminNavbar showModal={()=>setModal(true)}/>
      <MainGrid dataObjects={UIstate.dataObjects} selectedIndex={UIstate.selectedIndex} selectIndex={selectIndex}/>
      <CustomModal show={modalVisible} handleClose={()=>setModal(false)}
        lastEntry={UIstate.dataObjects[UIstate.dataObjects.length - 1]}/>
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
