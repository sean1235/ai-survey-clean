// Vercel Serverless Function
import { MongoClient, ObjectId } from 'mongodb';

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
        
        const { id } = req.body;
        
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        res.status(200).json({ 
            success: true,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to delete data',
            message: error.message 
        });
    }
}
