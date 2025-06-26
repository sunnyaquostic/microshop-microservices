import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: "analytical-service",
    brokers: ['host.docker.internal:9094', 'host.docker.internal:9095', 'host.docker.internal:9096'],
});

const consumer = kafka.consumer({ groupId: "analytical-service"});

const run = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({
            topics: ["payment-successful", "order-successful", "email-successful"],
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {

                switch (topic) {
                    case "payment-successful":
                        const value = message.value.toString()
                        const {userId, cart} = JSON.parse(value)

                        const total = cart.reduce((acc, item) => acc + item.price, 0)

                        console.log(`analytical consumer: User ${userId} paid ${total}`).tofixed(2);
                        break;

                    case "order-successful":
                        const orderValue = message.value.toString()
                        const {customerId, orderId} = JSON.parse(orderValue)

                        console.log(`Analytical consumer: Order id: ${userId} created successfully for userId: ${customerId}`);
                        break;

                    case "email-successful":
                        const emailValue = message.value.toString()
                        const {ownerId, emailId} = JSON.parse(emailValue)

                        console.log(`Analytical consumer: Email Id: ${emailId} is sent to user id: ${ownerId}`);
                        break;
                    
                    default:
                        break;
                }
                
            }
        })
    } catch (error) {
        console.log("Error from analytical consumer",error);
        
    }
}

run()