pragma solidity ^0.6.8;


// SPDX-License-Identifier: MIT
contract EHR {
  // type visibility variablename


    struct Patient {

       //patient address in network
        address id;
        uint pid;
        string fname;
        string lname;
        uint age;
        string bloodgroup;
        //Address
        string district;
        uint pincode;
        //contact
        uint registered_phonenumber;
        //report of being positive or negative
        bool covidtrace;
        bool deceased;
        uint C_No; // report number
        uint last_data_checkup;

    }

    struct DistrictReport{

        string district_name;
        uint activeCases;
        uint Deaths;
        mapping(address=>bool) citizens;
    }


    address private admin;
    Patient[] private patients; // no use
    DistrictReport[] private dist;// no use

    mapping(address => Patient) patientDetail;
    mapping(uint => address) patientPhone;
    mapping(string=>bool) districtPresent;
    mapping(string => DistrictReport) distDetail;
    mapping(address =>bool) patientAdded;

    address[] registered_person;
    mapping(address => bool) patientRegistered;

    modifier restrictedAdmin() {
        require(msg.sender == admin, "You donot have access");
        _;// all the code from the pickwinner function gets replacced in place of underscore
        //during the runtime
    }

    constructor() public {
      //msg is an object
      //msg.sender is a gllobal variable which descibes the address of  who just sent the transaction
      //msg.data returns the data field or arguments of the function in the transaction
      //msg.gas returns the amount of gas the current function invocation has available
      //msg.value returns the amount of ether in wei that was sent along with the function invocation
        admin = msg.sender;// the one who deploys this contract in the network becomes the
    }

    //when we send some amount of ether via a function then we make that function payable
    function register() public payable {

        require(!patientRegistered[msg.sender]);
        patientRegistered[msg.sender] = true;
        registered_person.push(msg.sender);
    }

    function addDistrict(string memory dname) public payable restrictedAdmin {
        require(!districtPresent[dname], "district already present");
        DistrictReport memory newdist = DistrictReport({
            district_name:dname,
            activeCases:0,
            Deaths:0
        });

        distDetail[dname] = newdist;
        districtPresent[dname] = true;
    }

    function addPatient(address id, string memory fname, string memory lname, string memory district,
    uint pincode, uint  phonenumber, bool covidtrace, uint C_No, uint last_data_checkup,
    string memory bloodgroup, uint pid, uint age)
    public restrictedAdmin {
        require(districtPresent[district], "Incorrect District Name");
        require(patientRegistered[id], "Patient Not registered");
        require(!patientAdded[id], "Patient Already in database");
        Patient memory newPatient = Patient({
            id : id,
            fname:fname,
            lname: lname,
            district: district,
            pincode: pincode,
            registered_phonenumber: phonenumber,
            covidtrace : covidtrace,
            deceased:false,
            C_No : C_No,
            last_data_checkup: last_data_checkup,
            pid:pid,
            bloodgroup:bloodgroup,
            age:age
        });

        patientDetail[id] = newPatient;
        patientPhone[phonenumber] = id;
        patientAdded[id] = true;


        //updating district detail

        distDetail[district].activeCases =
        covidtrace ? distDetail[district].activeCases + 1 : distDetail[district].activeCases;

    }

    function UpdateCovidReport(address person, bool trace, uint last_data_checkup,
    bool deceased) public restrictedAdmin {

        require(patientRegistered[person], " The person is not registered");

        Patient storage p = patientDetail[person];
        bool initialtrace = p.covidtrace;
        if (initialtrace != trace)
            p.covidtrace = trace;

        p.deceased = deceased;
        p.last_data_checkup = last_data_checkup;

        if (initialtrace != trace) {
            distDetail[p.district].activeCases--;
        }

        if (deceased) {
            distDetail[p.district].activeCases--;
            distDetail[p.district].Deaths++;
        }


    }

    // function grantAccess() public view returns(bool)
    // {
    //     for (uint i=0; i < patients.length; i++) {
    //         if (msg.sender == patients[i].id)
    //             return true;
    //     }
    //     return false;
    // }

    function Viewadmin() public view restrictedAdmin returns(address)
    {
        return admin;
    }
    // function getPatientCovidDetails(uint phonenumber ) public payable returns (string memory,bool,uint,uint) {
    //     require(patientRegistered[msg.sender],"You are not registered");
    //     require(msg.value> 100,"You must enter minimum of 0.001 ether");
    //     require(patientRegistered[patientPhone[phonenumber]]," The
    //     person you are searching for is not registered with this phonenumber");
    //     Patient memory p = patientDetail[patientPhone[phonenumber]];
    //     return (p.fname,p.covidtrace,p.C_No,p.last_data_checkup);
    // }

    function getPatientCovidDetails(uint phonenumber ) public view returns (bool) {
        require(patientRegistered[msg.sender], "You are not registered");
        // require(msg.value> 100,"You must enter minimum of 0.001 ether");
        require(patientRegistered[patientPhone[phonenumber]],
        " The person you are searching for is not registered with this phonenumber");

        Patient memory p = patientDetail[patientPhone[phonenumber]];

        return p.covidtrace;
    }

    function getRegistered() public restrictedAdmin view returns(address[] memory)
    {
        return registered_person;
    }

    function getDistrictActiveCount(string memory district) public view returns(uint)
    {
        require(districtPresent[district],"invalid district name or District not present");
        return distDetail[district].activeCases;
    }

    function getDistrictDeathCount(string memory district) public view returns (uint)
    {
        require(districtPresent[district],"invalid district name or District not present");
        return distDetail[district].Deaths;
    }

    // function getAllPatients() public view restrictedAdmin returns(Patient[] memory) {
    //     return patients;
    // }

    // function getPatientDetails(string phonenumber) public view returns (bool) {
    //     bool found = false;
    //     for (uint i = 0; i < patients.length; i++) {
    //         if (phonenumber == patients[i].phonenumber) {
    //             found = true;
    //             break;
    //         }
    //     }
    //     require(found == true, " The query person is not registered");
    //     return patients[i].covidtrace;
    // }


    //
    //
    //
    //
    //
    //
    //



        //pseudo random number generator
        // [current block difficulty+ current time+ addresses of players]-->sha3 algo-->really big number
//returns a random 256 bit number

    //cancelling entire round of lottery and refund the money to every player

    // only manager should be able to call the function
    //function modifier is used to reduce the duplicacy of code
}
//uint is by default uint256
// uint[] public myarray;
//
// function Test()public{
//   arr.push(1);
// }
//
// function getarraylength() public view returns (uint)
// {
//   return arr.length;
// }
//
// function getFirstElement() public view returns (uint)
// {
//   return arr[0];
// }
