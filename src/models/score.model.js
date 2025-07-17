import mongoose,{Schema} from 'mongoose';

const scoreSchema = new Schema
(
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
        debate:{type:mongoose.Schema.Types.ObjectId,ref:'Debate',required:true},
        argumentQuality: { type: Number, min: 0, max: 10 },
        rebuttalStrength: { type: Number, min: 0, max: 10 },
        engagementWithPOIs: { type: Number, min: 0, max: 5 },
        structureAndCohesion: { type: Number, min: 0, max: 5 },
        languageAndFluency: { type: Number, min: 0, max: 5 },
        roleFulfillment: { type: Number, min: 0, max: 5 },
        totalScore: { type: Number },
        normalizedScore: { type: Number },
        aiFeedback:String
    },
    {timestamps:true}
)

const Score = mongoose.model('Score',scoreSchema);
export {Score}