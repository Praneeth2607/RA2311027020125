require('dotenv').config();

/**
 * Priority Weights:
 * Placement > Result > Event
 */
const PRIORITY_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

async function fetchAndProcessNotifications(topN = 10) {
    const API_URL = 'http://20.207.122.201/evaluation-service/notifications';
    const AUTH_TOKEN = process.env.AUTH_TOKEN;

    if (!AUTH_TOKEN) {
        console.error("Error: AUTH_TOKEN not found in environment variables.");
        return;
    }

    try {
        console.log("Fetching notifications from API...");
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        console.log(`Received ${notifications.length} notifications. Processing...`);

        // Sort notifications based on Weight then Timestamp
        const sortedNotifications = notifications.sort((a, b) => {
            const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
            const weightB = PRIORITY_WEIGHTS[b.Type] || 0;

            if (weightA !== weightB) {
                return weightB - weightA; // Higher weight first
            }

            // If weights are equal, sort by recency (Timestamp descending)
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        // Extract top N
        const topNotifications = sortedNotifications.slice(0, topN);

        console.log(`\n--- TOP ${topN} PRIORITY NOTIFICATIONS ---`);
        console.table(topNotifications.map(n => ({
            ID: n.ID.slice(0, 8) + "...",
            Type: n.Type,
            Message: n.Message,
            Timestamp: n.Timestamp
        })));

        return topNotifications;
    } catch (error) {
        console.error("Failed to process notifications:", error.message);
    }
}

// Execute the function
fetchAndProcessNotifications(10);
