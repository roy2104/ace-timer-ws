const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let currentTimer = null;

wss.on("connection", ws => {
    console.log("Client connected");

    // Send existing timer to new client
    if (currentTimer) {
        ws.send(JSON.stringify(currentTimer));
    }

    ws.on("message", message => {
        currentTimer = JSON.parse(message);

        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(currentTimer));
            }
        });
    });

    ws.on("close", () => console.log("Client disconnected"));
});

console.log("WebSocket server running");
