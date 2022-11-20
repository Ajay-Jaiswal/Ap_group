const employeeModel = require("../model/employeeModel");
const validator = require("../middleware/validation");
const companyModel = require("../model/companyModel");


const createCompany = async function(req,res){
    try{
    const requestBody = req.body
    const{name, logo, website, userId } = requestBody

    if (!validator.isValidString(name)) {
        return res
          .status(400)
          .send({ status: false, message: "name is required for updatation." });
      }
  
      if (!validator.isValidString(logo)) {
        return res
          .status(400)
          .send({ status: false, message: "logo is required for updatation." });
      }
  
      if (!validator.isValidString(website)) {
          return res
            .status(400)
            .send({ status: false, message: "website is required for updatation." });
        }

        if(!userId){
            return res.status(400).send({status:false, message: "please add UserId"})
        }

        const Already = await companyModel.findOne({name :name})
        if(Already){
            return res.status(400).send({status: false, message: "company already exist"})
        }


        const createdata = {
            name : name,
            website : website,
            userId : userId,
            logo : `http://localhost:4000/public/${req.file.filename}`
        }
    const data = await companyModel.create(createdata)

    return res.status(201).send({status:true, message:"employee profile Created Successfully", data:data })
    }
    catch(err){
        return res.status(500).send({status: false, message: err.message,})
    }
}



const readCompany = async function(req,res){
    try{
        const filter = {isDeleted : false}
        const data = await companyModel.find(filter)
        if(!data){
            return res.status(400).send({status:false, message: "No company exist"})
        }
        return res.status(200).send({status:true, message:"employee data",  data: data})
    }catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


const updateCompany = async function(req,res){
    try{
    let authorIdFromToken = req.authorId;
    let companyId = req.params.companyId;
    let requestBody = req.body;
    const {name, logo, website } = requestBody;

    if (!validator.isValidRequestBody(req.params)) {
      return res.status(400).send({status: false, message: "Invalid request parameters. Please provide query details"});
    }

    
    if (!validator.isValidObjectId(companyId)) {
      return res
        .status(400)
        .send({ status: false, message: `companyId is invalid.` });
    }

    if (!validator.isValidString(name)) {
      return res
        .status(400)
        .send({ status: false, message: "name is required for updatation." });
    }

    if (!validator.isValidString(logo)) {
      return res
        .status(400)
        .send({ status: false, message: "logo is required for updatation." });
    }

    if (!validator.isValidString(website)) {
        return res
          .status(400)
          .send({ status: false, message: "website is required for updatation." });
      }

      
     

    let company = await companyModel.findOne({ _id: companyId });
    if (!company) {
      return res.status(400).send({ status: false, msg: "No such Company found" });
    }
    console.log(company.userId)
    console.log(company.userId.toString())
    if (company.userId.toString() !== authorIdFromToken) {
      res.status(401).send({
        status: false,
        message: `Unauthorized access! user's info doesn't match`,
      });
      return;
    }
    if (
      req.body.name ||
      req.body.logo ||
      req.body.website 
    ) {
      const name = req.body.name;
      const logo = req.body.logo;
      const website = req.body.website;
      

      const updatedEmployee = await companyModel.findOneAndUpdate(
        { _id: req.params.companyId },
        {
            name: name,
            logo: logo,
            website : website,
        },
        { new: true }
      );
      
      return res.status(200).send({
        status: true,
        message: "Successfully updated company details",
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


const deleteCompanyById = async function (req, res) {
    try {
      //let authorIdFromToken = req.authorId;
      let id = req.params.companyId;
  
      if (!validator.isValidObjectId(id)) {
        return res
          .status(400)
          .send({ status: false, message: `companyId is invalid.` });
      }
  
      let Company = await companyModel.findOne({ _id: id });
  
      if (!Company) {
        return res.status(400).send({ status: false, msg: "No such Company found" });
      }
      
      let data = await companyModel.findOne({ _id: id });
      if (data.isDeleted == false) {
        let Update = await companyModel.findOneAndUpdate(
          { _id: id },
          { isDeleted: true, deletedAt: Date() },
          { new: true }
        );
        return res.status(200).send({
          status: true,
          message: "successfully deleted company",
        });
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "company already deleted" });
      }
    } catch (err) {
      res.status(500).send({ status: false, Error: err.message });
    }
  };
  

module.exports.createCompany = createCompany
module.exports.readCompany = readCompany
module.exports.updateCompany = updateCompany
module.exports.deleteCompanyById = deleteCompanyById