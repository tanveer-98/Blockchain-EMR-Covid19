pragma solidity ^0.6.8;

// SPDX-License-Identifier: MIT

contract EHR {
    struct Patient {
        address id;
        string district;
        uint phonenumber;
        bool covidtrace;
        bool deceased;
        // uint report_ipfs;
    }

    struct DistrictReport {
        string district_name;
        uint activeCases;
        uint Deaths;
        mapping(address=>bool) citizens;
    }

    address private admin;
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

    modifier restrictedNonAdmin() {
        require(msg.sender != admin, "You donot have access");
        _;// all the code from the pickwinner function gets replacced in place of underscore
        //during the runtime
    }

    constructor() public {
        admin = msg.sender;
    }

    function register() public payable restrictedNonAdmin {

        require(!patientRegistered[msg.sender],"Patient already in database");
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

    function addPatient(  string memory district, uint  phonenumber, bool covidtrace)
    public restrictedNonAdmin {
        require(districtPresent[district], "Incorrect District Name");
        require(patientRegistered[msg.sender], "Patient Not registered");
        require(!patientAdded[msg.sender], "Patient Already in database");
        Patient memory newPatient = Patient({
            id : msg.sender,
            district: district,
            phonenumber: phonenumber,
            covidtrace : covidtrace,
            deceased:false
        });
        patientDetail[msg.sender] = newPatient;
        patientPhone[phonenumber] = msg.sender;
        patientAdded[msg.sender] = true;
        distDetail[district].activeCases =
        covidtrace ? distDetail[district].activeCases + 1 : distDetail[district].activeCases;
    }

    function UpdateCovidReport(uint phonenumber,bool trace,
    bool deceased) public restrictedAdmin {

        require(patientRegistered[msg.sender], " The person is not registered");

        Patient storage p = patientDetail[patientPhone[phonenumber]];
        bool initialtrace = p.covidtrace;
        if (initialtrace != trace)
            p.covidtrace = trace;

        p.deceased = deceased;


        if (initialtrace != trace) {
            distDetail[p.district].activeCases--;
        }

        if (deceased) {
            distDetail[p.district].activeCases--;
            distDetail[p.district].Deaths++;
        }


    }

    function Viewadmin() public view  returns(address)
    {
        return admin;
    }
    function getPatientCovidDetails(uint phonenumber ) public view returns (bool) {
        require(patientRegistered[msg.sender], "You are not registered");
        // require(msg.value> 100,"You must enter minimum of 0.001 ether");
        require(patientRegistered[patientPhone[phonenumber]],
        " The person you are searching for is not registered with this phonenumber");

        Patient memory p = patientDetail[patientPhone[phonenumber]];

        return p.covidtrace;
    }

    function getRegisteredPatients() public view returns(address[] memory) {
        return registered_person;
    }

    function getDistrictActiveCount(string memory district) public view returns(uint) {
        require(districtPresent[district], "invalid district name or District not present");
        return distDetail[district].activeCases;
    }

    function getDistrictDeathCount(string memory district) public view returns (uint) {
        require(districtPresent[district], "invalid district name or District not present");
        return distDetail[district].Deaths;
    }
}
