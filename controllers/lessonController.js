const Lesson = require('../models/lesson');

exports.createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('section');
        res.status(200).json(lessons);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('section');
        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
