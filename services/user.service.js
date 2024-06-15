const user = require('../models/user');

const jwt = require("jsonwebtoken");

class UserServices {

    static async registerUser(email, mot_de_passe, nom, telephone, age, photo, prenom, username) {
        try {
            console.log("-----Email --- Password-----", email, mot_de_passe, nom, telephone, age, photo, prenom, username);

            const createUser = new user({ email, mot_de_passe, nom, telephone, age, photo, prenom, username });
            return await createUser.save();
        } catch (err) {
            throw err;
        }
    }

    static async getUserByEmail(email) {
        try {
            return await user.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    static async checkUser(email) {
        try {
            return await user.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWT_EXPIRE) {
        return jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRE });
    }
}

module.exports = UserServices;