import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class GatewayWebsocket {
    @WebSocketServer() server: Server;

    @SubscribeMessage('testMessage')
    handleMessage(@MessageBody() body: any){
        console.log(body);
    }
}