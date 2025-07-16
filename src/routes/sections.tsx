import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const NVT = lazy(() => import('src/pages/NVT/NVT'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const NVTForm = lazy(()=>import("src/pages/sampleForm"))
export const Projects = lazy(()=>import("src/pages/Projects/Projects"))
export const ManageProjects = lazy(()=>import("src/pages/Projects/manage/ManageProjects"))
export const ManageLFC = lazy(()=>import("src/pages/LFC/Manage/ManageLFC"))
export const ManageCustomer = lazy(()=>import("src/pages/Customer/ManageCustomer/ManageCustomer"))
export const ManageMOD = lazy(()=>import("src/pages/MOD/ManageMOD/ManageMOD"))
export const LFC = lazy(()=>import("src/pages/LFC/LFC"))
export const Customer = lazy(()=>import("src/pages/Customer/Customer"))
export const MOD = lazy(()=>import("src/pages/MOD/MOD"))
export const Profile = lazy(()=>import("src/pages/Profile/Profile"))


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

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'projects/all', element: <Projects /> },
      { path: 'projects/create', element: <ManageProjects /> },
      { path: 'projects/details', element: <LFC /> },
      { path: 'lfc/create', element: <ManageLFC /> },
      { path: 'customer', element: <Customer /> },
      { path: 'customer/create', element: <ManageCustomer /> },
      { path: 'mod', element: <MOD /> },
      { path: 'mod/create', element: <ManageMOD /> },
      { path: 'nvt', element:<NVT/> },
      { path: 'nvt/create-nvt', element:<NVTForm/> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'profile', element: <Profile /> },
      
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
