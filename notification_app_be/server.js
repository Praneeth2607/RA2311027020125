require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('../logging_middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.json({ message: "Notification System Backend is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
