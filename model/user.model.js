const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    mobile: {
        type: Number,
        default: ''
    },
    token: {
        type: String
    },

})


var userModel = mongoose.model('users', userSchema);
module.exports = userModel;