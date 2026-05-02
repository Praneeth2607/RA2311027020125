import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Alert, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';

const API_URL = 'http://localhost:5000/notifications';
const PRIORITY_WEIGHTS = { 'Placement': 3, 'Result': 2, 'Event': 1 };

const PriorityInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    fetchPriorityNotifications();
  }, [limit]);

  const fetchPriorityNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = import.meta.env.VITE_AUTH_TOKEN;
      const response = await axios.get(API_URL, {
        params: { priority: 'true', limit: limit } 
      });

      const data = response.data.notifications || response.data || [];
      
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch priority notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkViewed = (id) => {
    setViewedIds(prev => {
      const next = new Set(prev).add(id);
      localStorage.setItem('viewedNotifications', JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
          Priority Inbox
        </Typography>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
          <InputLabel>Top 'N'</InputLabel>
          <Select
            value={limit}
            label="Top 'N'"
            onChange={(e) => setLimit(e.target.value)}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No priority notifications found.</Alert>
      )}

      {!loading && !error && notifications.map(notif => (
        <NotificationCard 
          key={notif.ID} 
          notification={notif} 
          isViewed={viewedIds.has(notif.ID)}
          onClick={() => handleMarkViewed(notif.ID)}
        />
      ))}
    </Box>
  );
};

export default PriorityInbox;
