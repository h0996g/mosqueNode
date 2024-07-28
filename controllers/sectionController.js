const Section = require('../models/section');
const Admin = require('../models/admin');
const { use } = require('../routes/api');

exports.createSection = async (req, res) => {
    try {
        const section = await Section.create(req.body);
        res.status(201).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.find();
        res.status(200).json(sections);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id).select('-createdAt -updatedAt -__v').populate({ path: 'lesson', select: '-photo -comments -quize -createdAt -updatedAt -__v' });
        res.status(200).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(section);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const admin_id = req.user._id;
        const mot_de_passe = req.body.mot_de_passe;
        const admin = await Admin.findById(admin_id);
        console.log(mot_de_passe);
        if (!mot_de_passe) {
            return res.status(400).json({ status: false, message: 'Les paramètres ne sont pas corrects' });
        }
        const isMot_de_passeCorrect = await admin.compareMot_de_passe(mot_de_passe);
        if (!isMot_de_passeCorrect) {
            return res.status(401).json({ status: false, message: 'password incorrect' });
        }


        await Section.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
