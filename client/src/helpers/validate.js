 function Validate ( password,  email = '' ) {
    const lenRegex = new RegExp(`^.*(?=.{16}).*$`)
    const numRegex = new RegExp(`^.*(?=(.*[0-9]){3,}).*$`)
    const symRegex = new RegExp(`^.*(?=(.*[!@#$%&*~|? "]){2,}).*$`)
    const lowerRegex = new RegExp(`^.*(?=(.*[a-z]){1,}).*$`)
    const upperRegex = new RegExp(`^(?=(.*[A-Z]){2,}).*$`)
    let fields = {
        PasswordLength: '',
        ContainsSymbol: '',
        ContainsNumber: '',
        ContainsUpperCase: '',
        ContainsLowerCase: '',
        Valid: true
    }

    // Defining validation rules
    if(!lenRegex.test(password))
    {
        fields.PasswordLength = 'Password length should be exactly 16 characters'
        fields.Valid = false
    }

    //if(password.search(/[\W\S]/) !== 2)
    if(!symRegex.test(password))
    {
        fields.ContainsSymbol= 'password must contain 2 symbols'
        fields.Valid = false
    }
      
    // if (password.search(/[0-9]/) !== 3)
    if (!numRegex.test(password))
    {
        fields.ContainsNumber= 'password must contain 3 numbers'
        fields.Valid = false
    }
      
    //if(password.search(/[a-z]/g) < 0)
    if(!lowerRegex.test(password))
    {
        fields.ContainsLowerCase = 'password must contain a lowercase letter';
        fields.Valid = false
    }
    
    //if(!upperRegex.test(password.charAt(0)) && !upperRegex.test(password.charAt(1)))
    let firstTwoChars = password.charAt(0) + password.charAt(1);
    if(!upperRegex.test(firstTwoChars))
    {
        fields.ContainsUpperCase ='The first 2 chars must be upper case letters';
        fields.Valid = false
    }

    return fields
  
    //   if(this.state.attempts >= 3){
    //     // check if ipaddress is the same
    //     if(this.getIPAddress() === this.state.ipAddress && email === this.state.email){
    //       this.setState({retry: 'Please retry in 5 minutes time'})
    //       const timeToWait = new Date(new Date().getTime() + 5*60000);
    //       this.setState({timeWaiting: timeToWait})
    
    //     }
  
    //     if(this.state.retry !== "" && this.state.timeWaiting !== new Date() && email <= this.state.email){
    //         this.setState({retry: 'Sorry, You must wait 5 minutes before retrying with the same email address'})
    //     }
    //   }

}

export default Validate