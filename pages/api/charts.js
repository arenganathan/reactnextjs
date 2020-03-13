import connectDb from "../../utils/connectDb"
import axios from "axios"
import Zipcode from "../../models/Zipcode"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

connectDb()

export default async(req, res) => {
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        const zipcodes  = await Zipcode.aggregate([
            { $group:
                {
                  _id: { state: "$state", city: "$city", loc: "$loc" },
                  pop: { $sum: "$pop" }
                }
             },
             { $sort: { pop: 1 } },
             { $group:
                {
                  _id : "$_id.state",
                  biggestCity:  { $last: "$_id.city" },
                  biggestPop:   { $last: "$pop" },
                  biggestCityLoc:   { $last: "$_id.loc" },
                  smallestCity: { $first: "$_id.city" },
                  smallestPop:  { $first: "$pop" },
                  smallestCityLoc:   { $first: "$_id.loc" },
                }
             },
            { $project:
              { _id: 0,
                state: "$_id",
                biggestCity:  { name: "$biggestCity",  pop: "$biggestPop", loc: "$biggestCityLoc" },
                smallestCity: { name: "$smallestCity", pop: "$smallestPop", loc: "$smallestCityLoc" }
              }
            }
        ])                        
        res.status(200).json({zipcodes})
    } catch (err) {
        console.error("Error during Zipcode retrieval API", err)
        res.status(403).send("Error during Zipcode retrieval API")
    }
    
}