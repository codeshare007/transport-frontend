import { Popper, styled, Box } from '@mui/material';


export const StyledPopper = styled(Popper)(() => ({
  width: '333px',
  height: '372px'
}));

export const StyledInside = styled(Box)(() => ({
  background: '#fff',
  borderRadius: '4px',
  border: '1px solid #E7E7E7;',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
  height: '100%',
  width: '100%',
}));
