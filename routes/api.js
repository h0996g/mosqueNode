const express = require('express');

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const sectionController = require('../controllers/sectionController');
const lessonController = require('../controllers/lessonController');
const { protect, isAdmin } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'helloooo' })

})

// users----------------------------------------------------------------
// router.get('/user', userController.loginUser)
router.get('/user/myinformation', protect, userController.getMyInformation)

router.post('/user/login', userController.loginUser)
router.post('/user/register', userController.createUser)

// Update a user
router.put('/user', protect, userController.updateUser);

// Get a user by ID
router.get('/user/:id', userController.getUserById);
router.get('/user/progress/:id', protect, userController.getUserProgressById);

// Get all users
router.get('/users', protect, isAdmin, adminController.showAllStudents);

// Filter users
// router.get('/users/filter', userController.filterUsers);


router.put('/user/password', protect, userController.updatePassword);


// router.delete('/user/:id', protect, isAdmin, userController.deleteUser);


// ---------------------admin---------------------------------------------
router.post('/admin/login', adminController.loginAdmin)
// router.post('/admin/register', adminController.createAdmin)
router.get('/admin/myinformation', protect, isAdmin, adminController.getMyInformation)

// Update an admin (with token verification)
router.put('/admin', protect, isAdmin, adminController.updateAdmin);

// Get an admin by ID
// router.get('/admin/:id', adminController.getAdminById);

// Get all admins
// router.get('/admins', adminController.getAllAdmins);

// Filter admins
// router.get('/admins/filter', adminController.filterAdmins);

// Update admin password
router.put('/admin/password', protect, adminController.updatePassword);

// router.delete('/admin/:id', protect, isAdmin, adminController.deleteAdmin);


// router.post('/admin/recoverpassword', adminController.recoverPassword);
// router.post('/admins/verifytoken', adminController.verifyToken);
// router.post('/admin/resetpassword', adminController.resetPassword);

// router.get('/admin/user/progress/:id', adminController.showProgressStudent);
router.get('/admin/user/practice/section/:id', protect, isAdmin, adminController.showpracticeStudentSection);
router.get('/admin/user/practice/lesson', protect, isAdmin, adminController.showpracticeStudentLesson);

//---------------------------------Section-----------------------------
router.post('/section', protect, isAdmin, sectionController.createSection);
router.get('/sections', protect, sectionController.getAllSections);
router.get('/section/:id', protect, sectionController.getSectionById);
router.put('/section/:id', protect, isAdmin, sectionController.updateSection);
router.post('/section/:id', protect, isAdmin, sectionController.deleteSection);


//---------------------------------Lesson-----------------------------
router.post('/lesson', protect, isAdmin, lessonController.createLesson);
router.get('/lessons', protect, lessonController.getAllLessons);
router.get('/lesson/:id', protect, lessonController.getLessonById);
router.put('/lesson/:id', protect, isAdmin, lessonController.updateLesson);
router.delete('/lesson/:id', protect, isAdmin, lessonController.deleteLesson);
router.post('/lesson/complete', protect, lessonController.setSectionProgress);
router.post('/lesson/user/comment/:id', protect, lessonController.addCommentUser);
router.post('/lesson/admin/comment/:id', protect, lessonController.addCommentAdmin);
router.get('/lesson/comments/:id', protect, lessonController.getComments);
router.get('/lesson/quiz/:id', protect, lessonController.getQuiz);
router.put('/lesson/quiz/:id', protect, isAdmin, lessonController.updateQuiz);
router.put('/lesson/comment/:id', protect, lessonController.deleteComment);
module.exports = router;
