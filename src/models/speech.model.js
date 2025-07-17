import mongoose,{Schema} from 'mongoose';

const speechScehma = new Schema
(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        debate:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Debate',
            required:true
        },
        speeches:[
            {
                by:{type:String,enum:['user','ai'],required:true},
                role:{type:String,required:true},
                content:String,
            }
        ],
        pois:[
        
            {
                from:{by:{type:String,enum:['user','ai']},role:{type:String}},
                to:{by:{type:String,enum:['user','ai']},role:{type:String}},
                question:String,
                answer:String,
                answered:{type:Boolean,default:false}
            }
        ],
    },
    {timestamps:true}
)

const Speech = mongoose.model('Speech',speechScehma);
export {Speech}