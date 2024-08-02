const express = require('express');

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const sectionController = require('../controllers/sectionController');
const lessonController = require('../controllers/lessonController');
const { protect, isAdmin } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

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
router.get('/user/progress/:id', userController.getUserProgressById);

// Get all users
router.get('/users', adminController.showAllStudents);

// Filter users
router.get('/users/filter', userController.filterUsers);


router.put('/user/password', protect, userController.updatePassword);


router.delete('/user/:id', userController.deleteUser);
router.post('/user/recoverpassword', userController.recoverPassword);
router.post('/users/verifytoken', userController.verifyToken);
router.post('/user/resetpassword', userController.resetPassword);

// ---------------------admin---------------------------------------------
router.post('/admin/login', adminController.loginAdmin)
router.post('/admin/register', adminController.createAdmin)
router.get('/admin/myinformation', protect, isAdmin, adminController.getMyInformation)

// Update an admin (with token verification)
router.put('/admin', protect, adminController.updateAdmin);

// Get an admin by ID
router.get('/admin/:id', adminController.getAdminById);

// Get all admins
router.get('/admins', adminController.getAllAdmins);

// Filter admins
router.get('/admins/filter', adminController.filterAdmins);

// Update admin password
router.put('/admin/password', protect, adminController.updatePassword);

router.delete('/admin/:id', adminController.deleteAdmin);


router.post('/admin/recoverpassword', adminController.recoverPassword);
router.post('/admins/verifytoken', adminController.verifyToken);
router.post('/admin/resetpassword', adminController.resetPassword);
router.get('/admin/user/progress/:id', adminController.showProgressStudent);
router.get('/admin/user/practice/section/:id', adminController.showpracticeStudentSection);
router.get('/admin/user/practice/lesson', adminController.showpracticeStudentLesson);

//---------------------------------Section-----------------------------
router.post('/section', sectionController.createSection);
router.get('/sections', sectionController.getAllSections);
router.get('/section/:id', sectionController.getSectionById);
router.put('/section/:id', sectionController.updateSection);
router.post('/section/:id', protect, sectionController.deleteSection);


//---------------------------------Lesson-----------------------------
router.post('/lesson', lessonController.createLesson);
router.get('/lessons', lessonController.getAllLessons);
router.get('/lesson/:id', lessonController.getLessonById);
router.put('/lesson/:id', lessonController.updateLesson);
router.delete('/lesson/:id', lessonController.deleteLesson);
router.post('/lesson/complete', protect, lessonController.setSectionProgress);
router.post('/lesson/comment/:id', protect, lessonController.addComment);
router.get('/lesson/comments/:id', lessonController.getComments);
router.get('/lesson/quiz/:id', lessonController.getQuiz);

router.put('/lesson/quiz/:id', lessonController.updateQuiz);
router.put('/lesson/comment/:id', protect, lessonController.deleteComment);
module.exports = router;
