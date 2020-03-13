import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import Cart from "../../models/Cart"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import isEmail from "validator/lib/isEmail"
import isLength from "validator/lib/isLength"

connectDb()

export default async (req, res) => {
    switch (req.method) {
        case "POST" :
            await handlePostRequest(req, res);
            break;
        default :
            res.status(405).send(`Method ${req.method} not allowed`);     
            break;  
    }
}

async function handlePostRequest(req, res) {
    const {name, email, password} = req.body;
    try {
      // Validate name / email/ password
      if(!isLength(name, {min: 3, max: 10})){
        return res.status(422).send("Name must be between 3 to 10 characters")
      } else if(!isLength(password, {min: 6})){
        return res.status(422).send("password should be minimum 6 characters")
      } else if(!isEmail(email)){
        return res.status(422).send("The Email must be valid one")
      }
      // 1. check to see if the user alraedy exists in DB
      const user = await User.findOne({email})     
      if(user) {
          return res.status(422).send(`User already exists with email: ${email}`)
      }      
      // 2. if not, hash their password
      const hash = await bcrypt.hash(password, 10)     
      // 3. create a user in DB
      const newUser  = await new User({
          name,
          email, 
          password: hash
      }).save();
      // 4. create a cart for the created user in DB
      await new Cart({
        user: newUser._id
      }).save();
      // 5. create a token for the user
      const token = jwt.sign({userId : newUser._id}, process.env.JWT_SECRET, {expiresIn: "1d"})      
      // 6. send back token  
      res.status(201).json(token)
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during SignUp request, Please try again later")
    }
}