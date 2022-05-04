const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://groceryShop:${process.env.PASS}@cluster0.657ma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("grocery-shop").collection("product");
    const feedbackCollection = client.db("grocery-shop").collection("feedback");

    // Auth
    app.post("/login", async (req, res) => {
      const user = req.body;

      const accessToken = jwt.sign(user, process.env.TOKEN, {
        expiresIn: "2d",
      });

      res.send({ accessToken });
    });

    //==============All Product Load==================
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //=================Product Add=================
    app.post("/products", async (req, res) => {
      const product = req.body.product;
      console.log(product);
      const { name, image, price, quantity, selerName, text, email } = product;

      const doc = {
        email,
        name,
        image,
        price,
        quantity,
        selerName,
        text,
      };
      const result = await productCollection.insertOne(doc);
      res.send(result);
    });

    //=============Single Product=============
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //Quantity Update
    // app.put("/products/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) };

    //   const options = { upsert: true };

    //   const updateDoc = {};
    //   const result = await productCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });

    // Product Delete
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // Feedback load
    app.get("/feedbacks", async (req, res) => {
      const query = {};
      const cursor = feedbackCollection.find(query);
      const feedbacks = await cursor.toArray();
      res.send(feedbacks);
    });
  } finally {
  }
}
run().catch((error) => console.dir);
app.get("/", (req, res) => {
  res.send("My first check");
});

app.listen(port, () => {
  console.log(port, "Example Runnig Port");
});
