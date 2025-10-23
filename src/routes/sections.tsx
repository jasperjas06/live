/* eslint-disable import/no-unresolved */
import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { Outlet, Navigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import Billing from 'src/pages/Billing/Billing';
import ViewLFC from 'src/pages/LFC/view/ViewLFC';
import { DashboardLayout } from 'src/layouts/dashboard';



// ----------------------------------------------------------------------
// Lazy imports
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const NVT = lazy(() => import('src/pages/NVT/NVT'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const NVTForm = lazy(() => import('src/pages/sampleForm'));
export const Projects = lazy(() => import('src/pages/Projects/Projects'));
export const ProjectView = lazy(() => import('src/pages/Projects/view/Projects'));
export const ManageProjects = lazy(() => import('src/pages/Projects/manage/ManageProjects'));
export const ManageLFC = lazy(() => import('src/pages/LFC/Manage/ManageLFC'));
export const ManageCustomer = lazy(() => import('src/pages/Customer/ManageCustomer/ManageCustomer'));
export const ManageMOD = lazy(() => import('src/pages/MOD/ManageMOD/ManageMOD'));
export const LFC = lazy(() => import('src/pages/LFC/LFC'));
export const Customer = lazy(() => import('src/pages/Customer/Customer'));
export const CustomerDetails = lazy(() => import('src/pages/CustomerDetails/CustomerDetails'));
export const ManageCustomerDetails = lazy(() => import('src/pages/CustomerDetails/ManageCustomer/ManageCustomerDetails'));
export const CustomerView = lazy(() => import('src/pages/Customer/view/customer'));
export const MOD = lazy(() => import('src/pages/MOD/MOD'));
export const Profile = lazy(() => import('src/pages/Profile/Profile'));
export const Marketer = lazy(() => import('src/pages/Marketer/index'));
export const CreateMarketer = lazy(() => import('src/pages/Marketer/Manage/ManageMarketer'));
export const CreateMarketingHead = lazy(() => import('src/pages/MarketingHead/manage/ManageMarketingHead'));
export const MarketingHead = lazy(() => import('src/pages/MarketingHead/MarketingHead'));
export const ViewMarketingHead = lazy(() => import('src/pages/MarketingHead/view/MarkingHead'));
export const ViewMOD = lazy(() => import('src/pages/MOD/view/Mod'));
export const ViewNVT = lazy(() => import('src/pages/NVT/view/ViewNVT'));
export const ViewMarketer = lazy(() => import('src/pages/Marketer/view/ViewMarketer'));
export const Percentage = lazy(() => import('src/pages/Percentage/Percentage'));
export const Roles = lazy(() => import('src/pages/Role/Role'));
export const RoleMenuMapping = lazy(() => import('src/pages/Mapping/RoleMenuMapping'));
export const RoleMenuForm = lazy(() => import('src/pages/Mapping/ManageMapping/ManageMapping'));
export const ManageRole = lazy(() => import('src/pages/Role/ManageRole/ManageRole'));
export const ManageEmployee = lazy(() => import('src/pages/Employee/Manage/ManageEmployee'));
export const Employee = lazy(() => import('src/pages/Employee/Employee'));
export const ViewMenu = lazy(() => import('src/pages/Mapping/view/RoleMenuMappingView'));
export const LifeAlliance = lazy(() => import('src/pages/LifeAlliance/LifeAlliance'));
export const LifeHousing = lazy(() => import('src/pages/LifeHousing/LifeHousing'));
export const Requests = lazy(() => import('src/pages/Requests/Request'));
export const ViewRequest = lazy(() => import('src/pages/Requests/view/ViewRequest'));
export const ManageBilling = lazy(() => import('src/pages/Billing/Manage/ManageBilling'));
export const CustomerEstimateView = lazy(() => import('src/pages/CustomerDetails/ManageCustomer/ViewCustomerDetails'));
export const BillingView = lazy(()=> import('src/pages/Billing/BillingView'));
// ----------------------------------------------------------------------
// Loading fallback (when lazy pages load)
const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// ----------------------------------------------------------------------
// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('liveauthToken');
  return token ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

// ----------------------------------------------------------------------
// Routes Definition
export const routesSection: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/customer" replace /> },
      { path: 'projects/all', element: <Projects /> },
      { path: 'projects/all/create', element: <ManageProjects /> },
      { path: 'projects/all/edit/:id', element: <ManageProjects /> },
      { path: 'projects/all/view/:id', element: <ProjectView /> },
      { path: 'projects/details', element: <LFC /> },
      { path: 'projects/details/create', element: <ManageLFC /> },
      { path: 'projects/details/view/:id', element: <ViewLFC /> },
      { path: 'projects/details/edit/:id', element: <ManageLFC /> },
      { path: 'customer', element: <Customer /> },
      { path: 'customer/:id/estimate', element: <CustomerDetails /> },
      { path: 'customer/view/:id', element: <CustomerView /> },
      { path: 'customer/create', element: <ManageCustomer /> },
      { path: 'customer/:id/estimate/create', element: <ManageCustomerDetails /> },
      { path: 'customer/:id/estimate/view/:estimateId', element: <CustomerEstimateView /> },
      { path: 'customer/edit/:id', element: <ManageCustomer /> },
      { path: 'mod', element: <MOD /> },
      { path: 'mod/view/:id', element: <ViewMOD /> },
      { path: 'mod/create', element: <ManageMOD /> },
      { path: 'nvt', element: <NVT /> },
      { path: 'nvt/create-nvt', element: <NVTForm /> },
      { path: 'nvt/edit/:id', element: <NVTForm /> },
      { path: 'nvt/view/:id', element: <ViewNVT /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'profile', element: <Profile /> },
      { path: 'marketer', element: <Marketer /> },
      { path: 'marketer/create', element: <CreateMarketer /> },
      { path: 'marketer/view/:id', element: <ViewMarketer /> },
      { path: 'marketing-head', element: <MarketingHead /> },
      { path: 'marketing-head/create', element: <CreateMarketingHead /> },
      { path: 'marketing-head/edit/:id', element: <CreateMarketingHead /> },
      { path: 'marketing-head/view/:id', element: <ViewMarketingHead /> },
      { path: 'percentage', element: <Percentage /> },
      { path: 'role', element: <Roles /> },
      { path: 'role&menu-mapping', element: <RoleMenuMapping /> },
      { path: 'role&menu-mapping/create', element: <RoleMenuForm /> },
      { path: 'role&menu-mapping/edit/:id', element: <RoleMenuForm /> },
      { path: 'role&menu-mapping/view/:id', element: <ViewMenu /> },
      { path: 'employee', element: <Employee /> },
      { path: 'employee/create', element: <ManageEmployee /> },
      { path: 'employee/edit/:id', element: <ManageEmployee /> },
      { path: 'life-alliance', element: <LifeAlliance /> },
      { path: 'life-housing', element: <LifeHousing /> },
      { path: 'billing', element: <Billing /> },
      { path: 'billing/view/:id', element: <BillingView /> },
      { path: 'all/request', element: <Requests /> },
      { path: 'all/request/view/:id', element: <ViewRequest /> },
      { path: 'billing/create', element: <ManageBilling /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
