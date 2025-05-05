import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { fragmetricApi } from "@/lib/api/fragmetric";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RestakingProgram } from "@fragmetric-labs/sdk";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["global-stats"],
    queryFn: () => fragmetricApi.getGlobalStats(),
  });

  // Source Distribution Config
  const sourceDistConfig = stats
    ? Object.keys(stats.sourceDistribution).reduce((acc, key) => {
        acc[key] = {
          label: key,
          color: `hsl(var(--chart-${(Object.keys(stats.sourceDistribution).indexOf(key) % 5) + 1}))`,
        };
        return acc;
      }, {} as ChartConfig)
    : {};

  // Boost Distribution Config
  const boostDistConfig = stats
    ? Object.keys(stats.boostDistribution).reduce((acc, key) => {
        acc[key] = {
          label: key,
          color: `hsl(var(--chart-${(Object.keys(stats.boostDistribution).indexOf(key) % 5) + 1}))`,
        };
        return acc;
      }, {} as ChartConfig)
    : {};

  // DeFi Distribution Config
  const defiDistConfig = stats
    ? Object.keys(stats.defiDistribution).reduce((acc, key) => {
        acc[key] = {
          label: key,
          color: `hsl(var(--chart-${(Object.keys(stats.defiDistribution).indexOf(key) % 5) + 1}))`,
        };
        return acc;
      }, {} as ChartConfig)
    : {};

  // Convert distribution data to recharts format
  const getChartData = (data: Record<string, number> | undefined) => {
    if (!data) return [];
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const sourceChartData = getChartData(stats?.sourceDistribution);
  const boostChartData = getChartData(stats?.boostDistribution);
  const defiChartData = getChartData(stats?.defiDistribution);

  const restaking = RestakingProgram.devnet();

  restaking.fragSOL.resolve().then(console.log);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <StatCard
            title="Total F Points"
            value={stats?.totalPoints.toLocaleString() || "0"}
            description="Total F Points earned by users"
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() || "0"}
            description="Number of unique users"
            isLoading={statsLoading}
          />
        </div>

        <Tabs defaultValue="distribution" className="w-full">
          <TabsList className="mb-6 grid grid-cols-3">
            <TabsTrigger value="distribution">Point Sources</TabsTrigger>
            <TabsTrigger value="boosts">Boost Distribution</TabsTrigger>
            <TabsTrigger value="defi">DeFi Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>F Point Source Distribution</CardTitle>
                <CardDescription>
                  Where F Points are being earned across assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {stats && (
                    <ChartContainer
                      config={sourceDistConfig}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourceChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={0}
                            paddingAngle={1}
                          >
                            {sourceChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boosts" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>F Point Boost Distribution</CardTitle>
                <CardDescription>
                  Percentage of users with different boost types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {stats && (
                    <ChartContainer config={boostDistConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={boostChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={0}
                            paddingAngle={1}
                          >
                            {boostChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defi" className="pt-2">
            <Card>
              <CardHeader>
                <CardTitle>DeFi Distribution</CardTitle>
                <CardDescription>
                  Where F Points are being earned in DeFi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  {stats && (
                    <ChartContainer config={defiDistConfig} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={defiChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={0}
                            paddingAngle={1}
                          >
                            {defiChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function StatCard({
  title,
  value,
  description,
  isLoading,
}: {
  title: string;
  value: string;
  description: string;
  isLoading: boolean;
}) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
}
