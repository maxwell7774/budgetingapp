'use client';

import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { PlanUsage } from '@/lib/types';

interface Props {
    chartType: 'withdrawal' | 'deposit';
    net: number;
    target: number;
}

export function BudgetUsageDonut({ chartType, net, target }: Props) {
    const chartConfig = {
        usage: {
            label: 'Usage',
        },
        target: {
            label: 'Target',
            color: 'var(--chart-1)',
        },
        net: {
            label: 'Net',
            color: 'var(--chart-2)',
        },
    } satisfies ChartConfig;

    const chartData = [
        {
            field: 'Target',
            amount: target || 1,
            fill: 'var(--color-target)',
        },
        {
            field: 'Net',
            amount: net,
            fill: 'var(--color-net)',
        },
    ];

    let percentage = (net / target) * 100;
    if (isNaN(percentage)) {
        percentage = 0;
    }

    return (
        <div className="flex flex-col">
            <div className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="field"
                            innerRadius={50}
                            outerRadius={70}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {`${percentage}%`}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    used
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                    {/* <PieChart> */}
                    {/*     <ChartTooltip */}
                    {/*         cursor={false} */}
                    {/*         content={<ChartTooltipContent hideLabel />} */}
                    {/*     /> */}
                    {/*     <Pie */}
                    {/*         data={chartData} */}
                    {/*         dataKey="amount" */}
                    {/*         nameKey="field" */}
                    {/*         innerRadius={40} */}
                    {/*     /> */}
                    {/* </PieChart> */}
                </ChartContainer>
            </div>
            <h1 className="items-center pb-0 text-center">
                {chartType === 'withdrawal' ? 'Withdrawn' : 'Deposited'}
            </h1>
            {/* <div className="flex-col gap-2 text-sm"> */}
            {/*     <div className="flex items-center gap-2 leading-none font-medium"> */}
            {/*         Trending up by 5.2% this month{' '} */}
            {/*         <TrendingUp className="h-4 w-4" /> */}
            {/*     </div> */}
            {/*     <div className="text-muted-foreground leading-none"> */}
            {/*         Showing total visitors for the last 6 months */}
            {/*     </div> */}
            {/* </div> */}
        </div>
    );
}
