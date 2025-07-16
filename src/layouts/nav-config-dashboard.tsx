import { Label } from 'src/components/label';
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
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Customer',
    path: '/customer',
    icon: icon('ic-user'),
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: icon('ic-lock'),
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
  // {
  //   title: 'LFC',
  //   path: '/lfc',
  //   icon: icon('ic-disabled'),
  // },
  {
    title: 'NVT',
    path: '/nvt',
    icon: icon('ic-blog'),
  },
  {
    title: 'MOD',
    path: '/mod',
    icon: icon('ic-cart'),
  },
  {
    title: 'Marketer',
    path: '/marketer',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
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
