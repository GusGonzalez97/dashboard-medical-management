"use client"; // Necesario para usar useRouter

import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface RouterProps {
    readonly path?:string, readonly title:string, readonly icon?:React.ReactNode; readonly variant?:'text' | 'outlined' | 'contained', readonly fullWidth?:boolean
}

export default function RouterHandlerButton({path,title,icon,variant,fullWidth}:RouterProps):React.JSX.Element {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const action = useCallback(():void=>{
    if(path){
      router.push(path)
    }
    else{
      router.back()
    }
  },[router,path])

  return <div><Button fullWidth={fullWidth??false} variant={variant} startIcon={icon??''} size={isMobile? 'medium' : 'large'} onClick={() => {action()}} type='button'>{title}</Button></div>;
}
