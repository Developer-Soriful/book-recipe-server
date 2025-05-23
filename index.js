import e from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

const app = e();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(cors());
app.use(e.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxfbk1g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect(); // ⬅️ এটাকে উপরে নিয়ে এসো

    const database = client.db("users");
    const usersCollection = database.collection("users");
    // top recipe sorting
    app.get("/toprecipe", async (req, res) => {
      const cursor = usersCollection.find().sort({ likeCount: -1 }).limit(6);
      const topRecipe = await cursor.toArray();
      res.send(topRecipe);
    });
    // GET users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });
    // get user one data
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    // this is for user data finding
    app.get("/users/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      console.log(query);

      const user = await usersCollection.find(query).toArray();
      res.send(user);
    });
    // this is for user update user
    app.put("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updateUserData = req.body;
        const options = { upsert: true };
        const updateDoc = {
          $set: updateUserData,
        };
        const result = await usersCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to update user" });
      }
    });
    // patch like data update
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $inc: {
          likeCount: 1,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // POST user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.status(200).send(result);
    });
    //  this is for user delete data
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    // Ping
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }
}
run();

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
