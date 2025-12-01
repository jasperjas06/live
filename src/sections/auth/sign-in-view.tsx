/* eslint-disable import/no-unresolved */
import { useState } from "react";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useRouter } from "src/routes/hooks";

import { getUserAccess, login } from "src/utils/api.auth";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email, password });

      if (response?.status === 200) {
        const token = response.data?.token || response.token;
        if (token) {
          const permissions = await getUserAcc(response.data.roleId);
          const isAdmin = response.data?.isAdmin === true;

          // Check if mobile and not admin
          if (isMobile && !isAdmin) {
            toast.error("Mobile access is restricted to administrators only.");
            setLoading(false);
            router.push("/unauthorized");
            return;
          }

          if (isAdmin) {
            localStorage.setItem("isAdmin", "true");

            // Manually define the full-access menus for admins
            const adminMenus = [
              "Customer",
              "Projects",
              "NVT",
              "MOD",
              "Marketer",
              "Marketing Head",
              "Roles",
              "Employee",
              "Role And Menu Mapping",
              "Percentage",
              "Billing",
              "Request",
              "Life Housing"
            ];

            // Construct permission objects with all actions true
            const fullAccessPermissions = adminMenus.map((menu) => ({
              menuId: { name: menu },
              read: true,
              create: true,
              update: true,
              delete: true,
            }));

            localStorage.setItem(
              "userAccess",
              JSON.stringify({
                role: response.data.role,
                menus: fullAccessPermissions,
              })
            );
          } else {
            localStorage.setItem("isAdmin", "false");
            if (permissions) {
              const lifeHousingPermission = {
      menuId: { name: "Life Housing" },
      read: true,
      create: true,
      update: true,
      delete: true,
    };

    const newPermission = {
      ...permissions,
      menus: [...permissions.menus, lifeHousingPermission],
    };

              localStorage.setItem("userAccess", JSON.stringify(newPermission));
            }
          }

          localStorage.setItem("liveauthToken", token);
          toast.success("Sign-in successful!");
          router.push("/customer");
          window.location.reload();
        } else {
          toast.error("Invalid response from server.");
        }
      } else {
        toast.error(response?.data?.message || "Invalid credentials.");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Sign-in failed. Please check your credentials.";
      toast.error(message);
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserAcc = async (id: string) => {
    try {
      const response = await getUserAccess(id);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          gap: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to access your dashboard
        </Typography>
      </Box>

      <form onSubmit={handleSignIn}>
        <TextField
          fullWidth
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          sx={{ mb: 3 }}
          autoComplete="email"
          required
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          sx={{ mb: 3 }}
          autoComplete="current-password"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  <Iconify
                    icon={
                      showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Box>
  );
}