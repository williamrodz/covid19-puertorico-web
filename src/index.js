import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

import { Switch, Route,BrowserRouter } from 'react-router-dom';


import App from './components/App';
import ExcessDeaths from './components/ExcessDeathsPage';
// eslint-disable-next-line
import AdminPage from './components/AdminPage.js';
import API from './components/API';
import HackathonPage from './components/HackathonPage.js'

import Firebase, {FirebaseContext} from './components/Firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        {/*<Route path="/admin" component={AdminPage}/>*/}
        <Route path="/hackathon" component={HackathonPage}/>
        <Route path="/excessDeaths" component={ExcessDeaths}/>
        <Route path="/api" component={API}/>
        <Route path="/" component={App}/>
      </Switch>

    </BrowserRouter>


  </FirebaseContext.Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
