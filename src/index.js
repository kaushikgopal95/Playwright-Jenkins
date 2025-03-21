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

// Database connection and initialization function
const initializeDatabase = async () => {
  // Create MySQL Connection Pool with retry capability built into mysql2
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    // Add connection retry options
    acquireTimeout: 60000, // 60 seconds to acquire a connection
  });
  
  const promisePool = pool.promise();
  
  // Function to create database and tables
  const setupDatabase = async () => {
    try {
      // Create database if it doesn't exist
      await promisePool.query('CREATE DATABASE IF NOT EXISTS user_registration');
      console.log('Database created or already exists');
      
      // Use the database
      await promisePool.query('USE user_registration');
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
      await promisePool.query(createTableQuery);
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
      await promisePool.query(createInterestsTableQuery);
      console.log('Interests table created or already exists');
      
      return { pool, promisePool };
    } catch (err) {
      console.error('Error setting up database:', err);
      throw err;
    }
  };
  
  // Implement connection retry with proper async/await pattern
  const MAX_RETRIES = 20;
  const INITIAL_BACKOFF = 1500;
  const MAX_BACKOFF = 30000;
  
  let retries = 0;
  let backoff = INITIAL_BACKOFF;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retries + 1}/${MAX_RETRIES} to connect to MySQL...`);
      
      // Try to connect and set up database
      const connection = await promisePool.getConnection();
      console.log('Successfully connected to MySQL');
      connection.release();
      
      return await setupDatabase();
    } catch (err) {
      retries++;
      
      if (retries >= MAX_RETRIES) {
        console.error('Maximum retry attempts reached. Could not connect to MySQL.');
        throw err;
      }
      
      console.error(`Failed to connect to MySQL (attempt ${retries}/${MAX_RETRIES}):`, err.message);
      console.log(`Retrying in ${backoff/1000} seconds...`);
      
      // Wait using a promise-based delay
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Increase backoff with exponential strategy, but cap it
      backoff = Math.min(backoff * 1.5, MAX_BACKOFF);
    }
  }
};

// Routes handler - only define routes after database is initialized
const setupRoutes = (promisePool) => {
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
};

// Initialize database, then start server
(async () => {
  try {
    const { promisePool } = await initializeDatabase();
    
    // Set up routes with the initialized database connection
    setupRoutes(promisePool);
    
    // Start server only after database is ready
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  }
})();