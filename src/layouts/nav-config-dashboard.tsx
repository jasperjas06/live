/* eslint-disable import/no-unresolved */
import {
  User,
  Users,
  Folder,
  Percent,
  ReceiptText,
  AppWindowMac,
  BadgeIndianRupee,
  IdCard,
  Route,
  House,
  GitPullRequest,
  File,
} from "lucide-react";

import { AllInclusive } from "@mui/icons-material";

export type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: NavItem[];
};

// ----------------------------------------------
// Step 1: Define all available menus
// ----------------------------------------------
const allNavData: NavItem[] = [
  { title: "Customer", path: "/customer", icon: <Users /> },
  {
    title: "Projects",
    path: "/projects",
    icon: <Folder />,
    children: [
      { title: "All Projects", path: "/projects/all" },
      { title: "Project Details", path: "/projects/details" },
    ],
  },
  { title: "Percentage", path: "/percentage", icon: <Percent /> },
  { title: "NVT", path: "/nvt", icon: <AppWindowMac /> },
  { title: "MOD", path: "/mod", icon: <ReceiptText /> },
  { title: "Marketer", path: "/marketer", icon: <BadgeIndianRupee /> },
  { title: "Marketing Head", path: "/marketing-head", icon: <User /> },
  { title: "Roles", path: "/role", icon: <IdCard /> },
  { title: "Employee", path: "/employee", icon: <Users /> },
  {
    title: "Role And Menu Mapping",
    path: "/role&menu-mapping",
    icon: <Route />,
  },
  { title: "Billing", path: "/billing", icon: <ReceiptText /> },
  { title: "Request", path: "/all/request", icon: <GitPullRequest /> },
  { title: "Life Alliance", path: "/life-alliance", icon: <AllInclusive /> },
  { title: "Life Housing", path: "/life-housing", icon: <House /> },
  { title: "Logs", path: "/logs", icon: <File /> },
];

// ----------------------------------------------
// Step 2: Load permissions from localStorage
// ----------------------------------------------
let userPermissions: any = null;
try {
  const stored = localStorage.getItem("userAccess");
  if (stored) {
    userPermissions = JSON.parse(stored);
    console.log("User Permissions:", userPermissions);
  }
} catch (error) {
  console.error("Failed to parse user permissions:", error);
}

// ----------------------------------------------
// Step 3: Filter navigation by permission
// ----------------------------------------------
let filteredNavData = allNavData;

if (userPermissions && Array.isArray(userPermissions.menus)) {
  const readableMenus = userPermissions.menus
    .filter((m: any) => m.read)
    .map((m: any) => {
     const name = m.menuId?.name?.toLowerCase();
      // ✅ If name is "project", return "projects", else return original name
      return name === "project" ? "projects" : name;
    });

  filteredNavData = allNavData.filter((nav) =>
    readableMenus.includes(nav.title.toLowerCase())
  );
}
// console.log("Filtered Navigation Data:", filteredNavData);
export const navData = filteredNavData;
