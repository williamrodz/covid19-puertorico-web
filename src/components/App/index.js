import React from 'react';
import { BrowserRouter as Router,Route } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

import Navigation from '../Navigation';
import HomePage from '../Home';

import * as ROUTES from '../../constants/routes';

const App = () => (
    <div>
      <FirebaseContext.Consumer>
        {firebase => <HomePage firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
);
export default App;
