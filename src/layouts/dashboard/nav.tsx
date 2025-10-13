/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/no-unresolved */
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

import type { NavItem } from '../nav-config-dashboard';
import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <>
      {/* <Logo /> */}
       <div className='flex flex- gap-2 '>
      <img src="/assets/logo/log.jpg" alt="" width={30} height={30} />
      {slots?.topArea}
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
  <span className="text-indigo-600">Life</span>
</h1>



       </div>

      <br />

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => {
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [open, setOpen] = useState(false);

              // check if any child is active
              const hasActiveChild = item.children?.some(
                (child) =>
                  pathname === child.path || pathname.startsWith(`${child.path}/`)
              );

              // parent is active only if exact match
              const isActive = pathname === item.path;

              useEffect(() => {
                if (isActive || hasActiveChild) {
                  setOpen(true);
                }
              }, [isActive, hasActiveChild]);

              const handleToggle = () => {
                setOpen((prev) => !prev);
              };

              if (item.children) {
                return (
                  <Box key={item.title}>
                    <ListItem disableGutters disablePadding>
                      <ListItemButton
                        onClick={handleToggle}
                        sx={{
                          pl: 2,
                          py: 1,
                          gap: 2,
                          pr: 1.5,
                          borderRadius: 0.75,
                          typography: 'body2',
                          fontWeight: isActive
                            ? 'fontWeightSemiBold'
                            : 'fontWeightMedium',
                          color: isActive
                            ? theme.vars.palette.primary.main
                            : theme.vars.palette.text.secondary,
                          bgcolor: isActive
                            ? varAlpha(theme.vars.palette.primary.mainChannel, 0.08)
                            : undefined,
                          '&:hover': {
                            bgcolor: isActive
                              ? varAlpha(theme.vars.palette.primary.mainChannel, 0.16)
                              : varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                          },
                        }}
                      >
                        <Box component="span" sx={{ width: 24, height: 24 }}>
                          {item.icon}
                        </Box>
                        <Box component="span" sx={{ flexGrow: 1 }}>
                          {item.title}
                        </Box>
                        {open ? <ChevronUp /> : <ChevronDown />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      {item.children.map((child) => {
                        const isChildActive =
                          pathname === child.path ||
                          pathname.startsWith(`${child.path}/`);

                        return (
                          <ListItem key={child.title} disableGutters disablePadding>
                            <ListItemButton
                              component={RouterLink}
                              href={child.path}
                              sx={{
                                pl: 5,
                                py: 1,
                                fontWeight: isChildActive
                                  ? 'fontWeightSemiBold'
                                  : 'fontWeightMedium',
                                color: isChildActive
                                  ? theme.vars.palette.primary.main
                                  : theme.vars.palette.text.secondary,
                              }}
                            >
                              {child.title}
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </Collapse>
                  </Box>
                );
              }

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: isActive
                        ? 'fontWeightSemiBold'
                        : 'fontWeightMedium',
                      color: isActive
                        ? theme.vars.palette.primary.main
                        : theme.vars.palette.text.secondary,
                      bgcolor: isActive
                        ? varAlpha(theme.vars.palette.primary.mainChannel, 0.08)
                        : undefined,
                      '&:hover': {
                        bgcolor: isActive
                          ? varAlpha(theme.vars.palette.primary.mainChannel, 0.16)
                          : varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
                      },
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>
                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {item.title}
                    </Box>
                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
