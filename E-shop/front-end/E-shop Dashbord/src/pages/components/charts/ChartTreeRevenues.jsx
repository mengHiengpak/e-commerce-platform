import { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { use30DayAgo } from '../../../hook/use30DayAgo';
import dayjs from 'dayjs';

function ChartTreeRevenues() {
    const { Day30Ago } = use30DayAgo();
    const [data, setData] = useState([]);

    useEffect(() => {
        Day30Ago().then((res) => {
            const sales = Array.isArray(res?.showReport?.sales) ? res.showReport.sales : [];
            const byDay = new Map();

            sales.forEach((sale) => {
                const key = dayjs(sale.createdAt).format('YYYY-MM-DD');
                const current = byDay.get(key) || { revenue: 0, count: 0 };
                current.revenue += Number(sale.totalCost) || 0;
                current.count += 1;
                byDay.set(key, current);
            });

            setData(Array.from(byDay.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => ({
                    day: dayjs(key).format('MMM D'),
                    revenue: Math.round(value.revenue * 100) / 100,
                    count: value.count
                })));
        });
    }, [Day30Ago]);

    const DEFAULT_OPACITY = {
        revenue: 1,
        count: 1,
    };

    const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
    const [activeKey, setActiveKey] = useState(null);

    const handleMouseEnter = useCallback((o) => {
        const { dataKey } = o;
        if (typeof dataKey === 'string') {
            setOpacity(prev => ({ ...prev, [dataKey]: 0.3 }));
            setActiveKey(dataKey);
        }
    }, []);

    const handleMouseLeave = useCallback((o) => {
        const { dataKey } = o;
        if (typeof dataKey === 'string') {
            setOpacity(prev => ({ ...prev, [dataKey]: 1 }));
            setActiveKey(null);
        }
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffc658" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#ffc658" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis width={60} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                />
                <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} iconType="circle" iconSize={8} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeOpacity={opacity.revenue}
                    fill="url(#gradRevenue)"
                    zIndex={activeKey === 'revenue' ? 10 : undefined}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    name="Sales"
                    stroke="#ffc658"
                    strokeWidth={2}
                    strokeOpacity={opacity.count}
                    fill="url(#gradCount)"
                    zIndex={activeKey === 'count' ? 10 : undefined}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default ChartTreeRevenues