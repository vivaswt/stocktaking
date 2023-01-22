const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const createPDF = require('./report');
const {downloadMaterials, downloadProductRecordsByDate} = require('./notionBusinessDataHandler');

const PORT = process.env.PORT || 3001;

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/api/pdf/wip', (req, res) => {
    const pdf = createPDF(
        'wip',
        JSON.parse(req.body.stocks),
        JSON.parse(req.body.reportYM));
    pdf.then(bytes => {
        res.end(Buffer.from(bytes, 'binary'));
    });
});

app.post('/api/pdf/product', (req, res) => {
    const pdf = createPDF(
        'product',
        JSON.parse(req.body.stocks),
        JSON.parse(req.body.reportYM));
    pdf.then(bytes => {
        res.end(Buffer.from(bytes, 'binary'));
    });
});

app.post('/api/materials', (req, res, next) => {
    downloadMaterials(req.body.token)
        .then(ms => res.json(ms))
        .catch(e => next(e));
});

app.post('/api/product-records-by-date', (req, res, next) => {
    const date = new Date(req.body.date);
    downloadProductRecordsByDate(req.body.token, date)
        .then(data => res.json(data))
        .catch(e => next(e));
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});