const { default: mongoose } = require('mongoose')
const course = require('../model/cources.model')
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


exports.add = async (req, res) => {
    const {
        courseName,
        courseDesc,
        instructorOccupation,
        instructorName,
        instructorDesc,
        price,
        whatYouGet
    } = req.body


    await new course({
        courseName: courseName,
        courseDesc: courseDesc,
        instructorOccupation: instructorOccupation,
        instructorName: instructorName,
        instructorDesc: instructorDesc,
        price: price,
        whatYouGet: whatYouGet
    })
        .save()
        .then(success => {
            return res.json({
                status: true,
                message: "course added",
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
    const { Id } = req.params

    if (!Id) {
        return res.json({
            status: false,
            message: "please enter Id"
        })
    }

    const isChildFound = await course.findOne({ _id: mongoose.Types.ObjectId(Id) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "course not present"
        })
    }

    await course.findOne({ _id: mongoose.Types.ObjectId(Id) })
        .then(success => {
            return res.json({
                status: true,
                message: "course data",
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

exports.getAll = async (req, res) => {


    await course.find()
        .then(success => {
            return res.json({
                status: true,
                message: "course data",
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

exports.update = async (req, res) => {
    const { courseId } = req.params
    const { courseName: courseName,
        courseDesc: courseDesc,
        instructorOccupation: instructorOccupation,
        instructorName: instructorName,
        instructorDesc: instructorDesc,
        price: price,
        whatYouGet: whatYouGet } = req.body

    if (!courseId) {
        return res.json({
            status: false,
            message: "please enter courseId"
        })
    }

    const isChildFound = await course.findOne({ _id: mongoose.Types.ObjectId(courseId) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "course not present"
        })
    }

    await course.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(courseId) },
        {
            $set: {
                courseName: courseName,
                courseDesc: courseDesc,
                instructorOccupation: instructorOccupation,
                instructorName: instructorName,
                instructorDesc: instructorDesc,
                price: price,
                whatYouGet: whatYouGet
            }
        },
        { returnOriginal: false }
    )
        .then(success => {
            return res.json({
                status: true,
                message: "course data updated",
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
    const { courseId } = req.params

    if (!courseId) {
        return res.json({
            status: false,
            message: "please enter courseId"
        })
    }

    const isChildFound = await course.findOne({ _id: mongoose.Types.ObjectId(courseId) })
    if (!isChildFound) {
        return res.json({
            status: false,
            message: "course not present"
        })
    }

    await course.findOneAndDelete({ _id: mongoose.Types.ObjectId(courseId) })
        .then(success => {
            return res.json({
                status: true,
                message: "course data deleted",
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



exports.addChapter = (upload.single('file'), async function (req, res) {
    const { courseId } = req.params
    const { name, desc } = req.body
    const file = req.file;

    console.log(file)

    if (!courseId) {
        return res.json({
            status: false,
            massage: "courseId not be empty"
        })
    }

    const isCourseFound = await course.findOne({ _id: mongoose.Types.ObjectId(courseId) })
    if (!isCourseFound) {
        return res.json({
            status: false,
            massage: "course not present"
        })
    }

    if (!file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const fileContent = file.buffer;
    const fileName = file.originalname;

    const s3 = new AWS.S3({
        accessKeyId: 'AKIA3SQJVY37NXUIPSJ5',
        secretAccessKey: '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',
    });

    const params = {
        Bucket: "tottoo",
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype
    }

    await s3.upload(params, (error, data) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            const chapterData = {
                url: data.Location,
                name: name,
                desc: desc
            };

            course.updateOne(
                { _id: courseId },
                { $push: { chapters: chapterData } }
            )
            console.log(data)
            res.status(200).send("File uploaded successfully");
        }
    });
});
