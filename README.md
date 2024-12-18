# Microservices with Kong API Gateway

This repository demonstrates a simple microservices architecture using **Node.js** and **Kong API Gateway**, deployed with **Docker Compose**. It includes three microservices: User Service, Product Service, and Order Service.

---

## **Microservices Overview**

### **1. User Service**
- URL: `/users`
- Port: `5001`
- Example Response:
  ```json
  [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ]
  ```

### **2. Product Service**
- URL: `/products`
- Port: `5002`
- Example Response:
  ```json
  [
    { "id": 1, "name": "Laptop" },
    { "id": 2, "name": "Smartphone" }
  ]
  ```

### **3. Order Service**
- URL: `/orders`
- Port: `5003`
- Example Response:
  ```json
  [
    { "orderId": 1, "product": "Laptop", "quantity": 1 },
    { "orderId": 2, "product": "Smartphone", "quantity": 2 }
  ]
  ```

---

## **Setup Instructions**

### **1. Prerequisites**
- Docker & Docker Compose installed
- Node.js (for local development/testing)

---

### **2. Clone the Repository**
```bash
git clone <repository-url>
cd <repository-directory>
```

---

### **3. Microservice Setup**
Each microservice has its own directory: `user-service`, `product-service`, and `order-service`.

#### **Dockerfile for Each Microservice**
Each microservice has a `Dockerfile` with the following structure:

```dockerfile
# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the service listens on
EXPOSE <PORT>

# Start the application
CMD ["node", "index.js"]
```

Replace `<PORT>` with the respective service's port (5001, 5002, or 5003).

#### **Install Dependencies**
Navigate to each service directory and install dependencies:
```bash
cd user-service
npm init -y
npm install express

cd ../product-service
npm init -y
npm install express

cd ../order-service
npm init -y
npm install express
```

---

### **4. Docker Compose Setup**
The `docker-compose.yml` file orchestrates all the services:

```yaml
version: '3.8'

services:
  kong-database:
    image: postgres:15
    environment:
      POSTGRES_USER: kong
      POSTGRES_DB: kong
      POSTGRES_PASSWORD: kong
    ports:
      - "5432:5432"

  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: "postgres"
      KONG_PG_HOST: kong-database
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: "0.0.0.0:8001, 0.0.0.0:8444 ssl"
    ports:
      - "8000:8000"
      - "8443:8443"
      - "8001:8001"
      - "8444:8444"
    depends_on:
      - kong-database

  kong-dashboard:
    image: pantsel/konga:latest
    environment:
      DB_ADAPTER: "postgres"
      DB_HOST: kong-database
      DB_USER: kong
      DB_PASSWORD: kong
      DB_DATABASE: kong
    ports:
      - "1337:1337"
    depends_on:
      - kong-database
      - kong

  user-service:
    build:
      context: ./user-service
    ports:
      - "5001:5001"

  product-service:
    build:
      context: ./product-service
    ports:
      - "5002:5002"

  order-service:
    build:
      context: ./order-service
    ports:
      - "5003:5003"
```

---

### **5. Start the Services**
Build and start the services using Docker Compose:
```bash
docker-compose up --build
```

This command will:
- Build the Docker images for the services
- Start Kong, the database, the microservices, and Konga (Kong dashboard)

---

### **6. Configure Kong**
Use the Kong Admin API to configure routing for the services.

#### **Add Routes for Microservices**
Run the following commands to create routes for the microservices:

```bash
# User Service
curl -i -X POST http://localhost:8001/services/ \
  --data "name=user-service" \
  --data "url=http://user-service:5001"

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data "paths[]=/users"

# Product Service
curl -i -X POST http://localhost:8001/services/ \
  --data "name=product-service" \
  --data "url=http://product-service:5002"

curl -i -X POST http://localhost:8001/services/product-service/routes \
  --data "paths[]=/products"

# Order Service
curl -i -X POST http://localhost:8001/services/ \
  --data "name=order-service" \
  --data "url=http://order-service:5003"

curl -i -X POST http://localhost:8001/services/order-service/routes \
  --data "paths[]=/orders"
```

---

### **7. Test the Services via Kong**
You can test the services using the following commands:

#### **User Service**
```bash
curl http://localhost:8000/users
```

#### **Product Service**
```bash
curl http://localhost:8000/products
```

#### **Order Service**
```bash
curl http://localhost:8000/orders
```

---

### **8. Monitoring and Dashboard**
- Access **Konga (Kong dashboard)**: [http://localhost:1337](http://localhost:1337)
- Configure and monitor your API Gateway visually.

---

## **Contributions**
Feel free to open issues or contribute by creating a pull request.

---

## **License**
This project is licensed under the MIT License.


