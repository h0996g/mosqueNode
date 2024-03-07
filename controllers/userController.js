const UserServices = require('../services/user.service')


exports.createUser = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, telephone, age, photo, prenom } = req.body;
        const duplicate = await UserServices.getUserByEmail(email);
        if (duplicate) {
            // throw new Error(`User Name ${email}, Already Registered`)
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }

        const user = await UserServices.registerUser(email, mot_de_passe, nom, telephone, age, photo, prenom);

        let tokenData;
        tokenData = { _id: user._id, email: email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.json({ status: true, message: 'User registered successfully', token: token, data: user });


    } catch (err) {
        console.log("---> err -->", err);
        next(err);
    }
}

exports.loginUser = async (req, res, next) => {
    try {

        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            // throw new Error('Parameter are not correct');
            return res.status(400).json({ status: false, message: 'Les paramètres ne sont pas corrects' });
        }
        let user = await UserServices.checkUser(email);
        if (!user) {
            // throw new Error('User does not exist');
            return res.status(404).json({ status: false, message: 'Le joueur n\'existe pas' });
        }

        const isPasswordCorrect = await user.compareMot_de_passe(mot_de_passe);

        if (isPasswordCorrect === false) {
            // throw new Error(`Username or Password does not match`);
            return res.status(401).json({ status: false, message: 'Email ou le mot de passe ne correspond pas' });
        }

        // Creating Token

        let tokenData;
        tokenData = { _id: user._id, email: user.email };


        const token = await UserServices.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, success: "sendData", token: token, data: user });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}
