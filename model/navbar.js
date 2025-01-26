const mongoose = require('mongoose');

const navbarInfoSchema = new mongoose.Schema({
  home: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  services:{
    type:String,
    required:true
  },
  trucktypes:{
    type:String,
    required:true
  },
  testimonials: {
    type: String,
    required: true
  },
  faqs: {
    type: String,
    required: true
  },
  truckstop: {
    type: String,
    required: true
  },
  contact:{
    type:String,
    required:true
  },
  setup:{
    type:String,
    required:true
  },
  picture:{
    type:String,
    required:true
  }

  
});

const Navbar = mongoose.model('Navbar', navbarInfoSchema);

module.exports = Navbar;
