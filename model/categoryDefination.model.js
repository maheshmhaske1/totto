const mongoose = require('mongoose')

const categoryDensSchema = new mongoose.Schema({

    category: {
        type: String
    }
})


var categoryDensModel = mongoose.model('categoryDens', categoryDensSchema);
module.exports = categoryDensModel;