import axios from 'axios';

 function GetIPAddress () {
    fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(response => {
      //console.log(response.ip)
      return response.ip
    })
  }

 function SaveDataInDb(data){
  axios.post('/api/insert', data)
          .then(res => console.log(res.data));
}

export { GetIPAddress, SaveDataInDb }