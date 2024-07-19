const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;

const lessonSchema = new mongoose.Schema({
    // admin: { type: ObjectId, required: true, ref: "Admin" },
    section: { type: ObjectId, required: true, ref: "Section" },
    title: { type: String, },
    photo: { type: String, required: false },
    urlVideo: { type: String, required: true },
    description: { type: String, required: true },
    suplemmentPdf: { type: String, required: false },
    duration: { type: String, required: true },

    quize: [{
        question: { type: String, },
        correctAnswerIndex: [Number],
        options: [
            String,

        ]
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, required: false, refPath: 'commants.onModel' },
        onModel: { type: String, required: true, enum: ['User', 'Admin'] },
        isDeleted: { type: Boolean, default: false },
        comment: { type: String }, createdAt: { type: Date, default: Date.now },
    }]

    ,

}, { timestamps: true })
lessonSchema.post('save', async function (doc, next) {
    try {
        await mongoose.model('Section').updateOne({ _id: doc.section }, { $push: { lesson: doc._id } })
    } catch (error) {
        console.log(error)
    }

});

const Lesson = mongoose.model('Lesson', lessonSchema)
module.exports = Lesson   