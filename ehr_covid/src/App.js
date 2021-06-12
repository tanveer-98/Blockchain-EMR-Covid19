
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home";
import Admin from "./components/Admin_page";
import Patient from "./components/patient.js";
// import { Link } from "react-router-dom";

import contract from './contract';
import React from 'react';

class App extends React.Component {
  state={
    manager:'',
    patients:[],
    message:''
  }

  async componentDidMount() {
    //this part is automatically called once the app is loaded to the screen
    //this is the first part to load
    const manager = await contract.methods.Viewadmin().call();
    //for meta mask we dont need to add a from: address into the call method
    //like we did in the lottery.test.js
    const registered_patients = await contract.methods.getRegisteredPatients().call();
    // const balance = await web3.eth.getBalance(contract.options.address);
    //balance is a number in wei
    this.setState({manager:manager});
    this.setState({patients:registered_patients});
    this.setState({message:'Enter an ether Amount'});
    //
    // console.log(this.state.manager);
    // console.log(this.state.patients[0]);


  }
  render()
  {
    return (
      <Router>
        <div className="container">
          <div>
            <h1 className=""> EHR COVID-19 </h1>
            {/* <h4>Message: {this.state.message}</h4> */}
            <Switch>

              <Route path="/admin" component={Admin} />
              <Route path="/patient" component={Patient} />
              <Route path="/" exact component={Home} />
            </Switch>
          </div>

          <div>

          </div>
        </div>
      </Router>
    );

  }

}

export default App;
