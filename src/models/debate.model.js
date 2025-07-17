import mongoose, {Schema} from "mongoose";

const debateSchema = new Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        roomId:{
            type:String,
            trim:true,
            unique: true,
            trim: true,
        },
        topic:{
            type:String,
            lowercase:true,
            trim:true,
            required:true
        },
        format:{
            type:String,
            enum:['asian','british'],
            required :true
        },
        level:{
            type:String,
            enum:['beginner','intermediate','advanced'],
            required:true
        },
        roles:
        [
            {   
                by:{type:String,enum:['user','ai'],required:true},
                role:{type:String,required:true},
            }
        ],
    },
    {timestamps:true}
)

const Debate = mongoose.model('Debate',debateSchema);
export {Debate}
