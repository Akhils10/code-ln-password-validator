import React, { Component } from 'react'
import axios from 'axios';

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'


class App extends Component {

  constructor(){
    super();
    
    this.state = {
      email: '',
      password: '',
      attempts: 0,
      ipAddress: '',
      timeWaiting: '',
      retry: '',
      err: '',
      sameEmail: false
    }

  }

  getIPAddress = () => {
    fetch('http://www.geoplugin.net/json.gp')
    .then(response => response.json())
    .then(response => {
      return response.geoplugin_request;
    });
  }

  componentDidMount(){
    this.setState({ipAddress: this.getIPAddress()})
    //EmailSender('philipakhilome@gmail.com', 'Testing email message', 'Hi, Welcome to codeln');
    this.sendEmailAlert('philipakhilome@gmail.com', 'Testing email message', 'Hi, Welcome to codeln');
    //this.postEmail('philipakhilome@gmail.com', 'Testing email message', 'Hi, Welcome to codeln');
  }

  componentWillUpdate(){
    axios.get('http://localhost:4000/login')
      .then(response => {
        //console.log(...response.data)
      })
      .catch(function (error) {
          console.log(error);
      })
  }

  saveDataInDb = (data) => {
    axios.post('http://localhost:4000/login/insert', data)
            .then(res => console.log(res.data));
  }

  sendEmailAlert = (receiver, subject, msg) => {
    const mailgun = require("mailgun-js");
    const api_key = 'b635d543db9933d31e4fa18fd87e8946-52b0ea77-c4130739';
    const DOMAIN = 'sandbox2336efb54c7c4886bf18e9e4044c5733.mailgun.org';
    const host = 'api.mailgun.net';
    const mg = mailgun({apiKey: api_key, domain: DOMAIN, host: host});
    const data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: receiver,
      subject: subject,
      text: msg
    };
    mg.messages().send(data, function (error, body) {
      if(error)
        console.log(error)
      console.log(body);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let email = this.refs.email.value;
    let password = this.refs.password.value;
    let err = '';

    // save the entries in db
    //const data = { "email" : email, "password" : password, "ipAddress" : this.getIPAddress(), "attempts" : this.state.attempt, "status" : 'unsuccessful' }
    //this.saveDataInDb(data);

    this.setState({
      email: email,
      password: password,
      attempts: this.state.attempts + 1
    })

    // Defining validation rules
    if(password.length < 16){
      err = 'Password length should be 16 or more characters';
    }
    if(password.search(/[\W\S]/) !== 2){
      err += 'password must contain 2 symbols';
    }
    if (password.search(/[0-9]/) !== 3){
      err += 'password must contain 3 numbers';
    }
    if(password.search(/[a-z]/g) < 0){
      err += 'password must contain a lowercase letter';
    }
    if(password.charAt(0).search(/[A-Z]/g) < 0 || password.charAt(1).search(/[A-Z]/g) < 0){
      err +='The first 2 chars must be upper case letters';
    }
    if(err !== "") this.setState({err: err});

    if(this.state.attempts >= 3){
      // check if ipaddress is the same
      if(this.getIPAddress() === this.state.ipAddress && email === this.state.email){
        this.setState({retry: 'Please retry in 5 minutes time'})
        const timeToWait = new Date(new Date().getTime() + 5*60000);
        this.setState({timeWaiting: timeToWait})
  
      }

      if(this.state.retry !== "" && this.state.timeWaiting !== new Date() && email <= this.state.email){
          this.setState({retry: 'Sorry, You must wait 5 minutes before retrying with the same email address'})
      }
    }
  }

  

  render() {
    
    return (
      <div className="container">
        <h3>Welcome, Please enter your login details</h3>
        <hr/>
        {
          this.state.err !== "" &&
            <div className="alert alert-warning">{this.state.err}</div>
        }
        {
          this.state.retry !== "" &&
          <div className="alert alert-danger">{this.state.retry}</div>
        }
        
        <form onSubmit={this.handleSubmit}>
            <fieldset>
                  <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" required ref="email" placeholder="Email address"/>
                  </div>
                  <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control" required ref="password" placeholder="Password"/>
                      <small>Your password must contain lower and uppercase letters, numbers and at least 2 symbols</small>
                  </div>
                  <div className="form-group">
                    <input type="submit" className="btn btn-primary btn-block" />
                  </div>
              </fieldset>

          </form>
      </div>
    )
  }
}

export default App