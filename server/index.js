const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const createPDF = require('./report');

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.post("/api/pdf", (req, res) => {
    const pdf = createPDF(JSON.parse(req.body.stocks));
    //res.json(JSON.parse(req.body.stocks));
    pdf.then(bytes => {
        res.end(Buffer.from(bytes, 'binary'));
    });
    
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});