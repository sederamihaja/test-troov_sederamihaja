const express = require('express')
const db = require('./config/db')

// Create express instnace
const app = express()

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Require & Import API routes
const objects = require('./routes/objectRoute')

// Use API Routes
app.use(objects)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
