const StudentController = require('../controllers/student');
const { authentication, checkStudent } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/login', StudentController.login)
router.post('/register', StudentController.register)
router.use(authentication)
router.post('/join-class/:id', checkStudent, StudentController.joinClass)

module.exports = router