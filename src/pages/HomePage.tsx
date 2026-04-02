import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome, {user?.name ?? 'User'}
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1" color="text.secondary">
          This is the home dashboard. Use the navigation to explore the application.
        </Typography>
      </Paper>
    </Box>
  );
}
