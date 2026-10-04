import { useState, useCallback, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGeneral } from '../../../hook/useGeneral';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ChartFourRevenues() {
    const { general } = useGeneral();
    const [data, setData] = useState([]);

    useEffect(() => {
        general().then((res) => {
            const resultObj = res?.result;

            if (Array.isArray(resultObj)) {
                // Standard multi-month array
                setData(resultObj.map(item => ({
                    month: `${MONTHS[item.month - 1]} ${item.year}`,
                    totalPurchaseDue: Number(item.totalDuePurchase) || 0,
                    totalSalesDue: Number(item.totalDueSale) || 0,
                })));
            } else if (resultObj && typeof resultObj === 'object') {
                // Single aggregate object fallback
                const currentMonthIndex = new Date().getMonth();
                const currentYear = new Date().getFullYear();

                setData([{
                    month: `${MONTHS[currentMonthIndex]} ${currentYear}`,
                    totalPurchaseDue: Number(resultObj.totalPurchaseDue) || 0,
                    totalSalesDue: Number(resultObj.totalSalesDue) || 0,
                }]);
            } else {
                setData([]);
            }
        });
    }, [general]); // Fixed: Replaced undefined `growth` with `general`

    const DEFAULT_OPACITY = {
        totalPurchaseDue: 1,
        totalSalesDue: 1,
    };

    const [opacity, setOpacity] = useState(DEFAULT_OPACITY);

    const handleMouseEnter = useCallback((o) => {
        const { dataKey } = o;
        if (typeof dataKey === 'string') {
            // Fixed: Dim the UNHOVERED line/area instead of the hovered one
            setOpacity({
                totalPurchaseDue: dataKey === 'totalPurchaseDue' ? 1 : 0.3,
                totalSalesDue: dataKey === 'totalSalesDue' ? 1 : 0.3,
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpacity(DEFAULT_OPACITY);
    }, []);

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="gradCustomer" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#82ca9d" stopOpacity={opacity.totalPurchaseDue * 0.4} />
                            <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradSupplier" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffc658" stopOpacity={opacity.totalSalesDue * 0.4} />
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
                        dataKey="totalPurchaseDue"
                        name="Purchase Due"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        strokeOpacity={opacity.totalPurchaseDue}
                        fill="url(#gradCustomer)"
                        fillOpacity={opacity.totalPurchaseDue}
                    />
                    <Area
                        type="monotone"
                        dataKey="totalSalesDue"
                        name="Sales Due"
                        stroke="#ffc658"
                        strokeWidth={2}
                        strokeOpacity={opacity.totalSalesDue}
                        fill="url(#gradSupplier)"
                        fillOpacity={opacity.totalSalesDue}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ChartFourRevenues;