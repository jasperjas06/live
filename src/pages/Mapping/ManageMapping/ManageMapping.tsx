/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  styled,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createMenuMapping, getAllMenu, getAllRoles, getRoleMenuById, updateMenuMapping } from "src/utils/api.service";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(3),
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: 8,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #3f51b5",
  fontWeight: 600,
  color: "#3f51b5",
}));

// ✅ Validation Schema
const roleMenuSchema = yup.object().shape({
  role: yup.string().required("Role is required"),
  menus: yup
    .array()
    .of(
      yup.object().shape({
        menu: yup.string().required("Menu name is required"),
        menu_id: yup.string().required("Menu ID is required"),
        read: yup.boolean().required(),
        create: yup.boolean().required(),
        update: yup.boolean().required(),
        delete: yup.boolean().required(),
      }),
    )
    .required("Menus are required"),
});

export interface RoleMenuFormData {
  role: string;
  menus: {
    menu: string;
    menu_id: string;
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  }[];
}

type PermissionKey = "read" | "create" | "update" | "delete";

const RoleMenuForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([]);
  const [menus, setMenus] = useState<
    { menu: string; menu_id: string; read: boolean; create: boolean; update: boolean; delete: boolean }[]
  >([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleMenuFormData>({
    resolver: yupResolver(roleMenuSchema),
    defaultValues: {
      role: "",
      menus: [],
    },
  });

  const getRolesData = async () => {
    try {
      const response = await getAllRoles();
      if (response?.data?.data) {
        const rolesData = response.data.data.map((role: any) => ({
          label: role.name,
          value: role._id,
        }));
        setRoles(rolesData);
      } else {
        console.log("Failed to fetch roles data");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getMenusData = async () => {
    try {
      const response = await getAllMenu();
      if (response?.data?.data) {
        const menusData = response.data.data.map((menu: any) => ({
          menu: menu.name,
          menu_id: menu._id,
          read: false,
          create: false,
          update: false,
          delete: false,
        }));
        setMenus(menusData);
      } else {
        console.log("Failed to fetch menus data");
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
  const fetchRoleMenu = async () => {
    if (!id) return; // create mode
    setIsLoading(true);
    try {
      const response = await getRoleMenuById(id);
      if (response?.data?.data) {
        const roleData = response.data.data;
        const menusData = roleData.menus.map((m: any) => ({
          menu: m.menuId?.name,
          menu_id: m.menuId?._id,
          read: m.read,
          create: m.create,
          update: m.update,
          delete: m.delete,
        }));
        reset({
          role: roleData.role?._id || "",
          menus: menusData,
        });
      }
    } catch (error) {
      console.error("Error fetching role menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchRoleMenu();
}, [id, reset]);


  useEffect(() => {
    getRolesData();
  }, []);

  useEffect(() => {
    getMenusData();
  }, []);

  const { fields } = useFieldArray({
    control,
    name: "menus",
  });

  useEffect(() => {
    if (menus.length > 0) {
      reset({
        role: "",
        menus: menus,
      });
    }
  }, [menus, reset]);

const onSubmit = async (data: RoleMenuFormData) => {
  try {
    setLoading(true)
    const payload = {
      roleId: data.role,
      menuIds: data.menus.map((m) => ({
        menuId: m.menu_id,
        read: m.read,
        create: m.create,
        update: m.update,
        delete: m.delete,
      })),
    };

    let response;
    if (id) {
      // Update existing mapping
      response = await updateMenuMapping(payload,); // make sure your API supports update with id
    } else {
      // Create new mapping
      response = await createMenuMapping(payload);
    }

    if (response?.data?.success) {
      toast.success(`Role Menu Mapping ${id ? "Updated" : "Saved"}!`);
      navigate(-1);
    } else {
      setLoading(false)
      toast.error("Error saving Role Menu Mapping");
    }
  } catch (error) {
    setLoading(false)
    toast.error("Error saving Role Menu Mapping");
    console.error(error);
  }
};

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Role Menu Mapping
      </Typography>

      <StyledCard>
        <CardContent>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={300}
            >
              <CircularProgress size={40} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormSection>
                <SectionTitle variant="h6">Role Information</SectionTitle>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={!!errors.role}
                    >
                      <InputLabel id="role-label" required>Role</InputLabel>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="role-label"
                            label="Role"
                            style={{ maxWidth: "300px" }}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.value} value={role.value}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.role && (
                        <FormHelperText>{errors.role.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection>
                <SectionTitle variant="h6">Menu Permissions</SectionTitle>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      mb={2}
                      p={2}
                      border="1px solid #e0e0e0"
                      borderRadius={2}
                    >
                      <Typography variant="subtitle1" fontWeight={500} mb={1}>
                        {item.menu}
                      </Typography>
                      <Box>
                        {(
                          [
                            "read",
                            "create",
                            "update",
                            "delete",
                          ] as PermissionKey[]
                        ).map((perm) => (
                          <Controller
                            key={perm}
                            name={`menus.${index}.${perm}`}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={Boolean(field.value)}
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                  />
                                }
                                label={
                                  perm.charAt(0).toUpperCase() + perm.slice(1)
                                }
                              />
                            )}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </div>
              </FormSection>

              <Divider sx={{ my: 4 }} />

              <Grid container justifyContent="flex-end">
                <Grid>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    type="submit"
                    sx={{ minWidth: 150 }}
                    disabled={loading}
                  >
                    {loading?" Submiting...":"Submit"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </StyledCard>
    </DashboardContent>
  );
};

export default RoleMenuForm;
