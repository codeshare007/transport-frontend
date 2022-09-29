import { Drawer, IconButton, useMediaQuery, Box } from "@mui/material";
import { ReactComponent as CloseIcon } from "./icons/close.svg";
import { Fragment, ReactNode } from "react";
import logo2 from "../../pages/LandingPages/prevezi2.png";

interface TargetGroupDrawerProps {
  open: boolean;
  children: ReactNode[] | ReactNode;
  setOpen: (open: boolean) => void;
}

export const TargetGroupDrawer = ({ children, open, setOpen }: TargetGroupDrawerProps) => {
  const matches = useMediaQuery("(max-width:1004px)");
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
            width: { xs: "100%", md: "902px", lg: '1004px' },
            padding: { xs: "38px 0px", md: "38px 0px" },
            marginTop: "64px"
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
            sx={{
                alignSelf: "flex-end",
                marginRight: "34px"
            }}
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
