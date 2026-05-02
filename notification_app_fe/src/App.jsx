import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';

const NavMenu = () => {
  const location = useLocation();
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
          Campus Notifications
        </Typography>
        <Button 
          component={Link} 
          to="/" 
          color={location.pathname === '/' ? 'primary' : 'inherit'}
        >
          All Notifications
        </Button>
        <Button 
          component={Link} 
          to="/priority" 
          color={location.pathname === '/priority' ? 'primary' : 'inherit'}
        >
          Priority Inbox
        </Button>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavMenu />
        <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
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
