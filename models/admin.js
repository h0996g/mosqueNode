const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const ObjectId = mongoose.Types.ObjectId;


const adminSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    telephone: {
        type: Number,
        require: true
    },
    mot_de_passe: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        // required: true
    },

}, { timestamps: true })


adminSchema.pre("save", async function () {
    var admin = this;
    if (!admin.isModified("mot_de_passe")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.mot_de_passe, salt);

        admin.mot_de_passe = hash;
    } catch (err) {
        throw err;
    }
});


//used while signIn decrypt
adminSchema.methods.compareMot_de_passe = async function (candidateMot_de_passe) {
    try {
        console.log('----------------no mot_de_passe', this.mot_de_passe);
        // @ts-ignore
        const isMatch = await bcrypt.compare(candidateMot_de_passe, this.mot_de_passe);
        return isMatch;
    } catch (error) {
        throw error;
    }
};



const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin   