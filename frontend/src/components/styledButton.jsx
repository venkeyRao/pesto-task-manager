import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const StyledButton = styled(Button)(({ theme }) => ({
  border: '1px solid white',
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'black',
  },
}));

export default StyledButton;