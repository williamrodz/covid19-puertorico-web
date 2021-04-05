import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

import { Switch, Route,BrowserRouter,Redirect } from 'react-router-dom';


import App from './components/App';
import ExcessDeaths from './components/ExcessDeathsPage';
// eslint-disable-next-line
import AdminPage from './components/AdminPage.js';
import API from './components/API';

import Firebase, {FirebaseContext} from './components/Firebase';

const RedirectToIdeathon = () => {window.location.href = 'https://www.prcovidideathon.com'; 
  return null;}

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        {/*<Route path="/admin" component={AdminPage}/>*/}
        <Route path="/hackathon" component={RedirectToIdeathon}/>
        <Route path="/challenge" component={RedirectToIdeathon}/>
        <Route path="/ideathon" component={RedirectToIdeathon}/>
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
