require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB client setup
const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}

app.use(express.json());

// Your routes and other code here...

app.get('/', (req, res) => {
    res.send('Hello World!');
});

async function startServer() {
    await connectToMongoDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer();
