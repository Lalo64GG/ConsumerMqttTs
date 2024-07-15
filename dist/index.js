"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
// MQTT broker URL
const brokerUrl = 'mqtt://52.72.139.152';
// MQTT connection options
const options = {
    clientId: 'mqtt_js_consumer',
    username: 'raspberry',
    password: 'dine123',
    keepalive: 60, // Keepalive interval in seconds
    reconnectPeriod: 1000, // Reconnect period in milliseconds
};
// Create MQTT client
const client = mqtt_1.default.connect(brokerUrl, options);
// Event handler for successful connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    const topic = 'pable';
    // Subscribe to the specified topic
    client.subscribe(topic, { qos: 0 }, (error) => {
        if (error) {
            console.error('Subscription error:', error);
        }
        else {
            console.log(`Subscribed to topic '${topic}'`);
        }
    });
});
// Event handler for receiving messages
client.on('message', (topic, message) => {
    console.log(`Message received on topic '${topic}': ${message.toString()}`);
});
// Event handler for connection errors
client.on('error', (error) => {
    console.error('Connection error:', error);
});
// Event handler for connection close
client.on('close', () => {
    console.log('Connection closed');
});
// Event handler for reconnection attempts
client.on('reconnect', () => {
    console.log('Attempting to reconnect to MQTT broker');
});
// Event handler for going offline
client.on('offline', () => {
    console.log('Disconnected from MQTT broker');
});
// Graceful shutdown on SIGINT signal
process.on('SIGINT', () => {
    client.end();
    console.log('Disconnected due to SIGINT');
});
