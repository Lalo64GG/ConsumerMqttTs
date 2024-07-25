import mqtt from 'mqtt';

const brokerUrl = "mqtt://52.72.139.152";

const options: mqtt.IClientOptions = {
  clientId: 'mqtt_ts_consumer',
  username: "raspberry",
  password: "dine123",
  keepalive: 60,
  reconnectPeriod: 1000,
};

const client = mqtt.connect(brokerUrl, options);

interface SensorData {
  gas_level?: number;
  temperature?: number;
}

let sensorData: SensorData = {};

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  const topic = "pable";
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
  try {
    const data: SensorData = JSON.parse(message.toString());
    sensorData = {
      gas_level: data.gas_level ?? sensorData.gas_level,
      temperature: data.temperature ?? sensorData.temperature,
    };
  } catch (error) {
    console.error('Error parsing message:', error);
  }
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

// Export a function to get the latest sensor data
export const getSensorData = () => sensorData;
