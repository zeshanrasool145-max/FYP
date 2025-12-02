import React from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Bell, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const Home: React.FC = () => {
  const { user } = useAppContext();
  
  const marketRates = [
    { name: 'Wheat (Gandum)', price: 4500, change: '+5.2%', trend: 'up' },
    { name: 'Cotton (Kapas)', price: 8200, change: '+1.8%', trend: 'up' },
    { name: 'Maize (Makai)', price: 3100, change: '-2.1%', trend: 'down' },
    { name: 'Rice (Chawal)', price: 5600, change: '+0.5%', trend: 'up' },
    { name: 'Sugarcane (Ganna)', price: 450, change: '0%', trend: 'stable' },
    { name: 'Potato (Aloo)', price: 1200, change: '+12%', trend: 'up' },
    { name: 'Onion (Pyaz)', price: 2500, change: '-5%', trend: 'down' },
  ];

  // Mock data for the price chart (Wheat prices over last 7 days)
  const priceHistory = [
    { day: 'Mon', price: 4200 },
    { day: 'Tue', price: 4250 },
    { day: 'Wed', price: 4300 },
    { day: 'Thu', price: 4280 },
    { day: 'Fri', price: 4400 },
    { day: 'Sat', price: 4450 },
    { day: 'Sun', price: 4500 },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500">Here is today's market update.</p>
        </div>
        <div className="relative p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 cursor-pointer">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
      </div>

      {/* Market Trends Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-agri-600 mr-2" />
            <h2 className="font-bold text-gray-900">Wheat Price Trend</h2>
          </div>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">+7.1%</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9ca3af'}} 
                dy={10}
              />
              <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value} PKR`, 'Price']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Market Rates Card */}
      <div className="bg-gradient-to-br from-agri-700 to-agri-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            <h2 className="font-bold text-lg">Live Mandi Rates</h2>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">Updated 5m ago</span>
        </div>
        <div className="space-y-4">
          {marketRates.map((crop, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/10 last:border-0 pb-2 last:pb-0">
              <span className="font-medium">{crop.name}</span>
              <div className="text-right">
                <span className="block font-bold text-lg leading-tight">{crop.price}</span>
                <span className={`text-xs flex items-center justify-end ${
                  crop.trend === 'up' ? 'text-green-300' : 
                  crop.trend === 'down' ? 'text-red-300' : 'text-gray-300'
                }`}>
                  {crop.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1"/> : 
                   crop.trend === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1"/> : null}
                  {crop.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h3 className="font-bold text-lg text-gray-800 mb-3">Recent Alerts</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            <div>
               <p className="text-sm text-gray-800 font-medium">New Demand for Cotton in Sahiwal</p>
               <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></div>
            <div>
               <p className="text-sm text-gray-800 font-medium">Wheat prices expected to rise</p>
               <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};