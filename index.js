const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Replace <dbname> with the actual name of your database
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://zhikangsam0724:2Un24f6Hfk4l1Z1x@cluster0.1jh2xph.mongodb.net/<benr2423>?retryWrites=true&w=majority";

// MongoDB client setup
const client = new MongoClient(mongoUri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        // Here you can set up your routes that require a database connection
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        // If MongoDB connection fails, you might want to handle it differently or exit the process
    }
}

// Swagger setup omitted for brevity...

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Connection to MongoDB and server start
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

// Routes setup omitted for brevity...
