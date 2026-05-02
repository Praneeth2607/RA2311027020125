# Campus Notification System

This repository contains the full-stack solution for the frontend evaluation (Stage 1 & Stage 2).

## Project Structure

- `notification_app_fe`: React frontend built with Vite (Runs on `http://localhost:3000`).
- `notification_app_be`: Node.js Express backend (Runs on `http://localhost:5000`).
- `logging_middleware`: Custom logging middleware used by the backend.
- `notification_system_design.md`: Architecture and design documentation.
- `Results/`: Contains demonstration media, including `Demo.mp4` and screenshots of the Postman and Localhost API testing.

## Setup Instructions

> [!WARNING]
> The upstream Evaluation Service tokens expire quickly. If you receive a `401 Unauthorized` error, you must generate a new token and update the `.env` files in both the root directory and `notification_app_fe/.env`. After updating, **restart the backend server**.

### Backend (Proxy & Stage 1 Logic)
1. Navigate to `notification_app_be`.
2. Run `npm install`.
3. Start the server with `node server.js`.
4. The backend runs on `http://localhost:5000` and proxies requests to the upstream API to bypass CORS for the frontend.

### Frontend (Stage 2 UI)
1. Navigate to `notification_app_fe`.
2. Run `npm install`.
3. Start the development server with `npm run dev`.
4. Open your browser to `http://localhost:3000`.

## Features Delivered
- **Stage 1**: Algorithm to sort notifications by Priority Weight (`Placement` > `Result` > `Event`) and Recency.
- **Stage 2**: Responsive React application using Material UI.
  - **All Notifications**: Server-side pagination and type filtering via backend proxy.
  - **Priority Inbox**: Custom top 'N' limiting with Stage 1 sorting logic.
  - **Viewed Tracking**: Persistent visual indicators for unread notifications.
