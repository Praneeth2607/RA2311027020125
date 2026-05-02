# Notification System Design Architecture

## Stage 1: Priority Inbox Logic

### Approach
To implement the Priority Inbox, notifications are sorted based on two criteria: **Weight** and **Recency**.

1. **Priority Weighting**
   We assign numerical values to each notification type to facilitate comparison:
   - **Placement**: 3 (Highest Priority)
   - **Result**: 2
   - **Event**: 1 (Lowest Priority)

2. **Sorting Strategy**
   The primary sort key is the **Weight**. If two notifications have the same weight, we use the **Timestamp** as the secondary sort key (descending order for recency).

3. **Efficiency in Maintenance**
   - **Current Implementation**: Since we are fetching a batch from an API, we use a standard $O(N \log N)$ sort.
   - **Scaling for Streaming Data**: If notifications were streaming in real-time, the most efficient way to maintain the "Top 10" would be using a **Min-Priority Queue (Min-Heap)** of size $K=10$, achieving a time complexity of $O(N \log K)$.

---

## Stage 2: Frontend Implementation

### Architecture Overview
The frontend is built using **React** (via Vite) and **Material UI**. To ensure a clean integration with the external evaluation service and avoid CORS (Cross-Origin Resource Sharing) restrictions, we utilized a **Backend Proxy Pattern**.

1. **Backend Proxy (`notification_app_be/server.js`)**
   - The Node.js Express server acts as a proxy for the frontend. 
   - It securely holds the `AUTH_TOKEN` and accepts incoming requests on `http://localhost:5000/notifications`.
   - It forwards query parameters (`page`, `limit`, `notification_type`) directly to the upstream evaluation service and returns the formatted data back to the React app.

2. **Frontend UI (`notification_app_fe`)**
   - **Routing**: `react-router-dom` handles navigation between the "All Notifications" and "Priority Inbox" pages.
   - **Responsiveness**: The UI relies heavily on Material UI's `sx` prop responsive breakpoints (`xs`, `sm`) to shift between mobile-friendly vertical stacks and desktop-friendly horizontal layouts.
   - **Minimalist Theme**: A custom `theme.js` implements a light, unobtrusive color palette focusing heavily on content readability.

3. **State Management (Read/Unread Status)**
   - Unread notifications are visually distinguished by bold text and a solid colored border.
   - When a user clicks a notification card, its `ID` is added to a React `Set` and simultaneously synchronized with the browser's `localStorage`. This ensures that read states persist across page reloads without requiring a database.
