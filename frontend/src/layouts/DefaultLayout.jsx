import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from '../components/Header';

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = () => {
    setUser("");
    setToken(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={user} onLogout={onLogout} />
      <Container component="main" sx={{ flex: 1, paddingY: 2 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
