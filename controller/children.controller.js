const { default: mongoose } = require('mongoose')
const children = require('../model/children.model')
const userModel = require('../model/user.model')
const quations = require('../model/quationary.model')

exports.addChildren = async (req, res) => {
    const {
        parentId, name, nickName, DOB, relation, gender
    } = req.body

    await new children({
        parentId: parentId,
        name: name,
        nickName: nickName,
        DOB: DOB,
        relation: relation,
        gender: gender
    })
        .save()
        .then(success => {
            return res.json({
                status: true,
                message: "child data added",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}

exports.getById = async (req, res) => {
    const { childId } = req.params

    if (!childId) {
        return res.json({
            status: false,
            message: "please enter childId"
        })
    }

    const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "childId not provide"
        })
    }

    await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
        .then(success => {
            return res.json({
                status: true,
                message: "child data",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}

exports.getByParentId = async (req, res) => {
    const { parentId } = req.params

    if (!parentId) {
        return res.json({
            status: false,
            message: "please enter parentId"
        })
    }

    const isParentFound = await userModel.findOne({ _id: mongoose.Types.ObjectId(parentId) })
    if (!isParentFound) {
        return res.json({
            status: false,
            message: "parent not found"
        })
    }

    // await children.find({ parentId: mongoose.Types.ObjectId(parentId) })
    await children.aggregate([
        { $match: { parentId: mongoose.Types.ObjectId(parentId) } },
        {
            $lookup: {
                from: "quations",
                foreignField: "childId",
                localField: "_id",
                as: "quations"
            }
        }
    ])
        .then(success => {
            return res.json({
                status: true,
                message: "child data",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}

exports.updateChild = async (req, res) => {
    const { childId } = req.params
    const { name, nickName, DOB, relation, gender } = req.body

    if (!childId) {
        return res.json({
            status: false,
            message: "please enter childId"
        })
    }

    const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "child not present"
        })
    }

    await children.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(childId) },
        {
            $set: {
                name: name,
                nickName: nickName,
                DOB: DOB,
                relation: relation,
                gender: gender
            }
        },
        { returnOriginal: false }
    )
        .then(success => {
            return res.json({
                status: true,
                message: "child data",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}

exports.delete = async (req, res) => {
    const { childId } = req.params

    if (!childId) {
        return res.json({
            status: false,
            message: "please enter childId"
        })
    }

    const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "childId not provide"
        })
    }

    await children.findOneAndDelete({ _id: mongoose.Types.ObjectId(childId) })
        .then(async (success) => {
            await quations.deleteMany({ childId: mongoose.Types.ObjectId(childId) })
            return res.json({
                status: true,
                message: "child data deleted",
                data: success
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: "something went wrong"
            })
        })
}
