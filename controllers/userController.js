const User = require('../models/user')
const UserServices = require('../services/user.service')


exports.createUser = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, telephone, age, photo, prenom } = req.body;
        const duplicate = await UserServices.getUserByEmail(email);
        if (duplicate) {
            throw new Error(`User Name ${email}, Already Registered`)
        }

        const response = await UserServices.registerUser(email, mot_de_passe, nom, telephone, age, photo, prenom);

        let tokenData;
        tokenData = { _id: response._id, email: email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.json({ status: true, message: 'User registered successfully', token: token, id: response._id });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.loginUser = async (req, res, next) => {
    try {

        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            throw new Error('Parameter are not correct');
        }
        let user = await UserServices.checkUser(email);
        if (!user) {
            throw new Error('Joueur does not exist');
        }

        const isPasswordCorrect = await user.compareMot_de_passe(mot_de_passe);

        if (isPasswordCorrect === false) {
            throw new Error(`Username or Password does not match`);
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: user._id, email: user.email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "sendData", token: token, name: user.nom, email: user.email });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
