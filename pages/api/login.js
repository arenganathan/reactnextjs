import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    const {email, password} = req.body;
    try {
      // 1. check to see if the user alraedy exists in DB
      const user = await User.findOne({email}).select("+password")      
      if(!user) {
          return res.status(404).send(`User not exists with email: ${email}`)
      }      
      // 2. validate the given password with DB password via hash match
      const passwordMatch = await bcrypt.compare(password, user.password)     
      if (!passwordMatch){
        return res.status(401).send(`Password not matches, please provide valid password`)
      }
      // 3. if matches, create a token for the user
      const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn: "1d"})      
      // 4. send back token  
      res.status(201).json(token)
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during Login request, Please try again later")
    }
}