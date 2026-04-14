"use client"

import * as React from "react"
import MuiCard from "@mui/material/Card"
import MuiCardContent from "@mui/material/CardContent"
import MuiCardActions from "@mui/material/CardActions"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <MuiCard
      data-slot="card"
      className={cn("rounded-xl", className)}
      sx={{
        borderRadius: 4,
        py: size === "sm" ? 1 : 2,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(135deg, color-mix(in oklab, var(--card) 90%, white 10%), color-mix(in oklab, var(--card) 96%, transparent 4%))",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 34px rgba(6, 40, 54, 0.12)",
      }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Box
      component="div"
      data-slot="card-header"
      className={cn(className)}
      sx={{ px: 2, pb: 1 }}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Typography
      component="div"
      variant="h6"
      data-slot="card-title"
      className={cn(className)}
      sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Typography
      component="div"
      variant="body2"
      data-slot="card-description"
      className={cn(className)}
      color="text.secondary"
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <MuiCardContent
      data-slot="card-content"
      className={cn(className)}
      sx={{ pt: 0, px: 2 }}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <MuiCardActions
      data-slot="card-footer"
      className={cn(className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
