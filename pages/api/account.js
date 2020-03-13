import connectDb from "../../utils/connectDb"
import User from "../../models/User"
import jwt from "jsonwebtoken"

connectDb()

export default async (req, res) => {
    switch (req.method) {
        case "GET" :
            await handleGetRequest(req, res);
            break;
        case "PUT" :
            await handlePutRequest(req, res);
            break;
        default :
            res.status(405).send(`Method ${req.method} not allowed`);     
            break;  
    }
};

async function handlePutRequest(req, res) {
    try {      
        const {_id, role} = req.body
        const user = await User.findOneAndUpdate(
            {_id},
            { role})
        res.status(203).send("User Updated")        
    } catch (err) {
        console.error(err);
        res.status(403).send("Invalid token")
    }  
}

async function handleGetRequest(req, res) {
    if(!("authorization" in req.headers)) {
        return res.status(401).send(`No Authorization token`);   
    }
    try {      
        // 1. Verify the JWT Token
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)      
        // 2. Get User details from DB adn respond back 
        const user = await User.findOne({_id : userId})
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).send("User not found")
        }       
    } catch (err) {
        console.error(err);
        res.status(403).send("Invalid token")
    }    
}

