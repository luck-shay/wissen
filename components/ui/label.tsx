"use client"

import * as React from "react"
import Box from "@mui/material/Box"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <Box
      component="label"
      data-slot="label"
      className={cn(className)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.2,
        color: "text.primary",
      }}
      {...props}
    />
  )
}

export { Label }
