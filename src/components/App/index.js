import React from 'react';
import { FirebaseContext } from '../Firebase';

//import HomePage from '../Home';
import MaintenancePage from '../Maintenance';


const App = () => (
    <div className="appContainer">
      <FirebaseContext.Consumer>
        {firebase => <MaintenancePage firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
);
export default App;
