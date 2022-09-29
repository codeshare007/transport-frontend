import React from "react";
import { RootState } from "../../redux/store";
import {
  Avatar,
  Box,
  Typography,
  styled
} from "@mui/material";
import { useSelector } from "react-redux";

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  width: '100%',
  marginTop: '26px',
  [theme.breakpoints.down('md')]: {
    padding: '0px 0px',
    gridTemplateColumns: '1fr',
  },
}));

const Item = styled(Box)(({ theme }) => ({
  display: "flex",
  backgroundColor: "white",
  padding: "20px",
  gap: "22px",
  p: {
    "&:first-of-type": {
      fontSize: "21px",
      fontWeight: "bold",
    },
    "&:last-of-type": {
      fontSize: "16px",
      marginBottom: "22px",
    },
  },
  svg: {
    marginRight: "10px",
  },
}));

export const UsersContent = (props: any) => {
  const users = useSelector((store: RootState) => store?.users?.content);
  const totalElements = useSelector(
    (store: RootState) => store?.users?.totalElements
  );

  //console.log(users);

  return (
    <Box>
      <Box sx={{ padding: { xs: '20px', md: "29px 35px" }}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: "14px", color: "rgba(153, 153, 153, 1)", lineHeight: 'normal' }}
          >
            {`Ukupno ${totalElements} korisnika`}
          </Typography>
          <Box display={"flex"} gap={"10px"}>
          </Box>
        </Box>
        <Container>
          {users?.map((item: any) => (
            <Item key={item.id}>
              <Avatar
                sx={{
                  height: "64px",
                  width: "64px",
                  fontSize: "21px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.name[0] + item.name[1]}
              </Avatar>
              <Box>
                <Typography sx={{ lineHeight: "28px" }}>
                  {item.name}
                </Typography>
                <Typography sx={{ lineHeight: "28px" }}>
                  {item.email}
                </Typography>
                <Typography sx={{ lineHeight: "24px" }}>
                  {item.phone}
                </Typography>
                <Typography sx={{ lineHeight: "24px" }}>
                  {item.companyRoles}
                </Typography>
              </Box>
            </Item>
          ))}
        </Container>
      </Box>
    </Box>
  );
};
