const express = require('express');
const cors = require('cors');

const monitorRoutes = require('./routes/monitorRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Mount API routes
app.use('/api', monitorRoutes);
app.use('/api', alertRoutes);

module.exports = app;