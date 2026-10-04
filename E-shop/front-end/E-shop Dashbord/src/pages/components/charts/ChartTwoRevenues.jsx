import { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGrowthReport } from '../../../hook/useGrowthReport';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ChartTwoRevenues() {
    const { growth } = useGrowthReport();
    const [data, setData] = useState([]);

    useEffect(() => {
        growth().then((res) => {
            const rows = Array.isArray(res?.showReport) ? res.showReport : [];
            setData(rows.map(item => ({
                month: `${MONTHS[item.month - 1]} ${item.year}`,
                totalCustomer: Number(item.totalCustomer) || 0,
                totalSupplier: Number(item.totalSupplier) || 0,
            })));
        });
    }, [growth]);

    const DEFAULT_OPACITY = {
        totalCustomer: 1,
        totalSupplier: 1,
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
                <linearGradient id="gradCustomer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSupplier" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc658" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ffc658" stopOpacity={0} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis width={40} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip />
            <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
            <Area
                type="monotone"
                dataKey="totalCustomer"
                stroke="#82ca9d"
                strokeWidth={2}
                strokeOpacity={opacity.totalCustomer}
                fill="url(#gradCustomer)"
                zIndex={activeKey === 'totalCustomer' ? 10 : undefined}
            />
            <Area
                type="monotone"
                dataKey="totalSupplier"
                stroke="#ffc658"
                strokeWidth={2}
                strokeOpacity={opacity.totalSupplier}
                fill="url(#gradSupplier)"
                zIndex={activeKey === 'totalSupplier' ? 10 : undefined}
            />
        </AreaChart>
        </ResponsiveContainer>
    );
}

export default ChartTwoRevenues