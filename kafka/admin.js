import { Kafka } from 'kafka';

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ['host.docker.internal:9094', 'host.docker.internal:9095', 'host.docker.internal:9096'],
});

const admin = kafka.admin();

const run = async () => {
    await admin.connect();
    await admin.createTopics({
        topics: [{ topic: "payment-successful"} , { topic: "order-successful"}],
    })
};

run()