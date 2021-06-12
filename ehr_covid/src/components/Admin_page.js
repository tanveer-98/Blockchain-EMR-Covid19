import React from 'react';
import {Link} from 'react-router-dom';
import web3 from "../web3";
import contract from "../contract";
// import ipfs from '../ipfs';
import ipfs from "../ipfs";
import {BrowserRouter as Router ,Route} from 'react-router-dom';


class Admin extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      ipfsHash_value:"",
      Admin: "",
      message: "",
      covidstatus: "",
      district: "",
      checkpatient_phone:'',
      query_status:'',
      ipfs_upload_phone:''
    };
  }

  async componentDidMount() {
    //this part is automatically called once the app is loaded to the screen
    //this is the first part to load
    const currentAccount = await web3.eth.getAccounts();
    this.setState({ Admin: currentAccount[0] });
    // console.log(currentAccount);
  }



  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };


  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  onSubmitMR = async (event) => {
    this.setState({ message: "Waiting for Transaction to complete ..." });
    event.preventDefault();
    var hash = "";
    //save document to IPFS,return its hash#, and set hash# to state
    await ipfs.add(this.state.buffer,  async (err, ipfsHash) => {
      console.log('ipfs Hash 1: ' +ipfsHash[0].hash);
      //setState by setting ipfsHash to ipfsHash[0].hash


      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract
      //return the transaction hash from the ethereum contract
      console.log("type: "+typeof(this.state.ipfsHash_value));
      this.setState({ipfsHash_value:ipfsHash[0].hash});
      console.log("ipfs hash2: "+this.state.ipfsHash_value);
      try{
       await contract.methods.updateIPFS(this.state.ipfs_upload_phone,this.state.ipfsHash_value)
      .send({from:this.state.Admin});
    }
    catch(err)
    {
      console.log(err);
    }
    });

    console.log("ipfs hash3: "+this.state.ipfsHash_value);
    this.setState({ message: "File Upload Complete ..." });

  };

  onSubmitForm_getIPFS = async (event) => {
    event.preventDefault();

    this.setState({ message: "Waiting for Transaction to complete ..." });

    const hash  = await contract.methods
      .getIPFS_forAdmin(
        this.state.ipfs_upload_phone
      )
      .call();

    console.log("retreived hash"+hash);
    this.setState({ipfsHash_value:hash});

    this.setState({message: "Trasaction Complete :  Successfully Fetched",});
  };

  OnFormSubmit_query = async (event) => {
    event.preventDefault();

    this.setState({ message: "Waiting for Transaction" });
    const status  = await contract.methods
      .getPatientCovidDetails(
        this.state.checkpatient_phone,
      )
      .send({ from: this.state.Admin });
    if(status){
      this.setState({query_status:"POSITIVE"});
    }
    else{
        this.setState({query_status:"NEGATIVE"});
    }
    console.log("status : "+this.state.query_status)
    this.setState({
      message: "Trasaction Complete : FETCHED RESULT",
    });
  };

  OnFormSubmitDistrict = async (event) => {
    event.preventDefault();

    this.setState({ message: "Waiting for Transaction to complete ..." });

    const status  = await contract.methods
      .addDistrict(
        this.state.district,
      )
      .send({ from: this.state.Admin});

    this.setState({message: "Trasaction Complete : District Successfully Added",});
  };

 OnFormSubmit_Update = async (event)=>{
   event.preventDefault();
   this.setState({ message: "Waiting for Transaction to complete ..." });

     await contract.methods
     .UpdateCovidReport(this.state.checkpatient_phone,this.state.covidstatus,this.state.deceased)
     .send({ from: this.state.Admin});

   this.setState({message: "Trasaction Complete : Status Updated Successfully",});

 }


  render()
  {

    return(
      <div>
        <div className="admin">
          <h1>
            Admin page
          </h1>
          <p>{this.state.message}</p>
          <hr></hr>

          <form  onSubmit={this.OnFormSubmitDistrict}>
            <p>Enter District Name</p>
            <input type="text" onChange= { event=>{this.setState({district:event.target.value})}}></input>
            <button type="submit">Add District</button>
          </form>

          <hr></hr>
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
          <hr/>
          <h2>UPDATE PATIENT STATUS</h2>
          <form onSubmit={this.OnFormSubmit_Update}>
            <label> Phone number</label>
            <p/>
            <input
              type="text"
              onChange={(event) =>
                this.setState({ checkpatient_phone: event.target.value })
              }
            ></input>
            <p/>
            <label> Covid Positive (true/false)</label>
            <p/>
            <input
              type="text"
              onChange={(event) =>
                this.setState({ covidstatus: event.target.value })
              }
            ></input>
            <p/>
            <label> Person deceased (true/false)</label>
            <p/>
            <input
              type="text"
              onChange={(event) =>
                this.setState({ deceased: event.target.value })
              }
            ></input>
            <p/>
            <button type ="submit">UPDATE</button>
          </form>


          <hr></hr>
          <h2>UPLOAD PATIENT REPORT</h2>
          <form onSubmit={this.onSubmitMR}>
            <label>Enter Patient Phonenumber :  </label>

            <input
              type="text"
              onChange={(event) =>
                this.setState({ ipfs_upload_phone: event.target.value })
              }
            ></input>
            <p/>
            <input type="file" onChange={this.captureFile} />

            <button type="submit">
              UPLOAD
            </button>
          </form>
          <p>IPFS HASH stored on Ethereum: {this.state.ipfsHash_value}</p>
        </div>
        <p/>
        <hr/>
        <h2>DOWNLOAD PATIENT REPORT</h2>
        <form onSubmit={this.onSubmitForm_getIPFS}>
          <label>Enter Patient Phonenumber to get Report :  </label>

          <input
            type="text"
            onChange={(event) =>
              this.setState({ ipfs_upload_phone: event.target.value })
            }
          ></input>
          <p/>
          <button type="submit">
            FETCH IPFS
          </button>

        </form>
        <p/>
        <Router>
          <Route path='/covid_report' component={() => {
            window.location.href = `https://ipfs.infura.io/ipfs/${this.state.ipfsHash_value}`;
            console.log(typeof(this.state.ipfsHash_value));
            return null;
          }}/>
          <Link to="/covid_report"> <button> GET FILE</button> </Link>
        </Router>
        <p/>
        <Link to="/">  <button>HOME PAGE</button> </Link>
      </div>
    );
  }

}

export default Admin;
