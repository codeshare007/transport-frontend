import { useState, useEffect } from "react";
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { Avatar, Box, Divider, Typography, useMediaQuery } from '@mui/material';
import { IconButton, TableContainer, TableBody, TableHead, TableRow, Table } from '@mui/material';
import { ReactComponent as EditIcon } from './icons/edit-icon.svg';
import { ReactComponent as DeleteIcon } from './icons/delete-icon.svg';
import { ReactComponent as UpRightArrow } from './icons/up-right-arrow.svg';
import { StyledTableCell, StyledTableBodyCell } from './GroupStyled';
import { getGroup, removeGroup, getAllGroups } from "../../redux/slices/group-slice";

export const GroupsContent = (props: any) => {
  const { sort, setSort, setEditGroup, setGroupOpen, setSelectedGroupData } = props;
  const matches = useMediaQuery("(max-width:767px)");
  const dispatch = useAppDispatch();
  const totalElements = useSelector((store: RootState) => store?.groups?.totalElements);
  const groups = useSelector((store: RootState) => store?.groups?.content);
 useEffect(() => {
console.log(groups)
 }, [groups])

  return (
    <Box sx={{ padding: '0px 15px 20px 15px', bgcolor: '#fafafa', width: { xs: '100%', md: '100%' } }}>
      {
        groups?.length > 0 && matches
          ?
          (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
              {groups?.map((row: any, index: number) => (
                <Box key={row?.id} onClick={() => { setSelectedGroupData(row) }}>
                  <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                    <Typography sx={{ width: '47%', textTransform: 'uppercase' }}>ime grupe:</Typography>
                    <Box sx={{ maxWidth: '200px',fontWeight: 'bold' }}>{row?.name}</Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', padding: '10px 0', flexDirection: 'row' }}>
                    <Typography sx={{ width: '47%', textTransform: 'uppercase' }}>Opis:</Typography>
                    <Box sx={{ maxWidth: '200px', height: '100px',fontWeight: 'bold', overflowWrap: 'anywhere' }}>{row?.description}</Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', padding: '0px 80px', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <IconButton onClick={() => { setEditGroup(row) }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => dispatch(removeGroup(row.id))}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => { dispatch(getGroup(row.id)); setGroupOpen(true); }}>
                        <UpRightArrow />
                      </IconButton>
                  </Box>
                  <Divider sx={{ height: '2px', backgroundColor: '#36CB83' }} />
                </Box>
              ))}
            </Box>
          )
          :
          //////////////////////////////////////////////////////
          groups?.length > 0 ?
            (
              <TableContainer sx={{ bgcolor: '#fafafa', width: { xs: '100%', md: 'auto' } }} component={Box}>
                <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 10px', }} aria-label='simple table'>
                  <TableHead sx={{ backgroundColor: '#fafafa', border: 'none' }}>
                    <TableRow>
                      <StyledTableCell>broj</StyledTableCell>
                      <StyledTableCell>ime grupe</StyledTableCell>
                      <StyledTableCell>Opis</StyledTableCell>
                      <StyledTableCell align='center'>akcije</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ overflowY: 'scroll', '*': { textTransform: 'capitalize' } }}>
                    {groups?.map((row: any, index: number) => (
                      <TableRow
                        key={row?.id}
                        onClick={() => {
                          setSelectedGroupData(row);
                          dispatch(getGroup(row.id))
                        }}
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
                        <StyledTableBodyCell sx={{ textTransform: 'uppercase', width: '5%' }} component='th' scope='row'>
                          {index + 1}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell width='30%'>
                          <Box sx={{ display: "flex" }}>
                            <Avatar
                              sx={{
                                height: "47px",
                                width: "47px",
                                fontSize: "18px",
                                fontWeight: "700",
                                lineHeight: "26px",
                                textTransform: "uppercase",
                              }}
                            >
                              {row?.name[0] + row?.name[1]}
                            </Avatar>
                            <Box
                              sx={{ display: "table", pl: "13px" }}
                            >
                              <Typography sx={{ verticalAlign: "center", fontSize: "16px", textAlign: { xs: 'center', md: 'center' }, fontWeight: '500', lineHeight: '24px' }}>
                                {row?.name}
                              </Typography>
                            </Box>
                          </Box>
                        </StyledTableBodyCell>
                        <StyledTableBodyCell sx={{overflowWrap: 'anywhere'}}>
                          {row?.description}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell align='center' width='10%'>
                          <Box display={'flex'} gap={'15px'} justifyContent={"center"}>
                            <IconButton onClick={() => setEditGroup(row)} >
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => dispatch(removeGroup(row.id))}>
                              <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => { setGroupOpen(true) }}>
                              <UpRightArrow />
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
            //////////////////////////////////////////////////////
            (
              <Box>

              </Box>
            )
      }
    </Box>
  );
};