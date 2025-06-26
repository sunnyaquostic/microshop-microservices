// config/kafka.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ['localhost:9094', 'localhost:9095', 'localhost:9096'],
});

export const producer = kafka.producer();

export const connectKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log('✅ Kafka Producer connected');
    } catch (err) {
        console.error(' Failed to connect Kafka Producer:', err.message);
    }
};
