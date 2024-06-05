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

// // tokencreate
// function TokenCreate(user) {
//   const token = jwt.sign(
//     {
//       email: user?.email,
//     },
//     'secret',
//     { expiresIn: '1h' }
//   );
//   return token;
// }

// jwt verify function
// function verifyToken(req, res, next) {
//   var token = req.headers.authorization.split(' ')[1];

//   console.log(token);
//   if (!token) return res.status(401).json({ message: 'No token provided' });
//   const verify = jwt.verify(token, 'secret');

//   if (!verify?.email) {
//     return res.send('You are not authorized');
//   }
//   req.user = verify.email;
//   next();
// }

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
    client.connect();

    // taskDb
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

    app.post('/users', async (req, res) => {
      const user = req.body;
      const token = TokenCreate(user);
      const IsHaveUser = await userCollection.findOne({ email: user?.email });

      if (IsHaveUser?._id) {
        return res.send({ status: 'success', message: 'login success', token });
      }

      await userCollection.insertOne(user);
      return res.send({ token });
    });

    app.get('/users/get/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    app.patch('/user/:email', async (req, res) => {
      const email = req.params.email;
      const updateData = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: updateData },
        { upsert: true }
      );
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
