const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const uri = process.env.URI;
const client = new MongoClient(uri);

const dbConnect = async () => {
    try {
        await client.connect();
        console.log('db Connected')
    } catch (error) {
        console.log(error)
    }
}

dbConnect();

const Services = client.db('wildography').collection('services');
const Reviews = client.db("wildography").collection('reviews')
app.post('/services', async (req, res) => {
    const result = await Services.insertOne(req.body);
    res.send(result)
})

//get the services to the client home page
app.get('/services/home', async (req, res) => {
    try {
        const result = await Services.find({}).limit(3).toArray();
        res.send({
            success: true,
            message: "successful",
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//services 
app.get("/services", async (req, res) => {
    try {
        const result = await Services.find({}).toArray();
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//services by id
app.get('/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Services.findOne({ _id: ObjectId(id) })
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//post review
app.post('/reviews', async (req, res) => {
    try {
        const result = await Reviews.insertOne(req.body);
        res.send({
            success: true,
            message: "Review added"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})


//get reviews
app.get('/reviews', async (req, res) => {
    try {
        // const service = req.query;

        const result = await Reviews.find(req.query).toArray();
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//find review by id
app.get('/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Reviews.findOne({ _id: ObjectId(id) });
        res.send({
            success: true,
            data: result
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//review deletion
app.delete("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Reviews.deleteOne({ _id: ObjectId(id) })
        res.send({
            success: true,
            message: "Item removed"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })  
    }
})
//update
app.patch("/reviews/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Reviews.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        res.send({
            success: true,
            message: "Updated"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})


//the root api
app.get('/', (req, res) => {
    res.send('Server is on')
})


//listening the port
app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})