const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  titlefirst: {
    type: String,
    required: true
  },
  titlesecond: {
    type: String,
    required: true
  },
  customer1name: {
    type: String,
    required: true
  },
  customer2name: {
    type: String,
    required: true,
  },
  customer3name: {
    type: String,
    required: true
  },
  customer1text: {
    type: String, 
    required: false 
  },
  customer2text: {
    type: String,
    required: false 
  },
  customer3text: {
    type: String,
    required: true
},
  customer1picture:{
    type:String,
    required:true
  },
  customer2picture:{
    type:String,
    required:true
  },
  customer3picture:{
    type:String,
    required:true
  }
});


const Customer = mongoose.model('Customer', customerSchema );

module.exports = Customer;
