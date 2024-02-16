const express = require('express');
const app = express();
const http = require('http');
const port = require('../config').httpServerPort;
const path = require('path');
const dataService = require('../services/dataService');
const fs = require('fs').promises;
const request = require('request');



app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const startHttpServer = () => {
    server.listen(port, function () {
        console.log(`Http server listening port ${port}`);
    });
};

app.post('/', async function (req, res) {
    if(req.body && req.body.resource_link_id && req.body.user_id) {
        const session = req.body.resource_link_id + req.body.user_id;
        await dataService.startSession(req.body, session);
        let html = await fs.readFile(path.resolve(__dirname + '../../../frontend/dist/index.html'), 'utf8');
        html = html.replace(/(data-session=)([^>]*)(>)/gm, `$1${session}$3`);
        res.send(html);
    } else {
        res.status(403).send('LTI expected')
    }
});

app.get('/proxy', async function (req, res, next) {
    req.pipe(request(req.query.url, {rejectUnauthorized: false}).on('error', next)).pipe(res);
});


module.exports = startHttpServer;
