const mongoose = require('mongoose')

const childrenSchema = new mongoose.Schema({
    childId:{
        type:mongoose.Types.ObjectId
    },
    calm_himself_by_bringing_hand_to_mouth: {
        type: Number,
        default: 0
    },
    express_emotions_like_pleasure_and_discomfort: {
        type: Number,
        default: 0
    },
    try_to_look_for_his_parent: {
        type: Number,
        default: 0
    },
    recognize_family_faces: {
        type: Number,
        default: 0
    },
    smile_at_familiar_faces: {
        type: Number,
        default: 0
    },
    respond_positively_to_touch: {
        type: Number,
        default: 0
    },
    make_gurgling_sound: {
        type: Number,
        default: 0
    },
    cry_differently_on_different_need: {
        type: Number,
        default: 0
    },
    try_to_imitate_sound: {
        type: Number,
        default: 0
    },
    follow_people_with_his_eyes: {
        type: Number,
        default: 0
    },
    follow_object_with_his_eyes: {
        type: Number,
        default: 0
    },
    observe_faces_with_interest: {
        type: Number,
        default: 0
    },
    raise_his_head_lying_on_his_stomach: {
        type: Number,
        default: 0
    },
    bring_his_hand_to_his_mouth: {
        type: Number,
        default: 0
    },
    try_to_touch_dangling_objects: {
        type: Number,
        default: 0
    },
    has_started_to_smile_at_others: {
        type: Number,
        default: 0
    }
})


var childrenModel = mongoose.model('quations', childrenSchema);
module.exports = childrenModel;