'use client'
import { Backdrop, Typography } from "@mui/material";
import Lottie from "lottie-react";
import React from "react";
import Animation from '../../../../public/assets/Animation.json';
import { secondary } from "@/styles/theme/colors";

interface FullScreenLoaderProps {
  readonly open: boolean;
  readonly label?:string;
}

export default function FullScreenLoader({ open,label }: FullScreenLoaderProps) : React.JSX.Element{
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }} open={open}>
      <div style={{ textAlign: "center" }}>
        <Lottie animationData={Animation} style={{ filter: "hue-rotate(3deg) brightness(1.5)" }}   
        />
        <Typography color={secondary[200]} variant="h6" sx={{ mt: 2 }}>
          {label ? label:  'Estamos procesando los datos...'}
        </Typography>
      </div>
    </Backdrop>
  );
}
