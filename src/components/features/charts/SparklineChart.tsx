"use client";

import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from "recharts";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Price } from "@prisma/client";

interface SparklineChartProps {
  data: Price[];
  title?: string;
  description?: string;
  field?: "close" | "open" | "high" | "low";
  color?: string;
  showCard?: boolean;
  className?: string;
  height?: number;
}

export function SparklineChart({
  data,
  title,
  description,
  field = "close",
  color = "#3b82f6", // blue-500
  showCard = true,
  className,
  height = 80,
}: SparklineChartProps) {
  // 株価変動のパーセンテージを計算
  const percentChange = useMemo(() => {
    if (!data || data.length < 2) return 0;
    
    const oldestPrice = data[data.length - 1][field] as number;
    const latestPrice = data[0][field] as number;
    
    return ((latestPrice - oldestPrice) / oldestPrice) * 100;
  }, [data, field]);

  // チャート表示用にデータを整形
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // 日付順（新しい順）にソート
    return [...data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((item) => ({
        date: new Date(item.date).toISOString().split("T")[0],
        value: item[field] !== null ? item[field] : 0,
      }));
  }, [data, field]);

  // チャートのみを表示する場合
  const chartComponent = (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis dataKey="date" hide />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} 円`, field === "close" ? "終値" : field === "open" ? "始値" : field === "high" ? "高値" : "安値"]}
          labelFormatter={(label) => `日付: ${label}`}
        />
        <ReferenceLine y={chartData[chartData.length - 1]?.value} strokeDasharray="3 3" stroke="#888" />
        <Line
          type="monotone"
          dataKey="value"
          stroke={percentChange >= 0 ? color : "#ef4444"} // 赤: 下落時
          strokeWidth={1.5}
          dot={false}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // カードなしの場合はチャートのみ返す
  if (!showCard) {
    return <div className={className}>{chartComponent}</div>;
  }

  // カード付きの場合
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          {title || "株価推移"}
          <span
            className={cn(
              "text-sm font-semibold",
              percentChange > 0 ? "text-green-500" : 
              percentChange < 0 ? "text-red-500" : "text-gray-500 dark:text-gray-300"
            )}
          >
            {percentChange > 0 ? "+" : ""}
            {percentChange.toFixed(2)}%
          </span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">{chartComponent}</CardContent>
    </Card>
  );
} 