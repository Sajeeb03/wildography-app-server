const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000

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
app.post('/services', async (req, res) => {
    const result = await Services.insertOne(req.body);
    res.send(result)
})
app.get('/', (req, res) => {
    res.send('Server is on')
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})