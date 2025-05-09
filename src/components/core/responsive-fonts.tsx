'use client'
import { useMediaQuery, Typography, useTheme } from "@mui/material";
import type { Variant } from "@mui/material/styles/createTypography";
import React from "react";

interface ResponsiveFontsProps {
  readonly text: string;
  readonly variant: Variant;
  readonly mobileVariant: Variant;
  readonly align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  readonly color?: string;
  readonly weight?: string;
}

export function ResponsiveFonts({ text, variant, mobileVariant, align, color, weight }: ResponsiveFontsProps): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Typography color={color ?? ''} align={align ?? 'center'} fontWeight={weight ?? ''} variant={isMobile ? mobileVariant : variant}>
    {text}
  </Typography>;
}

