import React, { useState, useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";

import {
  Box,
  Typography,
  styled,
  InputLabel,
  Button,
  Grid,
  useMediaQuery,
} from "@mui/material";
import logo from "./prevezi.png";
import logo2 from "./prevezi2.png";
import { Formik, Field } from "formik";
import { TextField } from "formik-mui";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useSnackBar } from "../../context/SnackContext";
import { userLogin } from "../../redux/slices/user-slice";
import { useDialog } from "../../context/ModalContext";
import { MainCheckbox } from "../../components/common/micro/buttons";
import { PaperContent } from "../../components/common/micro/theme";
import { LoginSchema } from "../../schema/loginSchema";

export const StyledBox = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  backgroundImage:
    "url(https://www.aircargoweek.com/wp-content/uploads/2020/06/marcin-jozwiak-oh0DITWoHi4-unsplash-scaled.jpg)",
  backgroundOrigin: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
}));

export const StyledGrid = styled(Grid)(() => ({
  height: "100%",
  width: "100%",
  backgroundImage:
    "url(https://www.aircargoweek.com/wp-content/uploads/2020/06/marcin-jozwiak-oh0DITWoHi4-unsplash-scaled.jpg)",
  justifyContent: "center",
  alignItems: "center",
  backgroundOrigin: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
}));

export const CenteredBox = styled(Box)(() => ({
  minWidth: "464px",
  height: "auto",
  padding: "50px 40px",
  background: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const LoginPage = () => {
  const loading = useSelector((store: RootState) => store?.user?.loading);
  const tokens = useSelector((store: RootState) => store?.user?.tokens);
  const errors = useSelector((store: RootState) => store?.user?.error);
  const storageToken = localStorage.getItem("token");
  const storageRefresh = localStorage.getItem("refreshToken");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();
  const { showDialog } = useDialog();
  const matches = useMediaQuery("(max-width:767px)");

  const [saveTokenInStorage, setSaveTokenInStorage] = useState(true);

  useEffect(() => {
    if (
      loading === "success" &&
      errors === null &&
      tokens.token &&
      tokens.refreshToken
    ) {
      if (saveTokenInStorage) {
        localStorage.setItem("token", tokens.token);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }
      showSnackBar("Uspešno ste se prijavili!", "success");
      navigate({
        pathname: '/objave',
        search: '?loggedIn=1',
      });
    }
    if (errors !== null) {
      showDialog("Greška", errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, loading, tokens]);

  useEffect(() => {
    if (storageToken && storageRefresh) {
      navigate({
        pathname: '/objave',
        search: '?loggedIn=1',
      });
    }
  }, [storageToken, storageRefresh]);

  return (
    <StyledGrid container spacing={0}>
      <Grid item xs={12} sx={{ padding: "0 10px 0 10px" }}>
        <PaperContent
          sx={{ maxWidth: "464px", margin: "auto", borderRadius: "5px" }}
          px={{ xs: 2, md: 5 }}
          pt={8}
          pb={{ xs: 3, md: 8 }}
        >
          {matches ? (
            <img src={logo2} alt="Logo2" />
          ) : (
            <img src={logo} alt="Logo" />
          )}
          <Typography mt={5} variant={"h1"} sx={{ fontSize: { xs: 26 } }}>
            Prijava na portal
          </Typography>
          <Box mt={1} mb={5} display={"flex"} gap={"5px"}>
            <Typography>Nemate nalog?</Typography>
            <Button
              size={"large"}
              variant={"text"}
              sx={{ p: 0, fontWeight: 400 }}
              onClick={() => navigate("/register")}
            >
              Registrujte se
            </Button>
          </Box>
          <Formik
            validationSchema={LoginSchema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values: any, { setSubmitting }) => {
              dispatch(userLogin(values));
              setSubmitting(false);
            }}
          >
            {({ submitForm }) => (
              <form style={{ width: "100%" }} onSubmit={submitForm}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <InputLabel>Email Adresa</InputLabel>
                  <Field
                    component={TextField}
                    name={"email"}
                    type={"text"}
                    placeholder={"Unesite vas email..."}
                    sx={{
                      width: "100%",
                      mb: 2,
                    }}
                  />
                  <InputLabel>Lozinka</InputLabel>
                  <Field
                    component={TextField}
                    name={"password"}
                    type={"password"}
                    placeholder={"Unesite vasu lozinku..."}
                    sx={{
                      width: "100%",
                      mb: 3,
                    }}
                  />
                  <LoadingButton
                    type={"submit"}
                    variant={"contained"}
                    size={"large"}
                    onClick={submitForm}
                    loading={loading !== "idle"}
                    onSubmit={submitForm}
                  >
                    {"Prijavi se"}
                  </LoadingButton>
                </Box>
              </form>
            )}
          </Formik>
          <Box
            display={"flex"}
            alignItems={"center"}
            width={"100%"}
            justifyContent={"space-between"}
            mt={4}
          >
            <MainCheckbox
              label={"Zapamti me"}
              setChecked={setSaveTokenInStorage}
              checked={saveTokenInStorage}
            />
            <Button
              disableRipple
              onClick={() => navigate("/reset-password")}
              sx={{ p: 0 }}
              size={"large"}
              variant={"text"}
            >
              Problem sa prijavom?
            </Button>
          </Box>
        </PaperContent>
      </Grid>
    </StyledGrid>
  );
};
