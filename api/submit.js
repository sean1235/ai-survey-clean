// Vercel Serverless Function - MongoDB Atlas
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const client = await connectToDatabase();
        const db = client.db('survey_db');
        const collection = db.collection('responses');
        
        const data = req.body;
        data.submittedAt = new Date();
        
        const result = await collection.insertOne(data);
        
        res.status(200).json({ 
            success: true, 
            id: result.insertedId 
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to save data',
            message: error.message 
        });
    }
}