"use client"

import * as React from "react"
import MuiButton from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button"

import { cn } from "@/lib/utils"

type AppButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"

type AppButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

type ButtonProps = Omit<MuiButtonProps, "variant" | "size"> & {
  variant?: AppButtonVariant
  size?: AppButtonSize
}

const buttonVariants = ({ className }: { className?: string } = {}) =>
  cn(className)

function mapVariant(variant: AppButtonVariant): MuiButtonProps["variant"] {
  if (variant === "outline") return "outlined"
  if (variant === "ghost" || variant === "link") return "text"
  return "contained"
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const iconSize = size.startsWith("icon")
  const color = variant === "destructive" ? "error" : "primary"

  if (iconSize) {
    return (
      <IconButton
        data-slot="button"
        color={color}
        size={size === "icon-lg" ? "large" : size === "icon-xs" ? "small" : "medium"}
        className={cn(className)}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "color-mix(in oklab, var(--card) 90%, white 10%)",
          transition: "all 180ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            borderColor: "color-mix(in oklab, var(--primary) 35%, var(--border) 65%)",
          },
        }}
        {...props}
      />
    )
  }

  return (
    <MuiButton
      data-slot="button"
      variant={mapVariant(variant)}
      color={color}
      size={size === "xs" || size === "sm" ? "small" : size === "lg" ? "large" : "medium"}
      className={cn(className)}
      sx={{
        textTransform: "none",
        borderRadius: "999px",
        fontWeight: 700,
        letterSpacing: "0.01em",
        px: 2,
        boxShadow:
          variant === "default"
            ? "0 8px 20px color-mix(in oklab, var(--primary) 22%, transparent)"
            : "none",
        borderColor:
          variant === "outline"
            ? "color-mix(in oklab, var(--border) 65%, var(--primary) 35%)"
            : undefined,
        backgroundColor:
          variant === "ghost"
            ? "transparent"
            : variant === "secondary"
              ? "color-mix(in oklab, var(--secondary) 85%, white 15%)"
              : undefined,
        transition: "all 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow:
            variant === "default"
              ? "0 10px 24px color-mix(in oklab, var(--primary) 26%, transparent)"
              : undefined,
        },
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
