import mongoose from "mongoose"

const {Number, String} = mongoose.Schema.Types

const ZipcodeSchema = new mongoose.Schema({
    city : {
        type: String,
        required: true
    },
    state : {
        type: String,
        required: true
    },
    pop : {
        type: Number,
        required: true
    },
    loc : [
        {
            type : Number,
            required: true
        }
    ]
})

export default mongoose.models.Zipcode || mongoose.model("Zipcode",ZipcodeSchema)