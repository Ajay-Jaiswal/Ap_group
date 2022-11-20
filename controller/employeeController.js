const employeeModel = require("../model/employeeModel");
const validator = require("../middleware/validation");
const companyModel = require("../model/companyModel");


const createEmployee = async function(req,res){
    try{
    const requestBody = req.body
    const{fname , lname , company, email, phone , userId } = requestBody

    if (!validator.isValidString(fname)) {
        return res
          .status(400)
          .send({ status: false, message: "fname is required for updatation." });
      }
  
      if (!validator.isValidString(lname)) {
        return res
          .status(400)
          .send({ status: false, message: "lname is required for updatation." });
      }
  
      if (!validator.isValidString(company)) {
          return res
            .status(400)
            .send({ status: false, message: "Company is required for updatation." });
        }

        if (!validator.isValidString(email)) {
            return res
              .status(400)
              .send({ status: false, message: "email is required for updatation." });
          }

          if(!userId){
            return res.status(400).send({status:false, message: "please add UserId"})
        }

          if (!validator.isValidObjectId(userId)) {
            return res
              .status(400)
              .send({ status: false, message: `userId is invalid.` });
          }
    
          

          if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
            return res.status(400).send({ status: false, message: 'Invalid Mail' })
        }
        //check for unique mail
        const isEmailAlreadyUsed = await employeeModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: 'This email is already registered' })
        }

           //check for unique phone no
           const isNoAlreadyUsed = await employeeModel.findOne({ phone })
           if (isNoAlreadyUsed) {
               return res.status(400).send({ status: false, message: 'This phone no is Already registered' })
           }
           //check for valid no
           if (!(/^[6-9]\d{9}$/.test(phone))) {
               return res.status(400).send({ status: false, message: 'Invalid phone no.' })
           }

           const companydetail = await companyModel.findOne({company: company})
           if(! companydetail){
            return res.status(400).send({ status: false, message: 'Invalid Company' })
           }

           const companydata = {
            name : companydetail.name,
            logo : companydetail.logo,
            website : companydetail.website
           }


    const data = await employeeModel.create(requestBody)

    return res.status(201).send({status:true, message:"employee profile Created Successfully", data:data , companydata:companydata })
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message,})
    }
}

const readEmployee = async function(req,res){
    try{
        const employeeName = req.query.fname || req.query.lname || req.query.email
        const filter = {isDeleted : false}
        const data = await employeeModel.findOne(filter , employeeName)
        return res.status(200).send({status:true, message:"employee data",  data: data})
    }catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


const updateEmployee = async function(req,res){
    try{
    let authorIdFromToken = req.authorId;
    let employeeId = req.params.employeeId;
    let requestBody = req.body;
    const {fname , lname , company, email, phone} = requestBody;

    if (!validator.isValidRequestBody(req.params)) {
      return res.status(400).send({status: false, message: "Invalid request parameters. Please provide query details"});
    }

    
    if (!validator.isValidObjectId(employeeId)) {
      return res
        .status(400)
        .send({ status: false, message: `employeeId is invalid.` });
    }

    if (!validator.isValidString(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "fname is required for updatation." });
    }

    if (!validator.isValidString(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "lname is required for updatation." });
    }

    if (!validator.isValidString(company)) {
        return res
          .status(400)
          .send({ status: false, message: "company is required for updatation." });
      }

     
      const isEmailAlreadyUsed = await employeeModel.findOne({ email })
      if (isEmailAlreadyUsed) {
          return res.status(400).send({ status: false, message: 'This email is already registered' })
      }

      //check for unique phone no
      const isNoAlreadyUsed = await employeeModel.findOne({ phone })
      if (isNoAlreadyUsed) {
          return res.status(400).send({ status: false, message: 'This phone no is Already registered' })
      }
      //check for valid no
   /*   if (!(/^[6-9]\d{9}$/.test(phone))) {
          return res.status(400).send({ status: false, message: 'Invalid phone no.' })
      }*/

   

    let employee = await employeeModel.findOne({ _id: employeeId });
    if (!employee) {
      return res.status(400).send({ status: false, msg: "No such employee found" });
    }
    if (employee.userId.toString() !== authorIdFromToken) {
      res.status(401).send({
        status: false,
        message: `Unauthorized access! author's info doesn't match`,
      });
      return;
    }
    if (
      req.body.fname ||
      req.body.lname ||
      req.body.company ||
      req.body.email ||
      req.body.phone
    ) {
      const fname = req.body.fname;
      const lname = req.body.lname;
      const company = req.body.company;
      const email = req.body.email;
      const phone = req.body.phone;

      const updatedEmployee = await employeeModel.findOneAndUpdate(
        { _id: req.params.employeeId },
        {
            fname: fname,
            lname: lname,
            company : company,
            email: email,
            phone : phone,
        },
        { new: true }
      );
      
      return res.status(200).send({
        status: true,
        message: "Successfully updated employee details",
        data: updatedEmployee,
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide employee details to update" });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: err.message,
    });
  }
}


const deleteEmployeeById = async function (req, res) {
    try {
      //let authorIdFromToken = req.authorId;
      let id = req.params.employeeId;
  
      if (!validator.isValidObjectId(id)) {
        return res
          .status(400)
          .send({ status: false, message: `employeeId is invalid.` });
      }
  
      let Company = await employeeModel.findOne({ _id: id });
  
      if (!Company) {
        return res.status(400).send({ status: false, msg: "No such Company found" });
      }
      
      let data = await employeeModel.findOne({ _id: id });
      if (data.isDeleted == false) {
        let Update = await employeeModel.findOneAndUpdate(
          { _id: id },
          { isDeleted: true, deletedAt: Date() },
          { new: true }
        );
        return res.status(200).send({
          status: true,
          message: "successfully deleted employee",
        });
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "employee already deleted" });
      }
    } catch (err) {
      res.status(500).send({ status: false, Error: err.message });
    }
  };
  

module.exports.createEmployee = createEmployee
module.exports.readEmployee = readEmployee
module.exports.updateEmployee = updateEmployee
module.exports.deleteEmployeeById = deleteEmployeeById