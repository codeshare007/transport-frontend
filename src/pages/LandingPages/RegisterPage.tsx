import { useNavigate } from "react-router-dom";
import { Typography, Link, Button, Grid, responsiveFontSizes } from "@mui/material";
import { PaperContent } from "../../components/common/micro/theme";
import { StyledGrid } from "./LoginPage";
import { StyledBox } from "./LoginPage";
import logo from "./prevezi2.png";

export const RegisterPage = () => {
  const navigate = useNavigate();
  return (
    <StyledGrid container spacing={0}>
      <Grid item xs={12} sx={{ padding: "0 10px 0 10px" }}>
        <PaperContent
          sx={{ maxWidth: "464px", margin: "auto", borderRadius: "5px" }}
          px={{ xs: 2, md: 5 }}
          pt={8}
          pb={{ xs: 3, md: 8 }}
        >
          <img src={logo} alt="Logo" />
          <Typography mt={4} variant={"h1"} sx={{ fontSize: { xs: 26 } }}>
            Registrujte Nov Nalog
          </Typography>
          <Typography mb={5} variant={"body1"} sx={{ fontSize: { xs: 16 }}}>
            Već imate nalog?{" "}
            <Link sx={{ textDecoration: "none" }} href="/">
              Prijavite se
            </Link>
          </Typography>
          <Button
            sx={{ mb: 1 }}
            size={"large"}
            onClick={() => navigate("/register/transport-company")}
            variant={"contained"}
            fullWidth
          >
            Transportno preduzeće
          </Button>
          <Button
            size={"large"}
            onClick={() => navigate("/register/trading-company")}
            variant={"contained"}
            fullWidth
          >
            Trgovinsko preduzeće
          </Button>
        </PaperContent>
      </Grid>
    </StyledGrid>
  );
};
