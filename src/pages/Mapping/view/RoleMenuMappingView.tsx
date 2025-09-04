import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import {
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  CircularProgress,
} from "@mui/material";

import { getRoleMenuById } from "src/utils/api.service";

import { DashboardContent } from "src/layouts/dashboard";

const RoleMenuMappingView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getMenuData = async () => {
    try {
      const response = await getRoleMenuById(id);
      if (response) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getMenuData();
  }, [id]);

  if (loading) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!data) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="text.secondary">
          No data found
        </Typography>
      </DashboardContent>
    );
  }

  const { role, menus } = data;
  console.log("role",data)

  return (
    <DashboardContent>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>View Role Menu Mapping </Typography>
      {/* Role Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Role Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6}}>
              <Typography variant="subtitle1" fontWeight={500}>
                Role Name:
              </Typography>
              <Typography variant="body1">{role?.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6}}>
              <Typography variant="subtitle1" fontWeight={500}>
                Role ID:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {role?._id}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Menus Table */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Menu Permissions
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Menu Name</TableCell>
                <TableCell align="center">Read</TableCell>
                <TableCell align="center">Create</TableCell>
                <TableCell align="center">Update</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(menus) && menus.length > 0 ? (
    menus.map((menu: any) => (
      <TableRow key={menu._id}>
        <TableCell>{menu.menuId?.name}</TableCell>
        {["read", "create", "update", "delete"].map((perm) => (
          <TableCell key={perm} align="center">
            {menu[perm] ? (
              <Chip
                label="Yes"
                color="success"
                size="medium"
                sx={{ fontSize: "0.75rem", width: "50px" }}
              />
            ) : (
              <Chip
                label="No"
                color="default"
                size="medium"
                sx={{ fontSize: "0.75rem", width: "50px"}}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} align="center">
        No menus assigned
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default RoleMenuMappingView;
