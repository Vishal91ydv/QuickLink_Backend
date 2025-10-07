require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToLongUrl } = require('./controllers/urlController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect to DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/QuickLink');

// API routes
app.use('/api/url', urlRoutes);

// Redirect route
app.get('/:shortCode', redirectToLongUrl);


app.get('/', (req, res) => {
  res.send('QuickLink backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
