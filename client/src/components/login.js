import React, { Component } from 'react'
import axios from 'axios'
import {Link, Redirect} from 'react-router-dom'
import $ from 'jquery'



export default class Login extends Component {

  constructor(){
    super()
    
    this.state = {
      email: '',
      password: '',
      attempts: 0,
      ipAddress: '',
      timeWaiting: '',
      err: '',
      retry: false,
      loginSuccess: false
    }

  }

  componentDidMount(){
    $.ajax({
        type: "GET",
        url: 'https://ipapi.co/json/',
        cache: false,
        success: (res) => {
            this.setState({ipAddress: res.ip})
           // console.log(this.state.ipAddress)
        }
    })
  }

  sendEmail = (receiver, subject, msg) => {
    axios.get(`https://techmybrand.com/sendmail.php?msg=${msg}&subject=${subject}&reciever=${receiver}`)
      .then(response => {
        console.log(response.data)
      })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let email = this.refs.email.value
    let password = this.refs.password.value
    let attempts;
    sessionStorage.setItem('retry', false)

    let credentials = { "email" : email, "password" : password }

    axios.post('/api/auth', credentials)
      .then(response => {
  
       if(response.data.length > 0){
            this.setState({ loginSuccess: true })
            attempts = 0
            console.log(response.data)
            sessionStorage.setItem("attempts", 0)
            this.sendEmail(email, 'Successful login', 'You have just logged in to your account on our test app. It are happy to have you back');
            localStorage.setItem('userData', JSON.stringify(response.data))
        }else{
          if(sessionStorage.getItem("attempts") !== null){
             attempts =  sessionStorage.getItem("attempts")
          }else{
            sessionStorage.setItem('attempts', '0')
            attempts =  sessionStorage.getItem("attempts")
          }
            
            attempts = parseInt(attempts) + 1
            sessionStorage.setItem("attempts", attempts)
            attempts = sessionStorage.getItem('attempts')
            let timeToWait = new Date(Date.now() + 5*60000)
            sessionStorage.setItem("timeWaiting", timeToWait)
            if(parseInt(sessionStorage.getItem('attempts')) >= 3){
              console.log(true)
                this.setState({retry: true, timeWaiting: timeToWait})
                this.sendEmail(email, 'Failed Login Attempt', 'Someone has had 3 failed attempts trying to login using your email');
                console.log(sessionStorage.getItem("timeWaiting"))
                sessionStorage.setItem("retry", true)
                if(new Date(sessionStorage.getItem("timeWaiting")).getMinutes() >= new Date().getMinutes())
                {
                  console.log(true)
                    timeToWait = null 
                    sessionStorage.setItem("attempts", 0)
                    sessionStorage.setItem("timeWaiting", null)
                    sessionStorage.setItem("retry", false)
                    this.setState({retry: false, err: '', timeWaiting: timeToWait})  
                }
            }else{
                let data = { 
                    email: email, 
                    attempts: sessionStorage.getItem("attempts"), 
                    ipAddress: this.state.ipAddress,
                    timeWaiting: sessionStorage.getItem("timeWaiting"),
                    status: 'unsuccessful'
                }
                this.setState(data)
                this.setState({err: 'Your email or password is not correct'})

                // update database record for this user
                axios.post(`/api/update/${email}`, data)
                    .then(response => {
                        console.log(response.data);
                    })
            }
        }
      })
      .catch(function (error) {
          console.log(error);
      }) 
  }
 
  render() {
    
    if(this.state.err !== ''){
        $('#ValidateErrors').html(`<div className="alert alert-warning"> ${this.state.err} </div>`)
    }
    if(sessionStorage.getItem("retry") === "true" || this.state.retry === true){
        const timeLeft = new Date(sessionStorage.getItem('timeWaiting')).getMinutes() - new Date().getMinutes()
        $('#ValidateErrors').html(`<div className="alert alert-danger"> You must wait  ${timeLeft} minutes more before retrying </div>`)
    }
    if(this.state.loginSuccess){
        $('#ValidateErrors').html(`<div className="alert alert-success"> Login successful... </div>`)
       return <Redirect to="/home"/>
    }
    return (
      <div className="container">
          <div className="row">
              <div className="col-md-5 ml-auto mr-auto mt-4">
                  <div className="card" style={{marginTop: '50px', padding: 30, borderRadius: 20}}>
                      <div className="card-title">
                          <h4 className="card-heading text-center">Welcome, Please login!</h4>
                          <hr/>
                      </div>
                      <div className="card-body">
                        <div id="ValidateErrors"></div>
          
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                          <div className="form-group">
                              <label>Email</label>
                              <input type="email" className="form-control" required ref="email" placeholder="Email address"/>
                          </div>
                          <div className="form-group">
                              <label>Password</label>
                              <input type="password" className="form-control" required ref="password" placeholder="Password"/>
                          </div>
                          <div className="form-group">
                            <input type="submit" className="btn btn-primary btn-block" />
                          </div>
                      </fieldset>
                  </form>
                  <Link to="/register" style={{color: "#007bff", textDecoration: "none"}}>Don't have an ID? Register now</Link>
                </div>
            </div>
          </div>
      </div>
      </div>
    )
  }
}

