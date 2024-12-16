const mongoose = require('mongoose');

const homeInfoSchema = new mongoose.Schema({
  titlesmall: {
    type: String,
    required: true
  },
  titlesmall1: {
    type: String,
    required: true
  },
  titlesmall2: {
    type: String,
    required: true
  },
  titlesmall3: {
    type: String,
    required: true
  },
  titlelarge: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  videoheader: {
    type: String,
    required: true
  },
  videobackground:{
    type:String,
    required:true
  }
});

const Home = mongoose.model('Home', homeInfoSchema);

module.exports = Home;
