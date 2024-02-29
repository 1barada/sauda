'use client'

import { ButtonHTMLAttributes } from "react";

export default function Button({onClick, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (onClick) onClick(e);
  }

  return (
    <button {...props} onClick={handleClick}/>
  );
}