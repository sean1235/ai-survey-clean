import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

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
        await client.connect();
        const database = client.db('surveyDB');
        const collection = database.collection('responses');
        
        const data = req.body;
        data.submittedAt = new Date().toISOString();
        data.id = Date.now().toString();
        
        await collection.insertOne(data);
        
        res.status(200).json({ 
            success: true, 
            id: data.id,
            message: 'Data saved to MongoDB'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to save data',
            message: error.message 
        });
    } finally {
        await client.close();
    }
}
