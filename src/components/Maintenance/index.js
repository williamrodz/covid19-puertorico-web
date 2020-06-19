import React from 'react';
import YoutubeBackground from 'react-youtube-background'
import logo from '../../full_logo.png'; // Tell webpack this JS file uses this image



export default function MaintenancePage(props) {

    return (
      <YoutubeBackground
        videoId={"iu-d5ysjR-c"}                /* default -> null */
        aspectRatio={"16:9"}            /* default -> "16:9" */
        overlay={null}                /* default -> null | e.g. "rgba(0,0,0,.4)" */
        nocookie={false}                 /* default -> false | sets host to https:/*www.youtube-nocookie.com to avoid loading Google's cookies */
        playerOptions={{loop:1,start:22}}          /* default -> {}  | https://developers.google.com/youtube/player_parameters*/
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
              ¡Estaremos de vuelta pronto!
            </text>
            <text style={{fontSize: 15}}>

            </text>
          </div>
          <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin: 50,color:"white",backdropFilter:"blur(5px) grayscale(1) contrast(3)",background: 'rgba(0,0,0,.6)',padding: 30}}>
            <text style={{fontSize: 30,fontWeight: 'bold'}}>
              We'll be back soon!
            </text>
            <text style={{fontSize: 15}}>
            </text>
          </div>

        </div>

      </YoutubeBackground>
    )
  }
