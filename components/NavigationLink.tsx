'use client'

import useHistory from "@/hooks/useHistory";
import Button from "./Button";
import { ButtonHTMLAttributes, useEffect } from "react";

interface NavigationLinkProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  href: string;
}

/** Prefetching and handles history for page */
export default function NavigationLink({ href, ...props }: NavigationLinkProps) {
  const { push, prefetch } = useHistory();

  useEffect(() => {
    prefetch(href);
  }, []);

  return (
    <Button onClick={() => push(href)} {...props}/>
  )
}
