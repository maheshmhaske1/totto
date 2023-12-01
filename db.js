const mongoose = require('mongoose')
require('dotenv').config()

exports.dbConnection = async () => {
    mongoose.connect("mongodb+srv://mahes:Mahi7558@cluster0.4rkar.mongodb.net/ecommerce", (error) => {
        if (!error) {
            console.log('Connected with MongoDB...')
        }
        else {
            console.log('error while connecting...', error)
        }
    })
}
