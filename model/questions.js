const mongoose = require('mongoose');

const questionsInfoSchema = new mongoose.Schema({
    titlefirst: {
        type: String,
        required: true
      },
      titlesecond: {
        type: String,
        required: true
      },
    
  questions1: {
    type: String,
    required: true
  },
  questions2: {
    type: String,
    required: true
  },
  questions3: {
    type: String,
    required: true
  },
  questions4: {
    type: String,
    required: true
  },
  questions5: {
    type: String,
    required: true
  },
  answer1: {
    type: String,
    required: true
  },
  answer2: {
    type: String,
    required: true
  },
  answer3: {
    type: String,
    required: true
  },
  answer4: {
    type: String,
    required: true
  },
  answer5: {
    type: String,
    required: true
  },
 
});

const Questions = mongoose.model('Questions', questionsInfoSchema);

module.exports = Questions;
