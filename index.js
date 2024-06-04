const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

   // task Db
    const TaskDb = client.db('taskDB');
    const taskCollection = TaskDb.collection('taskCollection');

    // userDb
    const userDb = client.db('userDB');
    const userCollection = userDb.collection('userCollection');

    app.post('/tasks', async (req, res) => {
      const taskData = req.body;
      const result = await taskCollection.insertOne(taskData);
      res.send(result);
    });

    app.get('/tasks', async (req, res) => {
      const result = await taskCollection.find({}).toArray();
      res.send(result);
    });

    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const updateTask = req.body;
      const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateTask }
      );
      res.send(result);
    });

    app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    console.log('Pinged your deployment. Server connected to MongoDB!');
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
