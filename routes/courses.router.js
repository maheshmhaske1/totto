var express = require('express');
var router = express.Router();
const course = require('../controller/course.controller')
const courseModel = require('../model/cources.model')

router.post('/add', course.add)
router.get('/get/:Id', course.getById)
router.get('/all', course.getAll)
router.put('/update/:courseId', course.update)
router.delete('/delete/:courseId', course.delete)
router.post('/add-chapter/:courseId', course.addChapter)

const AWS = require('aws-sdk');
const multer = require('multer');
const { default: mongoose } = require('mongoose');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async function (req, res) {
    const { name, desc, courseId } = req.body
    const file = req.file;

    console.log(req.body)

    if (!courseId) {
        return res.json({
            status: false,
            massage: "courseId not be empty"
        })
    }

    const isCourseFound = await courseModel.findOne({ _id: mongoose.Types.ObjectId(courseId) })
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
        Key:Date.now()+fileName,
        Body: fileContent,
        ContentType: file.mimetype
    }

    s3.upload(params, (error, data) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        } else {
            const chapterData = {
                url: data.Location,
                name: name,
                desc: desc
            };

            
            courseModel.updateOne(
                { _id: courseId },
                { $push: { chapters: chapterData } },
                { returnOriginal: false }
            )
            .then(success=>{
                return res.json({
                    status:false,
                    massage:"course added",
                    data:success
                })
            })
        }
    });
});

module.exports = router;
