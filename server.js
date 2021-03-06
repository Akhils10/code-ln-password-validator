const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = express.Router();
const PORT = 4000;

let User = require('./models/user.model');

app.use(cors());
app.use(bodyParser.json());

if(process.env.NODE_ENV === "production"){
    app.use(express.static('./client/build'))
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://codeLn_test:test123456@ds045604.mlab.com:45604/heroku_sxpk0dlj', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection was established successfully");
})

Routes.route('/').get(function(req, res) {
    User.find(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
            console.log(data);
        }
    });
});
Routes.route('/auth').post(function(req, res) {
    User.find(req.body, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
            console.log(data);
        }
    });
});
Routes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    User.findById(id, function(err, data) {
        res.json(data);
    });
});

Routes.route('/insert').post(function(req, res) {
    let userData = new User(req.body);
    userData.save()
        .then(data => {
            res.status(200).json({'data': 'data insert is successful'});
        })
        .catch(err => {
            res.status(400).send('adding new data failed');
        });
});

Routes.route('/update/:id').post(function(req, res) {  
        var myquery = { email : req.params.id  };
        var newvalues = { $set: req.body };
        User.updateOne(myquery, newvalues, function(err, data){
            if (err) throw err;
            res.json("Data updated");
        })     
        .catch(err => {
            res.status(400).send("Update not possible");
    });
});

Routes.route('/delete/:id').post(function(req, res) {  
    var myquery = { email : req.params.id  };
    User.deleteMany(myquery, function(err, data){
        if (err) throw err;
        res.json("Data deleted");
    })     
    .catch(err => {
        res.status(400).send("Update not possible");
});
});


app.use('/api', Routes);

app.listen(process.env.PORT || PORT, function() {
    console.log(`Server is running on Port:  ${process.env.PORT || PORT}`);
});