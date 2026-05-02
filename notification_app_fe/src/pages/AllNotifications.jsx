import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Alert, 
  FormControl, InputLabel, Select, MenuItem,
  Pagination, Stack
} from '@mui/material';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard';

const API_URL = 'http://localhost:5000/notifications';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotifications');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, typeFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = import.meta.env.VITE_AUTH_TOKEN;
      let params = { page, limit };
      if (typeFilter !== 'ALL') {
        params.notification_type = typeFilter;
      }

      const response = await axios.get(API_URL, {
        params: params
      });

      const data = response.data.notifications || response.data || [];
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notifications.');
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
          All Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="ALL">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && !error && (
        <>
          {notifications.map(notif => (
            <NotificationCard 
              key={notif.ID} 
              notification={notif} 
              isViewed={viewedIds.has(notif.ID)}
              onClick={() => handleMarkViewed(notif.ID)}
            />
          ))}

          <Stack spacing={2} sx={{ alignItems: 'center', mt: 4 }}>
            <Pagination 
              count={10} // Hardcoded pages since we don't know total count, just for demo
              page={page} 
              onChange={(e, value) => setPage(value)} 
              color="primary" 
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default AllNotifications;
