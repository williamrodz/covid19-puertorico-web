import React,{useState,useEffect} from 'react';
import '../index.css';
import { FirebaseContext } from './Firebase';
import Navigation from './NavigationBar'

import {LoveStatement,CoffeeButton} from './Common'

import { Button, Form,} from 'react-bootstrap';


const ES_LOCALE = 'es-pr'
const EN_LOCALE = 'en-us'


const APISignUpForm = (props) => {
    return (
    <>
        <div className='flexColumn' style={{width:'500px'}}>
            <h2 style={{padding:'40px'}}>
                {props.textContent[props.locale].signupforapikey}
            </h2>
                {props.textContent[props.locale].APIdescriptionText}          

        </div>
       
        <Form style={{paddingTop:'20px'}}>     
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder={props.textContent[props.locale].enterEmailText} onChange={(event)=>props.onChangeEmail((event.target.value))} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
            <Form.Label>{props.textContent[props.locale].passwordText}</Form.Label>
            <div style={{color:'red'}}>{props.errorMessage}</div>
            <Form.Control type="password" placeholder={props.textContent[props.locale].passwordText} onChange={(event)=>props.onChangePassword((event.target.value))}
            onKeyPress={(target)=> {if (target.charCode===13){ props.onSignUpClick()}} }

            />
        </Form.Group>
        <Button variant="success" onClick={props.onSignUpClick}>
            {props.textContent[props.locale].signupForAPIText}
        </Button>
        <div className='clickable' onClick={props.toggleLogInSignup}>{props.textContent[props.locale].logInInsteadText}</div>
        </Form>
    </>     
    )
}


const LogInForm = (props) => {
    return (
    <Form>       
    <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={(event)=>props.onChangeEmail((event.target.value))} />
    </Form.Group>
    <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={(event)=>props.onChangePassword((event.target.value))}
        onKeyPress={(target)=> {if (target.charCode===13){ props.onLogInClick()}} }        
        />
    </Form.Group>
    <div style={{color:'red'}}>{props.errorMessage}</div>
    <Button variant="primary" onClick={props.onLogInClick} >
        Log In
    </Button>
    <div className='clickable' onClick={props.resetPasswordWithEmail}>{props.textContent[props.locale].resetPassword}</div>
    <div className='clickable' onClick={props.toggleLogInSignup}>{props.textContent[props.locale].signUpInsteadText}</div>
    </Form>        
    )
}

const LoggedInBlock = (props) =>{
    return(
        <div className='centeringContainer' style={{flexDirection:'column'}}>
            <h6 style={{position:'absolute',top:'1px',left:'20px',color:'white'}}>{props.textContent[props.locale].loggedInAsText} {props.displayName}</h6>
            <h5 style={{position:'absolute',top:'5px',right:'20px',color:'white'}} className='clickable' onClick={props.signOutClick}>{props.textContent[props.locale].logoutText}</h5>
            <h5>{props.textContent[props.locale].yourApiKeyIsText}</h5>
            <div style={{background:'#bdc3c7',fontFamily:'"Courier New", Courier, monospace',borderRadius:10}}>{props.displayedAPIkey}</div>
        </div>
    )
}

const LogInOrSignUp = (props) =>{

    return(
        <div className='flexRow'style={{padding:'80px',}}>
          {  
            props.signUpVisible ? 
            <APISignUpForm {...props}/> :     
            <LogInForm {...props}/>
          }               
        </div>
    )
}

const APIExample = (props)=>{
    var JSONcontent = [
    <div className='flexRow '>"status":"OK",</div>,
    <div className='flexRow '>"data":{'{'}</div>
        ]

    let todaysDataKeys = Object.keys(props.todaysData)
    
    todaysDataKeys.forEach(key => {
        const div = (
        <div key={key} className='flexRow'>
            {' "'}{key}":"{props.todaysData[key]}"
        </div>)
        JSONcontent.push(div)
    }); 


    return(
        <div className='centeringContainer flexColumn' style={{backgroundColor:'#2980b9',color:'white',fontFamily:'Courier New',fontWeight:'bold',borderRadius:'15px'}}>
            <div className='flexRow centeringContainer'>GET https://www.covidtrackerpr.com/api/<div style={{color:'white'}}>getTodaysData</div>?key=<div style={{color:'red'}}>{'<YOURKEY>'}</div></div>
            <div className='flexColumn'>
                <div className='flexRow centeringContainer'>{'{'}</div>
                {JSONcontent}
                <div className='flexRow centeringContainer'>{'}'}</div>
                <div className='flexRow centeringContainer'>{'}'}</div>
            </div>

        </div>
    )
}



const DefinitionsSection = (props) =>{
    let definitions = 
    [{
        dataLabel:'molecularPositive',
        explanation:props.textContent[props.locale].molecularPositiveDefinitionText,
    },
    {
        dataLabel:'serologicalPositive',
        explanation:props.textContent[props.locale].serologicalPositiveDefinitionText,
    },
    {
        dataLabel:'totalPositive',
        explanation:props.textContent[props.locale].totalPositiveDefinitionText,
    },
    {
        dataLabel:'deaths',
        explanation:props.textContent[props.locale].deathsDefinitionText,
    },
    {
        dataLabel:'timestamp',
        explanation:props.textContent[props.locale].timestampDefinitionText,
    },
    {
        dataLabel:'saludTimeSignature',
        explanation:props.textContent[props.locale].saludTimeSignatureDefinitionText,
    }                                        
    ]

    var definitionDivs = []
 
    definitions.forEach(definition=>{
    let div =
    <div key={definition.dataLabel} className='flexColumn' style={{paddingTop:'20px'}}>
        <strong>{definition.dataLabel}</strong>{definition.explanation}
    </div>
    definitionDivs.push(div);
    })

    return(
        <div className='flexColumn' style={{width:'70%',paddingBottom:'30px'}}>
            <h3>{props.textContent[props.locale].definitionText}</h3>
            {definitionDivs}
        </div>
    )
}

const DescriptionSection = (props) =>{
    return (
    <div className='flexColumn'>
        <h3>{props.textContent[props.locale].getStartedText}</h3>
        <div className='flexColumn'>
            <APIExample todaysData={props.todaysData}/>
            <ul className='flexColumn' style={{textAlign:'left',padding:'20px'}}>
                <h5>Methods:</h5>
                <li><strong style={{color:'#007bff'}}>getTodaysData</strong>: {props.textContent[props.locale].getTodaysDataDescription}</li>
                <li><strong style={{color:'#007bff'}}>getHistoricalData</strong>: {props.textContent[props.locale].getHistoricalDataDescription}</li>                             
            </ul>
            <ul className='flexColumn' style={{textAlign:'left',padding:'20px'}}>
                <h5>Parameters:</h5>
                <li><strong>key</strong>: {props.textContent[props.locale].keyDescriptionText}</li>
            </ul>
        </div>
    </div>)
}


const APIpage = (props)=>{

    const [locale,setLocale] = useState(EN_LOCALE)
    const [loggedIn,setLoggedInStatus] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(true)
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [userDisplayName,setuserDisplayName] = useState(null)
    const [displayedAPIkey, setDisplayedAPIkey] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [todaysData,setTodaysData] = useState('')


    useEffect(()=>{
        console.log('Log in status changed')
        props.firebase.getAuthObject().onAuthStateChanged((user)=>{
            if (user){
                setLoggedInStatus(true)
                setDisplayedAPIkey(user.uid)
                setuserDisplayName(user.email)
                setErrorMessage('')
            } else{
                setLoggedInStatus(false)
            }
        })       
// eslint-disable-next-line
    },[])

    const getTodaysData = async ()=>{
        let aujourdhui = await props.firebase.getTodaysData()
        setTodaysData(aujourdhui)
    } 

    useEffect(
        ()=>{
            getTodaysData()
// eslint-disable-next-line
        },[])


    const registerEmailAndPassword = async () =>{
        let responseCode = await props.firebase.createUserWithEmailAndPassword(emailInput,passwordInput)        

        if (responseCode === 'auth/email-already-in-use'){
            setErrorMessage(textContent[locale].emailCollision)
        }
        else if (responseCode === 'auth/invalid-email'){
            setErrorMessage(textContent[locale].invalidEmail)
        }      
        else if (responseCode === 'auth/weak-password'){
            setErrorMessage(textContent[locale].weakPassword)
        }               
    }

    const signInWithEmailAndPassword = async ()=>{
        let responseCode = await props.firebase.signInWithEmailAndPassword(emailInput,passwordInput)        

        if (responseCode === 'auth/wrong-password'){
            setErrorMessage('The password is invalid or the user does not have a password.')
        }
        else if (responseCode === 'auth/invalid-email'){
            setErrorMessage(textContent[locale].invalidEmail)
        }        
    }

    const signOutClick = async() => {
        console.log("Signing out...")
        return await props.firebase.signOut()
    }

    const toggleLogInSignup = () =>{
        setErrorMessage('')
        setSignUpVisible(!signUpVisible)
    } 

    const resetPasswordWithEmail = async ()=>{
        let response = await props.firebase.sendPasswordResetEmail(emailInput)

        if (response ==='emailResetSent'){
            setErrorMessage(textContent[locale].emailResetLinkSent)
        }
    }


    let textContent = {
        'en-us':
        {   
            enterEmailText:'Enter email here...',
            passwordText:'Password',
            signupforapikey:'Sign up for an API key',
            signupForAPIText:'Sign Up',
            parametersText:'Parameters',
            keyDescriptionText:"Your API key that's created when you sign up.",
            timeframeDescriptionText:<>Whether you want to get today's data or a list of historical data. Options: <strong>today</strong> or <strong>historical</strong></>,
            APIdescriptionText:<div>Get daily and historic COVID-19 data from Puerto Rico.{<br/>}{<br/>}We scrape information from
                                Puerto Rico's Department of Health's official coronavirus statistics website every day.</div>,
            emailCollision:'A user already exists with that email address',
            signUpInsteadText:'Sign up instead',
            logInInsteadText:'Log in instead',
            loggedInAsText:'Logged in as',
            logoutText:'Log out',
            yourApiKeyIsText:'Your API key is:',
            getStartedText:'Get Started',
            definitionText:'Data Definitions',
// eslint-disable-next-line
            molecularPositiveDefinitionText:'The number of unique positive cases of COVID-19 in Puerto Rico from reverse transcription polymerase chain reaction (RT-PCR) tests.\
                These test for the presence of COVID-19 viruses replicating their genetic information in the body. The Puerto Rico Department of Health refers to these as "confirmed" cases.',
// eslint-disable-next-line
            serologicalPositiveDefinitionText:'The number of unique positive cases of COVID-19 in Puerto Rico from serology tests.\
                These test for the presence of antibodies that respond to COVID-19 in the body, therefore identifying a reaction to a COVID-19 characteristic virus. \
                The Puerto Rico Department of Health refers to these as "probable" or "likely" cases.',
            totalPositiveDefinitionText:'The sum of the number of unique positive cases by both RT-PCR and serology tests in Puerto Rico.',
            deathsDefinitionText:'The number of deaths attributed to patients who tested positive to COVID-19 in Puerto Rico.',
            timestampDefinitionText:'The timestamp of when our system automatically scraped the COVID-19 statistics for that day.',
            saludTimeSignatureDefinitionText:'The date statement the Puerto Rico Department of Health supplies below the source of its COVID-19 data we use.',
            invalidEmail:'The written email is incorrectly formatted.',
            weakPassword:'Password should be at least 6 characters',
            wrongPassword:'The password is invalid or the user does not have a password.',
            resetPassword:'Forgot my password',
            emailResetLinkSent:'An link to reset your password has been sent to your email.',
            getTodaysDataDescription:'Returns a JSON describing with COVID-19 data for the day the API is called.',
            getHistoricalDataDescription:'Returns a JSON with a list of objects with data since the first positive case in Puerto Rico. ',


        },
        'es-pr':
        {
            enterEmailText:'Entre su email aquí...',
            passwordText:'Contraseña',            
            signupforapikey:'Regístrate para usar nuestro API',
            signupForAPIText:'Registar',
            parametersText:'Parámetros',
            keyDescriptionText:"Tu clave de API que te creamos cuando te registras.",
            timeframeDescriptionText:<>Si quieres la data de hoy o una lista cronológica. Opciones: <strong>today</strong> o <strong>historical</strong>, respectivamente.</>,            
            APIdescriptionText:<div>Obtenga data diaria e histórica del COVID-19 en Puerto Rico.{<br/>}{<br/>} Sacamos nuestra información
                                usando algoritmos que accesan la página oficial de coronavirus del Departmento de Salud de Puerto Rico.</div>,          
            emailCollision:'Ya existe una cuenta con ese email',
            signUpInsteadText:'Registrarse en vez',
            logInInsteadText:'Hacer log in en vez',
            loggedInAsText:'Logged in como',
            logoutText:'Deslogearse',
            yourApiKeyIsText:'Tu credencial de API es:',
            getStartedText:'Empieza a usarlo',
            definitionText:'Definiciones de datos',
// eslint-disable-next-line
            molecularPositiveDefinitionText:'El número de casos únicos positivos de COVID-19 en Puerto Rico según notado por una prueba de la reacción en cadena de polimerasa con transcripción inversa (RT-PCR, por sus siglas en inglés). \
            Esta prueba analiza la presencia del virus COVID-19 replicando su información genética en el cuerpo. El Departamento de Salud de Puerto Rico se refiere a estos como casos "confirmados".',
// eslint-disable-next-line            
            serologicalPositiveDefinitionText:'El número de casos únicos positivos de COVID-19 en Puerto Rico a partir de pruebas serológicas. \
            Estas pruebas identifican la presencia de anticuerpos que responden al COVID-19 en el cuerpo, por lo tanto, identifican una reacción característica al COVID-19. \
            El Departamento de Salud de Puerto Rico se refiere a estos como casos "probables"',
            totalPositiveDefinitionText:'La suma del número de casos positivos únicos tanto por RT-PCR como por pruebas serológicas en Puerto Rico.',
            deathsDefinitionText:'El número de muertes atribuidas a pacientes que tuvieron una prueba positiva al COVID-19 por cualquiera de las dos pruebas en Puerto Rico ',
            timestampDefinitionText:'La marca de tiempo en cuando nuestro sistema automáticamente obtuvo las estadísticas de COVID-19 para ese día.',
            saludTimeSignatureDefinitionText:'La declaración de fecha que el Departamento de Salud de Puerto Rico suministra por debajo de los datos de COVID-19 de donde obtenemos su data.',  
            invalidEmail:'El email ingresado está en un formato inválido.',
            weakPassword:'La contraseña debe más de 6 caracteres.',
            wrongPassword:'La contraseña es inválida o no existe tal registro con este email.',
            resetPassword:'Me olvidé mi contraseña',
            emailResetLinkSent:'Un enlace para reestablecer tu contraseña se ha enviado a su email.',
            getTodaysDataDescription:'Devuelve un JSON con la data de COVID-19 data para el día en que el API es accesado.',
            getHistoricalDataDescription:'Devuelve un JSON con una lista de objetos desde el día del primer caso positivo en Puerto Rico.',
                        
        }
    }

    return(
        <div className='centeringContainer coolGradient flexColumn' style={{justifyContent:'space-evenly',width:'100%'}}>
            <Navigation locale={locale} clickSpanishButton={()=>setLocale(ES_LOCALE)} clickEnglishButton={()=>setLocale(EN_LOCALE)}/>
            <div style={{display:'flex',flexDirection:'row',textAlign:'center',justifyContent:'space-around',width:'412px',paddingTop:'20px'}}>
                <h1>COVID Tracker PR </h1><h1 style={{color: '#007bff'}}>API</h1>
            </div>
            <div className='centeringContainer'>
                { loggedIn ? 
                    <LoggedInBlock locale={locale} textContent={textContent} displayName={userDisplayName} signOutClick={signOutClick} displayedAPIkey={displayedAPIkey}
                    />
                    :
                    <LogInOrSignUp 
                    locale={locale}
                    textContent={textContent}
                    onSignUpClick={registerEmailAndPassword}
                    onLogInClick={signInWithEmailAndPassword}
                    onChangeEmail={setEmailInput} onChangePassword={setPasswordInput}
                    errorMessage={errorMessage} signUpVisible={signUpVisible}
                    toggleLogInSignup={toggleLogInSignup}
                    resetPasswordWithEmail={resetPasswordWithEmail}                
                    />
                    }
            </div>
            <DescriptionSection locale={locale} textContent={textContent} todaysData={todaysData}/>     
            <DefinitionsSection locale={locale} textContent={textContent}/>
            <CoffeeButton/>            
            <LoveStatement style={{fontSize: 13,paddingTop: 10,paddingBottom:20}} locale={locale}/>
            
        </div>
    )
}

const APIpageWithFirebase = (props) =>{
    return (
        <FirebaseContext.Consumer>
            {firebase => <APIpage firebase={firebase} />}
        </FirebaseContext.Consumer>
    )
}

export default APIpageWithFirebase