import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';



interface PageHeaderProps {
  name?: string;
  children?: ReactNode;
}

const PageHeader = ({ name, children }: PageHeaderProps) => {
  return (
    <Box sx={{ bgcolor: '#fff', padding: { xs: '20px 20px', md: '30px 35px' } }}>
      <Typography sx={{ fontSize: { xs: '21px', md: '24px' }, fontWeight: '800', color: '#222' }}>{name}</Typography>
      {children}
    </Box>
  );
};

export default PageHeader;
