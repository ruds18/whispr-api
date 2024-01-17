const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors'); 
const User = require('./models/UserModel');
const {
  registerUser,
  loginUser,
  getAllSecrets,
  setSecret,
  getCurrentUser,
  resetPassword,
} = require('./controllers/authcontroller');


const app = express();
const secretKey = 'your-secret-key';

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://admin:admin@cluster0.xdg5g1e.mongodb.net/?retryWrites=true&w=majority')
.then(()=> console.log("Db connected sucessfully!"))
.catch((e)=> console.log(e));


  function verifyToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token is missing' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  }


app.post('/register', registerUser);
app.post('/login', loginUser);
app.get('/all-secrets', verifyToken, getAllSecrets);
app.post('/set-secret', verifyToken, setSecret);
app.get('/current-user', verifyToken, getCurrentUser);
app.post('/reset-password', resetPassword);
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});