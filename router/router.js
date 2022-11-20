const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const companyController = require('../controller/companyController')
const employeeController = require('../controller/employeeController')
const middleware = require('../middleware/auth')
const multer = require('multer')

router.get('/', function(req,res){
    return res.send({ message : "server is started"})
})

router.use(express.static(__dirname+"../public"))

////// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  
  var upload = multer({ storage: storage })
  ////////

//user routes
router.post('/user', userController.createAuthor)
router.post('/login', userController.loginAuthor)

//company rooutes
router.post('/createCompany',middleware.loginCheck,upload.single("logo"), companyController.createCompany)
router.get('/getCompany', companyController.readCompany)
router.put('/updateCompany/:companyId',middleware.loginCheck, companyController.updateCompany)
router.delete('/deleteCompany/:companyId',middleware.loginCheck, companyController.deleteCompanyById)

// employee routes
router.post('/createEmployee',middleware.loginCheck, employeeController.createEmployee)
router.get('/getEmployee', employeeController.readEmployee)
router.put('/updateEmployee/:employeeId',middleware.loginCheck, employeeController.updateEmployee)
router.delete('/deleteEmployee/:employeeId',middleware.loginCheck, employeeController.deleteEmployeeById)

module.exports = router;