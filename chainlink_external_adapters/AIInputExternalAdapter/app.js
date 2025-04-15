// server.js (or index.js)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createRequest = require('./index').createRequest;

const app = express();
const port = process.env.EA_PORT || 8080;

// Set up CORS options
const corsOptions = {
  origin: '*', // Allow all origins (you can restrict this to your frontend domain if needed)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));        // Enable CORS for all routes
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body);
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result);
    res.status(status).json(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
