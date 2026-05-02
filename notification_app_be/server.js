require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const logger = require('../logging_middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Middleware to log every single request for debugging
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

const PRIORITY_WEIGHTS = { 'Placement': 3, 'Result': 2, 'Event': 1 };

// MAIN ENDPOINT FOR STAGE 1 & 2
app.get('/notifications', async (req, res) => {
    console.log("Processing /notifications request...");
    const API_URL = 'http://20.207.122.201/evaluation-service/notifications';
    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    try {
        // Construct URL with query parameters
        const url = new URL(API_URL);
        if (req.query.limit) url.searchParams.append('limit', req.query.limit);
        if (req.query.page) url.searchParams.append('page', req.query.page);
        if (req.query.notification_type) url.searchParams.append('notification_type', req.query.notification_type);

        const response = await fetch(url.toString(), {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        
        if (!response.ok) {
            const err = await response.text();
            console.error("API Error from upstream:", err);
            return res.status(response.status).json({ error: "Upstream API Error", details: err });
        }

        const data = await response.json();
        const notifications = data.notifications || [];
        console.log(`Fetched ${notifications.length} notifications.`);

        const sorted = notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;
            if (weightA !== weightB) return weightB - weightA;
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        // The query params might handle slicing upstream. If we still need priority inbox slicing:
        const isPriorityRequest = req.query.priority === 'true';
        let finalData = notifications;

        if (isPriorityRequest) {
            finalData = sorted.slice(0, req.query.limit ? parseInt(req.query.limit) : 10);
        }

        res.json({ 
            rollNo: "RA2311027020125",
            notifications: finalData 
        });
    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Notification System Backend is running. Use /notifications for Stage 1." });
});

app.listen(PORT, () => {
    console.log(`Server is LIVE at http://localhost:${PORT}`);
    console.log(`Stage 1 endpoint: http://localhost:${PORT}/notifications`);
});
