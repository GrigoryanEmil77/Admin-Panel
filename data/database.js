require("dotenv").config();

const mongoose = require('mongoose');
const Admin = require('../model/admins'); 

const uri = process.env.MONGO_URI 

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

async function addAdmin(name, email, password, picture, bio,) {
  try {
    const newAdmin = new Admin({
      name: name,
      email: email,
      password: password,
      picture: picture,
      bio: bio,

  
    });

    
    await newAdmin.save();
    console.log('Admin saved successfully');
  } catch (err) {
    console.error('Error saving admin:', err);
    throw err; 
  }
}



module.exports = addAdmin;
connectToDatabase();



