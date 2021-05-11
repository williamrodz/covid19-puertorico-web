import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import '../vaccineBlocks.css'

function formatVaccinationData(rawHistoricalData){
    let timeSeriesData =  rawHistoricalData
    let administeredDosesTimeSeries = getNivoDataObject(timeSeriesData,'administeredDoses')
    let peopleWithAtLeastOneDoseTimeSeries = getNivoDataObject(timeSeriesData,'peopleWithAtLeastOneDose')
    let peopleWithTwoDosesTimeSeries = getNivoDataObject(timeSeriesData,'peopleWithTwoDoses')
    return [
        {
            "id": "Dosis adminstradas",
            "color": "hsl(160, 70%, 50%)",
            "data": administeredDosesTimeSeries            
        },
        {
            "id": "Personas on 1 dosis",
            "color": "hsl(189, 70%, 50%)",
            "data": peopleWithAtLeastOneDoseTimeSeries            
        },        
        {
            "id": "personas con ambas dosis ",
            "color": "hsl(41, 70%, 50%)",
            "data": peopleWithTwoDosesTimeSeries            
        },         

    ]
}

function getNivoDataObject(timeSeries,feature){
    if (!timeSeries){ return null};

    var xyList = []
    timeSeries.map((values,i)=>{
        xyList.push({"x":i,"y":values[feature]})
    })

    return xyList;
}



  const MyResponsiveLine = (props) => {
    
    
    const toolTipElement = (tooltipProps) => {


        return (
          <div className="toolTipElement">
            <div style={{margin:5}}>
              <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center'}}>
                <div style={{backgroundColor: tooltipProps.point.serieColor,borderRadius: '5px',height: '1.5vw',width: '1.5vw',margin: "5px"}}/>
                <div>{tooltipProps.point.serieId}:<span style={{fontWeight: 'bold'}}> {tooltipProps.point.data.y}</span></div>
              </div>
              <div style={{textAlign: 'right',display: 'flex',flexDirection: 'row-reverse'}}>
                {/* <span style={{fontWeight: 'bold'}}><span style={{color:'white'}}>_</span>{tooltipProps.point.data.x}</span>
                <div><span>{props.xAxisLabel}:</span></div> */}
    
              </div>
            </div>
          </div>)
    };
    
    return (
    <ResponsiveLine
        data={props.data ? formatVaccinationData(props.data) : console.log(`time series not available`)}
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'fecha',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Personas vacunadas',
            legendOffset: -50,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        crosshairType="bottom"
        tooltip={toolTipElement}

        // legends={[
        //     {
        //         anchor: 'bottom-right',
        //         direction: 'column',
        //         justify: false,
        //         translateX: 100,
        //         translateY: 0,
        //         itemsSpacing: 0,
        //         itemDirection: 'left-to-right',
        //         itemWidth: 80,
        //         itemHeight: 20,
        //         itemOpacity: 0.75,
        //         symbolSize: 12,
        //         symbolShape: 'circle',
        //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
        //         effects: [
        //             {
        //                 on: 'hover',
        //                 style: {
        //                     itemBackground: 'rgba(0, 0, 0, .03)',
        //                     itemOpacity: 1
        //                 }
        //             }
        //         ]
        //     }
        // ]}
    />)
    }


const VaccinationGraph = (props) =>{

    const [historicalData,setHistoricalData] = useState();

    useEffect(()=>{
        const fetchData = async () => {
            let timeSeriesRetrieval = await props.firebase.getHistoricalVaccinationData()
            if (timeSeriesRetrieval.exists){
                console.log("timeSeriesRetrieval",timeSeriesRetrieval);
                let timeSeriesData = timeSeriesRetrieval.data().all;
                console.log("timeSeriesData",timeSeriesData);
                setHistoricalData(timeSeriesData);                
            }
            else{
                alert('nope')
            }

        }
        fetchData();
    },[])




    return(
        <div className="statsBlock vaccination-graph">
          <span className="vaccination-graph-title">Vacunación en PR</span>
          <MyResponsiveLine data={historicalData ? (historicalData) : []}/>           
        </div>
    )
}

export default VaccinationGraph;