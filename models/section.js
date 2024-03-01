const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;



const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    descriprion: {
        type: String,
        required: true
    },
    resultat: [{
        user: {
            type: ObjectId, required: false,
            ref: "User"
        },
        score: {
            type: Number
        }
    }],
    lesson: [{
        type: ObjectId, required: false,
        ref: "Lesson"
    }],
}, { timestamps: true })

const Section = mongoose.model('Section', sectionSchema)
module.exports = Section   