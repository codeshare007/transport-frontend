import { ReactComponent as CloseIcon } from './icons/close.svg';
import { Box, IconButton, TableContainer, TableBody, TableHead, TableRow, Table } from '@mui/material';
import { StyledTableCell, StyledTableBodyCell } from './VehicleStyled';

interface VehicleInfoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedVehicleData: any;
}

export const VehicleInfo = ({ open, setOpen, selectedVehicleData }: VehicleInfoProps) => {
  return (
    <Box sx={{ padding: '5px 5px', bgcolor: '#fafafa', width: { xs: '100%', md: '100%' }, position: 'absolute', bottom: '0px', zIndex: 999 }}>
      <Box sx={{ textAlign: 'right' }}><IconButton sx={{ padding: '4px' }} onClick={() => setOpen(!open)}><CloseIcon /></IconButton></Box>
      <TableContainer sx={{ bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' } }} component={Box}>
        <Table sx={{
          borderCollapse: 'separate',
          borderSpacing: '0px 10px',
        }}
          aria-label='simple table'>
          <TableHead sx={{ backgroundColor: '#fafafa', border: 'none' }}>
            <TableRow>
              <StyledTableCell sx={{ padding: '5px 5px', fontSize: '13px' }}>Reg. broj</StyledTableCell>
              <StyledTableCell sx={{ padding: '5px 5px', fontSize: '13px' }}>Tip Vozila</StyledTableCell>
              <StyledTableCell sx={{ padding: '5px 5px', fontSize: '13px' }}>vrsta karoserije</StyledTableCell>
              <StyledTableCell sx={{ padding: '5px 5px', fontSize: '13px' }}>nosivost</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ '*': { textTransform: 'capitalize' } }}>
            <TableRow
              sx={{
                backgroundColor: '#fff',
                height: '50px',
                borderRadius: '4px',
                padding: '10px auto'
              }}
            >
              <StyledTableBodyCell sx={{ textTransform: 'uppercase', padding: '5px 5px', fontSize: '13px' }} component='th' scope='row'>
                { selectedVehicleData?.licensePlate }
              </StyledTableBodyCell>
              <StyledTableBodyCell sx={{ padding: '5px 5px', fontSize: '13px' }}>
                { selectedVehicleData?.vehicleType?.name }
              </StyledTableBodyCell>
              <StyledTableBodyCell sx={{ padding: '5px 5px', fontSize: '13px' }}>
                { selectedVehicleData?.bodyType?.name }
              </StyledTableBodyCell>
              <StyledTableBodyCell sx={{ padding: '5px 5px', fontSize: '13px' }}>
                { selectedVehicleData?.vehicleType?.grossWeight }
              </StyledTableBodyCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}