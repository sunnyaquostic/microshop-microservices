# microshop-microservices

A microservices-based e-commerce backend system with a React frontend, designed for scalability and modularity. The system uses Apache Kafka for asynchronous communication between services.

## Architecture Overview

- **Client (React App):** User-facing frontend for browsing, registration, and order placement.
- **Payment Service:** Handles user registration, authentication, and payment processing.
- **Order Service:** Processes orders after successful payment and communicates order status.
- **Email Service:** Sends transactional emails (e.g., order confirmation, registration) to users.
- **Analytical Service:** Consumes events for analytics and reporting.
- **Kafka Service:** Provides the event streaming backbone for inter-service communication.

```
[Client] ⇄ [Payment Service] ⇄ [Order Service] ⇄ [Email Service]
         ↘︎ Kafka (Event Bus) ↙︎         ↘︎
         [Analytical Service]           [Kafka Service]
```

## Services

- **client/**: React frontend application.
- **payment-service/**: Node.js/Express service for user and payment management.
- **order-service/**: Node.js/Express service for order processing.
- **email-service/**: Node.js service for sending emails based on Kafka events.
- **analytical-service/**: Node.js service for analytics, listens to Kafka topics.
- **kafka/**: Kafka cluster setup (docker-compose) and admin scripts.

## Technologies Used
- Node.js, Express.js
- React.js
- Apache Kafka (via KafkaJS)
- PostgreSQL (for payment-service)
- Docker (for Kafka cluster)
- Nodemailer (for emails)
- Tailwind CSS (for frontend styling)

## Getting Started

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose (for Kafka)
- PostgreSQL (for payment-service)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/sunnyaquostic/microshop-microservices.git
   cd microshop-microservices
   ```
2. **Start Kafka cluster:**
   ```bash
   cd services/kafka
   docker-compose up -d
   ```
3. **Configure environment variables:**
   - Each service has a `config/config.env` file. Update DB credentials, SMTP, etc.
4. **Install dependencies and run services:**
   ```bash
   # Example for payment-service
   cd ../payment-service
   npm install
   npm start
   # Repeat for order-service, email-service, analytical-service
   ```
5. **Start the frontend:**
   ```bash
   cd ../client
   npm install
   npm start
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](LICENSE) 