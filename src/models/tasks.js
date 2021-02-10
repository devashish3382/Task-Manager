const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    maxLength: 100,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }
}, { timestamps: true })
const Task = mongoose.model('tasks',taskSchema);
module.exports = Task;