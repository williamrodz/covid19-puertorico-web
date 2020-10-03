import React,{useState,useEffect} from 'react';
import '../index.css';
import { FirebaseContext } from './Firebase';

import { Button, Form,} from 'react-bootstrap';


const APISignUpForm = (props) => {
    return (
    <>
        <div className='flexColumn' style={{width:'500px'}}>
            <h2 style={{top:'0px'}}>
                {props.signupForAPIText}
            </h2>
                {props.APIdescriptionText}          

        </div>
       
        <Form>     
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={(event)=>props.onChangeEmail((event.target.value))} />
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div style={{color:'red'}}>{props.errorMessage}</div>
            <Form.Control type="password" placeholder="Password" onChange={(event)=>props.onChangePassword((event.target.value))}
            onKeyPress={(target)=> {if (target.charCode===13){ props.onSignUpClick()}} }

            />
        </Form.Group>
        <Button variant="success" onClick={props.onSignUpClick}>
            Sign Up
        </Button>
        <div className='clickable' onClick={props.toggleLogInSignup}>{props.logInInsteadText}</div>
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
        <Form.Control type="password" placeholder="Password" onChange={(event)=>props.onChangePassword((event.target.value))}/>
    </Form.Group>
    <div style={{color:'red'}}>{props.errorMessage}</div>
    <Button variant="primary" onClick={props.onLogInClick}
        onKeyPress={(target)=> {if (target.charCode===13){ props.onLogInClick()}} }
    
    >
        Log In
    </Button>    
    <div className='clickable' onClick={props.toggleLogInSignup}>{props.signUpInsteadText}</div>
    </Form>        
    )
}

const LoggedInBlock = (props) =>{
    return(
        <div className='centeringContainer' style={{flexDirection:'column'}}>
            <h3>Loggen in as {props.displayName}</h3>
            <div className='clickable' onClick={props.signOutClick}>sign out</div>
            <div>Your API key is:</div>
            <div style={{background:'#bdc3c7',fontFamily:'"Courier New", Courier, monospace',borderRadius:10}}>{props.displayedAPIkey}</div>
        </div>
    )
}

const LogInOrSignUp = (props) =>{

    return(
        <>
          {  
            props.signUpVisible ? 
            <APISignUpForm {...props}/> :     
            <LogInForm {...props}/>
          }               
        </>
    )
}


const APIpage = (props)=>{

    const [locale,setLocale] = useState('en-us')
    const [loggedIn,setLoggedInStatus] = useState(false)
    const [signUpVisible, setSignUpVisible] = useState(true)
    const [emailInput, setEmailInput] = useState(null)
    const [passwordInput, setPasswordInput] = useState(null)
    const [displayedAPIkey, setDisplayedAPIkey] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect(()=>{
        console.log('Log in status changed')
        props.firebase.getAuthObject().onAuthStateChanged((user)=>{
            if (user){
                setLoggedInStatus(true)
                setDisplayedAPIkey(user.uid)
            } else{
                setLoggedInStatus(false)
            }
        })       
// eslint-disable-next-line
    },[])


    const registerEmailAndPassword = async () =>{
        let response = await props.firebase.createUserWithEmailAndPassword(emailInput,passwordInput)        

        if (response === 'auth/email-already-in-use'){
            setErrorMessage(textContent[locale].emailCollision)
        }
    }

    const signInWithEmailAndPassword = async ()=>{
        let response = await props.firebase.signInWithEmailAndPassword(emailInput,passwordInput)        

        if (response === 'auth/email-already-in-use'){
            
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


    let textContent = {
        'en-us':
        {
            signupforapikey:'Sign up for an API key',
            signupForAPIText:'Sign Up',
            APIdescriptionText:<div>Get daily and historic COVID-19 data from Puerto Rico.{<br/>}{<br/>}We scrape information from
                                Puerto Rico's Department of Health's official coronavirus statistics website every day.</div>,
            emailCollision:'A user already exists with that email address',
            signUpInsteadText:'Sign up instead',
            logInInsteadText:'Log in instead',


        },
        'es-pr':
        {
            signupforapikey:'Regístrate para usar nuestro API',
            signupForAPIText:'Registar',
            APIdescriptionText:<div>Obtenga data diaria e histórico del COVID-19 en Puerto Rico.{<br/>}{<br/>} Sacamos nuestra información
                                usando algoritmos que accesan la página oficial de coronavirus del Departmento de Salud de Puerto Rico.</div>,          
            emailCollision:'Ya existe una cuenta con ese email',
            signUpInsteadText:'Registrarse en vez',
            logInInsteadText:'Hacer log in en vez'

        }
    }

    return(
        <div className='fullSpaceContainer centeringContainer coolGradient flexColumn' style={{justifyContent:'space-evenly'}}>
            <div style={{position:'absolute',width: '20px', top:'5px',right:'20px', display:'flex',alignItems:'space-evenly'}}>
                <div className='clickable' onClick={()=>setLocale('en-us')}>en</div><div className='clickable' onClick={()=>setLocale('es-pr')}>es</div>
            </div>
            <h1>COVID Tracker PR</h1>
            <div className='centeringContainer'>
                { loggedIn ? 
                    <LoggedInBlock apiKey='12345' displayName='Bananas'signOutClick={signOutClick} displayedAPIkey={displayedAPIkey}
                    />
                    :
                    <LogInOrSignUp onSignUpClick={registerEmailAndPassword}
                    signupForAPIText={textContent[locale].signupforapikey}
                    APIdescriptionText={textContent[locale].APIdescriptionText}
                    onLogInClick={signInWithEmailAndPassword}
                    onChangeEmail={setEmailInput} onChangePassword={setPasswordInput}
                    errorMessage={errorMessage} signUpVisible={signUpVisible}
                    toggleLogInSignup={toggleLogInSignup}
                    logInInsteadText={textContent[locale].logInInsteadText}
                    signUpInsteadText={textContent[locale].signUpInsteadText}
                    
                    />
                    }           
            </div>
            
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