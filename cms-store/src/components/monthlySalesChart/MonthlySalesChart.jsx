// MonthlySalesChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";

function MonthlySalesChart() {
  const { authFetch } = useAuthFetch();
  const [data, setData] = useState([]);

  useEffect(() => {
    getData()

  }, []);
  const getData = async () => {
    const { error, data } = await authFetch(
      "http://localhost:8001/api/monthly-sales"
    );
    if (error) {
      console.log(error);
    } else {
      setData(data);
    }
  };

  return (
    <>
      <div className="w-full hidden sm:block h-80 bg-white shadow rounded-xl py-8 px-1 my-5 md:my-8">
        <h2 className="text-base font-medium mb-3">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_sales"
              stroke="#3b82f6"
              strokeWidth={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="block sm:hidden h-[220px] bg-white shadow rounded-xl py-8 px-1 my-5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" fontSize={10} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_sales"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default MonthlySalesChart;
