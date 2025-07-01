import app from "./app.js";
import { connectKafkaProducer } from "./config/kafka.js";
import db from "./config/db.js";
import { configDotenv } from "dotenv";
import path from 'path'

configDotenv({
  path: path.resolve(process.cwd(), 'config/config.env')
});

const PORT = process.env.PORT

process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`)
    console.log(`Server is shutting down due to uncaught exception errors`);
    process.exit(1)
    
})


app.listen(PORT, () => {
    // connectKafkaProducer()
    console.log(`Payment service is listen on PORT ${PORT}`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down, due to unhandled promise rejection`)
    app.close(() => {
        process.exit(1)
    })
})

