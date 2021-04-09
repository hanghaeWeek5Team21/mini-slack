import React from 'react';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configureStore';
import Test from '../pages/Test';

function App() {
  return (
    <>
      <ConnectedRouter history={history}>
        <Route path='/test' component={Test} />
      </ConnectedRouter>
      good
    </>
  );
}

export default App;
