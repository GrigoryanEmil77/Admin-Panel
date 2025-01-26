const express = require('express');
const connectToDatabase = require('./data/database');
const routes = require('./routes/routes'); 
const cookieParser = require('cookie-parser'); 
const path = require('path');
const cors = require('cors');
require('dotenv').config();



const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser()); 
app.use('/images', express.static('uploads'));
app.use('/images', express.static('public/images'));
app.use('/videos', express.static('uploads'));


app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

app.use('/', routes); 

app.use(cors({ origin: 'http://localhost:3001' }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 });







 


