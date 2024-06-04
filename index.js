const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const port = 5000;

// Load environment variables from .env file
dotenv.config();

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log(
      'Pinged your deployment. Server connected to MongoDB!'
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Final Project Server!');
});

app.listen(port, () => {
  console.log(`Final Project Server app listening on port ${port}`);
});
