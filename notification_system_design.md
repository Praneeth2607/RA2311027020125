# Stage 1

## Approach: Priority Inbox Logic

To implement the Priority Inbox, we need to sort notifications based on two criteria: **Weight** and **Recency**.

### 1. Priority Weighting
We assign numerical values to each notification type to facilitate comparison:
- **Placement**: 3 (Highest Priority)
- **Result**: 2
- **Event**: 1 (Lowest Priority)

### 2. Sorting Strategy
The primary sort key is the **Weight**. If two notifications have the same weight, we use the **Timestamp** as the secondary sort key (descending order for recency).

### 3. Efficiency in Maintenance
To maintain the Top 10 efficiently as new notifications arrive:
- **Current Implementation**: Since we are fetching a batch from an API, we use a standard $O(N \log N)$ sort.
- **Scaling for Streaming Data**: If notifications were streaming in real-time, the most efficient way to maintain the "Top 10" would be using a **Min-Priority Queue (Min-Heap)** of size $K=10$. 
    - For every new notification:
        1. Compare it with the minimum element in the heap.
        2. If the new one has higher priority, remove the minimum and insert the new one.
    - This keeps the complexity at $O(N \log K)$, which is significantly faster than re-sorting the entire list as $N$ grows.

## Implementation Details
The solution is implemented in `notification_app_be/priorityInbox.js`. It performs a protected GET request to the evaluation service, processes the JSON response, and outputs the top 10 notifications to the console.
