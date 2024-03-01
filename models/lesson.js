const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;



const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true
    },
    urlVideo: {
        type: String,
        required: true
    },
    descriprion: {
        type: String,
        required: true

    },
    quize: [{
        question: {
            type: String,
        },
        Answer: {
            type: String
        }
    }],
    commants: [{
        user: {
            type: ObjectId, required: false,
            ref: "User"
        },
        commant: {
            type: String
        }
    }],


}, { timestamps: true })






const Lesson = mongoose.model('Lesson', lessonSchema)
module.exports = Lesson   