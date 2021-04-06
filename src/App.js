import React from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
//import { AmplifySignOut } from '@aws-amplify/ui-react';
//import { Auth } from 'aws-amplify';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListPage4 from './listpage4';
import ListPage5 from './listpage5';
import DetailPage from './detailpage';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/' component={ListPage4}/>
            <Route exact={true} path='/listpage4' component={ListPage4}/>
            <Route exact={true} path='/listpage5' component={ListPage5}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
        </Switch>
        </Router>
        </div>      
      {/* <AmplifySignOut /> */}
    </div>

  )};
}

export default withAuthenticator(App);

