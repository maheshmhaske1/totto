const { default: mongoose } = require('mongoose')
const children = require('../model/children.model')
const quations = require('../model/quationary.model')
const childrenModel = require('../model/children.model')

exports.addQuations = async (req, res) => {
    const {
        childId,
        calm_himself_by_bringing_hand_to_mouth,
        express_emotions_like_pleasure_and_discomfort,
        try_to_look_for_his_parent,
        recognize_family_faces,
        smile_at_familiar_faces,
        respond_positively_to_touch,
        make_gurgling_sound,
        cry_differently_on_different_need,
        try_to_imitate_sound,
        follow_people_with_his_eyes,
        follow_object_with_his_eyes,
        observe_faces_with_interest,
        raise_his_head_lying_on_his_stomach,
        bring_his_hand_to_his_mouth,
        try_to_touch_dangling_objects,
        has_started_to_smile_at_others
    } = req.body

    if (!childId) {
        return res.json({
            status: false,
            message: "please provide childId"
        })
    }

    const isChildPresent = await childrenModel.findOne({ _id: mongoose.Types.ObjectId(childId) })
    if (!isChildPresent) {
        return res.json({
            status: false,
            message: "please provide valid childId"
        })
    }

    await new quations({
        childId: childId,
        calm_himself_by_bringing_hand_to_mouth: calm_himself_by_bringing_hand_to_mouth,
        express_emotions_like_pleasure_and_discomfort: express_emotions_like_pleasure_and_discomfort,
        try_to_look_for_his_parent: try_to_look_for_his_parent,
        recognize_family_faces: recognize_family_faces,
        smile_at_familiar_faces: smile_at_familiar_faces,
        respond_positively_to_touch: respond_positively_to_touch,
        make_gurgling_sound: make_gurgling_sound,
        cry_differently_on_different_need: cry_differently_on_different_need,
        try_to_imitate_sound: try_to_imitate_sound,
        follow_people_with_his_eyes: follow_people_with_his_eyes,
        follow_object_with_his_eyes: follow_object_with_his_eyes,
        observe_faces_with_interest: observe_faces_with_interest,
        raise_his_head_lying_on_his_stomach: raise_his_head_lying_on_his_stomach,
        bring_his_hand_to_his_mouth: bring_his_hand_to_his_mouth,
        try_to_touch_dangling_objects: try_to_touch_dangling_objects,
        has_started_to_smile_at_others: has_started_to_smile_at_others
    })
        .save()
        .then(success => {
            return res.json({
                status: true,
                message: "child questions data added",
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

// exports.getById = async (req, res) => {
//     const { childId } = req.params

//     if (!childId) {
//         return res.json({
//             status: false,
//             message: "please enter childId"
//         })
//     }

//     const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
//     if (!isChildFound) {
//         return res.json({
//             status: false,
//             message: "childId not provide"
//         })
//     }

//     await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
//         .then(success => {
//             return res.json({
//                 status: true,
//                 message: "child data",
//                 data: success
//             })
//         })
//         .catch(error => {
//             return res.json({
//                 status: false,
//                 message: "something went wrong"
//             })
//         })
// }

// exports.getByParentId = async (req, res) => {
//     const { parentId } = req.params

//     if (!parentId) {
//         return res.json({
//             status: false,
//             message: "please enter parentId"
//         })
//     }

//     const isParentFound = await userModel.findOne({ _id: mongoose.Types.ObjectId(parentId) })
//     if (!isParentFound) {
//         return res.json({
//             status: false,
//             message: "parent not found"
//         })
//     }

//     await children.find({ parentId: mongoose.Types.ObjectId(parentId) })
//         .then(success => {
//             return res.json({
//                 status: true,
//                 message: "child data",
//                 data: success
//             })
//         })
//         .catch(error => {
//             return res.json({
//                 status: false,
//                 message: "something went wrong"
//             })
//         })
// }

// exports.updateChild = async (req, res) => {
//     const { childId } = req.params
//     const { name, nickName, DOB, relation, gender } = req.body

//     if (!childId) {
//         return res.json({
//             status: false,
//             message: "please enter childId"
//         })
//     }

//     const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
//     if (!isChildFound) {
//         return res.json({
//             status: false,
//             message: "child not present"
//         })
//     }

//     await children.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(childId) },
//         {
//             $set: {
//                 name: name,
//                 nickName: nickName,
//                 DOB: DOB,
//                 relation: relation,
//                 gender: gender
//             }
//         },
//         { returnOriginal: false }
//     )
//         .then(success => {
//             return res.json({
//                 status: true,
//                 message: "child data",
//                 data: success
//             })
//         })
//         .catch(error => {
//             return res.json({
//                 status: false,
//                 message: "something went wrong"
//             })
//         })
// }

// exports.delete = async (req, res) => {
//     const { childId } = req.params

//     if (!childId) {
//         return res.json({
//             status: false,
//             message: "please enter childId"
//         })
//     }

//     const isChildFound = await children.findOne({ _id: mongoose.Types.ObjectId(childId) })
//     if (!isChildFound) {
//         return res.json({
//             status: false,
//             message: "childId not provide"
//         })
//     }

//     await children.findOneAndDelete({ _id: mongoose.Types.ObjectId(childId) })
//         .then(success => {
//             return res.json({
//                 status: true,
//                 message: "child data deleted",
//                 data: success
//             })
//         })
//         .catch(error => {
//             return res.json({
//                 status: false,
//                 message: "something went wrong"
//             })
//         })
// }
