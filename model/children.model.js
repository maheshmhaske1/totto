const mongoose = require('mongoose')

const childrenSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String,
        default: ''
    },
    nickName: {
        type: String,
        default: ''
    },
    DOB: {
        type: Date,
        default: ''
    },
    relation: {
        type: Number //1.mom 2.dad 3.other
    },
    gender: {
        type: Number //1.male 2.female 3.other
    }
})


var childrenModel = mongoose.model('children', childrenSchema);
module.exports = childrenModel;