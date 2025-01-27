require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectDB= require('./connect.js')
const authRoutes = require('./routes/auth');
const protectedRoute=require('./routes/protectedRoute.js')
const main= require('./server')
// const protectedRoute = require('./routes/protectedRoute');

connectDB();
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
}));
app.use(express.json());


app.use('/', authRoutes);
app.get('/app', async (req, res) => {
  try {
    const info = await main();
    res.json(info);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.use('/protected',protectedRoute)
// app.use('/protected', protectedRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});