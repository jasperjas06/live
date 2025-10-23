import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import { Warning } from "@mui/icons-material";
import { ArrowLeft } from "lucide-react";

 function UnauthorizedView() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    localStorage.clear();
    navigate("/sign-in");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "error.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Warning/>
        </Box>

        <Typography variant="h3" fontWeight={700} gutterBottom>
          Access Denied
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Mobile access is restricted to administrators only. Please use a
          desktop device or contact your administrator for access.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGoBack}
            startIcon={<ArrowLeft/>}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Back to Sign In
          </Button>
        </Box>

        {/* <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: 2,
            bgcolor: "background.neutral",
            maxWidth: 400,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you believe this is an error, please contact your system
            administrator or IT support team.
          </Typography>
        </Box> */}
      </Box>
    </Container>
  );
}

export default UnauthorizedView