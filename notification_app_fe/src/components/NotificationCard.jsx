import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const NotificationCard = ({ notification, isViewed, onClick }) => {
  const getChipColor = (type) => {
    switch (type) {
      case 'Placement': return 'success';
      case 'Result': return 'primary';
      case 'Event': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card 
      onClick={onClick}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        borderLeft: isViewed ? '4px solid transparent' : '4px solid #1976d2',
        opacity: isViewed ? 0.7 : 1,
        transition: '0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip label={notification.Type} color={getChipColor(notification.Type)} size="small" />
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={isViewed ? 'normal' : 'bold'}>
          {notification.Message}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          ID: {notification.ID}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
