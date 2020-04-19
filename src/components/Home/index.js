import React, {Component} from 'react';

import { FirebaseContext } from '../Firebase';

class Home extends Component{
  constructor(props){
    super(props)
    console.log("PRops are")
    console.log(props)
  }

  async componentDidMount(){
    var todaysData = await this.props.firebase.getTodaysData()
    if (todaysData.exists){
        var data = todaysData.data()
        this.setState({
        conductedTests:data.conductedTests,
        confirmedCases:data.confirmedCases,
        deaths:data.deaths,
        negativeCases:data.negativeCases,
        testsInProgress:data.testsInProgress,
        timestamp:data.timestamp,
        saludTimeSignature:data.saludTimeSignature,
      })
    } else{
      console.log("Data for today does not exist")
    }
    const historicalDataRef = await this.props.firebase.getHistoricalData()
    if (historicalDataRef.exists){
      const historicalData = historicalDataRef.data().all
      this.setState({historicalData:historicalData})
    }
}

  render (){
    return (
      <div>
        <h1>Home</h1>

      </div>
    );
  }

}
export default Home;
