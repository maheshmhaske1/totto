const { default: mongoose } = require('mongoose')
const categoryModel = require('../model/categoryDefination.model')

exports.add = async (req, res) => {
    const { category } = req.body

    if (!category) {
        return res.json({
            status: false,
            message: "please provide category"
        })
    }

    await new categoryModel({
        category: category
    }).save()

        .then((success) => {
            return res.json({
                success: true,
                message: `category added`,
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                success: false,
                message: "something went wrong", error
            })
        })
}

exports.delete = async (req, res) => {
    const { catId } = req.params

    if (!catId) {
        return res.json({
            status: false,
            message: "please provide catId"
        })
    }

    await categoryModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(catId) })
        .then((success) => {
            return res.json({
                success: true,
                message: `category deleted`,
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                success: false,
                message: "something went wrong", error
            })
        })
}

exports.getAll = async (req, res) => {
    await categoryModel.find({})

        .then((success) => {
            return res.json({
                success: true,
                message: `categorys`,
                data: success
            })
        })
        .catch((error) => {
            return res.json({
                success: false,
                message: "something went wrong", error
            })
        })
}