const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locationFlorida:{
    type: String,
    required: true
  },
  picture:{
    type:String,
    required:true
  }
});

const Contact = mongoose.model('Contact', contactInfoSchema);

module.exports = Contact;
