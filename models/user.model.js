const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    id: {
        type: Number
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    ipAddress: {
        type: String
    },
    attempts: {
        type: Number
    },
    timeWaiting: {
        type: Date
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('User', User);