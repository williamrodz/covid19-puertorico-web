import React, { Component } from 'react';
import tableau from 'tableau-api';


class Test extends Component {
  componentDidMount() {
    this.initViz()
  }


  initViz() {
    const vizUrl = 'https://public.tableau.com/shared/6JD4G3286?:toolbar=n&:tabs=n&:display_count=n&:origin=viz_share_link&:embed=y';
    const vizContainer = this.vizContainer;
    let viz = new window.tableau.Viz(vizContainer, vizUrl)
  }


  render() {
    return (
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
        <h1>{this.props.title}</h1>
        <p style={{marginLeft: "15px",marginRight: "15px",textAlign: 'center',fontSize: "13px"}}>{this.props.description}</p>
        <div ref={(div) => { this.vizContainer = div }}>
        </div>
      </div>
    )
  }
}


export default Test;
