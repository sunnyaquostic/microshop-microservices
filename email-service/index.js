import { producer, consumer } from "./utils/kafka.js";
import { configDotenv } from "dotenv";

configDotenv({
    path: 'config/config.env'
})

const run = async () => {
    try {
        await producer.connect()
        await consumer.connect()
        await consumer.subscribe({
            topics: ["order-successful", "registration-successful"],
            fromBeginning: true
        });


        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                const value = message.value.toString()
                const { user } = JSON.parse(value)

                console.log(value)
                //todo: send email to the user
                const dummyEmailId= '123456098'
                console.log(`Email Consumer: Email sent successfully!`);
                

                await producer.send({
                    topic: "email-successful",
                    messages: [
                        {value: JSON.stringify({userId, emailId: dummyEmailId})}
                    ]
                })                
            }
        })
    } catch (error) {
        console.log("Error from analytical consumer",error);
        
    }
}

run()


