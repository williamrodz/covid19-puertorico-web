import React,{useState} from 'react';
import { Button } from 'react-bootstrap';
import '../index.css'
import piloto151logo from '../sponsors/piloto151.png'

const BACKGROUND_COLOR = "#22a6b3";

const themeDefinitions = {
    saludPublica:"el covid-19 ha sido una clara crisis de salud. \
    algunos paises han podido mitigar las crisis, como en Singapúr y Corea del Sur,\
    donde antecedentes pasados con viruses como el SARS han establecido memoria institucional.\
    Sin embargo, en Puerto Rico consistentemente estamos sobrepasando récords de contagios. \
    ¿qué debemos hacer diferente?",
    finanzas:"el covid-19 ha acelerado la transición del uso del efectivo a la moneda virtual. más y más comercios están aceptando métodos de pago electrónico, tal como el ath móvil.\
    muchos negocios establecidos han podido integrar tales sistemas fácilmente, pero comerciantes pequeños y más rudimentarios han sufrido más inercia.\
    ¿cómo apoyamos a los pequeños y medianos negocios durante el clima del covid? ¿como ofrecemos innovación a la vez de apoyar esos que no necesariamente pueden invertir en ella?",
    medioAmbiente:"con menos movimento de personas, \
    las emisiones de carbón han bajado, promoviendo la imagén de un ambiente más ecológicamente en balance.\
    sin embargo, se he desatado una explosión en el uso de plásticos y materiales de un solo uso.\
    restaurantes que han podido sobrevivir la crisis lo han hecho en gran parte al usar toneladas colectivas de envases plásticos o de styroforam.\
    éstos luego terminan llenando vertederos en la isla.\
    ¿cómo los restaurantes pueden inteligentemente realizar ordenes sin plásticos de un sólo uso? ¿cómo podemos incentivar el reciclaje o la composta y salvaguardar el manejo seguro de materiales potencialmente infectados? ",
    educacion:"el salón de clase se ha convertido de un cuarto de escritorios a un cuadro de un monitor.\
    en muchos casos no hay ni monitor por falta de recursos económicos en la casa ya que una madre o padre haya perdido su trabajo por la pandemia.\
    soluciones como televisar clases en canales locales han ayudado, pero queda claro que la pandemia ha subrayado disparidades existentes en el sistema de educación en Puerto Rico.\
    ¿cómo modernizamos el sistema educativo público? ¿Como entrenamos maestros para entregar experiencias educativos cohesivas?\
    ¿cuál es el mejor uso de los recursos del departamento de educación en estos tiempos?",
    vacuna:"de haber una vacuna contra el COVID-19 acreditada por la comunidad científica y lista para distribución, ¿cómo será distribuida al pueblo puertorriqueño? \
    poca vez en la historia se ha distribuido recursos al tal escala. ¿cómo deberán deben reaccionar lugares públicos? \
    ¿será necesario públicamente certificar recepción de la vacuna? \
    ¿cómo nos moveremos adelante como sociedad en tal punto crítico manteniendo protecciones en salud pública hacia grupos más frágiles?"
}


const HackathonTopics = (props) =>{
    return(
        <div className={`${props.className} flexRow listOfTopics`} style={{fontWeight:'bold',cursor:'pointer',justifyContent:'space-evenly'}}>
            <p onClick={()=>props.onClick('saludPublica')} >{'<'}salud pública{'>'}</p>            
            <p onClick={()=>props.onClick('finanzas')} >{'<'}finanzas{'>'}</p>
            <p onClick={()=>props.onClick('medioAmbiente')}>{'<'}medio ambiente{'>'}</p>
            <p onClick={()=>props.onClick('educacion')}>{'<'}educación virtual{'>'}</p>
            <p onClick={()=>props.onClick('vacuna')}>{'<'}vacuna y transición al futuro{'>'}</p>
        </div>
    )
}

const SponsorsSection = (props) =>{
    return(
        <div className="flewColumn">
            <div style={{fontSize:15,fontWeight:'bold',marginTop:10}}>auspiciado por:</div>
            <div className="flewRow">
                <img alt="Piloto 151" src={piloto151logo}/>
            </div>
        </div>
    )
}

const MainSection = (props) => {

    return (
        <div className='fadeInSlow' style={{fontWeight:'14px'}}>
            <p style={{fontWeight:'bold'}}>¿qué es?</p>
            <p>
            una actividad de 48 horas para fomentar el diálogo y la creación de soluciones nuevas para afrontar la crisis del covid-19 específicamente en Puerto Rico.
            durante tres días, participantes se unirán en equipos para desarrollar una solución para un tema designado. 
            al final, habrá la oportunidad de presentar dichas soluciones a un jurado a través de un ‘pitch’ de 5 minutos. 
            </p>
            <p  style={{paddingTop:'20px'}}>los temas son:</p>
            <HackathonTopics  onClick={props.setTopic}/>
            <p style={{fontWeight:'bold'}}>¿quién puede participar?</p>
            <p>
                todos están bienvenidos a participar: estudiantes de cualquier nivel, profesionales, y todo entre medio.
            </p>                     
            <p  className={props.selectedTopic ? "fadeInFast" : ""}>{props.selectedTopic ? themeDefinitions[props.selectedTopic] : ""}</p>
            <div style={{display:'flex',flexDirection:'column',width:311,marginTop:45}}> 
                <Button variant="light" style={{marginBottom:10}}>inscripcción: pronto</Button>
                <Button href="https://forms.gle/Xufow2mBWq8KkAdB9" variant="light" style={{marginBottom:10}} >participar como mentor</Button>
                <Button href="https://forms.gle/LdApmtBiPaKWjmaa8" variant="light" style={{marginBottom:10}}>auspiciar evento</Button>  
            </div>
            <SponsorsSection/>              

        </div>
    )
}


const HackathonPage = (props) => {

    const [selectedTopic, setTopic] = useState()

    return (
        <div className="flexColumn" style={{backgroundColor:BACKGROUND_COLOR,padding:'40px',color:'white',fontFamily:'Monaco',height:'228%'}}>
            <p className="flexColumn typingTitle">
                <div className="typingAnimationFirst">Puerto Rico</div>
                <div className="typingAnimationFirst">COVID Ideathon</div>
            </p>
            <MainSection setTopic={setTopic} selectedTopic={selectedTopic}/>
        </div>
    )
}
export default HackathonPage