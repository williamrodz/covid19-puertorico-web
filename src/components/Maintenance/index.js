import React from 'react';
import YoutubeBackground from 'react-youtube-background'
import logo from '../../full_logo.png'; // Tell webpack this JS file uses this image



export default function MaintenancePage(props) {

    return (
      <YoutubeBackground
        videoId={"Dg49Dcw4MF8"}                /* default -> null */
        aspectRatio={"16:9"}            /* default -> "16:9" */
        overlay={null}                /* default -> null | e.g. "rgba(0,0,0,.4)" */
        nocookie={false}                 /* default -> false | sets host to https:/*www.youtube-nocookie.com to avoid loading Google's cookies */
        playerOptions={{loop:1,start:10}}          /* default -> {}  | https://developers.google.com/youtube/player_parameters*/
        onReady={null}                  /* default -> null | returns event with player object */
        onEnd={null}                    /* default -> null | returns event with player object */
        onPlay={null}                   /* default -> null | returns event with player object */
        onPause={null}                  /* default -> null | returns event with player object */
        onError={null}                  /* default -> null | returns event with player object */
        onStateChange={null}            /* default -> null | returns event with player object */
        onPlaybackRateChange={null}     /* default -> null | returns event with player object */
        onPlaybackQualityChange={null}  /* default -> null | returns event with player object */
        className="videoContainer"
      >
        <div style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-evenly'}}>
          <div style={{top:"10%",borderRadius: 30,display: "flex",}}>
            <img
            height='100px'
            src={logo} alt="Logo"  title="Logo COVID Tracker PR &copy; Lissette Rodríguez "/>
          </div>
        </div>
        <div className="maintenanceMessageContainer">
          <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin: 50,color:"white",backdropFilter:"blur(5px) grayscale(1) contrast(3)",background: 'rgba(0,0,0,.6)',padding: 30}}>
            <text style={{fontSize: 30,fontWeight: 'bold'}}>
              ¡Estaremos de vuelta esta tarde!
            </text>
            <text style={{fontSize: 15}}>
              Hoy, 11 de junio de 2020, el Departmento de Salud de Puerto Rico cambió el tipo de data que hace pública acerca los
              casos positivos de COVID-19 en la isla y estamos decidiendo como presentarla en contexto con la data ya existente.
              ¡Gracias por su paciencia!
            </text>
          </div>
          <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin: 50,color:"white",backdropFilter:"blur(5px) grayscale(1) contrast(3)",background: 'rgba(0,0,0,.6)',padding: 30}}>
            <text style={{fontSize: 30,fontWeight: 'bold'}}>
              We'll be back this afternoon!
            </text>
            <text style={{fontSize: 15}}>
              Today, June 11th, 2020, the Puerto Rico Department of Health changed the type of data it releases surrounding
              positive COVID-19 cases on the island. We are in the process of deciding how to best present it.
              Thank you for your patience!
            </text>
          </div>

        </div>

      </YoutubeBackground>
    )
  }
