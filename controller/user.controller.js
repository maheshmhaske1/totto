const userModel = require('../model/user.model')
const mailMiddleware = require('../middleware/mail.middleware')
const jwtMiddleware = require('../middleware/auth')
const fs = require('fs-extra')
const otpModel = require('../model/otp.model')
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv').config()


exports.createUser = async (req, res) => {
    let { name, email, mobile } = req.body

    let error_message = `please enter`
    if (!name) {
        error_message += `name`
    }
    if (!mobile) {
        error_message += `, mobile`
    }
    if (!email) {
        error_message += `, Email`
    }

    if (error_message !== "please enter") {
        return res.json({
            success: false,
            message: error_message
        })
    }

    const isUserFound = await userModel.findOne({ mobile: mobile })
    if (isUserFound) {
        return res.json({
            success: false,
            message: "user already exist please login"
        })
    }


    await new userModel({
        name: name,
        email: email,
        mobile: mobile,
    }).save()
        .then(async (success) => {
            console.log("success ==>", success)

            const token = await jwtMiddleware.generate_token_user(success._id, success.mobile)
            console.log(token)
            await userModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(success._id) },
                { $set: { token: token } },
                { returnOriginal: false }
            )
                .then((success) => {
                    return res.json({
                        success: true,
                        message: `user registered`,
                        data: success
                    })
                })
                .catch((error) => {
                    return res.json({
                        success: false,
                        message: "something went wrong", error
                    })
                })
        })
        .catch((error) => {
            return res.json({
                success: false,
                message: "something went wrong", error
            })
        })
}

exports.sendOtp = async (req, res) => {
    const mobile = req.params.mobile

    if (!mobile) {
        return res.json({
            status: false,
            message: "please enter mobile"
        })
    }

    return res.json({
        status: true,
        message: `otp sent on ${mobile} your otp is 000000`
    })
}

exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body

    if (!mobile || !otp) {
        return res.json({
            status: false,
            message: "mobile and otp required"
        })
    }

    if (otp !== '000000') {
        return res.json({
            status: false,
            message: "please enter valid otp"
        })
    }

    const isUserExist = await userModel.findOne({
        mobile: mobile
    })

    if (!isUserExist) {
        return res.json({
            isNewUser: true,
            message: "user not present",
            data: []
        })
    }
    else {
        return res.json({
            isNewUser: true,
            message: "user already present",
            data: isUserExist
        })
    }
}

exports.isUserExist = async (req, res) => {
    const mobile = req.params.mobile

    if (!mobile) {
        return res.json({
            status: false,
            message: "please enter mobile"
        })
    }

    const isUserExist = await userModel.findOne({
        mobile: mobile
    })

    if (!isUserExist) {
        return res.json({
            status: false,
            message: "user not present with this mobile"
        })
    }
    else {
        return res.json({
            status: true,
            message: "user exists"
        })
    }
}

exports.login = async (req, res) => {
    let { username, password } = req.body

    let error_message = `please enter`

    if (!username) {
        error_message += `, email`
    }
    if (!password) {
        error_message += `, password`
    }

    if (error_message !== "please enter") {
        return res.json({
            success: false,
            message: error_message
        })
    }


    const isUserFound = await userModel.findOne({ email: username })
    console.log(isUserFound)
    if (!isUserFound) {
        return res.json({
            success: false,
            message: "user not registered please register"
        })
    }

    if (bcrypt.compareSync(password, isUserFound.password)) {
        return res.json({
            success: true,
            message: `logged in`,
            data: isUserFound
        })
    }
    else {
        return res.json({
            success: false,
            message: `incorrect password`
        })
    }
}

exports.resetPassword = async (req, res) => {
    let { username, newPassword, otp } = req.body

    let error_message = `please enter`

    if (!username) {
        error_message += `, email`
    }
    if (!newPassword) {
        error_message += `, password`
    }
    if (!otp) {
        error_message += `, otp`
    }

    if (error_message !== "please enter") {
        return res.json({
            success: false,
            message: error_message
        })
    }

    const isUserFound = await userModel.findOne({ email: username })
    console.log(isUserFound)
    if (!isUserFound) {
        return res.json({
            success: false,
            message: "user not registered please register"
        })
    }

    const isValidOtp = await otpModel.findOne({ email: username }).sort({ _id: -1 })
        .then(async (success) => {
            if (!success) {
                return res.json({
                    success: false,
                    message: `record not found`
                })
            }
            else {
                if (otp == success.otp && success.validTill > Date.now()) {
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
                    console.log("hashedNewPassword ==>", hashedNewPassword)
                    console.log("newPassword ==>", newPassword)
                    console.log("Usrname ==>", username)
                    await userModel.findByIdAndUpdate({ _id: isUserFound._id },
                        {
                            $set: {
                                password: hashedNewPassword
                            }
                        })
                        .then((success) => {
                            console.log(success)
                            if (success) {
                                return res.json({
                                    success: true,
                                    message: "password changed successfully"
                                })
                            }
                            x
                        })
                        .catch((error) => {
                            return res.json({
                                success: false,
                                message: "error while changing password"
                            })
                        })
                }
                else if (otp == success.otp && success.validTill < Date.now()) {
                    return res.json({
                        success: false,
                        message: "otp expired"
                    })
                }
                else {
                    return res.json({
                        success: false,
                        message: "otp not matched"
                    })
                }
            }
        })
        .catch((error) => {
            return res.json({
                success: false,
                message: "something went wrong", error
            })
        })

    console.log(isValidOtp)

}

// exports.isUserExist = async (req, res) => {
//     let { username } = req.body

//     let error_message = `please enter`

//     if (!username) {
//         error_message += `, email`
//     }

//     if (error_message !== "please enter") {
//         return res.json({
//             success: false,
//             message: error_message
//         })
//     }

//     const isUserFound = await userModel.findOne({ email: username })
//     if (!isUserFound) {
//         return res.json({
//             success: false,
//             message: "email not registered"
//         })
//     }
//     else {
//         return res.json({
//             success: true,
//             message: "user found"
//         })
//     }

// }

exports.addUserWallet = async (req, res) => {
    const { userId, price } = req.body

    if (!userId) {
        return res.json({
            status: false,
            message: "userId required"
        })
    }

    const isUserExist = await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) })
    if (!isUserExist) {
        return res.json({
            status: false,
            message: "invalid userId"
        })
    }

    await userModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        {
            $set: {
                wallet: isUserExist.wallet + price
            }
        },
        { returnOriginal: false }
    )
        .then((success) => {
            return res.json({
                success: true,
                message: `money added in user wallet`,
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

/* ---------- remove profile image ------------ */
exports.remove_profile_img = async (req, res) => {
    const { user_id } = req.body

    if (!user_id)
        return res.json({
            status: false,
            message: `please select user_id`,
        })

    const users = await userModel.findById({ _id: user_id })
    if (users == null || !users)
        return res.json({
            status: false,
            message: `invalid user_id`
        })

    user.findByIdAndUpdate({ _id: user_id },
        {
            $set: {
                displayPhoto: null
            }
        },
        { returnOriginal: true }
    )
        .then(async (success) => {
            let filename = success.displayPhoto
            await fs.remove(`./public/profile_images/${filename}`); // remove upload dir when uploaded bucket

            return res.json({
                status: true,
                message: `profile image removed`,
            })
        })
}

/* ---------- update profile image ------------ */
exports.add_profile_image = async (req, res) => {
    const { user_id } = req.params


    if (!req.file)
        return res.json({
            status: false,
            message: `please select image`,
        })

    if (!user_id)
        return res.json({
            status: false,
            message: `please select user_id`,
        })

    const users = await userModel.findById({ _id: user_id })
    if (users == null || !users)
        return res.json({
            status: false,
            message: `invalid user_id`
        })


    const displayPhoto = req.file.filename
    console.log(displayPhoto)
    userModel.findByIdAndUpdate({ _id: user_id },
        {
            $set: { photo: displayPhoto }
        },
        { returnOriginal: true }
    )
        .then(async (success) => {
            let filename = success.photo
            let root_url = req.protocol + "://" + req.headers.host
            let profile_url = root_url + "/profile_images/" + displayPhoto
            await fs.remove(`./public/profile_images/${filename}`); // remove image from bucket

            return res.json({
                status: true,
                message: `profile image updated successfully`,
                data: {
                    user_id: success._id,
                    profile_images: profile_url
                }
            })
        })
        .catch((error) => {
            return res.json({
                status: false,
                message: `error`, error
            })
        })
}