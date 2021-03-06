import User from "../../models/User"
import connectDb from "../../utils/connectDb"
import catchErrors from "../../utils/catchErrors"
import axios from "axios"
import jwt from "jsonwebtoken"


connectDb()

export default async (req, res) => {
    switch (req.method) {
        case "GET" :
            await handleGetRequest(req, res);
            break;
        default :
            res.status(405).send(`Method ${req.method} not allowed`);     
            break;  
    }
};

async function handleGetRequest(req, res) {
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        const users = await User.find({_id : {$ne : userId}}).sort({role : "desc"})
        res.status(200).json(users)
    } catch (err) {
        console.error(err)
        res.status(403).send("Please login again")
    }
}