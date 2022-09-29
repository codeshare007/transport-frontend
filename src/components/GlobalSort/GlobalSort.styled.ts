import { styled, TablePagination, TablePaginationProps, TablePaginationBaseProps } from '@mui/material';


export const StyledTablePagination = styled(TablePagination)<TablePaginationBaseProps>(({ theme }) => ({
  width: '100%',
  marginBottom: '30px',
  borderBottom: '0',
  '.MuiTablePagination-spacer': {
    display: 'none',
  },
  '.MuiInputBase-root': {
    order: 1,
    marginRight: 14,
    borderRadius: 4,
    width: 68,
    '.MuiSelect-icon': {
      top: 'unset',
      right: 7,
    },
    '.MuiTablePagination-select': {
      padding: '10px 13px',
      display: 'flex',
      borderRadius: 4,
    }
  },
  '.MuiTablePagination-selectLabel': {
    order: 2,
  },
  '.MuiTablePagination-displayedRows': {
    order: 3,
    marginLeft: 'auto'
  },
  '.MuiTablePagination-actions': {
    display: 'flex',
    order: 4,
    button: {
      ':disabled': {
        backgroundColor: '#F4F4F4',
      }
    }
  },
  '.MuiTablePagination-toolbar': {
    padding: '0px',
  },
}));
