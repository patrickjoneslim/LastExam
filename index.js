const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 7000;

// Set up default mongoose connection
const url = "mongodb+srv://AdminGroup:1234@cluster0.hr8pm86.mongodb.net/test";
const client = new MongoClient(url);

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const dbName = "Doctors_clinic";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });


app.get("/Patients", (req, res) => {
  db.collection("Patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log("err");
      return res.json({ msg: "There was an error processing your query" });
    });
});

//Insert a patient

app.post("/Patients", (req, res) => {
    console.log(req.body);
    const {name,age,birthdate,address,gender} = req.body;
    db.collection("Patients")
      .insertOne({name,age,birthdate,address,gender})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Display Prescriptions
  app.get("/Prescription/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Prescription")
      .find({_id: ObjectId(id)})
      .toArray()
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Create prescriptions

  app.post("/Prescription", (req, res) => {
    console.log(req.body);
    const {date,name,diagnosis,medications} = req.body;
    db.collection("Prescription")
      .insertOne({date,name,diagnosis,medications})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 


  //Delete a prescription

  app.delete("/Prescription/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Prescription")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Add a medication to the prescription

  app.put("/Prescription/:_id", (req, res) => {
    const id = req.params._id;
    const {medications} = req.body;
    db.collection("Prescription")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $push: {
            medications
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Remove a medication from a prescription

  app.put("/Prescriptions_/:_id", (req, res) => {
    const id = req.params._id;
    const {medications} = req.body;
    db.collection("Prescription")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $pull: {
            medications
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });



 //update patients
 app.put("/Patients_/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("Patients")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $set:req.body
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });
 //Delete a patient

 app.delete("/Patients_/:_id", (req, res) => {
  const id = req.params._id;
  db.collection("Patients")
    .deleteOne(
      {
        _id: ObjectId(id)
      })
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});