import { Box, Table, TableFooter, TableRow, TableContainer } from '@mui/material';
import React from 'react';

import { StyledTablePagination } from './GlobalSort.styled';


export interface GlobalSortProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  count: number;
  rowsPerPageOptions: number[];
}


export const GlobalSort = (props: GlobalSortProps) => {
  const { page, setPage, rowsPerPage, setRowsPerPage, count, rowsPerPageOptions } = props;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value));
  };

  return (
    <Box display={'flex'} mt={'auto'} >
      <TableContainer>
        <Table>
          <TableFooter>
            <TableRow>
              <StyledTablePagination
                count={count}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={'po strani'}
                rowsPerPageOptions={rowsPerPageOptions}
                backIconButtonProps={{
                  sx: {
                    backgroundColor: '#E8E8E8',
                    borderRadius: 1,
                  }
                }}
                nextIconButtonProps={{
                  sx: {
                    backgroundColor: '#E8E8E8',
                    borderRadius: 1,
                  }
                }}
                SelectProps={{
                  sx: {
                    backgroundColor: '#E8E8E8',
                  }
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};
