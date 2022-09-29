import { useState } from "react";
import {
  Typography,
  Button,
  InputLabel,
  Box,
  Grid,
  useMediaQuery,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { PaperContent } from "../../components/common/micro/theme";
import { StyledGrid } from "./LoginPage";
import { Formik, Field } from "formik";
import { TextField } from "formik-mui";

import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import logo from "./prevezi.png";
import logo2 from "./prevezi2.png";
import api from "../../api/base";
import { apiv1 } from "../../api/paths";
import { useDialog } from "../../context/ModalContext";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const matches = useMediaQuery("(max-width:767px)");

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email().required("Molimo vas unesite pravilan email."),
  });

  const handleSubmit = async (email: string) => {
    const response = await api.post(apiv1 + "reset-password/init", {
      email,
    });
    if (response.status === 200) {
      showDialog(
        "Promena lozinke",
        "Zahtev za promenu lozinke je prihvaćen. Proverite vašu email adresu."
      );
    }
  };

  return (
    <StyledGrid container spacing={0}>
      <Grid item xs={12} sx={{ padding: "0 10px 0 10px" }}>
        <PaperContent
          sx={{ maxWidth: "464px", margin: "auto", borderRadius: "5px" }}
          px={{ xs: 2, md: 5 }}
          pt={10}
          pb={{ xs: 5, md: 8 }}
        >
          {matches ? (
            <img src={logo2} alt="Logo2" />
          ) : (
            <img src={logo} alt="Logo" />
          )}
          <Typography mt={5} variant={"h1"} sx={{ fontSize: { xs: 23 } }}>
            Zaboravljena Lozinka?
          </Typography>
          <Typography mt={1} >Poslaćemo Vam novu</Typography>
          <Formik
            validationSchema={ForgotPasswordSchema}
            initialValues={{
              email: "",
            }}
            onSubmit={(values: any, { setSubmitting }) => {
              handleSubmit(values.email);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Box
                mt={4}
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <InputLabel>Email Adresa</InputLabel>
                <Field
                  component={TextField}
                  name={"email"}
                  type={"text"}
                  InputProps={{
                    placeholder: "Unesite Vaš email",
                  }}
                />
                <LoadingButton
                  type={"submit"}
                  variant={"contained"}
                  onClick={submitForm}
                  loading={isSubmitting}
                  sx={{ mt: 2 }}
                  size={"large"}
                >
                  {"Pošalji"}
                </LoadingButton>
              </Box>
            )}
          </Formik>
          <Button
            size={"large"}
            onClick={() => navigate("/")}
            sx={{ marginTop: "10px" }}
            fullWidth
            variant={"secondary"}
          >
            {"Nazad"}
          </Button>
        </PaperContent>
      </Grid>
    </StyledGrid>
  );
};
