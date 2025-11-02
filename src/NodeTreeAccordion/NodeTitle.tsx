
import React, { forwardRef } from "react";
import classes from './NodeTitle.module.css'
import type { NodeTitleProps } from "./util/types";
import { useToggle } from "@mantine/hooks";

export const NodeTitle = forwardRef<HTMLButtonElement, NodeTitleProps>(
  ({ className = "", onClick, ...props }, ref) => {
    const [ isActive, toggleIsActive ] = useToggle();

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      if (onClick)
        onClick(e);
      toggleIsActive();
    }

    let styleClasses = `${className} ${classes.root}`
    if (isActive) styleClasses += ` ${classes.active}`;

    return (
      <button 
        ref={ref} 
        type='button'
        className={styleClasses} 
        onClick={handleClick} 
        {...props} 
      />
    );
  }
);
NodeTitle.displayName = "NodeTitle";