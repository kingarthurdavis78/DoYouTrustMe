const { WebSocketServer } = require('ws');
const express = require('express');
const app = express();

// Serve up our webSocket client HTML
app.use(express.static('./public'));

const port = 3000;
server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

// Create a webSocket server
const wss = new WebSocketServer({ server });

let connections = [];

// When a client connects, listen for messages
wss.on('connection', (ws) => {
    console.log('Client connected');

    if (connections.length > 2) {
        ws.send('Sorry, the server is full');
        ws.close();
    }
    connections.push(ws);
    ws.send('You are player ' + connections.length);

    ws.on('message', (message) => {
        // Broadcast the message to the other client
        connections.forEach((connection) => {
            if (connection !== ws) {
                connection.send(message);
            }
        }
    )});

    ws.on('close', () => {
        console.log('Client disconnected');
        connections = connections.filter((connection) => connection !== ws);
        connections[0].send('Sorry, the other player disconnected');
    });


});