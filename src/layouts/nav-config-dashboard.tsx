import { User, Users, Folder, Percent, ReceiptText, AppWindowMac, BadgeIndianRupee } from 'lucide-react';

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
    path: '/customer',
    icon: <Users/>,
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
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
