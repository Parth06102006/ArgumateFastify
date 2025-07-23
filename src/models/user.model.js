import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:
        {
            type:String,
            required:[true,"password is required"]
        },
    },
    {timestamps:true}
)

userSchema.methods.isPasswordCorrect = async function(password)
{
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User',userSchema)
