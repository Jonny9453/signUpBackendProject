// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import necessary modules
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests
const connectDB = require('./connect.js'); // Import database connection function
const authRoutes = require('./routes/auth'); // Import authentication routes
const protectedRoute = require('./routes/protectedRoute.js'); // Import protected routes
const {Event}=require('./models/User')


// Initialize the Express application
const app = express();
const http = require('http').Server(app);


const socketIO = require('socket.io')(http, {
  cors: {
      origin: "https://project-tawny-theta.vercel.app/"
  }
});
// Connect to the database
connectDB();

// Use CORS middleware to allow cross-origin requests
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allow specified HTTP methods
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization' // Allow specified headers
}));

// Middleware to parse JSON request bodies
app.use(express.json());
  
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('add', async(data) => {
    const event = await Event.findOne({ _id: data.id });
    console.log("mayayayyaay",event)
    
    
    if(event){
      
      event.attendees.push(data.email);
        
      await event.save();
      const events = await Event.find()
      socketIO.emit('jointResponse', events);
    
    } else{
      console.log("event not found")
    }
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

// Set up routes
app.use('/', authRoutes); // Use authentication routes for the root path

app.get('/events',async(req,res)=>{
  
   
    // Find the user by email
    const events = await Event.find();
  console.log(events)
    if (events) {
      res.json({ data: events}); 
    } else {
      res.status(404).json({ error: 'events not found' }); // Handle events not found
    }
})

// Use protected routes for the '/protected' path
app.use('/protected', protectedRoute);
   
// Set the port for the server to listen on
const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

// Start the server and listen on the specified port
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
});