import { WebSocketServer } from "ws";
import { OnClientMessage } from "./server";
import * as Logging from "./log";
import { Zynith } from "..";

const bootAttempts = 50;
const port = 8080
const log = Logging.logger("websocket-api");
let WSServer: WebSocketServer;

let zynith = new Zynith({})

async function initializeWebsockets() {
    for (let i = 0; i < bootAttempts; i++) {
        try {
            WSServer = new WebSocketServer({ port });
            await new Promise((resolve, reject) => {
                WSServer.on("error", reject);
                WSServer.on("listening", resolve);
                WSServer.on("error", reject);
            });        
            break;
        } catch (e:any) {
            // If the error is something other than "address in use", then we try again
            // the shutdown process is not complete
            if (e.code !== 'EADDRINUSE') { throw e; }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

export function listenForClients() {
    WSServer.on("connection", function connection(ws) {
        
        const send = (action: string, data: any) => {
            ws.send(JSON.stringify({action, data}));
            log.log(`<- WebSocket message send: ${action} ${JSON.stringify(data).length} bytes`);
        }

        ws.addEventListener("message", (event) => {
            const { message, data } = JSON.parse(event.data.toString());
            log.log(`-> WebSocket message received: ${message}`);
            OnClientMessage(send, message, data, zynith);
        })
    });
}

export async function boot () {

    // Start the WebSocket server
    log.log(`Booting websocket server`);
    await initializeWebsockets()
    log.log(`WebSocket server successfully running on port ${port}`);

    // Start the database
    zynith.database.build()

    // Start listening for clients
    listenForClients();
}

export const localServerConfig = {
    name: 'run-websocket-server',
    configureServer: () => {boot()},
    buildEnd: () => {
        console.log("Shutting down websocket server");
        if (WSServer) WSServer.close();
        zynith.database.shutdown();
    },
}
