const webSocketsServerPort = require('../config').webSocketsServerPort;
const webSocketServer = require('websocket').server;
const http = require('http');
const clients = [];
const server = http.createServer();
const wsServer = new webSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 131072,
    maxReceivedMessageSize: 10 * 1024 * 1024,
});
const dataService = require('../services/dataService');

const startWebsocketServer = () => {
    console.log('WebSocket server listening port ' + webSocketsServerPort);
    server.listen(webSocketsServerPort)
};

wsServer.on('request', async (request) => {
    const connection = request.accept(null, request.origin);
    const session = request.resourceURL.query.session;
    if(!session)
        return;
    clients[session] = connection;
    const sessionData = await dataService.getSession(session);
    if(sessionData) {
        connection.send(JSON.stringify({
            body: sessionData,
            action: 'sessionData'
        }));
    }

    connection.on('message', async (message) => {
        if (message.type !== 'utf8')
            return;

        const msg = JSON.parse(message.utf8Data);
        switch (msg.action) {
            case "updateSettings": {
                await dataService.updateSettings(session, msg.body);
                break;
            }
            case "updateAnswers": {
                await dataService.updateAnswers(session, msg.body);
                break;
            }
            case "journalDownloaded": {
                await dataService.journalDownloaded(session);
                break;
            }
        }
    });
    connection.on('close', () => {delete clients[session]});
});

module.exports = startWebsocketServer;
