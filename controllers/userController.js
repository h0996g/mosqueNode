const User = require('../models/user')
const Token = require('../models/token')
// const Creneau = require('../models/creneau')
const UserServices = require('../services/user.service')
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");



exports.createUser = async (req, res, next) => {
    try {
        console.log("---req body---", req.body);
        const { email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom, username } = req.body;
        const duplicate = await UserServices.getUserByEmail(email);
        if (duplicate) {
            // throw new Error(`Etudient Name ${email}, Already Registered`)
            return res.status(400).json({ status: false, message: `L'email ${email} est déjà enregistré` });
        }

        const user = await UserServices.registerUser(email, mot_de_passe, nom, telephone, age, poste, wilaya, photo, prenom, username);

        let tokenData;
        tokenData = { _id: user._id, email: email, role: "user" };


        const token = await UserServices.generateAccessToken(tokenData, "365d")

        res.json({ status: true, message: 'user registered successfully', token: token, data: user });


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
            return res.status(404).json({ status: false, message: 'Le user n\'existe pas' });
        }

        const isPasswordCorrect = await user.compareMot_de_passe(mot_de_passe);

        if (isPasswordCorrect === false) {
            // throw new Error(`Username or Password does not match`);
            return res.status(401).json({ status: false, message: 'Email ou le mot de passe ne correspond pas' });

        }

        // Creating Token

        let tokenData;
        tokenData = { _id: user._id, email: user.email, role: "user" };


        const token = await UserServices.generateAccessToken(tokenData, "365d")

        res.status(200).json({ status: true, success: "Bien connecté", token: token, data: user });
    } catch (error) {
        console.log(error, 'err---->');
        next(error);
    }
}

exports.getMyInformation = async (req, res) => {
    try {
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.updateUser = async (req, res) => {
    try {
        // const id = req.params.id;
        const userData = req.body;

        // Extract admin ID from the token
        const user_id = req.user._id;

        // Update User data
        const updatedUser = await User.findByIdAndUpdate(user_id, userData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or unauthorized' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





exports.getAllUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const query = {};
        if (req.query.cursor) {
            query._id = { $lt: new ObjectId(req.query.cursor) }
        }
        // Fetch the documents from the database
        const users = await User.find(query).sort({ _id: -1 }).limit(limit);
        // Determine if there's more data to fetch
        const moreDataAvailable = users.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? users[users.length - 1]._id : null;

        res.json({
            data: users,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.filterUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3; // How many documents to return
        const filter = req.query; // Use the entire query object as the filter

        if (req.query.cursor) {
            filter._id = { $lt: new ObjectId(req.query.cursor) };
        }

        // Fetch the documents from the database, sort by _id
        const users = await User.find(filter).sort({ _id: -1 }).limit(limit);

        // Determine if there's more data to fetch
        const moreDataAvailable = users.length === limit;

        // Optionally, you can fetch the next cursor by extracting the _id of the last document
        const nextCursor = moreDataAvailable ? users[users.length - 1]._id : null;

        res.json({
            data: users,
            moreDataAvailable,
            nextCursor,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update admin password
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Extract admin ID from the token
        const user_id = req.user._id;

        // Fetch admin by ID
        const user = await User.findById(user_id);


        const isMatch = await user.compareMot_de_passe(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }


        user.mot_de_passe = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.deleteOne({ _id: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }

        // Check if a token already exists for this User
        const existingToken = await Token.findOne({ user_id: user._id });
        if (existingToken) {
            // Optional: Delete the existing token before creating a new one
            await Token.deleteOne({ _id: existingToken._id });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit code

        // Create a new token document in the database
        await Token.create({
            user_id: user._id, // Associate the token with the User
            token: verificationCode,
        });

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS, // Use environment variables
            },
        });

        // Define mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verification Code for Password Recovery',
            text: `Your verification code is: ${verificationCode}`,
        };

        // Send an email with the verification code
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ status: false, message: 'Internal server error' });
            }
            console.log('Email sent:', info.response);
            res.json({ status: true, message: 'Verification code sent successfully' });
        });
    } catch (error) {
        console.error('Error during password recovery:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { email, codeVerification } = req.body;

        // Find the User by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'Email not found.' });
        }

        // Find a token for the User
        const token = await Token.findOne({ user_id: user._id, token: codeVerification });
        if (!token) {
            // If no matching token found, respond with an error status
            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }

        // Delete the token after successful verification to ensure it's used only once
        // await Token.deleteOne({ _id: token._id });

        // Respond with success status if the token matches
        res.status(200).json({ status: true, message: 'Verification successful.' });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, codeVerification } = req.body;

        // Find the patient by email using Mongoose's findOne
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'Email not found. Please enter a registered email address.' });
        }


        const token = await Token.findOne({ user_id: user._id, token: codeVerification });
        if (!token) {
            // If no matching token found, respond with an error status
            return res.status(404).json({ status: false, message: 'Verification code does not match or has expired.' });
        }

        // Delete the token after successful verification to ensure it's used only once
        await Token.deleteOne({ _id: token._id });

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt); // Assuming 10 is the salt rounds

        // Update the User's password with the hashed new password using Mongoose's findOneAndUpdate
        await User.findOneAndUpdate(
            { email: email },
            { $set: { mot_de_passe: hashedPassword } } // Use $set to specify the fields to update
        );

        return res.status(200).json({ status: true, message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};