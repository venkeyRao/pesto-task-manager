import { Box } from '@mui/material';

const GuestLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {children}
    </Box>
  );
};

export default GuestLayout;
