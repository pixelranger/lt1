const connectDb = require('./db');
const startWebsocketServer = require('./server/websocket');
const startHttpServer = require('./server/http');
connectDb();
startHttpServer();
startWebsocketServer();