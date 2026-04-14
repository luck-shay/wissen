"use client"

import * as React from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import ListSubheader from "@mui/material/ListSubheader"

import { cn } from "@/lib/utils"

type DropdownMenuContextValue = {
  anchorEl: HTMLElement | null
  setAnchorEl: (el: HTMLElement | null) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within <DropdownMenu>")
  }
  return context
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ anchorEl, setAnchorEl }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setAnchorEl } = useDropdownMenuContext()

  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        setAnchorEl(event.currentTarget)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({
  className,
  children,
  align = "start",
  sideOffset = 4,
  ...props
}: {
  className?: string
  children: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
} & Omit<React.ComponentProps<typeof Menu>, "open" | "anchorEl" | "onClose" | "children">) {
  const { anchorEl, setAnchorEl } = useDropdownMenuContext()

  return (
    <Menu
      data-slot="dropdown-menu-content"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: align === "end" ? "right" : align === "center" ? "center" : "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: align === "end" ? "right" : align === "center" ? "center" : "left",
      }}
      slotProps={{
        paper: {
          className: cn(className),
          sx: {
            mt: `${sideOffset}px`,
            borderRadius: 3,
            minWidth: 180,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 18px 36px rgba(3, 35, 49, 0.2)",
            backdropFilter: "blur(10px)",
          },
        },
      }}
      {...props}
    >
      {children}
    </Menu>
  )
}

function DropdownMenuGroup({ children, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dropdown-menu-group" {...props}>{children}</div>
}

function DropdownMenuLabel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ListSubheader>) {
  return (
    <ListSubheader data-slot="dropdown-menu-label" className={cn(className)} {...props}>
      {children}
    </ListSubheader>
  )
}

function DropdownMenuItem({ className, children, ...props }: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem
      data-slot="dropdown-menu-item"
      className={cn(className)}
      sx={{
        borderRadius: 2,
        mx: 0.5,
        my: 0.25,
        fontSize: 14,
        transition: "all 160ms ease",
      }}
      {...props}
    >
      {children}
    </MenuItem>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem data-slot="dropdown-menu-checkbox-item" className={cn(className)} {...props}>
      {children}
    </MenuItem>
  )
}

function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem data-slot="dropdown-menu-radio-item" className={cn(className)} {...props}>
      {children}
    </MenuItem>
  )
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof Divider>) {
  return <Divider data-slot="dropdown-menu-separator" className={cn(className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn(className)} {...props} />
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuSubTrigger({ className, children, ...props }: React.ComponentProps<typeof MenuItem>) {
  return (
    <MenuItem data-slot="dropdown-menu-sub-trigger" className={cn(className)} {...props}>
      {children}
    </MenuItem>
  )
}

function DropdownMenuSubContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
