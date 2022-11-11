const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        //collections
        const serviceCollection = client.db('ancientShot').collection('services');
        const reviewCollection = client.db('ancientShot').collection('reviews');

        //read

        //only 3 data loading
        //all data load
        /* app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        }) */
        
        //limited
        app.get('/limitedservices',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        //all service
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        //specific data load
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //reviews api

        app.get('/reviews', async(req,res)=>{
            // console.log(req.query.email);
            let query ={};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/reviews', async(req,res)=>{
            // console.log(req.query.email);
            let query ={};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray().sort({time: -1});
            res.send(reviews);
        })
        app.get('/reviews', async(req,res)=>{
            // console.log(req.query.email);
            let query ={};
            const cursor = reviewCollection.find(query).sort({time: -1});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        

        app.post('/reviews', async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);                                      
        })
    }
    finally{

    }
}
run().catch(err=>{console.error(err)})

app.listen(port,()=>{
    console.log(`Ancient Shot server is running on port ${port}`);
})