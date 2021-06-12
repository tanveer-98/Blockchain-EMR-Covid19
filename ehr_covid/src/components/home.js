import React from 'react';
import {Link} from 'react-router-dom';

class Home extends React.Component{

  render(){
    return(
      <div>
        <h3>HOME PAGE</h3>
        <img className ='image-home' src ="https://medcitynews.com/uploads/2021/05/GettyImages-1218533956.jpg" ></img>
        <p/>
        <Link to={{pathname:"/admin",state:this.state}}> <button>ADMIN</button></Link>
        <p></p>

        <Link to={{pathname:"/patient",state:this.state}}> <button>PATIENT</button> </Link>
      </div>
    );
  }

}

export default Home;
