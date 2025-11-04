/* eslint-disable consistent-return */
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { Tabs, Tab, Box, Button, Typography } from "@mui/material";

import {
  createCustomerEstimate,
  getAllMarkingHead,
  updateEmployee,
} from "src/utils/api.service";

import { DashboardContent } from "src/layouts/dashboard";

import EMI from "./EMI";
import Flat from "./Flat";
import Plot from "./Plot";
import General from "./General";
import toast from "react-hot-toast";

export type RootFormData = {
  general?: Record<string, any>;
  plot?: Record<string, any>;
  flat?: Record<string, any>;
};

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

const ManageCustomerDetails = () => {
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [saleType, setSaleType] = useState("");
  const [marketerOptions, setMarketerOptions] = useState<
    { label: string; value: string; percentage: string | number }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  console.log("id", id);

  const methods = useForm<RootFormData>({
    defaultValues: {
      general: {},
      plot: {},
      flat: {},
    },
    mode: "onBlur",
  });

  const { handleSubmit, trigger } = methods;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const getMarketerNames = async () => {
    try {
      const response = await getAllMarkingHead();
      if (response?.status === 200) {
        const marketers = response.data.data.map((m: any) => ({
          label: m.name,
          value: m._id,
          percentage: m.percentageId.rate,
        }));
        setMarketerOptions(marketers);
      }
    } catch (error) {
      console.error("Error fetching marketers:", error);
    }
  };

  useEffect(() => {
    getMarketerNames();
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    let correct: any = {};
    correct.general = data.general;
    correct.customerId = id;
    if (saleType.toLowerCase() === "plot") correct.plot = data.plot;
    if (saleType.toLowerCase() === "flat") correct.flat = data.flat;
    try {
      const response = await createCustomerEstimate(correct);
      if (response.status === 200) {
        toast.success(response.message);
        navigate(-1);
      } else {
        console.error("Submission error 1:", response);
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to save billing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextFromGeneral = async () => {
    const valid = await trigger("general"); // validate all general fields
    if (valid) {
      // Decide next tab based on saleType
      if (saleType.toLowerCase() === "plot") setTabIndex(1);
      else if (saleType.toLowerCase() === "flat") setTabIndex(1);
      else setTabIndex(0); // default
    }
  };

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, fontWeight: 600 }}>
        Estimate Details
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
              {saleType.toLowerCase() === "plot" && (
                <Tab label="Plot" id="tab-1" aria-controls="tabpanel-1" />
              )}
              {saleType.toLowerCase() === "flat" && (
                <Tab label="Flat" id="tab-1" aria-controls="tabpanel-1" />
              )}
            </Tabs>

            {/* Tab Panels */}
            <TabPanel value={tabIndex} index={0}>
              <General
                marketer={marketerOptions}
                saleType={saleType}
                setSaleType={setSaleType}
                handleNext={handleNextFromGeneral}
                setTabIndex={setTabIndex}
              />
            </TabPanel>

            {saleType.toLowerCase() === "plot" && (
              <TabPanel value={tabIndex} index={1}>
                <Plot
                  control={methods.control}
                  errors={methods.formState.errors}
                />
              </TabPanel>
            )}

            {saleType.toLowerCase() === "flat" && (
              <TabPanel value={tabIndex} index={1}>
                <Flat
                  control={methods.control}
                  errors={methods.formState.errors}
                />
              </TabPanel>
            )}

            {/* Save Button */}
            {tabIndex === 1 && (
              <Box mt={2}>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Box>
            )}
          </form>
        </FormProvider>
      </Box>
    </DashboardContent>
  );
};

export default ManageCustomerDetails;
