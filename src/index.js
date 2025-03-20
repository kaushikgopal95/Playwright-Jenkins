// server.js - Main server file

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Create MySQL Connection Pool
const pool = mysql.createPool({
  // host: process.env.DB_HOST || 'db',
  host: 'localhost',
  user: process.env.DB_USER,  
  password: process.env.DB_PASSwORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a connection and set up the database
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Create database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS user_registration', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      connection.release();
      return;
    }
    console.log('Database created or already exists');
    
    // Switch to the created database
    connection.query('USE user_registration', (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        connection.release();
        return;
      }
      console.log('Using user_registration database');
      
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
      
      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          connection.release();
          return;
        }
        console.log('Users table created or already exists');
        
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
        
        connection.query(createInterestsTableQuery, (err) => {
          if (err) {
            console.error('Error creating interests table:', err);
          } else {
            console.log('Interests table created or already exists');
          }
          // Release the connection back to the pool
          connection.release();
        });
      });
    });
  });
});

// Create a promise wrapper for pool to use with async/await
const promisePool = pool.promise();

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
    
    const [results] = await promisePool.execute(
      insertUserQuery,
      [username, email, hashedPassword, dob, country, gender, bio, profilePic, terms]
    );
    
    const userId = results.insertId;
    
    // Handle interests if provided
    if (interests && interests.length > 0) {
      // Create an array of value arrays for batch insert
      const interestValues = interests.map(interest => [userId, interest]);
      
      // Insert interests
      const insertInterestsQuery = `
        INSERT INTO interests (user_id, interest) VALUES ?
      `;
      
      try {
        await promisePool.query(insertInterestsQuery, [interestValues]);
      } catch (err) {
        console.error('Error saving interests:', err);
        // Still continue as user was created successfully
      }
    }
    
    return res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      userId
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});