import { useState, type FormEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../auth/AuthContext';
import { changePassword } from '../api/authApi';
import { isAdmin } from '../rbac/roles';

export default function ProfilePage() {
  const { user } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to change password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Profile
      </Typography>

      {/* User Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6">User Information</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 1.5, alignItems: 'center' }}>
          <Typography color="text.secondary" fontWeight={500}>Name</Typography>
          <Typography>{user?.name}</Typography>
          <Typography color="text.secondary" fontWeight={500}>Role</Typography>
          <Box>
            <Chip label={user?.role} color="primary" size="small" />
          </Box>
          <Typography color="text.secondary" fontWeight={500}>Tenant</Typography>
          <Typography>{user?.tenant}</Typography>
        </Box>
      </Paper>

      {/* Change Password */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6">Change Password</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleChangePassword} sx={{ maxWidth: 400 }}>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
          </Button>
        </Box>
      </Paper>

      {/* User Authorization — admin only */}
      {user && isAdmin(user.role) && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AdminPanelSettingsIcon color="primary" />
            <Typography variant="h6">User Authorization</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography color="text.secondary">
            Manage user roles, permissions, and access control settings here.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
