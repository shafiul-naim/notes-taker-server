const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://naim:vsl7ORReuThm40sF@cluster0.javc4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");

    // get api to read all notes or read database
    // http://localhost:5000/notes

    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    // create notes or create database
    // http://localhost:5000/note

    /* body data format
    {
        "userName": "nusra",
        "textData": "hello world"
        
    } */

    app.post("/note", async (req, res) => {
      const newUser = req.body;
      console.log("connected to database");
      console.log(newUser);
      const result = await notesCollection.insertOne(newUser);
      res.send(result);
    });

    // update notes
    // http://localhost:5000/note/626bb9c4d0e0c2ce4f9b4242

    app.put("/note/:id", async(req, res) => {
      const id = req.params.id;
      const data = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          ...data
        },
      };
      const result = await notesCollection.updateOne(filter, updatedDoc, options)

      console.log("from put method update", data);
      res.send(result);
    });

    // delete notes
    // http://localhost:5000/note/626bb9c4d0e0c2ce4f9b4242

    app.delete('/note/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const result = await notesCollection.deleteOne(filter);
        res.send(result);
    })
  } finally {
  }
}
run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object

//   console.log("connected to db")

// //   client.close();
// });

app.get("/", (req, res) => {
  res.send(" hello world");
});

app.listen(port, () => {
  console.log(`Example app listening to port ${port} `);
});

// pass    vsl7ORReuThm40sF
// naim
