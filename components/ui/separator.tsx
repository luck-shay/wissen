"use client"

import Divider from "@mui/material/Divider"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Divider>) {
  return (
    <Divider
      data-slot="separator"
      orientation={orientation}
      className={cn(className)}
      {...props}
    />
  )
}

export { Separator }
