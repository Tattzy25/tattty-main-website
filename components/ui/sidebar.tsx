// Core components
export { Sidebar, SidebarTrigger, SidebarRail } from "./sidebar/sidebar-core"

// Context and provider
export { SidebarProvider, useSidebar } from "./sidebar/context"

// Layout components
export {
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
} from "./sidebar/sidebar-layout"

// Menu components
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar/sidebar-menu"

// Constants and types
export type { SidebarContextProps } from "./sidebar/constants"
