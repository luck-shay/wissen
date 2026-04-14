"use client"

import * as React from "react"
import MuiAvatar from "@mui/material/Avatar"

import { cn } from "@/lib/utils"

type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>
type AvatarFallbackProps = React.ComponentProps<"span">

function AvatarImage(props: AvatarImageProps) {
  void props
  return null
}

AvatarImage.displayName = "AvatarImage"

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return <span className={cn(className)} {...props} />
}

AvatarFallback.displayName = "AvatarFallback"

function Avatar({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof MuiAvatar> & {
  size?: "default" | "sm" | "lg"
}) {
  let src: string | undefined
  let alt: string | undefined
  let fallback: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    if (child.type === AvatarImage) {
      const imageProps = child.props as AvatarImageProps
      src = typeof imageProps.src === "string" ? imageProps.src : undefined
      alt = imageProps.alt
    }

    if (child.type === AvatarFallback) {
      fallback = (child.props as AvatarFallbackProps).children
    }
  })

  return (
    <MuiAvatar
      data-slot="avatar"
      className={cn(
        "group/avatar relative shrink-0",
        className
      )}
      src={src}
      alt={alt}
      sx={{
        width: size === "lg" ? 40 : size === "sm" ? 24 : 32,
        height: size === "lg" ? 40 : size === "sm" ? 24 : 32,
        fontSize: size === "sm" ? 12 : 14,
      }}
      {...props}
    >
      {fallback}
    </MuiAvatar>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
