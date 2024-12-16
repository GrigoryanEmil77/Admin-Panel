const mongoose = require('mongoose');

const videobackgroundallInfoSchema = new mongoose.Schema({
  videodispatch: {
    type: String,
    required: true
  },
  videobackground: {
    type: String,
    required: true
  },
  
  
});

const VideoTypesAll = mongoose.model('VideoTypesAll', videobackgroundallInfoSchema);

module.exports = VideoTypesAll;
