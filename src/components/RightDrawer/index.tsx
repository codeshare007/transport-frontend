import { Button, Drawer, IconButton, useMediaQuery, Box } from "@mui/material";
import { ReactComponent as CloseIcon } from "./icons/close.svg";
import React, { Fragment, ReactNode } from "react";
import logo2 from "../../pages/LandingPages/prevezi2.png";

interface RightDrawerProps {
  open: boolean;
  children: ReactNode[] | ReactNode;
  setOpen: (open: boolean) => void;
}

export const RightDrawer = ({ children, open, setOpen }: RightDrawerProps) => {
  const matches = useMediaQuery("(max-width:767px)");
  return (
    <Fragment>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => setOpen(!open)}
        sx={{
          display: "flex",
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "727px" },
            padding: { xs: "30px 15px", md: "30px 35px" },
          },
        }}
      >
        {matches ? (
          <Box
            sx={{ width: '100%', margin: "auto", display: 'flex', borderBottom: '1px solid #E0E0E0', justifyContent: 'space-between', alignItems: 'center' }}
            pb={2}
          >
            <img src={logo2} alt={"prevezi"} />{" "}
            <IconButton
              sx={{ alignSelf: "flex-end" }}
              onClick={() => setOpen(!open)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            sx={{ alignSelf: "flex-end" }}
            onClick={() => setOpen(!open)}
          >
            <CloseIcon />
          </IconButton>
        )}

        {children}
      </Drawer>
    </Fragment>
  );
};
