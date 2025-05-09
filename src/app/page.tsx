"use client";

import { redirect,usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Page (): null {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      redirect('/dashboard');
    }
  }, [pathname]);

  return null; // Evita que se renderice algo innecesario
}
