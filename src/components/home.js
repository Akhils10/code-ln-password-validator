import React, { Component } from 'react'
import { Redirect} from 'react-router-dom'

export default class Home extends Component {
    constructor(){
        super()

        this.state = {
            data: '',
            loggedIn: false
        }

        this.Logout = this.Logout.bind(this)
    }

    componentWillMount(){
        
        let data = localStorage.getItem('userData')
        data = JSON.parse(data)
        console.log(data)
        if(data !== null){
            this.setState({ data: data, loggedIn: true})
            
        }
            
    }

    componentDidMount(){
        //console.log(this.state.data[0]._id)
    }

    Logout(){
        localStorage.clear()
        this.setState({ data: '', loggedIn: false})
    }

    render() {
        if(!this.state.loggedIn){
            return <Redirect to="/" />
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 ml-auto mr-auto mt-4">
                        <div className="card" style={{marginTop: '50px', padding: 30, borderRadius: 20}}>
                            <div className="card-title">
                                <h3 className="card-heading">Welcome, Home</h3>
                                <span className="btn btn-primary btn-sm btn-rounded"
                                        style={{float: 'right'}}
                                        onClick={this.Logout}> 
                                    Logout 
                                </span>
                            </div>
                            <div className="card-body">
                                <p className="lead">
                                    Hello user {this.state.data[0]._id}, thank you for your time.
                                    your account details is as follows:
                                </p>
                                <ul style={{listStyleType: 'none'}}>
                                    <li>Email: {this.state.data[0].email}</li>
                                    <li>Last loggedIn Ip: {this.state.data[0].ipAddress}</li>
                                </ul>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        )
    }
}
