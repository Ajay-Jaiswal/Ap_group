const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const validator = require("../middleware/validation");
const secretKey = "JayVision";

//Creating Author documents by validating the details.
const createAuthor = async function (req, res) {
  try {
    // Request body verifying
    let requestBody = req.body;
    

    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameter, please provide author Detaills",
        });
    }

    //Extract body params
    const { fname, lname, title, email, password } = requestBody;

    // Validation started & detecting here the falsy values .
    if (!validator.isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "First name is required" });
    }
    if (!validator.isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Last name is required" });
    }
    if (!validator.isValid(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }
    if (!validator.isValidTitle(title)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `Title should be among Mr, Mrs and Miss`,
        });
    }
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }

    //Email validation whether it is entered perfectly or not.
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res.status(400).send({status: false,message: `Email should be a valid email address`});
      return;
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: `Password is required` });
    }

    if(password.length <8 ){
      return res.status(400).send({status:true , message: "password required minimum eight character"})
    }

    if(password.length > 20 ){
      return res.status(400).send({status:true , message: "password required maximum twenty character"})
    }


    const isEmailAlredyUsed = await userModel.findOne({ email });
    if (isEmailAlredyUsed) {
      return res
        .status(400)
        .send({
          status: false,
          message: `${email} email address is already registered`,
        });
    }
    //validation Ends

    const newUser = await userModel.create(requestBody);
    return res
      .status(201)
      .send({
        status: true,
        message: `user created successfully`,
        data: newUser,
      });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

//Login author Handler - Author won't be able to login with wrong credentials.
const loginAuthor = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. Please provide login details",
        });
    }

    //Extract params
    let { email, password } = requestBody;

    //Validation starts -
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required for login` });
    }

    //Email validation whether it is entered perfectly or not.
    email = email.trim();
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res
        .status(400)
        .send({
          status: false,
          message: `Email should be a valid email address`,
        });
      return;
    }
    if (!validator.isValid(password)) {
      //Password is entered correctly or not.
      return res
        .status(400)
        .send({ status: false, message: `Password is mandatory for login` });
    }
    //Validitions ends

    const findUser = await userModel.findOne({ email, password }); //finding author details in DB to get a match of the provided Email and password.

    if (!findUser) {
      return res
        .status(401)
        .send({
          status: false,
          message: `Invalid login credentials. Please check the details & try again.`,
        });
    }



    //creating JWT
    let token = jwt.sign({ authorId: findUser._id }, secretKey);
    res.header("x-api-key", token);
    res.cookie("x-api-key", token,{
      expires : new Date(Date.now()+9000000),
      httpOnly : true
    });

    let decoded = jwt.verify(token, secretKey)
    console.log(decoded)

    if (!decoded) {
        return res.status(403).send({ status: false, message: `Invalid authentication token in request` })
    }

    authorId = decoded.authorId
    let finddetail = await userModel.findOne({_id : authorId})
    return res
      .status(201)
      .send({
        status: true,
      message: `User login successfully =  ${authorId}`,
      userId : authorId,
      email : finddetail.email,
      fname : finddetail.fname,
      lname : finddetail.lname,
        data: { token },
      });
      
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = {
  createAuthor,
  loginAuthor,
};