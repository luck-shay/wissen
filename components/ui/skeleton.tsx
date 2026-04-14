"use client"

import MuiSkeleton from "@mui/material/Skeleton"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<typeof MuiSkeleton>) {
  return (
    <MuiSkeleton
      data-slot="skeleton"
      variant="rounded"
      className={cn(className)}
      {...props}
    />
  )
}

export { Skeleton }
