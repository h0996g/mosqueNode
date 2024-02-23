const express = require('express');
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const { protect } = require('../handler/auth');

const router = express.Router();
router.get('/', async (req, res) => {
    res.json({ message: 'hellow' })

})

// ---------------------User---------------------------------------------

router.get('/user', userController.loginUser)

router.post('/user', userController.createUser)


// ---------------------admin---------------------------------------------
router.get('/admin', adminController.loginAdmin)
router.post('/admin', adminController.createAdmin)

module.exports = router;
