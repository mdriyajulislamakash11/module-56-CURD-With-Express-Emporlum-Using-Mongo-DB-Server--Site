const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// madleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zchez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // coffee collection
    const coffeeCollection = client.db("coffee-shope").collection("coffees");
    // user collection
    const userCollection = client.db("coffee-shope").collection("users");

    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      console.log("Received Coffee:", newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateCoffee = {
        $set: {
          name: coffee.name,
          supplier: coffee.supplier,
          taste: coffee.taste,
          chef: coffee.chef,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };

      const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });





    // User Collection 

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser)
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee meacking server is running....");
});

app.listen(port, () => {
  console.log(`Coffee server is Running on port: ${port}`);
});
