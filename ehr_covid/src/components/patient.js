import React  from "react";
import { Link } from "react-router-dom";
import web3 from "../web3";
import contract from "../contract";
import ipfs from "../ipfs";
import {BrowserRouter as Router ,Route} from 'react-router-dom';
class Patient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPatient: "",
      message: "",
      covidstatus: "",
      phonenumber: "",
      district: "",
      activeCases: "",
      deaths: "",
      checkpatient_phone:'',
      query_status:''
    };
  }
  //

  async componentDidMount() {
    //this part is automatically called once the app is loaded to the screen
    //this is the first part to load
    const currentAccount = await web3.eth.getAccounts();
    this.setState({ currentPatient: currentAccount[0] });
    // console.log(currentAccount);
    const dist = await contract.methods
      .getDistrict(this.state.currentPatient)
      .call();

    this.setState({ district: dist });
    console.log("dist : " + this.state.district);

    try {
      const activecases = await contract.methods
        .getDistrictActiveCount(this.state.district)
        .call();
      const deaths = await contract.methods
        .getDistrictDeathCount(this.state.district)
        .call();
      console.log("active cases : " + activecases);
      this.setState({ activeCases: activecases, deaths: deaths });
    } catch (err) {
      console.log("district not present");
    }


    // this.setState()
    //for meta mask we dont need to add a from: address into the call method
    //like we did in the lottery.test.js
  }

  OnRegisterClick = async () => {
    const Account = await web3.eth.getAccounts();
    console.log(typeof Account[0]);
    this.setState({ message: "Waiting for Transaction to complete ..." });
    await contract.methods.register().send({ from: this.state.currentPatient });
    this.setState({
      message: "Trasaction Complete : You have been Successfully Registered",
    });
  };

  OnAddFormSubmit = async (event) => {
    event.preventDefault();
    this.setState({ message: "Waiting for Transaction to complete ..." });
    await contract.methods
      .addPatient(
        this.state.district,
        this.state.phonenumber,
        this.state.covidstatus
      )
      .send({ from: this.state.currentPatient });
    this.setState({
      message: "Trasaction Complete : Details succesfully Added",
    });
  };

  OnFormSubmit_query = async (event) => {
    event.preventDefault();

    this.setState({ message: "Waiting for Transaction to complete ..." });
    const status  = await contract.methods
      .getPatientCovidDetails(
        this.state.checkpatient_phone,
      )
      .send({ from: this.state.currentPatient });
    if(status){
      this.setState({query_status:"POSITIVE"});
    }
    else{
        this.setState({query_status:"NEGATIVE"});
    }
    console.log("status : "+this.state.query_status)
    this.setState({
      message: "Trasaction Complete : Details succesfully Added",
    });
  };

  render() {
    // console.log(location);
    return (
      <div>
        <h2> <u> PATIENT PAGE</u></h2>
        <p>{this.state.message}</p>
        <p>Please Register Before You Add Your Details</p>
        <button onClick={this.OnRegisterClick}>REGISTER</button>
        {/* <h3>this is the message : {location.state.message}</h3> */}
        <hr/>
        <p>Current Patient: {this.state.currentPatient}</p>
        <form onSubmit={this.OnAddFormSubmit}>
          <h2>Enter Your Details</h2>

          <label>Enter Phonenumber </label>
          <input
            type="text"
            onChange={(event) =>
              this.setState({ phonenumber: event.target.value })
            }
          ></input>
          <p />
          <label>Enter District </label>
          <input
            type="text"
            onChange={(event) =>
              this.setState({ district: event.target.value })
            }
          ></input>
          <p />
          <label>Enter Covid Status </label>
          <input
            type="text"
            onChange={(event) =>
              this.setState({ covidstatus: event.target.value })
            }
          ></input>
          <p />
          <button type="submit">Enter</button>
        </form>
        <hr/>
        <h2>DOWNLOAD COVID REPORT</h2>
        <Router>
          <Route path='/covid_report' component={async () => {
            const hashvalue = await contract.methods.getIPFS_forPatient(this.state.currentPatient).call();
            console.log("hash : "+hashvalue);
            
            window.location.href = `https://ipfs.infura.io/ipfs/${hashvalue}`;
            return null;
          }}/>
          <Link to="/covid_report"> <button> DOWNLOAD REPORT</button> </Link>
        </Router>



        <p />
        <p>Active Cases(Current District) : {this.state.activeCases} </p>
        <p>Death Count (Current District) : {this.state.deaths}</p>
        <hr />
        <h2>CHECK COVID STATUS</h2>
        <form onSubmit={this.OnFormSubmit_query}>
          <label> Enter the person's Phone number</label>
          <p/>
          <input
            type="text"
            onChange={(event) =>
              this.setState({ checkpatient_phone: event.target.value })
            }
          ></input>
          <p/>
          <button type ="submit">CHECK</button>
        </form>
        <p>COVID-19 STATUS : {this.state.query_status} </p>
        <Link to="/">
          {" "}
          <button>HOME</button>{" "}
        </Link>
      </div>
    );
  }
}

export default Patient;
