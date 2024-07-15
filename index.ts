import mqtt from 'mqtt';
import dotenv from 'dotenv';

dotenv.config();

const brokerUrl = process.env.BROKE_URL || '';

// MQTT connection options
const options = {
    clientId: 'mqtt_js_consumer',
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    keepalive: 60, // Keepalive interval in seconds
    reconnectPeriod: 1000, // Reconnect period in milliseconds

  };

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  const topic = process.env.TOPIC || '';

  client.subscribe(topic, { qos: 0 }, (error) => {
    if (error) {
      console.error('Subscription error:', error);
    } else {
      console.log(`Subscribed to topic '${topic}'`);
    }
  });
});


client.on('message', (topic, message) => {
  console.log(`Message received on topic '${topic}': ${message.toString()}`);
});

client.on('error', (error) => {
  console.error('Connection error:', error);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker');
});

client.on('offline', () => {
  console.log('Disconnected from MQTT broker');
});

process.on('SIGINT', () => {
  client.end();
  console.log('Disconnected due to SIGINT');
});
