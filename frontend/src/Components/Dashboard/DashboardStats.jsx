import React, { useState, useEffect, useContext } from 'react';
import Axios from '../../Api/Axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserContext } from '../../Context/UserContext';

const DashboardStats = () => {
  const [dashboardData, setDashboardData] = useState({
  statistics: {
    statusDistribution: {}, 
    registrationTrends: [],
    topSelectors: [],
    totalUsers: 0,
    totalEvents: 0,
    giftsCollected: 0
  }
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const {user}=useContext(UserContext)
  
  // Modified state for single select
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventsLoading, setEventsLoading] = useState(false);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  useEffect(() => {
    fetchEventOptions();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, selectedEvent]);

  const fetchEventOptions = async () => {
    try {
      setEventsLoading(true);
      const response = await Axios.get('/events/event-list');
      if (response.data.success) {
        const options = response.data.data.map(event => ({
          value: event.id,
          label: event.title
        }));
        setEventOptions(options);
        // Only auto-select first event if none is selected and list is not empty
        if (!selectedEvent && options.length > 0) {
          setSelectedEvent(options[0].value);
        }
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if((user.role!=="admin")&&(!selectedEvent)){
         return;
      }
      // Build params object
      const params = {};
      
      // Add time range if not 'all'
      if (timeRange !== 'all') {
        params.timeRange = timeRange;
      }
      
      // Add event ID if selected
      if (selectedEvent) {
        params.eventId = selectedEvent;
      }
      
      const response = await Axios.get('/dashboard', { params });
      setDashboardData(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Select an event</div>
      </div>
    );
  }

  const { statistics } = dashboardData;

  // Prepare data for charts
  const companyChartData = statistics?.topCompanies?.map((company, index) => ({
    name: company._id,
    value: company.count,
    fill: COLORS[index % COLORS.length]
  }));


  const statusChartData = Object.entries(statistics?.statusDistribution || {})?.map(([status, count], index) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: COLORS[index % COLORS.length]
  }));

  const trendData = statistics?.registrationTrends?.map(trend => ({
    date: trend.date,
    registrations: trend.count
  }));

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>

          {/* Event Single Select */}
          <select
            value={selectedEvent}
            onChange={handleEventChange}
            disabled={eventsLoading}
            className="w-full sm:min-w-[250px] lg:min-w-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          >
            {eventOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Event Display */}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{statistics?.totalUsers}</p>
            </div>
          </div>
        </div>

      {!selectedEvent&&<div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div className="ml-3 sm:ml-4 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Events</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{statistics?.totalEvents}</p>
          </div>
        </div>
      </div>}

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600 flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Gifts Collected</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{statistics?.giftsCollected}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8"> 
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Registration Trends</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Status Overview</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {statusChartData.map((entry, index) => (
            <div key={`cell-${index}`} className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }}></div>
              <span className="ml-2">{entry.name}: <span className="font-bold">{entry.value}</span></span>
            </div>
          ))}
        </div>
      </div> 

   
    </div>
  );
};

export default DashboardStats;