const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;

const sectionSchema = new mongoose.Schema({
    admin: { type: ObjectId, required: true, ref: "Admin" },
    photo: { type: String, required: false },
    name: { type: String, requeired: true },
    description: { type: String, required: true },

    lesson: [{
        type: ObjectId, required: false, ref: "Lesson"
    }],
}, { timestamps: true })

const Section = mongoose.model('Section', sectionSchema)
module.exports = Section   