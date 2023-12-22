const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI. In production, this will be set in Azure's Application Settings.
const uri = process.env.MONGODB_URI || "mongodb+srv://zhikangsam0724:2Un24f6Hfk4l1Z1x@cluster0.1jh2xph.mongodb.net/";;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

client.connect(err => {
  if (err) {
    console.error('Database connection failed', err);
    process.exit();
  }
  console.log('Connected to MongoDB');

  // Define routes here
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
