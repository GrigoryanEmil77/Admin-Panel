const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admins'); 
const Contact = require('../model/contacts');
const Customer = require('../model/customer');
const Navbar = require('../model/navbar');
const Follow = require('../model/follow');
const Home = require('../model/home');
const About = require('../model/about');
const Questions = require('../model/questions');
const TruckTypes = require('../model/trucktypes');
const Services = require('../model/services');
const Request = require('../model/request');
const VideoTypesAll = require('../model/videoheader')
const TruckTypesStop = require('../model/truckstop')
// const MessageTypes = require('../model/message')
const authenticateToken = require('../middleware/auth'); 
const upload = require('../middleware/upload'); 
const sgMail = require('@sendgrid/mail')
const cors = require('cors'); 
const fs = require('fs');
const path = require('path')




require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get('/', (req, res) => {
    res.render('home'); 
});

router.get('/register', (req, res) => {
    res.render('register'); 
});

router.get('/login', (req, res) => {
    res.render('login'); 
});


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return res.render('register', { errorMessage: 'Email already exists' });
      }
  
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.render('register', { errorMessage: 'Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = new Admin({
        name: name,
        email: email,
        password: hashedPassword
      });
  
      await newAdmin.save();
      console.log('Admin registered successfully');
      res.redirect('/login');
    } catch (error) {
      console.error('Error registering admin:', error);
      res.render('register', { errorMessage: 'Server error' });
    }
  });
  

router.get('/register', (req, res) => {
    res.render('register'); 
});


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/table', (req, res) => {
    res.render('table'); 
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.render('login', { errorMessage: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.render('login', { errorMessage: 'Invalid password' });
        }

        const payload = {
            admin: {
                id: admin.id
            }
          
        };
    
        const jwtSecret = process.env.JWT_SECRET || "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";
        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }); 
            res.redirect('/dashboard');
        });

    } catch (error) {
        console.error('Error logging in admin:', error);
        res.render('login', { errorMessage: 'Server error' });
    }
});
 
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).send('Admin not found');
        }
        res.render('profile', { admin });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).send('Server error');
    }
});

router.post('/profile', authenticateToken, upload.single('picture'), async (req, res) => {
    try {
        const { name, bio,phone } = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null; 

        
        const updatedFields = { name, bio,phone };
        if (picture) {
            updatedFields.picture = picture;
        }

        const admin = await Admin.findByIdAndUpdate(req.admin.id, updatedFields, { new: true });

        if (!admin) {
            return res.status(404).send('Admin not found');
        }

        res.render('profile', { admin, successMessage: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).send('Server error');
    }
});


router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).send('Admin not found');
        }
        res.render('dashboard', { admin });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).send('Server error');
    }
});

router.get('/contactinfo', authenticateToken, async (req, res) => {
    try {
        const contactId = req.contact ? req.contact.id : "675f35d75d1b14643c7b4c38";
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).send('Contact not found');
        }
        res.render('contactinfo', { contact });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).send('Server error');
    }
});
router.post('/update-contact', upload.single('picture'), async (req, res) => {
    try {
        const { title, gmail, phone, location,locationFlorida } = req.body;

        const updatedFields = { title, gmail, phone, location,locationFlorida };

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}/images`;
            updatedFields.picture = `${baseUrl}/${req.file.filename}`;
        }

        const contactId = req.contact ? req.contact.id : "675f35d75d1b14643c7b4c38";
        const contact = await Contact.findByIdAndUpdate(contactId, updatedFields, { new: true });

        if (!contact) {
            return res.status(404).send('Contact not found');
        }

        res.render('contactinfo', { contact, successMessage: 'Contact updated successfully' });
    } catch (error) {
        console.error('Error updating contact information:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});




router.get('/customer-reviews', authenticateToken, async (req, res) => {
    try {
        const customerId = req.customer ? req.customer.id : "675f36025d1b14643c7b4c39";
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }
        res.render('customer-reviews', { customer });
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).send('Server error');
    }
});


router.post('/update-customer', upload.fields([
    { name: 'customer1picture' },
    { name: 'customer2picture' },
    { name: 'customer3picture' },
]), async (req, res) => {
    try {
        const {
            titlefirst,
            titlesecond,
            customer1name,
            customer2name,
            customer3name,
            customer1text,
            customer2text,
            customer3text,
        } = req.body;

        const customerId = req.customer ? req.customer.id : "675f36025d1b14643c7b4c39";
        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).send('Customer not found');
        }

     
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const customer1picture = req.files.customer1picture
            ? `${baseUrl}/images/${req.files.customer1picture[0].filename}`
            : existingCustomer.customer1picture;

        const customer2picture = req.files.customer2picture
            ? `${baseUrl}/images/${req.files.customer2picture[0].filename}`
            : existingCustomer.customer2picture;

        const customer3picture = req.files.customer3picture
            ? `${baseUrl}/images/${req.files.customer3picture[0].filename}`
            : existingCustomer.customer3picture;

      
        const updatedFields = {
            titlefirst,
            titlesecond,
            customer1name,
            customer2name,
            customer3name,
            customer1text,
            customer2text,
            customer3text,
            customer1picture,
            customer2picture,
            customer3picture,
        };

 
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            updatedFields,
            { new: true } 
        );

        if (!updatedCustomer) {
            return res.status(404).send('Customer not found');
        }

        res.render('customer-reviews', {
            customer: updatedCustomer,
            successMessage: 'Customer updated successfully',
        });
    } catch (error) {
        console.error('Error updating customer information:', error);
        res.status(500).send('Server error');
    }
});




router.get('/navbarinfo', authenticateToken, async (req, res) => {
    try {
        const navbarId = req.navbar ? req.navbar.id : "675f2df2e55dd796c2dbfb44" ;
        const navbar = await Navbar.findById(navbarId);
        if (!navbar) {
            return res.status(404).send('Navbar not found');
        }
        res.render('navbarinfo', { navbar });
    } catch (error) {
        console.error('Error fetching navbar:', error);
        res.status(500).send('Server error');
    }
});

router.post('/navbarinfo', upload.single('picture'), async (req, res) => {
    try {
        const { home, about, services, faqs, testimonials, contact, setup } = req.body;

    
        const updatedFields = { home, about, services, faqs, testimonials, contact, setup };

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}/images`;
            updatedFields.picture = `${baseUrl}/${req.file.filename}`;
        }
        const navbarId = req.navbar ? req.navbar.id : "675f2df2e55dd796c2dbfb44";
        const navbar = await Navbar.findByIdAndUpdate(navbarId, updatedFields, { new: true });

        if (!navbar) {
            return res.status(404).send('Navbar not found');
        }

        res.render('navbarinfo', { navbar, successMessage: 'Navbar updated successfully' });
    } catch (error) {
        console.error('Error updating navbar information:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});




router.get('/follow-us', authenticateToken, async (req, res) => {
    try {
        const followId = req.follow ? req.follow.id : "675f2ecae55dd796c2dbfb46" ;
        const follow = await Follow.findById(followId);
        if (!follow) {
            return res.status(404).send('Follow not found');
        }
        res.render('follow-us', { follow });
    } catch (error) {
        console.error('Error fetching follow:', error);
        res.status(500).send('Server error');
    }
});

router.post('/follow-us', upload.single('picture'), async (req, res) => {
    try {
    
        const { followtitle, facelink, instagramlink,linkedlink } = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null;
        const updatedFields = { followtitle, facelink, instagramlink,linkedlink};
        if (picture) {
            updatedFields.picture = picture;
        }

        const follow = await Follow.findByIdAndUpdate(
            req.follow ? req.follow.id : "675f2ecae55dd796c2dbfb46",
            updatedFields,
            { new: true }
        );

        if (!follow) {
            return res.status(404).send('Follow not found');
        }
        res.render('follow-us', { follow, successMessage: 'Follow updated successfully' });
    } catch (error) {
        console.error('Error updating follow information:', error);
        res.status(500).send('Server error');
    }
});


router.get('/homeinfo', authenticateToken, async (req, res) => {
    try {
        const homeId = req.home ? req.home.id : "675f2e96e55dd796c2dbfb45" ;
        const home = await Home.findById(homeId);
        if (!home) {
            return res.status(404).send('Home not found');
        }
        res.render('homeinfo', { home});
    } catch (error) {
        console.error('Error fetching home:', error);
        res.status(500).send('Server error');
    }
});
router.post('/homeinfo', upload.single('picture'), async (req, res) => {
    try {
    
        const { titlesmall,titlesmall1,titlesmall2,titlesmall3,titlelarge,text } = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null;
        const updatedFields = { titlesmall,titlelarge,text,titlesmall1,titlesmall2,titlesmall3 };
        if (picture) {
            updatedFields.picture = picture;
        }

        const home = await Home.findByIdAndUpdate(
            req.home ? req.home.id : "675f2e96e55dd796c2dbfb45", 
            updatedFields,
            { new: true }
        );

        if (!home) {
            return res.status(404).send('Home not found');
        }
        res.render('homeinfo', { home, successMessage: 'Home updated successfully' });
    } catch (error) {
        console.error('Error updating home information:', error);
        res.status(500).send('Server error');
    }
});



router.get('/aboutinfo', authenticateToken, async (req, res) => {
    try {
        const aboutId = req.about ? req.about.id : "675f2f8ee55dd796c2dbfb47" ;
        const about = await About.findById(aboutId);
        if (!about) {
            return res.status(404).send('About not found');
        }
        res.render('aboutinfo', { about});
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).send('Server error');
    }
});
router.post('/aboutinfo', upload.single('picture'), async (req, res) => {
    try {
    
        const {  titlefirst,titlesecond,text,carriersnumber,loadsnumber,brokersnumber,carrierstext,loadstext,brokerstext } = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null;
        const updatedFields = { titlefirst,titlesecond,text,carriersnumber,loadsnumber,brokersnumber,carrierstext,loadstext,brokerstext};
        if (picture) {
            updatedFields.picture = picture;
        }

        const about = await About.findByIdAndUpdate(
            req.about ? req.about.id : "675f2f8ee55dd796c2dbfb47", 
            updatedFields,
            { new: true }
        );

        if (!about) {
            return res.status(404).send('About not found');
        }
        res.render('aboutinfo', { about, successMessage: 'About updated successfully' });
    } catch (error) {
        console.error('Error updating about information:', error);
        res.status(500).send('Server error');
    }
});



router.get('/truckStop', authenticateToken, async (req, res) => {
    try {
        const trucktopId = req.truckstop ? req.truckstop.id : "675f336a5d1b14643c7b4c36";
        const truckstop = await TruckTypesStop.findById(trucktopId);
        if (!truckstop) {
            return res.status(404).send('About not found');
        }
        res.render('truckStop', {truckstop});
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).send('Server error');
    }
});

router.post('/truckStop', upload.fields([
    { name: 'picture1' },
    { name: 'picture2' },
    { name: 'picture3' },
    { name: 'picture4' },
    { name: 'picture5' },
    { name: 'picture6' },
    { name: 'picture7' },
    { name: 'picture8' },
    { name: 'picture9' },
    { name: 'picture10' }
]), authenticateToken, async (req, res) => {
    try {
        const {
            field1,
            field2,
            field3,
        } = req.body;

        const truckstopId = req.truckstop ? req.truckstop.id : "675f336a5d1b14643c7b4c36";
        const existingTruckstop = await TruckTypesStop.findById(truckstopId);

        if (!existingTruckstop) {
            return res.status(404).send('Truckstop not found');
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const pictureFields = [
            'picture1',
            'picture2',
            'picture3',
            'picture4',
            'picture5',
            'picture6',
            'picture7',
            'picture8',
            'picture9',
            'picture10'
        ];

        const updatedFields = {
            field1,
            field2,
            field3,
        };

        pictureFields.forEach(field => {
            if (req.files[field]) {
                updatedFields[field] = `${baseUrl}/images/${req.files[field][0].filename}`;
            } else {
                updatedFields[field] = existingTruckstop[field];
            }
        });

        const updatedTruckstop = await TruckTypesStop.findByIdAndUpdate(
            truckstopId,
            updatedFields,
            { new: true } 
        );

        if (!updatedTruckstop) {
            return res.status(404).send('Truckstop update failed');
        }

        res.render('truckStop', {
            truckstop: updatedTruckstop,
            successMessage: 'Truckstop updated successfully',
        });
    } catch (error) {
        console.error('Error updating truckstop:', error);
        res.status(500).send('Server error');
    }
});



router.get('/questions', authenticateToken, async (req, res) => {
    try {
        const questionsId = req.questions ? req.questions.id : "675f308d5d1b14643c7b4c32" ;
        const questions = await Questions.findById(questionsId);
        if (!questions) {
            return res.status(404).send('Questions not found');
        }
        res.render('questions', {questions});
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).send('Server error');
    }
});
router.post('/questions', upload.single('picture'), async (req, res) => {
    try {
    
        const { titlefirst,titlesecond,questions1,questions2,questions3,questions4,questions5,
                answer1,answer2,answer3,answer4,answer5} = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null;
        const updatedFields = {titlefirst,titlesecond,questions1,questions2,questions3,questions4,questions5,
                               answer1,answer2,answer3,answer4,answer5};
        if (picture) {
            updatedFields.picture = picture;
        }

        const questions = await Questions.findByIdAndUpdate(
            req.questions ? req.questions.id : "675f308d5d1b14643c7b4c32",
            updatedFields,
            { new: true }
        );

        if (!questions) {
            return res.status(404).send('Questions not found');
        }
        res.render('questions', { questions, successMessage: 'Questions updated successfully' });
    } catch (error) {
        console.error('Error updating questions information:', error);
        res.status(500).send('Server error');
    }
});


router.get('/services', authenticateToken, async (req, res) => {
    try {
        const servicesId = req.services ? req.services.id : "675f30e15d1b14643c7b4c33" ;
        const services = await Services.findById(servicesId);
        if (!services) {
            return res.status(404).send('Services not found');
        }
        res.render('services', {services});
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Server error');
    }
});

router.post('/services', upload.fields([
    { name: 'picture1' },
    { name: 'picture2' },
    { name: 'picture3' },
    { name: 'picture4' },
    { name: 'picture5' },
    { name: 'picture6' },
    { name: 'picture7' }
]), async (req, res) => {
    try {
        console.log("Files received:", req.files);  // Log to debug

        const {
            titleServices,
            titlefirst,
            titlesecond,
            LoadSearch,
            Booking,
            BrokerSetup,
            Detention,
            Invoicing,
            Factoring,
            Support
        } = req.body;

        const servicesId = req.services ? req.services.id : "675f30e15d1b14643c7b4c33";
        const existingServices = await Services.findById(servicesId);

        if (!existingServices) {
            return res.status(404).send('Services not found');
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/images`;

        const picture1 = req.files && req.files.picture1
            ? `${baseUrl}/${req.files.picture1[0].filename}`
            : existingServices.picture1;

        const picture2 = req.files && req.files.picture2
            ? `${baseUrl}/${req.files.picture2[0].filename}`
            : existingServices.picture2;

        const picture3 = req.files && req.files.picture3
            ? `${baseUrl}/${req.files.picture3[0].filename}`
            : existingServices.picture3;

        const picture4 = req.files && req.files.picture4
            ? `${baseUrl}/${req.files.picture4[0].filename}`
            : existingServices.picture4;

        const picture5 = req.files && req.files.picture5
            ? `${baseUrl}/${req.files.picture5[0].filename}`
            : existingServices.picture5;

        const picture6 = req.files && req.files.picture6
            ? `${baseUrl}/${req.files.picture6[0].filename}`
            : existingServices.picture6;

        const picture7 = req.files && req.files.picture7
            ? `${baseUrl}/${req.files.picture7[0].filename}`
            : existingServices.picture7;

        const updatedFields = {
            titleServices,
            titlefirst,
            titlesecond,
            LoadSearch,
            Booking,
            BrokerSetup,
            Detention,
            Invoicing,
            Factoring,
            Support,
            picture1,
            picture2,
            picture3,
            picture4,
            picture5,
            picture6,
            picture7
        };

        const updatedServices = await Services.findByIdAndUpdate(servicesId, updatedFields, { new: true });

        if (!updatedServices) {
            return res.status(404).send('Services update failed');
        }

        res.render('services', {
            services: updatedServices,
            successMessage: 'Services updated successfully'
        });

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});


router.get('/trucktypes', authenticateToken, async (req, res) => {
    try {
        const truckId = req.truck ? req.truck.id : "675f33225d1b14643c7b4c35";
        const truck = await TruckTypes.findById(truckId);
        if (!truck) {
            return res.status(404).send('TruckTypes not found');
        }
        res.render('trucktypes', {truck});
    } catch (error) {
        console.error('Error fetching trucktypes:', error);
        res.status(500).send('Server error');
    }
});
router.post('/trucktypes', upload.fields([
    { name: 'DryVanpicture' },
    { name: 'Reeferpicture' },
    { name: 'BoxTruckpicture' },
    { name: 'Flatbedpicture' },
    { name: 'StepDeckpicture' },
    { name: 'PowerOnlypicture' }
]), async (req, res) => {
    try {
        const {
            titleTruck,
            DryVan, Reefer, BoxTruck, Flatbed, StepDeck, PowerOnly,
            DryVantext, Reefertext, BoxTrucktext, Flatbedtext, StepDecktext, PowerOnlytext
        } = req.body;

        const truckId = req.truck ? req.truck.id : "675f33225d1b14643c7b4c35";
        const existingTruck = await TruckTypes.findById(truckId);

        if (!existingTruck) {
            return res.status(404).send('Trucktypes not found');
        }

    
        const baseUrl = `${req.protocol}://${req.get('host')}/images`;

      
        const updatedFields = {
            titleTruck,
            DryVan, Reefer, BoxTruck, Flatbed, StepDeck, PowerOnly,
            DryVantext, Reefertext, BoxTrucktext, Flatbedtext, StepDecktext, PowerOnlytext
        };


        const pictureFields = [
            'DryVanpicture', 'Reeferpicture', 'BoxTruckpicture', 
            'Flatbedpicture', 'StepDeckpicture', 'PowerOnlypicture'
        ];

        pictureFields.forEach((field) => {
            if (req.files[field]) {
                updatedFields[field] = `${baseUrl}/${req.files[field][0].filename}`;
            } else {
                updatedFields[field] = existingTruck[field]; 
            }
        });

    
        const updatedTruck = await TruckTypes.findByIdAndUpdate(
            truckId,
            updatedFields,
            { new: true }
        );

        if (!updatedTruck) {
            return res.status(404).send('Trucktypes update failed');
        }

        res.render('trucktypes', {
            truck: updatedTruck,
            successMessage: 'Trucktypes updated successfully'
        });

    } catch (error) {
        console.error('Error updating trucktypes information:', error);
        res.status(500).send('Server error');
    }
});


router.get('/request', authenticateToken, async (req, res) => {
    try {
        const requestId = req.request ? req.request.id : "675f32e75d1b14643c7b4c34";
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).send('Request not found');
        }
        res.render('request', {request});
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).send('Server error');
    }
});

router.post('/request', upload.single('picture'), async (req, res) => {
    try {
    
        const { titlefirst,titlesecond } = req.body;
        const picture = req.file ? '/images/' + req.file.filename : null;
        const updatedFields = {titlefirst,titlesecond
                                };
        if (picture) {
            updatedFields.picture = picture;
        }

        const request= await Request.findByIdAndUpdate(
            req.request ? req.request.id : "675f32e75d1b14643c7b4c34",
            updatedFields,
            { new: true }
        );

        if (!request) {
            return res.status(404).send('Request not found');
        }
        res.render('request', { request, successMessage: 'Request updated successfully' });
    } catch (error) {
        console.error('Error updating request information:', error);
        res.status(500).send('Server error');
    }
});


router.get('/upload-videoheader', authenticateToken, async (req, res) => {
    try {
        const videoId = req.video ? req.video.id : "675f35285d1b14643c7b4c37" ;
        const video = await VideoTypesAll.findById(videoId);
        if (!video) {
            return res.status(404).send('About not found');
        }
        res.render('upload-videoheader', { video});
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).send('Server error');
    }
});
router.post('/upload-videoheader', upload.fields([
    { name: 'videodispatch', maxCount: 1 }, 
    { name: 'videobackground', maxCount: 1 }
]), async (req, res) => {
    try {
        const updatedFields = {};

     
        const baseUrl = `${req.protocol}://${req.get('host')}/videos`;
        if (req.files['videodispatch']) {
            updatedFields.videodispatch = `${baseUrl}/${req.files['videodispatch'][0].filename}`;
        }
        if (req.files['videobackground']) {
            updatedFields.videobackground = `${baseUrl}/${req.files['videobackground'][0].filename}`;
        }

        const videoId = req.video ? req.video.id : "675f35285d1b14643c7b4c37";
        const video = await VideoTypesAll.findByIdAndUpdate(videoId, updatedFields, { new: true });

        if (!video) {
            return res.status(404).send('Video not found');
        }

        res.render('upload-videoheader', { video, successMessage: 'Video updated successfully' });
    } catch (error) {
        console.error('Error updating video information:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});





// router.get('/message', authenticateToken, async (req, res) => {
//     try {
//         const messageId = req.message ? req.message.id : "675f381d5d1b14643c7b4c3a" ;
//         const message = await MessageTypes.findById(messageId);
//         if (!message) {
//             return res.status(404).send('About not found');
//         }
//         res.render('message', { message});
//     } catch (error) {
//         console.error('Error fetching about:', error);
//         res.status(500).send('Server error');
//     }
// });
// router.post('/message', upload.single('attachment'), async (req, res) => {
//     try {
//         const { to,name,email,information,number,from,titlefirst,titlesecond } = req.body;
//         const attachment = req.file ? '/attachments/' + req.file.filename : null;
//         const updatedFields = { to,name,email,information,number,from,titlefirst,titlesecond  };
        
//         if (attachment) {
//             updatedFields.attachment = attachment;
//         }

//         const message = await MessageTypes.findByIdAndUpdate(
//             req.message ? req.message.id : "675f381d5d1b14643c7b4c3a",
//             updatedFields,
//             { new: true }
//         );

//         if (!message) {
//             return res.status(404).send('Message not found');
//         }
//         res.render('message', { message, successMessage: 'Message updated successfully' });
//     } catch (error) {
//         console.error('Error updating message information:', error);
//         res.status(500).send('Server error');
//     }
// });



router.get('/register', authenticateToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).send('Admin not found');
        }
        res.render('register', { admin });
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).send('Server error');
    }
});  

router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/login');
});
module.exports = router;
