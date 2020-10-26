import React,{useState} from 'react';
import '../index.css'


const themeDefinitions = {
    finanzas:"el covid-19 ha acelerado la transición del uso del efectivo a la moneda virtual. más y más comercios están aceptando métodos de pago electrónico, tal como el ath móvil.\
    muchos negocios establecidos han podido integrar tales sistemas fácilmente, pero comerciantes pequeños y más rudimentarios han sufrido más inercia.\
    ¿cómo apoyamos a los pequeños y medianos negocios durante el clima del covid? ¿como ofrecemos innovación a la vez de apoyar esos que no necesariamente pueden invertir en ella?",
    medioAmbiente:"con menos movimento de personas, \
    las emisiones de carbón han bajado y promovido la imagén de un ambiente más ecológicamente en balance.\
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
            <p onClick={()=>props.onClick('finanzas')} >finanzas</p>
            <p onClick={()=>props.onClick('medioAmbiente')}>medio ambiente</p>
            <p onClick={()=>props.onClick('educacion')}>educación virtual</p>
            <p onClick={()=>props.onClick('vacuna')}>vacuna y transición al futuro</p>
        </div>
    )
}

const HackathonPage = (props) => {

    const [selectedTopic, setTopic] = useState()

    return (
        <div className="flexColumn" style={{backgroundColor:'#22a6b3',padding:'40px',color:'white',fontFamily:'Monaco',height:'175%'}}>
            <p className="flexColumn typingTitle">
                <div className="typingAnimationFirst">Puerto Rico</div>
                <div className="typingAnimationFirst">COVID Hackathon</div>
            </p>
            <p className="fadeInSlow" style={{fontWeight:'bold'}}>¿qué es?</p>
            <p className="fadeInSlow">
            una actividad de 72 horas para fomentar el diálogo y la creación de soluciones nuevas para afrontar la crisis del covid-19 específicamente en Puerto Rico.
            durante tres días, participantes se unirán en equipos para desarrollar una solución para un tema designado. 
            al final, habrá la oportunidad de presentar dichas soluciones a un jurado a través de un ‘pitch’ de 5 minutos. 
            </p>
            <p className="fadeInSlow" style={{paddingTop:'20px'}}>los temas son:</p>
            <HackathonTopics className="fadeInSlow" onClick={setTopic}/>
            <p className={selectedTopic ? "fadeInFast" : ""}>{selectedTopic ? themeDefinitions[selectedTopic] : ""}</p>
            <p className="fadeInSlow" style={{fontWeight:'bold',paddingTop:'20px'}}>¿cómo inscribirse?</p>
            <p className="fadeInSlow">más información pronto</p>

        </div>
    )
}
export default HackathonPage