import React, { Component } from 'react'
import $ from 'jquery'
import {Redirect} from 'react-router-dom'
import axios from 'axios';

import Validate from '../helpers/validate'
import { SaveDataInDb } from '../helpers/func';



export default class Register extends Component {
    constructor(){
        super()

        this.state = {
            formValid: false,
            ipAddress: null,
            registered: false
        }
    }

    componentDidMount (){
        $.ajax({
            type: "GET",
            url: 'https://ipapi.co/json/',
            cache: false,
            success: (res) => {
                this.setState({ipAddress: res.ip})
                console.log(this.state.ipAddress)
            }
        })
        
    }

    handleSubmit = (e) => {
        e.preventDefault()
        $('#PasswordChecker').hide();
        let email = this.refs.email.value
        let password = this.refs.password.value
        let val = Validate(password, email)
        
        if(val.Valid){
            $('#PasswordChecker li').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            
            if(this.handleConfirmPasswordChange){
                // save data in db
                let data = { "email" : email, "password" : password, "ipAddress" : this.state.ipAddress, "status" : 'unsuccessful' }
                
                // check if user has already registered with this email

                axios.post('http://localhost:4000/login/auth', {"email" : email} )
                .then(response => {
                    console.log(response.data)
                    if(response.data.length > 0){
                        this.setState({
                            email: email,
                            password: password,
                            attempts: this.state.attempts + 1,
                            err: 'Email address is already registered'
                        })
                    }else{
                        SaveDataInDb(data)
                        // save to localStorage as well
                        localStorage.setItem("app_reg_data", JSON.stringify(data))
                        this.setState({ ipAddress: data.ipAddress, registered: true })
                        console.log('registered')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
            }
        }
    }

    handleChange = () => {
        $('#PasswordChecker').show();
        let email = ''
        let password = this.refs.password.value
        let val = Validate(password, email)

        if(!val.Valid){
            $('#PasswordChecker').show();
            if(val.PasswordLength === '') {
                $('.LengthCheck').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            }else{
                $('.LengthCheck').css({color : "#ff0000", fontWeight : '300', fontStyle : 'italic'})
            }
        
            if(val.ContainsSymbol === ''){
                $('.SymbolsCheck').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            }else{
                $('.SymbolsCheck').css({color : "#ff0000", fontWeight : '300', fontStyle : 'italic'})
            }
        
            if(val.ContainsUpperCase === ''){
                $('.UpperCaseCheck').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            }else{
                $('.UpperCaseCheck').css({color : "#ff0000", fontWeight : '300', fontStyle : 'italic'})
            }
        
            if(val.ContainsLowerCase === ''){
                $('.LowerCaseCheck').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            }else{
                $('.LowerCaseCheck').css({color : "#ff0000", fontWeight : '300', fontStyle : 'italic'})
            }

            if(val.ContainsNumber === ''){
                $('.NumbersCheck').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
            }else{
                $('.NumbersCheck').css({color : "#ff0000", fontWeight : '300', fontStyle : 'italic'})
            } 
        }else{
            $('#PasswordChecker li').css({color : "#09ff00", fontWeight : 'normal', fontStyle : 'normal'})
        }
    }

    handleConfirmPasswordChange = () => {
        if(this.refs.cpassword.value !== this.refs.password.value){
            $('#ConfirmPasswordCheck').text('Your password does not match')
            return false
        }
        $('#ConfirmPasswordCheck').text('Great! your password matches').css({color: '#09ff00', fontWeight : 'normal', fontStyle : 'normal'})
        return true
    }

    render() {
        if (this.state.registered === true){
           return <Redirect to="/" />
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-5 ml-auto mr-auto mt-4">
                        <div className="card" style={{marginTop: '50px', padding: 30, borderRadius: 20}}>
                            <div className="card-title">
                                <h4 className="card-heading text-center">Welcome, Please signup!</h4>
                                <hr/>
                            </div>
                            <div className="card-body">
                                <div id="validateErrors"></div>
                                <form onSubmit={this.handleSubmit}>
                                    <fieldset>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" className="form-control" required ref="email" placeholder="Email address"/>
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" onChange={this.handleChange} className="form-control" required ref="password" placeholder="Password"/>
                                            <small>
                                                <ul id="PasswordChecker" style={{display: "none"}}>
                                                    <li className="LengthCheck">Your password must be of 16 characters</li>
                                                    <li className="SymbolsCheck">Must contain at least 2 sysmbols</li>
                                                    <li className="UpperCaseCheck">The first two characters must be Uppercase</li>
                                                    <li className="LowerCaseCheck">Must contain lowercase letters</li>
                                                    <li className="NumbersCheck">Must contain at 3 numbers</li> 
                                                </ul>
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <label>Confirm Password</label>
                                            <input type="password" onChange={this.handleConfirmPasswordChange} className="form-control" ref="cpassword" required placeholder="Retype Password"/>
                                            <small id="ConfirmPasswordCheck"></small>
                                        </div>
                                        <div className="form-group">
                                        <input type="submit" className="btn btn-primary btn-block" />
                                        </div>
                                    </fieldset>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
