const mongoose = require('mongoose');

const trucktypesInfoSchema = new mongoose.Schema({
  titleTruck: {
    type: String,
    required: true
  },
  DryVan: {
    type: String,
    required: true
  },
  Reefer:{
    type:String,
    required:true
  },
  BoxTruck: {
    type: String,
    required: true
  },
  Flatbed: {
    type: String,
    required: true
  },
  StepDeck: {
    type: String,
    required: true
  },
  PowerOnly:{
    type:String,
    required:true
  },
  DryVantext: {
    type: String,
    required: true
  },
  Reefertext:{
    type:String,
    required:true
  },
  BoxTrucktext: {
    type: String,
    required: true
  },
  Flatbedtext: {
    type: String,
    required: true
  },
  StepDecktext: {
    type: String,
    required: true
  },
  PowerOnlytext:{
    type:String,
    required:true
  }, 
   DryVanpicture: {
    type: String,
    required: true
  },
  Reeferpicture:{
    type:String,
    required:true
  },
  BoxTruckpicture: {
    type: String,
    required: true
  },
  Flatbedpicture: {
    type: String,
    required: true
  },
  StepDeckpicture: {
    type: String,
    required: true
  },
  PowerOnlypicture:{
    type:String,
    required:true
  },

  
});

const TruckTypes = mongoose.model('TruckTypes', trucktypesInfoSchema);

module.exports = TruckTypes;
