const mongoose = require('mongoose');

const followInfoSchema = new mongoose.Schema({
  followtitle: {
    type: String,
    required: true
  }, 
  facelink: {
    type: String,
    required: true
  },
  instagramlink: {
    type: String,
    required: true
  },
  linkedlink:{
    type:String,
    required:true
  },
  
});

const Follow = mongoose.model('Follow', followInfoSchema);

module.exports = Follow;
