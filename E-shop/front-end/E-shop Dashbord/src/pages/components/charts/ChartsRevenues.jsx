import { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMonthlyReport } from '../../../hook/useMonthlyReport';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ChartsRevenues() {
    const [data, setData] = useState([]);
    const { monthly } = useMonthlyReport();

    useEffect(() => {
        monthly().then((res) => setData(res?.showReport ?? []));
    }, [monthly]);

    const sales = Array.isArray(data)
        ? data.map(item => ({
            month: `${MONTHS[item.month - 1]} ${item.year}`,
            generalTotal: Number(item.generalTotal) || 0
        }))
        : [];

    const LINE_COLORS = { generalTotal: '#fb923c' };
    const [opacity, setOpacity] = useState({ generalTotal: 1 });

    const handleMouseEnter = useCallback((dataKey) => {
        if (typeof dataKey === 'string') {
            setOpacity(prev => ({ ...prev, [dataKey]: 0.5 }));
        }
    }, []);

    const handleMouseLeave = useCallback((dataKey) => {
        if (typeof dataKey === 'string') {
            setOpacity(prev => ({ ...prev, [dataKey]: 1 }));
        }
    }, []);

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                        width={60}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} iconType="circle" iconSize={8} />
                    {Object.entries(LINE_COLORS).map(([key, color]) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={color}
                            strokeWidth={2}
                            strokeOpacity={opacity[key]}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ChartsRevenues