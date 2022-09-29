import React from 'react';
import { useAppDispatch } from '../../redux/store';
import { removeVehicle } from '../../redux/slices/vehicle-slice';
import { Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { IconButton, TableContainer, TableBody, TableHead, TableRow, Table } from '@mui/material';
import { ReactComponent as EditIcon } from './icons/edit-icon.svg';
import { ReactComponent as DeleteIcon } from './icons/delete-icon.svg';
import { ReactComponent as NotesIcon } from './icons/notes.svg';
import { useDialog } from '../../context/ModalContext';

import { GlobalSort } from '../../components/GlobalSort';
import { StyledTableCell, StyledTableBodyCell } from './VehicleStyled';

const kategorije = [
  "Registarski Broj:",
  "Tip Vozila:",
  "Vrsta Karoserije:",
  "Dimenzije Vozila:",
  "Nosivost:",
  "Oprema:",
  "Beleške:",
  "Akcije:",
];

export const DriversContent = (props: any) => {



  const matches = useMediaQuery("(max-width:767px)");
  const totalElements = useSelector((store: RootState) => store?.vehicles?.vehicles?.totalElements);
  const allVehicles = useSelector((store: RootState) => store?.vehicles?.vehicles);

  const dispatch = useAppDispatch();

  const { sort, setSort, setOpen, setVehicleData, setSelectedMapVehicle } = props;

  const { showDialog } = useDialog();


  return (
    <Box sx={{ padding: '0px 15px', bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' } }}>
      {allVehicles?.content?.length > 0 && matches
        ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
            {allVehicles?.content?.map((row: any) => (
              <Box onClick={() => setSelectedMapVehicle(row)}>
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[0]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.licensePlate}</Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[1]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.type?.name}</Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[2]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}>{row?.bodyType?.name}</Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[3]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold', justifyContent: 'flex-start' }}>{row?.type?.name !== 'šleper' && `D: ${row?.dimension?.length?.toFixed(1)}m x Š: ${row?.dimension?.width?.toFixed(1)}m x V: ${row?.dimension?.height?.toFixed(1)}m / K: ${row?.dimension?.volume?.toFixed(1)}m3`}</Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[4]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}> {row?.loadCapacity}</Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[5]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}><IconButton onClick={() => showDialog('Oprema', row?.additionalEquipment)}>
                    <NotesIcon />
                  </IconButton></Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[6]}</Typography>
                  <Box sx={{ maxWidth: '200px', pl: '40px', fontWeight: 'bold' }}><IconButton onClick={() => showDialog('Beleške', row?.description)}>
                    <NotesIcon />
                  </IconButton></Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                  <Typography sx={{ width: '150px', }}>{kategorije[7]}</Typography>
                  <Box sx={{ pl: '40px', fontWeight: 'bold' }}><IconButton onClick={() => {
                    setOpen({
                      open: true,
                      edit: true,
                    });
                    setVehicleData({
                      id: row.id,
                      vehicleTypeId: row.type.id,
                      bodyTypeId: row.bodyType.id,
                      length: row.dimension.length,
                      width: row.dimension.width,
                      height: row.dimension.height,
                      volume: row.dimension.volume,
                      loadCapacity: row.loadCapacity.replace('t', ''),
                      additionalEquipment: row.additionalEquipment,
                      description: row.description,
                      licensePlate: row.licensePlate,
                    });
                  }}>
                    <EditIcon />
                  </IconButton>
                    <IconButton onClick={() => dispatch(removeVehicle(row.id))}>
                      <DeleteIcon />
                    </IconButton></Box>
                </Box>
                <Divider sx={{ height: '3px', backgroundColor: '#36CB83' }} />
              </Box>
            ))}
          </Box>
        )
        : allVehicles?.content?.length > 0 ?
          (
            <TableContainer sx={{ bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' } }} component={Box}>
              <Table sx={{

                borderCollapse: 'separate',
                borderSpacing: '0px 10px',
              }}
                aria-label='simple table'>
                <TableHead sx={{ backgroundColor: '#fafafa', border: 'none' }}>
                  <TableRow>
                    <StyledTableCell>Reg. broj</StyledTableCell>
                    <StyledTableCell>Tip Vozila</StyledTableCell>
                    <StyledTableCell>vrsta karoserije</StyledTableCell>
                    <StyledTableCell>Dimenzije vozila</StyledTableCell>
                    <StyledTableCell align='center'>nosivost</StyledTableCell>
                    <StyledTableCell align='center'>oprema</StyledTableCell>
                    <StyledTableCell align='center'>beleske</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody sx={{ overflowY: 'scroll', '*': { textTransform: 'capitalize' } }}>
                  {allVehicles?.content?.map((row: any) => (
                    <TableRow
                      key={row?.id}
                      onClick={() => setSelectedMapVehicle(row)}
                      sx={{
                        backgroundColor: '#fff',
                        height: '75px',
                        borderRadius: '4px',
                        '&:hover': {
                          cursor: 'pointer',
                          backgroundColor: '#f5f5f5',
                          'th': {
                            borderColor: '#36CB83',
                          },
                        },
                      }}
                    >
                      <StyledTableBodyCell sx={{ textTransform: 'uppercase' }} component='th' scope='row'>
                        {row?.licensePlate}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row?.type?.name}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row?.bodyType?.name}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row?.type?.name !== 'šleper' && `D: ${row?.dimension?.length?.toFixed(1)}m x Š: ${row?.dimension?.width?.toFixed(1)}m x V: ${row?.dimension?.height?.toFixed(1)}m / K: ${row?.dimension?.volume?.toFixed(1)}m3`}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell align='center'>
                        {row?.loadCapacity}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell align='center'>
                        <IconButton onClick={() => showDialog('Oprema', row?.additionalEquipment)}>
                          <NotesIcon />
                        </IconButton>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell align='center'>
                        <IconButton onClick={() => showDialog('Beleške', row?.description)}>
                          <NotesIcon />
                        </IconButton>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <Box display={'flex'} gap={'15px'}>
                          <IconButton onClick={() => {
                            setOpen({
                              open: true,
                              edit: true,
                            });
                            setVehicleData({
                              id: row.id,
                              vehicleTypeId: row.type.id,
                              bodyTypeId: row.bodyType.id,
                              length: row.dimension.length,
                              width: row.dimension.width,
                              height: row.dimension.height,
                              volume: row.dimension.volume,
                              loadCapacity: row.loadCapacity.replace('t', ''),
                              additionalEquipment: row.additionalEquipment,
                              description: row.description,
                              licensePlate: row.licensePlate,
                            });
                          }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => dispatch(removeVehicle(row.id))}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </StyledTableBodyCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
          :

          (
            <Box>
              <Typography textAlign={'center'}>
                Trentuno nema vozila
              </Typography>
            </Box>
          )}
      <GlobalSort
        rowsPerPageOptions={[5, 10, 15]}
        count={totalElements ? totalElements : 0}
        page={sort.pageNo}
        rowsPerPage={sort.pageSize}
        setPage={(page: number) => setSort({ ...sort, pageNo: page })}
        setRowsPerPage={(rowsPerPage: number) => setSort({ ...sort, pageSize: rowsPerPage })}
      />
    </Box>
  );
};