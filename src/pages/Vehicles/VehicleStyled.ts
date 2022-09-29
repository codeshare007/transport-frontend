import { styled, TableCell } from '@mui/material';


export const StyledTableCell = styled(TableCell)(({theme}) => ({

  textTransform: 'uppercase',
  color: '#999',
  lineHeight: '19px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  border: 'none',
}));

export const StyledTableBodyCell = styled(TableCell)(({theme}) => ({

  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  color: '#222',
  borderBottom: 'none',
  '&:first-of-type': {
    borderLeft: 'solid 3px transparent',
  }
}));