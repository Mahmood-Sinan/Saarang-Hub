const express = require('express')
const cors = require('cors') // to allow frontend apis to reach backend ports
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express()
const port = 3000
const JWT_SECRET_KEY = 'my_secret_key' || 'fall_back_key'; 
const connectDB = async () => {
    try {
        // await mongoose.connect('mongodb+srv://sinanmahmood7_db_user:Yd1mTu7RS7rnZadN@saarangcluster.jcx0ejt.mongodb.net/?appName=SaarangCluster')
        await mongoose.connect('mongodb://sinanmahmood7_db_user:Yd1mTu7RS7rnZadN@ac-8gyqxid-shard-00-00.jcx0ejt.mongodb.net:27017,ac-8gyqxid-shard-00-01.jcx0ejt.mongodb.net:27017,ac-8gyqxid-shard-00-02.jcx0ejt.mongodb.net:27017/?ssl=true&replicaSet=atlas-wzbeox-shard-0&authSource=admin&appName=SaarangCluster')
        console.log('Connected to MongoDB Atlas');
    }
    catch(error) {
        console.error(error);
        return;
    }
}
const userSchema = new mongoose.Schema({username: String, email: String, password: String, registeredEvents: Array}); // User blueprint for mongodb
const User = mongoose.model('User', userSchema) // Object model for user end to create a db interface
const eventSchema = new mongoose.Schema({title: String,
                                            description: String,
                                            date: Date,
                                            location: String,
                                            imageUrl: String}); // event blueprint for mongodb
const Event = mongoose.model('Events', eventSchema) // Object model for user end to create a db interface
app.use(cors());
app.use(express.json());

connectDB();
// GET route for /api/events call
app.get('/api/events', async (req, res) => {
    console.log(`Got request for /api/events`)
    try{
        const events = await Event.find();
        res.json(events);
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.get('/api/events/:id', async (req, res) => {
    console.log(`Got request for /api/event/${req.params.id}`)
    try{
        const events = await Event.findById(req.params.id);
        console.log(events);
        res.json(events);
    } catch(error){
        console.error(error);
        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.post('/api/signup', async (req, res) => {
    console.log(`Got request for signup from Username: ${req.body.email}`)
    console.log(req.body);
    try{
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            registeredEvents: [],
        })
        await newUser.save();

        res.json({username: req.body.username, message: 'User Saved'})
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.post('/api/login', async (req, res) => {
    console.log(`Got request for login from Username: ${req.body.username}`)
    console.log(req.body);
    try{
        const existingUser = await User.findOne({username: req.body.username});

        if(existingUser){
            if(existingUser.password === req.body.password){
                res.json({username: req.body.username, message: 'User Found'})
            }
            else{
                res.json({username: req.body.username, message: 'Incorrect Username or Password'})   
            }
        }
        else{
            res.json({message: 'User not Found'})
        }
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.post('/api/events/:id/register', async (req, res) => {
    console.log(`Got request for register for event: ${req.params.id}`)
    console.log(req.body);
    try{
        const eventID = req.params.id;
        const user = await User.findOne({username: req.body.username});

        if(!user){
            res.json({message: 'User not Found'});
            return;
        }
        for(const RegEventID of user.registeredEvents){
            if(eventID === RegEventID){
                console.error(`user already registered for the event`)
                res.status(500).json({
                    message: `User already registered for the event ${eventID}` // Error message to pass to frontend
                });
                return;
            }
        }
        user.registeredEvents.push(eventID);
        await user.save();

        res.json({username: req.body.username, message: 'Registration for the event '  + eventID + ' completed'})
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.post('/api/events/:id/unregister', async (req, res) => {
    console.log(`Got request for unregister for event: ${req.params.id}`)
    console.log(req.body);
    try{
        const eventID = req.params.id;
        const user = await User.findOne({username: req.body.username});

        if(!user){
            res.json({message: 'User not Found'});
            return;
        }
        user.registeredEvents = user.registeredEvents.filter((id)=>id!=eventID);
        await user.save();

        res.json({username: req.body.username, message: 'Unregistration for the event '  + eventID + ' completed'})
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.get('/api/my-registrations/:username', async (req, res) => {
    console.log(`Got request for registered events for ${req.params.username}`)
    try{
        const user = await User.findOne({username: req.params.username});

        console.log(user.registeredEvents);
        if(!user){
            res.json({message: 'User not Found'});
            return;
        }
        const regEvents = [];
        for (const eventID of user.registeredEvents){
            const event = await Event.findById(eventID);
            regEvents.push(event);
        }

        res.json({regEvents})
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: 'Error' // Error message to pass to frontend
        });
    }
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});