import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: "order-service",
    brokers: ['localhost:9094', 'localhost:9095', 'localhost:9096'],
});

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: "order-service"});

const run = async () => {
    try {
        await producer.connect()
        await consumer.connect()
        await consumer.subscribe({
            topic: "payment-successful",
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                const value = message.value.toString()
                const {userId, cart} = JSON.parse(value)

                //todo: insert order into  database
                const dummyOrderId = '12345678'
                console.log(`Order Consumer: Order created for user id: ${dummyOrderId}`);
                

                await producer.send({
                    topic: "order-successful",
                    messages: [
                        {value: JSON.stringify({userId, orderId: dummyOrderId})}
                    ]
                })                
            }
        })
    } catch (error) {
        console.log("Error from analytical consumer",error);
        
    }
}

run()