// server.js - Main server file

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // replace with your MySQL username
  password: '',      // replace with your MySQL password
  database: 'user_registration'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create database if it doesn't exist
  db.query(`CREATE DATABASE IF NOT EXISTS user_registration`, (err) => {
    if (err) console.error('Error creating database:', err);
    
    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        country VARCHAR(50) NOT NULL,
        gender ENUM('male', 'female', 'other') NOT NULL,
        bio TEXT,
        profile_pic VARCHAR(255),
        terms_accepted BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table created or already exists');
    });
    
    // Create interests table
    const createInterestsTableQuery = `
      CREATE TABLE IF NOT EXISTS interests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        interest VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, interest)
      )
    `;
    
    db.query(createInterestsTableQuery, (err) => {
      if (err) console.error('Error creating interests table:', err);
      else console.log('Interests table created or already exists');
    });
  });
});

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      dob, 
      country, 
      gender, 
      interests, 
      bio, 
      profilePic, 
      terms 
    } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user
    const insertUserQuery = `
      INSERT INTO users 
      (username, email, password, date_of_birth, country, gender, bio, profile_pic, terms_accepted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertUserQuery,
      [username, email, hashedPassword, dob, country, gender, bio, profilePic, terms],
      (err, results) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
        }
        
        const userId = results.insertId;
        
        // Handle interests if provided
        if (interests && interests.length > 0) {
          // Create an array of value arrays for batch insert
          const interestValues = interests.map(interest => [userId, interest]);
          
          // Insert interests
          const insertInterestsQuery = `
            INSERT INTO interests (user_id, interest) VALUES ?
          `;
          
          db.query(insertInterestsQuery, [interestValues], (err) => {
            if (err) {
              console.error('Error saving interests:', err);
              // Still return success for user creation
            }
            
            return res.status(201).json({ 
              success: true, 
              message: 'Registration successful',
              userId
            });
          });
        } else {
          return res.status(201).json({ 
            success: true, 
            message: 'Registration successful',
            userId
          });
        }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
