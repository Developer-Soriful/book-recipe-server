import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// some
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-10-auth-1f744.web.app",
      "https://book-recipe-server.vercel.app",
      "https://book-recipe-server.vercel.app",
      "https://prismatic-bombolone-cfb6f1.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxfbk1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("users");
const usersCollection = database.collection("users");

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "✅ Connected to MongoDB! You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectDB();

app.get("/toprecipe", async (req, res) => {
  try {
    const cursor = usersCollection.find().sort({ likeCount: -1 }).limit(6);
    const topRecipe = await cursor.toArray();
    res.send(topRecipe);
  } catch (err) {
    console.error("Error fetching top recipes:", err);
    res
      .status(500)
      .send({ error: "Failed to get top recipes", details: err.message });
  }
});

// this routes for recipes filtering
app.get("/recipes", async (req, res) => {
  const { cuisine } = req.query;
  const query = {};
  if (cuisine && cuisine !== "All") {
    query.cuisine = cuisine;
  }
  const result = await usersCollection.find(query).toArray();
  res.send(result);
});
// user get routes
app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection
      .find()
      .sort({ likeCount: -1 })
      .toArray();
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .send({ error: "Failed to get users", details: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    const query = { _id: new ObjectId(id) };
    const user = await usersCollection.findOne(query);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (err) {
    console.error(`Error fetching user with ID ${req.params.id}:`, err);
    res.status(500).send({ error: "Failed to get user", details: err.message });
  }
});

app.get("/users/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const query = { userEmail: email };
    const user = await usersCollection.find(query).toArray();
    res.send(user);
  } catch (err) {
    console.error(`Error fetching user with email ${req.params.email}:`, err);
    res
      .status(500)
      .send({ error: "Failed to get user by email", details: err.message });
  }
});
// user post route
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    if (!user || Object.keys(user).length === 0) {
      return res.status(400).send({ error: "Request body cannot be empty" });
    }
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error inserting user:", err);
    res
      .status(500)
      .send({ error: "Failed to insert user", details: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    const filter = { _id: new ObjectId(id) };
    const updateUserData = req.body;
    if (!updateUserData || Object.keys(updateUserData).length === 0) {
      return res
        .status(400)
        .send({ error: "Request body cannot be empty for update" });
    }
    const options = { upsert: true };
    const updateDoc = { $set: updateUserData };
    const result = await usersCollection.updateOne(filter, updateDoc, options);

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return res.status(404).send({ error: "User not found and not upserted" });
    }
    res.send(result);
  } catch (err) {
    console.error(`Error updating user with ID ${req.params.id}:`, err);
    res
      .status(500)
      .send({ error: "Failed to update user", details: err.message });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = { $inc: { likeCount: 1 } };
    const result = await usersCollection.updateOne(filter, updatedDoc);

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ error: "User not found for like increment" });
    }
    res.send(result);
  } catch (err) {
    console.error(
      `Error incrementing likeCount for user ID ${req.params.id}:`,
      err
    );
    res
      .status(500)
      .send({ error: "Failed to increment likeCount", details: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "User not found for deletion" });
    }
    res.send(result);
  } catch (err) {
    console.error(`Error deleting user with ID ${req.params.id}:`, err);
    res
      .status(500)
      .send({ error: "Failed to delete user", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
