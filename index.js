const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Ancient Shot server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w75vwv7.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('ancientShot').collection('services');

        //read
        //all data load
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    }
    finally{

    }
}
run().catch(err=>{console.error(err)})

app.listen(port,()=>{
    console.log(`Ancient Shot server is running on port ${port}`);
})