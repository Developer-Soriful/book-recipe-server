import express from "express";

import cors from "cors";

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import dotenv from "dotenv";

import serverless from "serverless-http";

// Load environment variables

dotenv.config();

// Express app init

const app = express();

app.use(cors());

app.use(express.json());

// MongoDB config

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxfbk1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,

    strict: true,

    deprecationErrors: true,
  },
});

let usersCollection;

// Connect to DB

async function connectDB() {
  try {
    await client.connect();

    const database = client.db("users");

    usersCollection = database.collection("users");

    console.log("✅ MongoDB connected.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectDB();

// ----------- ROUTES (no `/api` prefix!) -------------

app.get("/toprecipe", async (req, res) => {
  const cursor = usersCollection.find().sort({ likeCount: -1 }).limit(6);

  const topRecipe = await cursor.toArray();

  res.send(topRecipe);
});

app.get("/users", async (req, res) => {
  const users = await usersCollection.find().toArray();

  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  const query = { _id: new ObjectId(id) };

  const user = await usersCollection.findOne(query);

  res.send(user);
});

app.get("/users/email/:email", async (req, res) => {
  const email = req.params.email;

  const query = { userEmail: email };

  const user = await usersCollection.find(query).toArray();

  res.send(user);
});

app.put("/users/:id", async (req, res) => {
  const id = req.params.id;

  const filter = { _id: new ObjectId(id) };

  const updateUserData = req.body;

  const options = { upsert: true };

  const updateDoc = { $set: updateUserData };

  const result = await usersCollection.updateOne(filter, updateDoc, options);

  res.send(result);
});

app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;

  const filter = { _id: new ObjectId(id) };

  const updatedDoc = { $inc: { likeCount: 1 } };

  const result = await usersCollection.updateOne(filter, updatedDoc);

  res.send(result);
});

app.post("/users", async (req, res) => {
  const user = req.body;

  const result = await usersCollection.insertOne(user);

  res.status(200).send(result);
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  const query = { _id: new ObjectId(id) };

  const result = await usersCollection.deleteOne(query);

  res.send(result);
});

// Export for Vercel

export default serverless(app);
