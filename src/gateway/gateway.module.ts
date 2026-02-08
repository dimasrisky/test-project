import { Module } from "@nestjs/common";
import { GatewayWebsocket } from "./gateway-web-socket";

@Module({
    imports: [],
    providers: [GatewayWebsocket],
    exports: [],
})
export class GatewayModule {}