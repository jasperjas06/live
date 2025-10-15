import type { BoxProps } from "@mui/material/Box";

import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";

import { layoutClasses } from "../core/classes";

// ----------------------------------------------------------------------

export type AuthContentProps = BoxProps;

export function AuthContent({
  sx,
  children,
  className,
  ...other
}: AuthContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          py: 5,
          px: 3,
          width: 1,
          zIndex: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          maxWidth: "var(--layout-auth-content-width)",
          bgcolor: theme.vars.palette.background.default,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <div className="flex justify-center items-center gap-4">
        <img
          src="/assets/logo/log.jpg"
          alt="life logo"
          width={30}
          height={30}
        />
        <p className="text-indigo-900 font-bold text-3xl">Life Group</p>
      </div>

      {children}
    </Box>
  );
}
