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
  Code2,
  Tag,
  TrendingUp,
  Telescope,
  Target,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { WisdomLogo } from "./wisdom-logo"

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
import { Badge } from "@/components/ui/badge"
import { getRegions, getEras, getGenres } from "@/lib/literature-data"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const regions = getRegions()
  const eras = getEras()
  const genres = getGenres()

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  const isActiveExact = (url: string) => {
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
                  <WisdomLogo size={18} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Wisdom</span>
                  <span className="text-xs text-muted-foreground">Pan-African Library</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-2" />

        {/* Developer */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Developer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/developer")}>
                  <Link href="/developer">
                    <Code2 />
                    <span>Integrate the Wisdom</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/manifesto")}>
                  <Link href="/manifesto" className="flex items-center gap-2">
                    <Tag />
                    <span>Manifesto</span>
                    <Badge variant="secondary" className="ml-auto px-1.5 py-0 text-[10px] uppercase tracking-wide">
                      New
                    </Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-2" />

        {/* Future — three-scenario futures forecast */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Future
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/futures")}>
                  <Link href="/futures">
                    <Telescope />
                    <span>Our Paths</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Present — Agenda 2063 measurement (live data + goals) */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Present
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/africa-2050") && !pathname.includes("goals")}>
                  <Link href="/africa-2050?view=reality">
                    <TrendingUp />
                    <span>Our reality</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/africa-2050") && pathname.includes("goals")}>
                  <Link href="/africa-2050?view=goals">
                    <Target />
                    <span>Our goals (Agenda 2063)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/audit")}>
                  <Link href="/audit">
                    <Code2 />
                    <span>Data audit</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Past — most sub-items */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Past
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/browse")}>
                  <Link href="/browse">
                    <Library />
                    <span>The Archive</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/search")}>
                  <Link href="/search">
                    <Search />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/themes")}>
                  <Link href="/themes">
                    <Tag />
                    <span>Themes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Past — Regions */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 text-muted-foreground/60">
            <Globe className="size-3" />
            Regions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {regions.map((region) => {
                const url = `/browse/region/${encodeURIComponent(region.toLowerCase())}`
                return (
                  <SidebarMenuItem key={region}>
                    <SidebarMenuButton asChild isActive={isActiveExact(url)}>
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

        {/* Past — Eras */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 text-muted-foreground/60">
            <Calendar className="size-3" />
            Eras
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {eras.map((era) => {
                const url = `/browse/era/${encodeURIComponent(era.toLowerCase())}`
                return (
                  <SidebarMenuItem key={era}>
                    <SidebarMenuButton asChild isActive={isActiveExact(url)}>
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

        {/* Past — Genres */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-1.5 text-muted-foreground/60">
            <BookOpen className="size-3" />
            Genres
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {genres.map((genre) => {
                const url = `/browse/genre/${encodeURIComponent(genre.toLowerCase())}`
                return (
                  <SidebarMenuItem key={genre}>
                    <SidebarMenuButton asChild isActive={isActiveExact(url)}>
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
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <div className="p-2 flex items-center justify-end gap-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
