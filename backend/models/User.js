const mongoose=require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {type:String, required:true}, 
  email: {type:String, required:true},
  password: {type:String},
  profilePic: {type:String},
  isAdmin: {
    type: Boolean,
    required: true,
    default: false // Default to false so new users aren't admins
  },
  solvedProblems : [{
    type: Schema.Types.ObjectId,
    ref: "Question"
  }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;