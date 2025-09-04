import * as yup from "yup";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";

import { Tabs, Tab, Box, Button, Typography } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import EMI from "./EMI";
import Flat from "./Flat";
import Plot from "./Plot";
import General from "./General";
import Marketer from "./Marketer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ✅ Schema (all fields optional, no required validation)
const schema = yup.object().shape({
  marketerName: yup.string().nullable(),
  emiAmount: yup.number().nullable(),
});

const ManageCustomerDetails = () => {
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);

  // ✅ Setup react-hook-form
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      marketerName: "",
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = methods;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <DashboardContent>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
                Customer Details
                 Form
              </Typography>
      <Box sx={{ width: "100%" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tabs Header */}
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              aria-label="customer details tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="General" id="tab-0" aria-controls="tabpanel-0" />
              <Tab label="Plot" id="tab-1" aria-controls="tabpanel-1" />
              <Tab label="Merketer" id="tab-2" aria-controls="tabpanel-2" />
              <Tab label="EMI" id="tab-3" aria-controls="tabpanel-3" />
              <Tab label="Flat" id="tab-4" aria-controls="tabpanel-4" />
            </Tabs>

            {/* Tab Panels */}
            <TabPanel value={tabIndex} index={0}>
              <General control={control} errors={errors} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Plot control={control} errors={errors} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <Marketer control={control} errors={errors} />
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              <EMI control={control} errors={errors} />
            </TabPanel>
            <TabPanel value={tabIndex} index={4}>
              <Flat control={control} errors={errors} />
            </TabPanel>

            {/* Save Button */}
            <Box mt={2}>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </DashboardContent>
  );
};

export default ManageCustomerDetails;
