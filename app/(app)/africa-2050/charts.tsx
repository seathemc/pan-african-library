"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Color scheme: Blue for positive growth, Violet for negative/declining
const BLUE = "#3b82f6";
const VIOLET = "#8b5cf6";
const BLUE_LIGHT = "#93c5fd";

// Population Data
const populationData = [
  { year: "2025", total: 1.48, urban: 0.82, working: 0.755 },
  { year: "2030", total: 1.65, urban: 0.95, working: 0.825 },
  { year: "2035", total: 1.85, urban: 1.10, working: 0.920 },
  { year: "2040", total: 2.08, urban: 1.25, working: 1.050 },
  { year: "2045", total: 2.28, urban: 1.35, working: 1.200 },
  { year: "2050", total: 2.49, urban: 1.40, working: 1.350 },
];

// Economic Data
const economicData = [
  { year: "2025", gdp: 2.1, perCapita: 2250, middleClass: 14.8 },
  { year: "2030", gdp: 2.7, perCapita: 2700, middleClass: 18.8 },
  { year: "2035", gdp: 3.0, perCapita: 2900, middleClass: 22.7 },
  { year: "2040", gdp: 3.5, perCapita: 3500, middleClass: 26.9 },
  { year: "2045", gdp: 4.0, perCapita: 4000, middleClass: 31.6 },
  { year: "2050", gdp: 4.5, perCapita: 4500, middleClass: 36.1 },
];

// Energy Data
const energyData = [
  { year: "2025", renewable: 6, fossil: 94, electricityAccess: 47, solarGW: 50 },
  { year: "2030", renewable: 10, fossil: 90, electricityAccess: 55, solarGW: 120 },
  { year: "2035", renewable: 18, fossil: 82, electricityAccess: 65, solarGW: 280 },
  { year: "2040", renewable: 30, fossil: 70, electricityAccess: 76, solarGW: 500 },
  { year: "2045", renewable: 45, fossil: 55, electricityAccess: 86, solarGW: 750 },
  { year: "2050", renewable: 60, fossil: 40, electricityAccess: 95, solarGW: 1000 },
];

// Education Data
const educationData = [
  { year: "2025", primary: 77.5, secondary: 28, tertiary: 9, literacy: 67 },
  { year: "2030", primary: 79.0, secondary: 32, tertiary: 11, literacy: 70 },
  { year: "2035", primary: 80.5, secondary: 37, tertiary: 14, literacy: 73 },
  { year: "2040", primary: 82.0, secondary: 42, tertiary: 17, literacy: 76 },
  { year: "2045", primary: 83.5, secondary: 47, tertiary: 21, literacy: 79 },
  { year: "2050", primary: 85.0, secondary: 52, tertiary: 25, literacy: 82 },
];

// Health Data
const healthData = [
  { year: "2025", lifeExpectancy: 64, infantMortality: 40, maternalMortality: 350, waterAccess: 70 },
  { year: "2030", lifeExpectancy: 66, infantMortality: 35, maternalMortality: 300, waterAccess: 75 },
  { year: "2035", lifeExpectancy: 67.5, infantMortality: 30, maternalMortality: 260, waterAccess: 80 },
  { year: "2040", lifeExpectancy: 69, infantMortality: 26, maternalMortality: 225, waterAccess: 85 },
  { year: "2045", lifeExpectancy: 69.5, infantMortality: 23, maternalMortality: 200, waterAccess: 90 },
  { year: "2050", lifeExpectancy: 70, infantMortality: 20, maternalMortality: 180, waterAccess: 95 },
];

// Digital Transformation Data
const digitalData = [
  { year: "2025", internet: 36, mobile: 560, digitalPayments: 180, techStartups: 3.2 },
  { year: "2030", internet: 48, mobile: 720, digitalPayments: 350, techStartups: 6.5 },
  { year: "2035", internet: 62, mobile: 920, digitalPayments: 620, techStartups: 12 },
  { year: "2040", internet: 74, mobile: 1150, digitalPayments: 1000, techStartups: 18 },
  { year: "2045", internet: 85, mobile: 1380, digitalPayments: 1450, techStartups: 24 },
  { year: "2050", internet: 93, mobile: 1650, digitalPayments: 1920, techStartups: 30 },
];

// Food Security Data
const foodData = [
  { year: "2025", production: 558, perCapita: 377, undernourished: 289 },
  { year: "2030", production: 660, perCapita: 400, undernourished: 280 },
  { year: "2035", production: 787, perCapita: 425, undernourished: 265 },
  { year: "2040", production: 953, perCapita: 458, undernourished: 245 },
  { year: "2045", production: 1157, perCapita: 507, undernourished: 220 },
  { year: "2050", production: 1393, perCapita: 559, undernourished: 190 },
];

// Wellbeing Data for Radar Chart (2050 projections)
const wellbeingData2050 = [
  { metric: "Happiness", value: 54, fullMark: 100 },
  { metric: "Life Satisfaction", value: 66, fullMark: 100 },
  { metric: "Social Cohesion", value: 64, fullMark: 100 },
  { metric: "Freedom", value: 70, fullMark: 100 },
  { metric: "Trust in Gov", value: 57, fullMark: 100 },
  { metric: "Arts & Culture", value: 50, fullMark: 100 },
];

// Employment Data
const employmentData = [
  { year: "2025", laborForce: 410, employmentRate: 84.2, youthEmployment: 38, femaleEmployment: 39, formalJobs: 45 },
  { year: "2030", laborForce: 450, employmentRate: 85.5, youthEmployment: 42, femaleEmployment: 41, formalJobs: 62 },
  { year: "2035", laborForce: 510, employmentRate: 86.8, youthEmployment: 47, femaleEmployment: 44, formalJobs: 85 },
  { year: "2040", laborForce: 580, employmentRate: 88.0, youthEmployment: 52, femaleEmployment: 47, formalJobs: 115 },
  { year: "2045", laborForce: 670, employmentRate: 89.0, youthEmployment: 57, femaleEmployment: 50, formalJobs: 155 },
  { year: "2050", laborForce: 770, employmentRate: 90.0, youthEmployment: 62, femaleEmployment: 53, formalJobs: 205 },
];

// Sector Jobs Data (Millions)
const sectorJobsData = [
  { year: "2025", agriculture: 165, manufacturing: 52, services: 126, tech: 0.8, green: 0.5 },
  { year: "2030", agriculture: 155, manufacturing: 78, services: 149, tech: 2.0, green: 1.5 },
  { year: "2035", agriculture: 140, manufacturing: 110, services: 195, tech: 4.0, green: 3.5 },
  { year: "2040", agriculture: 120, manufacturing: 155, services: 250, tech: 7.0, green: 6.5 },
  { year: "2045", agriculture: 100, manufacturing: 210, services: 315, tech: 11.0, green: 10.0 },
  { year: "2050", agriculture: 80, manufacturing: 280, services: 380, tech: 15.0, green: 14.0 },
];

// Wages Data
const wagesData = [
  { year: "2025", average: 185, minimum: 85, jobsCreated: 8 },
  { year: "2030", average: 220, minimum: 110, jobsCreated: 11 },
  { year: "2035", average: 275, minimum: 145, jobsCreated: 14 },
  { year: "2040", average: 350, minimum: 190, jobsCreated: 17 },
  { year: "2045", average: 440, minimum: 250, jobsCreated: 20 },
  { year: "2050", average: 550, minimum: 320, jobsCreated: 23 },
];

// Happiness & Life Satisfaction Data
const happinessData = [
  { year: "2025", happiness: 4.4, satisfaction: 5.1, optimism: 54, meaning: 6.1, positiveAffect: 65, rank: 113 },
  { year: "2030", happiness: 4.6, satisfaction: 5.4, optimism: 58, meaning: 6.4, positiveAffect: 67, rank: 105 },
  { year: "2035", happiness: 4.8, satisfaction: 5.7, optimism: 63, meaning: 6.8, positiveAffect: 69, rank: 95 },
  { year: "2040", happiness: 5.0, satisfaction: 6.0, optimism: 68, meaning: 7.2, positiveAffect: 71, rank: 82 },
  { year: "2045", happiness: 5.2, satisfaction: 6.3, optimism: 72, meaning: 7.6, positiveAffect: 73, rank: 68 },
  { year: "2050", happiness: 5.4, satisfaction: 6.6, optimism: 76, meaning: 8.0, positiveAffect: 75, rank: 55 },
];

export function AfricaCharts() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">The Data: 2025-2050 Projections</h2>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-1">
          <TabsTrigger value="demographics" className="text-sm py-3">Demographics</TabsTrigger>
          <TabsTrigger value="economy" className="text-sm py-3">Economy</TabsTrigger>
          <TabsTrigger value="energy" className="text-sm py-3">Energy</TabsTrigger>
          <TabsTrigger value="education" className="text-sm py-3">Education</TabsTrigger>
          <TabsTrigger value="health" className="text-sm py-3">Health</TabsTrigger>
          <TabsTrigger value="employment" className="text-sm py-3">Employment</TabsTrigger>
          <TabsTrigger value="happiness" className="text-sm py-3">Happiness</TabsTrigger>
          <TabsTrigger value="digital" className="text-sm py-3">Digital</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6 mt-6">
          <Card>
        <CardHeader>
          <CardTitle className="text-xl">Population & Demographic Dividend</CardTitle>
          <CardDescription>
            Africa&apos;s population grows by 1 billion, with 79% increase in working-age population
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={populationData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Billions', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}B`} />
              <Legend />
              <Area type="monotone" dataKey="total" stackId="1" stroke={BLUE} fill={BLUE} name="Total Population" />
              <Area type="monotone" dataKey="urban" stackId="2" stroke={BLUE_LIGHT} fill={BLUE_LIGHT} name="Urban Population" />
              <Area type="monotone" dataKey="working" stackId="3" stroke={VIOLET} fill={VIOLET} name="Working Age (15-64)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Economy Tab */}
        <TabsContent value="economy" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">GDP Growth</CardTitle>
            <CardDescription>
              Economy more than doubles from $2.1T to $4.5T
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={economicData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Trillions USD', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value}T`} />
                <Line type="monotone" dataKey="gdp" stroke={BLUE} strokeWidth={3} name="GDP" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Middle Class Expansion</CardTitle>
            <CardDescription>
              From 14.8% to 36.1% of population (680M people join)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={economicData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: '% of Population', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="middleClass" fill={BLUE} name="Middle Class %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Energy Tab */}
        <TabsContent value="energy" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Energy Revolution</CardTitle>
          <CardDescription>
            Renewable energy grows from 6% to 60% of production. Fossil fuel dependence cut in half.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: '% of Production', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Area type="monotone" dataKey="renewable" stackId="1" stroke={BLUE} fill={BLUE} name="Renewable Energy" />
              <Area type="monotone" dataKey="fossil" stackId="2" stroke={VIOLET} fill={VIOLET} name="Fossil Fuels (Declining)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Education Transformation</CardTitle>
          <CardDescription>
            Secondary completion nearly doubles (28% to 52%), tertiary enrollment triples
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: '% Enrollment/Completion', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="primary" fill={BLUE} name="Primary Enrollment" />
              <Bar dataKey="secondary" fill={BLUE_LIGHT} name="Secondary Completion" />
              <Bar dataKey="tertiary" fill={VIOLET} name="Tertiary Enrollment" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Life Expectancy</CardTitle>
            <CardDescription>
              Gains 6 years: from 64 to 70 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis domain={[60, 75]} label={{ value: 'Years', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value} years`} />
                <Line type="monotone" dataKey="lifeExpectancy" stroke={BLUE} strokeWidth={3} name="Life Expectancy" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Mortality Decline</CardTitle>
            <CardDescription>
              Infant mortality cut in half (40 to 20 per 1,000)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Per 1,000 Births', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="infantMortality" stroke={VIOLET} strokeWidth={3} name="Infant Mortality (Declining)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Digital Tab */}
        <TabsContent value="digital" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Digital Revolution</CardTitle>
          <CardDescription>
            Internet access: 36% to 93%. Digital payment users: 180M to 1.9B. Tech startups: 3,200 to 30,000.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={digitalData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: '% / Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="internet" stroke={BLUE} strokeWidth={2} name="Internet Penetration (%)" />
              <Line type="monotone" dataKey="mobile" stroke={BLUE_LIGHT} strokeWidth={2} name="Mobile Users (M)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Food Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Food Security & Nutrition</CardTitle>
          <CardDescription>
            Food production more than doubles. Undernourished population drops 34% (99M fewer people).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={foodData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="perCapita" stroke={BLUE} strokeWidth={3} name="Food per Capita (kg)" />
              <Line type="monotone" dataKey="undernourished" stroke={VIOLET} strokeWidth={3} name="Undernourished (Millions, Declining)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Happiness Tab */}
        <TabsContent value="happiness" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Wellbeing & Social Progress</CardTitle>
          <CardDescription>
            Comparison of wellbeing metrics: 2025 vs 2050 (scores out of 100)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={wellbeingData2050}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="2050" dataKey="value" stroke={BLUE} fill={BLUE} fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            2050 projections: Happiness 54/100, Life Satisfaction 66/100, Social Cohesion 64/100, Freedom 70/100, Trust in Gov 57/100, Arts & Culture 50/100
          </p>
        </CardContent>
      </Card>

      {/* Happiness Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Happiness & Life Satisfaction Scores</CardTitle>
          <CardDescription>
            Happiness score: 4.4 to 5.4 (+1.0). Life satisfaction: 5.1 to 6.6 (+1.5). Life meaning: 6.1 to 8.0.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={happinessData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Score (0-10)', angle: -90, position: 'insideLeft' }} domain={[4, 9]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="happiness" stroke={BLUE} strokeWidth={2} name="Happiness Score" />
              <Line type="monotone" dataKey="satisfaction" stroke={BLUE_LIGHT} strokeWidth={2} name="Life Satisfaction" />
              <Line type="monotone" dataKey="meaning" stroke={VIOLET} strokeWidth={2} name="Life Meaning" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rising Optimism</CardTitle>
            <CardDescription>
              Population optimism: 54% to 76% (+22 points)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={happinessData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} domain={[50, 80]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area type="monotone" dataKey="optimism" stroke={BLUE} fill={BLUE} name="Optimism %" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Global Happiness Ranking</CardTitle>
            <CardDescription>
              Africa rises from #113 to #55 globally (lower = better)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={happinessData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Global Rank', angle: -90, position: 'insideLeft' }} reversed domain={[40, 120]} />
                <Tooltip formatter={(value) => `#${value} globally`} />
                <Line type="monotone" dataKey="rank" stroke={BLUE} strokeWidth={3} name="Global Happiness Rank (improving)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Labor Force Growth</CardTitle>
          <CardDescription>
            Labor force nearly doubles from 410M to 770M. Employment rate improves from 84.2% to 90%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={employmentData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}M`} />
              <Legend />
              <Area type="monotone" dataKey="laborForce" stroke={BLUE} fill={BLUE} name="Total Labor Force (M)" />
              <Area type="monotone" dataKey="formalJobs" stroke={BLUE_LIGHT} fill={BLUE_LIGHT} name="Formal Jobs (M)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Youth & Female Employment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Youth Employment</CardTitle>
            <CardDescription>
              Youth employment rises from 38% to 62% (+24 points)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} domain={[30, 70]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="youthEmployment" stroke={BLUE} strokeWidth={3} name="Youth Employment %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Female Employment</CardTitle>
            <CardDescription>
              Female employment rises from 39% to 53% (+14 points)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} domain={[35, 60]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="femaleEmployment" stroke={BLUE} strokeWidth={3} name="Female Employment %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sector Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Economic Transformation: Jobs by Sector</CardTitle>
          <CardDescription>
            Agriculture declines (165M to 80M), Manufacturing & Services boom. Tech jobs grow 19x.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={sectorJobsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="year" />
              <YAxis label={{ value: 'Millions', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value}M`} />
              <Legend />
              <Area type="monotone" dataKey="services" stackId="1" stroke={BLUE} fill={BLUE} name="Services" />
              <Area type="monotone" dataKey="manufacturing" stackId="1" stroke={BLUE_LIGHT} fill={BLUE_LIGHT} name="Manufacturing" />
              <Area type="monotone" dataKey="agriculture" stackId="1" stroke={VIOLET} fill={VIOLET} name="Agriculture (Declining)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Wages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Wage Growth</CardTitle>
            <CardDescription>
              Average wages triple: $185 to $550/month. Minimum wage quadruples.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={wagesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'USD/month', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="average" fill={BLUE} name="Average Wage" />
                <Bar dataKey="minimum" fill={BLUE_LIGHT} name="Minimum Wage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Job Creation Acceleration</CardTitle>
            <CardDescription>
              Jobs created annually: 8M to 23M (nearly 3x increase)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={wagesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Million/year', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value}M jobs/year`} />
                <Line type="monotone" dataKey="jobsCreated" stroke={BLUE} strokeWidth={3} name="Jobs Created Annually" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
