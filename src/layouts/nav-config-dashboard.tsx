
import { User, Users, Folder, Percent, ReceiptText, AppWindowMac, BadgeIndianRupee, IdCard, Route, House,  } from 'lucide-react';

import { AllInclusive } from '@mui/icons-material';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon?: React.ReactNode; // <-- made optional
  info?: React.ReactNode;
  children?: NavItem[];
};


export const navData = [
  // {
  //   title: 'Dashboard',
  //   path: '/',
  //   icon: icon('ic-analytics'),
  // },
  {
    title: 'Customer',
    path: '/customer/',
    icon: <Users/>,
    // children: [
    //   {
    //     title: 'Manage Customer',
    //     path: '/customer/',
    //   },
    //   {title: 'Customer Details',
    //   path: '/customer/details',}
    // ]
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: <Folder/>,
    children: [
      {
        title: 'All Projects',
        path: '/projects/all',
        
      },
      {
        title: "Project Details",
        path: "/projects/details"
      }
    ]
  },
  {
    title: 'Percentage',
    path: '/percentage',
    icon: <Percent/>,
  },
  {
    title: 'NVT',
    path: '/nvt',
    icon: <AppWindowMac/>,
  },
  {
    title: 'MOD',
    path: '/mod',
    icon: <ReceiptText/>,
  },
  {
    title: 'Marketer',
    path: '/marketer',
    icon: <BadgeIndianRupee/>,
  },
  {
    title: 'Marketing Head',
    path: '/marketing-head',
    icon: <User/>,
  },
  {
    title : "Roles",
    path: '/role',
    icon: <IdCard/>
  },
  {
    title: 'Employee',
    path: '/employee',
    icon: <Users/>
  },
  {
    title : "Role And Menu Mapping",
    path: '/role&menu-mapping',
    icon: <Route/>
  },
  {
    title: 'Billing',
    path: '/billing',
    icon: <ReceiptText />,
  },
  {
    title: 'Life Alliance',
    path: '/life-alliance',
    icon: <AllInclusive/>,
  },
  {
    title: 'Life Housing',
    path: '/life-housing',
    icon: <House/>,
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
