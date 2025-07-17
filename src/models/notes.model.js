import mongoose from 'mongoose';

const statementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Claim', 'Rebuttal', 'POI', 'Emotion', 'Summary'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const speakerNoteSchema = new mongoose.Schema({
  speaker: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  statements: {
    type: [statementSchema],
    default: [],
  },
});

const notesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
  },
  debate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debate',
    required: true,
  },
  notes: {
    type: [speakerNoteSchema],
    default: [],
  },
}, { timestamps: true });

export const Notes = mongoose.model('Notes', notesSchema);
