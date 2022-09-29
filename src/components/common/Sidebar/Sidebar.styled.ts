import { Box, Typography, styled } from '@mui/material';


export const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  flex: '0 1 270px',
  boxShadow: 'none',
  '	.MuiDrawer-paper': {
    backgroundColor: theme.palette.primary.main,
  }
}));

export const Title = styled(Typography)(() => ({
  color: "#FFFFFF",
  fontStyle: "italic",
  fontSize: 26,
  marginBottom: '93px',
}));

export const SmallText = styled(Typography)(() => ({
  fontSize: 13,
  color: "#FFFFFF",
  opacity: 0.7,
  marginBottom: 40
}));