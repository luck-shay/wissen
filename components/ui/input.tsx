"use client"

import * as React from "react"
import InputBase from "@mui/material/InputBase"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, ...props }, ref) {
    const nativeInputProps = props as React.InputHTMLAttributes<HTMLInputElement>

    return (
      <InputBase
        inputRef={ref}
        type={type}
        data-slot="input"
        className={cn(className)}
        disabled={nativeInputProps.disabled}
        inputProps={nativeInputProps}
        fullWidth
        sx={{
          height: 42,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "color-mix(in oklab, var(--background) 84%, white 16%)",
          px: 1.5,
          py: 0.5,
          fontSize: 14,
          transition: "all 180ms ease",
          "&.Mui-focused": {
            borderColor: "primary.main",
            boxShadow: (theme) => `0 0 0 4px ${theme.palette.primary.main}2e`,
            backgroundColor: "var(--card)",
          },
        }}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
