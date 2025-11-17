"use client"

import * as React from "react"
import {
  BookOpen,
  Home,
  Search,
  Library,
  Globe,
  Calendar,
  ChevronRight,
  Landmark,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getRegions, getEras, getGenres } from "@/lib/literature-data"
import { UserMenu } from "./user-menu"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    email: string
    name?: string | null
  } | null
}

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const navMain: NavItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "The Archive",
    url: "/browse",
    icon: Library,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Africa 2050",
    url: "/africa-2050",
    icon: TrendingUp,
    badge: "New",
  },
]

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const regions = getRegions()
  const eras = getEras()
  const genres = getGenres()

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  const isActiveSubRoute = (url: string) => {
    return decodeURIComponent(pathname) === decodeURIComponent(url)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Alexandria</span>
                  <span className="text-xs text-muted-foreground">
                    Pan-African Library
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="default" className="ml-auto text-[10px] px-1.5 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Globe className="mr-2 size-4" />
            Regions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {regions.map((region) => {
                const url = `/browse/region/${encodeURIComponent(region.toLowerCase())}`
                return (
                  <SidebarMenuItem key={region}>
                    <SidebarMenuButton asChild isActive={isActiveSubRoute(url)}>
                      <Link href={url}>
                        <ChevronRight className="size-4" />
                        <span>{region}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Calendar className="mr-2 size-4" />
            Eras
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eras.map((era) => {
                const url = `/browse/era/${encodeURIComponent(era.toLowerCase())}`
                return (
                  <SidebarMenuItem key={era}>
                    <SidebarMenuButton asChild isActive={isActiveSubRoute(url)}>
                      <Link href={url}>
                        <ChevronRight className="size-4" />
                        <span>{era}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <BookOpen className="mr-2 size-4" />
            Genres
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {genres.map((genre) => {
                const url = `/browse/genre/${encodeURIComponent(genre.toLowerCase())}`
                return (
                  <SidebarMenuItem key={genre}>
                    <SidebarMenuButton asChild isActive={isActiveSubRoute(url)}>
                      <Link href={url}>
                        <ChevronRight className="size-4" />
                        <span>{genre}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Landmark className="mr-2 size-4" />
            Political Thought
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveSubRoute("/browse/genre/political%20philosophy")}>
                  <Link href="/browse/genre/political%20philosophy">
                    <ChevronRight className="size-4" />
                    <span>Political Philosophy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveSubRoute("/browse/genre/political%20document")}>
                  <Link href="/browse/genre/political%20document">
                    <ChevronRight className="size-4" />
                    <span>Political Documents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActiveSubRoute("/browse/genre/speech")}>
                  <Link href="/browse/genre/speech">
                    <ChevronRight className="size-4" />
                    <span>Speeches</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="p-2">
          <UserMenu user={user || null} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
