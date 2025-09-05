import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketService = {
  stompClient: null,
  roomId: '',
  participant: '',
  onMessage: null,

  connect(roomId, participant, onMessage, onDisconnect, onError) {
    if (this.stompClient && this.stompClient.connected) {
      console.warn('Already connected.');
      return;
    }

    this.roomId = roomId;
    this.participant = participant;
    this.onMessage = onMessage;



    const socket = new SockJS('https://codequestbackend.onrender.com/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('[WebSocket] Connected to room:', roomId);

        this.stompClient.subscribe(`/topic/code/${roomId}`, (message) => {
          const payload = JSON.parse(message.body);
          if (payload && payload.code) {
            this.onMessage(payload.code);
          }
        });

        // Notify room of join
        this.sendMessage(JSON.stringify({ type: 'join', participant }), `/app/code/${roomId}/join`);
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame);
        if (onError) onError();
      },
      onWebSocketClose: () => {
        console.log('[WebSocket] Closed');
        if (onDisconnect) onDisconnect();
      },
    });

    this.stompClient.activate();
  },

  sendCodeMessage(code) {
    if (this.stompClient && this.stompClient.connected) {
      const message = {
        type: 'code',
        code,
        participant: this.participant,
      };
      this.stompClient.publish({
        destination: `/app/code/${this.roomId}`,
        body: JSON.stringify(message),
      });
    } else {
      console.warn('[WebSocket] Not connected. Cannot send code.');
    }
  },

  sendMessage(message, destination = `/app/code/${this.roomId}`) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: message,
      });
    } else {
      console.warn('[WebSocket] Not connected. Cannot send message.');
    }
  },

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      console.log('[WebSocket] Disconnecting...');
      this.sendMessage(
        JSON.stringify({ type: 'leave', participant: this.participant }),
        `/app/code/${this.roomId}/leave`
      );
      this.stompClient.deactivate();
    } else {
      console.log('[WebSocket] Stomp client not connected. Skip disconnect.');
    }
  },
};

export default WebSocketService;
