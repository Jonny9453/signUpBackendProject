const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {User, Event}=require('../models/User')

// Protected route
router.get('/', verifyToken, (req, res) => {
    if (req.verified) {
        return res.status(200).json({verified:true});
    } else {
        // Access Denied
        return res.status(401).send('Access Denied');
    }

});

// const users = [
//     { email: 'mayanksharan11@gmail.com', data: 'Protected data for user@example.com' },
//     // Add more users as needed
//   ];

router.get('/user', async(req, res) => {
    const email = req.query.email; // Get the email from the query parameters
   console.log(email)
    // Find the user by email
    const user =await User.findOne({email});
  
    if (user) {
      res.json({ data: user}); // Send back the protected data
    } else {
      res.status(404).json({ error: 'User not found' }); // Handle user not found
    }
  });

  router.post('/addEvent', async(req, res) => {
    const email = req.query.email; // Get the email from the query parameters
    const {title, description, date }=req.body;
    
   console.log(title)
   try{

   
    // Find the user by email
    const user =await User.findOne({email});
  console.log("mayayayyaay",user)
    const emails=user.email
    console.log("mayayayyaay", emails)
    if(user.email){
      const event = new Event({emails, title, description, date});
      user.notes.push({emails, title, description, date});
        console.log(user)
        await user.save();
    await event.save();
    res.json({message: 'Note added successfully', data: event});
    } else{
      res.status(404).json({ error: 'User not found' });
    }
    // if (user) {
    //   user.notes.push(body);
    //   console.log(user)
    //   await user.save();
    //   res.json({message: 'Note added successfully', data: user});
    // } else {
    //   res.status(404).json({ error: 'User not found' }); // Handle user not found
    // }
  }catch(error){
    res.status(500).json({error:error})
  }
  });
  router.post('/deleteEvent',async(req,res)=>{
    const {email, index}=req.body;
    console.log("mayank")
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (user) {
          // Check if the index is valid
          if (index >= 0 && index < user.notes.length) {
            user.notes.splice(index, 1); // Remove the note at the specified index
            await user.save(); // Save the updated user document
    
            res.json({ message: 'Note removed successfully', data: user }); // Send back the updated user data
          } else {
            res.status(400).json({ error: 'Invalid index' }); // Handle invalid index
          }
        } else {
          res.status(404).json({ error: 'User not found' }); // Handle user not found
        }
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handle server errors
      }

  })



module.exports = router;