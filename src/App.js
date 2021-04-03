// import logo from './logo.svg';
import React from 'react';

import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.min.css';
import ListPage from './listpage';
import DetailPage from './detailpage';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//       </header>
//       <AmplifySignOut />

//     </div>
//   );
// }


class App extends React.Component {

  render(){
    return (
      <div className="App">
        <div>
        <Router>
        <Switch>
            <Route exact={true} path='/' component={ListPage}/>
            <Route exact={true} path='/detailpage' component={DetailPage}/>
        </Switch>
        </Router>
        </div>      
      {/* <AmplifySignOut /> */}
    </div>

  )};
}




// export default App;
export default withAuthenticator(App);

