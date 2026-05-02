import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

const NavMenu = () => {
  const location = useLocation();
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar sx={{ flexWrap: 'wrap', py: { xs: 1, sm: 0 }, gap: { xs: 1, sm: 0 } }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            color: 'primary.main',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            width: { xs: '100%', sm: 'auto' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Campus Notifications
        </Typography>
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Button 
            component={Link} 
            to="/" 
            color={location.pathname === '/' ? 'primary' : 'inherit'}
            size="small"
          >
            All
          </Button>
          <Button 
            component={Link} 
            to="/priority" 
            color={location.pathname === '/priority' ? 'primary' : 'inherit'}
            size="small"
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavMenu />
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, pb: 4, px: { xs: 1.5, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityInbox />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
