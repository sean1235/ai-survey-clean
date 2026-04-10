const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB连接
const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }
    const client = await MongoClient.connect(uri);
    cachedClient = client;
    return client;
}

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// API路由
app.get('/api/data', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('survey_db');
        const collection = db.collection('responses');
        const data = await collection.find({}).sort({ submittedAt: -1 }).toArray();
        res.json(data);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch data', message: error.message });
    }
});

app.post('/api/submit', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('survey_db');
        const collection = db.collection('responses');
        
        const data = req.body;
        data.submittedAt = new Date();
        
        const result = await collection.insertOne(data);
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to save data', message: error.message });
    }
});

app.post('/api/delete', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('survey_db');
        const collection = db.collection('responses');
        
        const { id } = req.body;
        await collection.deleteOne({ id: id });
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete data', message: error.message });
    }
});

app.post('/api/clear', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('survey_db');
        const collection = db.collection('responses');
        
        const result = await collection.deleteMany({});
        res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to clear data', message: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
