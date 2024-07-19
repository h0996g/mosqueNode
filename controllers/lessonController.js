const Lesson = require('../models/lesson');
const User = require('../models/user');
const Admin = require('../models/admin');

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


// Function to set section progress for a user
exports.setSectionProgress = async (req, res) => {
    try {
        const { sectionId, lessonId, score } = req.body;
        const userId = req.user._id;
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the section progress for the given section
        let sectionProgress = user.sectionProgress.find(
            (progress) => progress.section.toString() === sectionId
        );

        if (!sectionProgress) {
            // If section progress doesn't exist, create a new one with the completed lesson and score
            sectionProgress = {
                section: sectionId,
                completedLessons: [{ _id: lessonId, score: score }],
            };
            user.sectionProgress.push(sectionProgress);
        } else {
            // If section progress exists, check if the lesson is already completed
            const completedLesson = sectionProgress.completedLessons.find(
                (lesson) => lesson._id.toString() === lessonId
            );
            console.log(completedLesson);

            if (!completedLesson) {
                // If lesson is not completed, add it to the completedLessons array
                sectionProgress.completedLessons.push({ _id: lessonId, score });
            } else {
                // If lesson is already completed, update the score
                completedLesson.score = score;
            }
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ sectionProgress: user.sectionProgress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addComment = async (req, res) => {
    try {
        const { comment, onModel } = req.body;
        let userId;
        if (onModel === 'User') {
            userId = req.user._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        } else if (onModel === 'Admin') {
            userId = req.user._id;
            const admin = await Admin.findById(userId);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
        }
        const lesson = await Lesson.findOneAndUpdate(
            { _id: req.params.id },
            {
                $push: {
                    comments: { user: userId, onModel, comment },
                },
            },
            { new: true }
        );
        const newComment = lesson.comments[lesson.comments.length - 1];
        res.status(201).json(newComment._id);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}

exports.getComments = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).select('comments').populate({
            path: 'comments.user',
            model: 'User',
            select: ['username', 'photo']
        });
        res.status(200).json(lesson.comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getQuiz = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).select('quize');
        res.status(200).json(lesson.quize);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
exports.deleteComment = async (req, res) => {
    // delete comment and set deleted to true and remove comment String
    try {
        const commentId = req.body.commentId;
        const lesson = await Lesson.findOneAndUpdate(
            { _id: req.params.id, 'comments._id': commentId },
            {
                $set: {
                    'comments.$.isDeleted': true,
                    'comments.$.comment': '',
                },
            },
            { new: true }
        );
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


}

