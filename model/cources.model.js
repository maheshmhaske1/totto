const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        default: ''
    },
    courseDesc: {
        type: String,
        default: ''
    },
    instructorOccupation: {
        type: String,
        default: ''
    },
    instructorName: {
        type: String,
        default: ''
    },
    instructorDesc: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: ''
    },
    whatYouGet: {
        type: [],
        default: []
    },
    chapters: [{
        url: {
            type: String
        },
        name: {
            type: String
        },
        desc: {
            type: String
        }
    }]
})


var courseModel = mongoose.model('courses', courseSchema);
module.exports = courseModel;