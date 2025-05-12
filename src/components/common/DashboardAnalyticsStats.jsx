import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react'; // For fallback

const chartComponents = {
  PieChart: ({ stats }) => {
    // Define a refined color palette
    const refinedColors = [
      "#4C9A2A", // Greenish
      "#1D71B8", // Blueish
      "#F2C94C", // Yellowish
      "#F26B6B", // Reddish
      "#8C7FDB", // Lavender
    ];

    const formattedStats = stats.map((stat, idx) => ({
      name: stat.label,
      value: parseInt(stat.value, 10),
      color: refinedColors[idx % refinedColors.length],  // Loop over colors
    }));

    return (
      <div className="my-8 p-6 bg-white rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedStats}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false}  // Remove label lines inside the chart
              label={({ name, value }) => `${name}: ${value}`}
              isAnimationActive={true}
            >
              {formattedStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}`}
              labelFormatter={(label) => `${label}`}
            />
            <Legend
              verticalAlign="top"
              align="center"
              iconType="circle"
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '14px',
                color: '#4A4A4A',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },

  BarChart: ({ stats }) => {
    const formattedStats = stats.map(stat => ({
      label: stat.label,
      value: parseInt(stat.value, 10),
    }));

    return (
      <div className="my-8 p-6 bg-white rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedStats}>
            {/* Cartesian Grid with a subtle style */}
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            {/* X and Y Axis with customized styles */}
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12, fill: '#4A4A4A' }} 
              axisLine={{ stroke: '#E0E0E0' }} 
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4A4A4A' }} 
              axisLine={{ stroke: '#E0E0E0' }} 
            />
            
            {/* Tooltip with custom formatting */}
            <Tooltip 
              formatter={(value) => `${stats[0]?.prefix || ""} ${value}`} 
              labelFormatter={(label) => `Category: ${label}`} 
              itemStyle={{ color: '#333' }} 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '5px' }}
            />
            
            {/* Bar with a smooth color palette */}
            <Bar 
              dataKey="value" 
              fill="#4C9A2A" 
              radius={[4, 4, 0, 0]} 
              barSize={50}
              animationDuration={800}  // Smooth animation
            />
            
            {/* Adding a legend */}
            <Legend 
              iconType="square" 
              wrapperStyle={{ paddingTop: '10px', fontSize: '14px', color: '#4A4A4A' }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  },

  Card: ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <Card className="bg-white shadow-lg border rounded-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {stat.prefix ? `${stat.prefix} ` : ""}
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  ),
};

export default function DashboardStats({ data }) {
  console.log('data received: ', data);

  if (data == null || !Array.isArray(data)) {
    return null;
  }

  return (
    <div className="space-y-10">
      {data.map((section) => {
        const ChartComponent = chartComponents[section.component];

        if (!ChartComponent) {
          console.error(`No component found for ${section.component}`);
          return null;
        }

        return (
          <div key={section.category}>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{section.title}</h2>
            <ChartComponent stats={section.stats} />
          </div>
        );
      })}
    </div>
  );
}
