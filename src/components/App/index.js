import React from 'react';
import { FirebaseContext } from '../Firebase';

import HomePage from '../Home';

const App = () => (
    <div>
      <FirebaseContext.Consumer>
        {firebase => <HomePage firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
);
export default App;
