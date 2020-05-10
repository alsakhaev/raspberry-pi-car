import { PeerConnectionClient } from './peerconnection_client';
import { trace } from './common';

export class WebSocketSignalingChannel {
    remoteVideo_: any;
    wsPath_: any;
    websocket_?: WebSocket;
    peerConnectionClient_?: PeerConnectionClient | null;

    constructor(remoteVideo: any, wsPath: string) {
        this.remoteVideo_ = remoteVideo;
        this.wsPath_ = wsPath;

        window.onbeforeunload = this.doSignalingDisconnnect.bind(this);
    };


    connectWebSocket() {
        this.websocket_ = new WebSocket(this.wsPath_);
        this.websocket_.onopen = this.onWebSocketOpen_.bind(this);
        this.websocket_.onclose = this.onWebSocketClose_.bind(this);
        this.websocket_.onmessage = this.onWebSocketMessage_.bind(this);
        this.websocket_.onerror = this.onWebSocketError_.bind(this);
    };

    onWebSocketOpen_(event: Event) {
        trace("Websocket connnected: " + this.websocket_?.url);
        this.doSignalingRegister();
    };

    onWebSocketClose_(event: CloseEvent) {
        trace("Websocket Disconnected");
        this.doSignalingDisconnnect();
        this.peerConnectionClient_?.close();
        this.peerConnectionClient_ = null;
    };

    onWebSocketMessage_(event: MessageEvent) {
        trace("WSS -> C: " + event.data);

        var dataJson = JSON.parse(event.data);
        if (dataJson["cmd"] == "send") {
            this.peerConnectionClient_?.onReceivePeerMessage(dataJson["msg"]);
        }
    };

    onWebSocketError_(event: Event) {
        trace("An error occured while connecting", event);
        // TODO: need error handling
    };

    webSocketSendMessage(message: string) {
        if (this.websocket_?.readyState == WebSocket.OPEN ||
            this.websocket_?.readyState == WebSocket.CONNECTING) {
            trace("C --> WSS: " + message);
            this.websocket_?.send(message);
            return true;
        }
        trace("failed to send websocket message :" + message);
        return new Error('failed to send websocket message');
    };


    doSignalingConnect() {
        // check whether WebSocket is suppored in this browser.
        if (window.WebSocket) {
            // supported
            this.peerConnectionClient_ =
                new PeerConnectionClient(this.remoteVideo_, this.doSignalingSend.bind(this));
            this.connectWebSocket();
        } else {
            trace("doSignalingConnect: WebSocket is not suppported in this platform!");
            // WebSocket is not supported
        }
    };

    // 
    doSignalingRegister() {
        // No Room concept, random generate room and client id.
        var register = {
            cmd: 'register',
            roomid: this.randomString_(9),
            clientid: this.randomString_(8)
        };
        var register_message = JSON.stringify(register);
        this.webSocketSendMessage(register_message);
    };

    doSignalingSend(data: any) {
        var message = {
            cmd: "send",
            msg: JSON.stringify(data),
            error: ""
        };
        var data_message = JSON.stringify(message);
        if (!this.webSocketSendMessage(data_message)) {
            trace("Failed to send data: " + data_message);
            return false;
        };
        return true;
    };

    doSignalingDisconnnect() {
        if (this.websocket_?.readyState == 1) {
            this.websocket_?.close();
        };
    };

    ///////////////////////////////////////////////////////////////////////////////
    //
    // Utility Helper functions
    //
    ///////////////////////////////////////////////////////////////////////////////

    isPrivateIPaddress_(ipaddress: string) {
        var parts = ipaddress.split('.');
        return parts[0] === '10' ||
            (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
            (parts[0] === '192' && parts[1] === '168');
    };

    randomString_(length: number) {
        // Return a random numerical string.
        var result = [];
        var strLength = length || 5;
        var charSet = '0123456789';
        while (strLength--) {
            result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
        }
        return result.join('');
    };
}