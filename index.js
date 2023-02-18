//express
const express = require("express");
//env
const dotenv = require("dotenv").config();

//mongodb
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const URL = process.env.DB;
const app = express();
app.use(express.json());


// Home page
app.get("/", (req, res) => {
    res.send("Welcome to Hall Booking app 🎉🎉");
});

//create a room
app.post("/rooms/create", async (req, res) => {
    try {
        //connect mongodb
        const connection = await mongoclient.connect(URL);
        //select DB
        const db = connection.db("hallbook");
        //select collection
        const collection = db.collection("rooms");
        //insert data
        const operation = await collection.insertMany(req.body);
        //close the connection
        connection.close();
        res.json({ message: "Rooms Created" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});

//room booking
app.post("/booking/:id", async (req, res) => {

    try {
        //connect mongodb
        const connection = await mongoclient.connect(URL);
        //select DB
        const db = connection.db("hallbook");
        //select collection
        const collection = db.collection("bookingdetails");
        const collection1 = db.collection("rooms");
        const data = await collection1.find({ _id: mongodb.ObjectId(req.params.id) }).toArray();

        if (data[0].isbooked) {
            res.json({ messagae: "Already booked" });
        } else {
            //update booking  data
            const op1 = await collection1.findOneAndUpdate({ _id: mongodb.ObjectId(req.params.id) }, { $set: { isbooked: true } });
            //insert data
            const operation = await collection.insertOne({ ...req.body, isbooked: true });
            //close the connection
            connection.close();
            res.json({ message: "Room Booked" });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});
//get room details
app.get("/roomdetails", async (req, res) => {
    try {
        //connect mongodb
        const connection = await mongoclient.connect(URL);
        //select DB
        const db = connection.db("hallbook");
        //select collection
        const collection = db.collection("rooms");
        //insert data
        const roomdetails = await collection.find({}).toArray();
        //close the connection
        connection.close();
        res.json(roomdetails);
    } catch (error) {
        console.log(error)
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});


//get customer details
app.get("/customers", async (req, res) => {
    try {
        //connect mongodb
        const connection = await mongoclient.connect(URL);
        //select DB
        const db = connection.db("hallbook");
        //select collection
        const collection = db.collection("bookingdetails");
        //insert data
        const customers = await collection.find({}).toArray();
        //close the connection
        connection.close();
        res.json(customers);
    } catch (error) {
        console.log(error)
        res.status(500).json({ messagae: "Something Went Wrong" });
    }
});

app.listen(process.env.PORT || 8000);