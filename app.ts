import mqtt from 'mqtt';


const brokerUrl = "mqtt://52.72.139.152" || '';

// MQTT connection options
const options: mqtt.IClientOptions = {
  clientId: 'mqtt_ts_consumer',
  username: "raspberry",
  password: "dine123",
  keepalive: 60, // Keepalive interval in seconds
  reconnectPeriod: 1000, // Reconnect period in milliseconds
};

const client = mqtt.connect(brokerUrl, options);

let gasLevel: number | null = null;

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  const topic = "pable" || '';

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
  // Assuming message is a JSON string with a gas_level field
  const data = JSON.parse(message.toString());
  gasLevel = data.gas_level;
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

// Export gasLevel for use in API route
export { gasLevel };
