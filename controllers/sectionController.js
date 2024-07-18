const Section = require('../models/section');

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
        await Section.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
