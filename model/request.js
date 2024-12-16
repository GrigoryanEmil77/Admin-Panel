const mongoose = require('mongoose');

const requestInfoSchema = new mongoose.Schema({
  titlefirst: {
    type: String,
    required: true
  },
  titlesecond: {
    type: String,
    required: true
  },

  
});

const Request = mongoose.model('Request', requestInfoSchema);

module.exports = Request;
