# <p align="center">Decentralized Trading Engine</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"></a>
  <a href="#"><img src="https://img.shields.io/badge/JSON%20Web%20Token-black?style=for-the-badge&logo=JSON-Web-Tokens" alt="JWT"></a>
</p>

## Introduction

This project is a backend trading engine designed to handle order management, balance tracking, and real-time price updates. It's built with Node.js, TypeScript, and leverages Redis for message queuing and data persistence. This system is tailored for developers building decentralized trading platforms or integrating trading functionalities into their applications.

## Table of Contents

1.  [Key Features](#key-features)
2.  [Installation Guide](#installation-guide)
3.  [Usage](#usage)
4.  [Project Structure](#project-structure)
5.  [Technologies Used](#technologies-used)
6.  [License](#license)

## Key Features

*   **Order Management:** Handles the creation and closing of trade orders via API endpoints.
*   **Real-time Price Streaming:** Ingests price data, streams prices to the backend, and calculates PNL using Redis streams.
*   **Balance Management:** Tracks user balances and processes balance requests.
*   **Data Persistence (Snapshots):** Periodically saves the application state (open orders and user balances) to Redis using a snapshot mechanism.
*   **Asynchronous Processing:** Uses Redis streams for asynchronous communication between components, ensuring reliable order processing and callback handling.
*   **Authentication:** Implements JWT-based authentication to secure API endpoints.
*   **Redis Streams:** Leverages Redis streams for asynchronous message queuing between order submission, processing, and client callbacks.
*   **Snapshotting:** Implements a snapshotting service that periodically saves the application state (open orders, user balances) to Redis, enabling quick recovery and data persistence. Snapshots are time-based and include the last processed offset ID from the trade stream.
*   **Price Poller:** A separate service polls for price data from external sources and streams updates into redis.
*   **Engine:** The engine processes trades based on price updates pushed into redis.

## Installation Guide

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies for each module (`backend`, `Engine`, `price-poller`):**

    ```bash
    cd backend
    npm install
    cd ../Engine
    npm install
    cd ../price-poller
    npm install
    cd ..
    ```

3.  **Configure environment variables:**

    Create `.env` files in the `backend`, `Engine`, and `price-poller` directories and set the necessary environment variables. Examples:

    *   **backend/.env:**

        ```
        REDIS_HOST=<redis_host>
        REDIS_PORT=<redis_port>
        JWT_SECRET=<jwt_secret>
        ```

    *   **Engine/.env:**

        ```
        REDIS_HOST=<redis_host>
        REDIS_PORT=<redis_port>
        ```
    *   **price-poller/.env:**

        ```
        REDIS_HOST=<redis_host>
        REDIS_PORT=<redis_port>
        ```

4.  **Run the backend server:**

    ```bash
    cd backend
    npm run dev
    ```
5.  **Run the Engine:**

    ```bash
    cd Engine
    npm run dev
    ```

6.  **Run the price-poller:**

    ```bash
    cd price-poller
    npm run dev
    ```

## Usage

The backend provides API endpoints for managing trades and balances.

*   **Create Order:** `POST /trades` - Creates a new trade order.
*   **Close Order:** `POST /trades/:orderId/close` - Closes an existing trade order.
*   **Get Balance:** `GET /balance` - Retrieves the user's balance.

Interact with the backend through HTTP requests to these endpoints. The backend uses Redis streams to process orders asynchronously.  The price-poller service streams price data into redis, which the engine then uses to calculate PNL and execute trades. Snapshots are periodically created and loaded from Redis to ensure data persistence.

## Project Structure

```
.
├── backend/              # Backend server (Express, TypeScript)
│   ├── src/              # Source code
│   │   ├── Routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   ├── types/        # TypeScript types
│   │   ├── jwt.ts        # JWT authentication middleware
│   │   ├── server.ts     # Entry point for the backend server
│   │   ├── trades.ts     # Trade-related API endpoints
│   │   ├── balance.ts    # Balance-related API endpoints
│   │   ├── requestBalance.ts # balance request to user balance
│   │   ├── closeOrder.ts  # function to close user orders
│   │   ├── pushData.ts    # send order data to redis queue
│   │   └── redisSubscriber.ts # redis subscriber for order callbacks
│   ├── package.json      # Backend dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── assets/         # assets like images
├── Engine/               # Trading Engine (Node.js, TypeScript)
│   ├── src/              # Source code
│   │   ├── getLatestPrices.ts # Streams latest prices from redis
│   │   ├── server.ts     # Entry point for the trading engine
│   │   ├── services/     # Engine services
│   │   │   ├── popData.ts # process trades and update balances
│   │   │   └── SnapshotService.ts # Snapshot functionality
│   │   └── types/        # TypeScript types
│   ├── package.json      # Engine dependencies and scripts
│   └── tsconfig.json     # TypeScript configuration
├── price-poller/         # Price Poller Service (Node.js, TypeScript)
│   ├── src/              # Source code
│   │   └── server.ts     # Entry point for the price poller service
│   ├── package.json      # Price Poller dependencies and scripts
│   └── tsconfig.json     # TypeScript configuration
├── package.json          # Root package file (if applicable)

```

## Technologies Used

<p align="left">
  <a href="#"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"></a>
  <a href="#"><img src="https://img.shields.io/badge/JSON%20Web%20Token-black?style=for-the-badge&logo=JSON-Web-Tokens" alt="JWT"></a>
</p>

*   **Backend:** Node.js, Express, TypeScript
*   **Data Persistence & Messaging:** Redis
*   **Authentication:** JWT

## License

MIT License
