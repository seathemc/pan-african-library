import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap, Heart, Wifi } from "lucide-react";
import { AfricaCharts } from "./charts";

export default function Africa2050Page() {
  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs">Building Pan-African Optimism</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Africa in 2050
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Pan-African optimism isn&apos;t wishful thinking—it&apos;s data. We&apos;ve compiled 116 metrics from the UN,
          World Bank, IMF, WHO, and IEA into one dashboard. By 2050: 2.5 billion people, a $4.5 trillion
          economy, near-universal electricity. This is the future, visualized.
        </p>
        <p className="text-base text-muted-foreground max-w-3xl">
          <strong>Why we built this:</strong> Because the narrative about Africa&apos;s future should be rooted
          in facts, not speculation. These projections come from authoritative sources, collected in one place
          so you can see the full picture.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">+1.01B</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Population Growth (2025-2050)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From 1.48B to 2.49B people. The youngest continent becomes the most populous.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">+114%</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              GDP Growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From $2.1T to $4.5T. Africa becomes 4th largest economy globally.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">95%</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Electricity Access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From 47% to near-universal. 2.3 billion people gain power.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">900M</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Middle Class Population
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From 220M to 900M. Over 1/3 of Africans join the middle class.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">93%</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Internet Penetration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From 36% to 93%. A digitally connected continent.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-3xl font-bold text-blue-600">70 yrs</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Life Expectancy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From 64 to 70 years. Six additional years of life for every African.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mission Statement */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl">Why This Matters</CardTitle>
          <CardDescription className="text-base leading-relaxed pt-2">
            Pan-African optimism isn&apos;t blind hope—it&apos;s data-driven confidence. These projections show
            a continent on the cusp of transformation: declining infant mortality, expanding education,
            renewable energy revolution, and a digital economy creating millions of jobs. The challenges
            remain real—water stress, urbanization pressure, youth unemployment gaps—but the trajectory
            is unmistakable. Understanding these numbers is essential for anyone invested in Africa&apos;s future.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Charts Section */}
      <AfricaCharts />

      {/* Data Sources */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Data Sources</CardTitle>
          <CardDescription className="text-sm">
            UN World Population Prospects, IMF World Economic Outlook, World Bank Development Indicators,
            IEA Africa Energy Outlook, WHO Global Health Observatory, UNESCO Institute for Statistics,
            FAO State of Food and Agriculture, World Happiness Report, WEF Global Gender Gap Report.
            All metrics shown at 5-year intervals: 2025, 2030, 2035, 2040, 2045, 2050.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
