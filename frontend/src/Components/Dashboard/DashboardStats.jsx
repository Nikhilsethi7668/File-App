import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Axios from '../../Api/Axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DashboardStats = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  
  // New state for multiselect
  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  useEffect(() => {
    fetchEventOptions();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, selectedEvents]);

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
      
      if (selectedEvents.length === 0) {
        // If no events selected, fetch data for all events
        const params = timeRange !== 'all' ? { timeRange } : {};
        const response = await Axios.get('/dashboard', { params });
        setDashboardData(response.data.data);
      } else {
        // If events are selected, make multiple API calls and combine the data
        const dashboardPromises = selectedEvents.map(event => {
          const params = {
            ...(timeRange !== 'all' && { timeRange }),
            eventId: event.value
          };
          return Axios.get('/dashboard', { params });
        });

        const responses = await Promise.all(dashboardPromises);
        
        // Combine data from multiple responses
        const combinedData = combineEventData(responses.map(res => res.data.data));
        setDashboardData(combinedData);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const combineEventData = (dataArray) => {
    if (dataArray.length === 0) return null;
    if (dataArray.length === 1) return dataArray[0];

    // Initialize combined statistics
    const combined = {
      statistics: {
        totalUsers: 0,
        totalEvents: 0,
        giftsCollected: 0,
        statusDistribution: {},
        topCompanies: [],
        topEvents: [],
        topSelectors: [],
        registrationTrends: []
      },
      timeRange: dataArray[0].timeRange,
      eventFilter: 'multiple'
    };

    const companyMap = new Map();
    const eventMap = new Map();
    const selectorMap = new Map();
    const trendsMap = new Map();

    dataArray.forEach(data => {
      const stats = data.statistics;
      
      // Sum basic statistics
      combined.statistics.totalUsers += stats.totalUsers;
      combined.statistics.totalEvents += stats.totalEvents;
      combined.statistics.giftsCollected += stats.giftsCollected;
      
      // Combine status distribution
      Object.entries(stats.statusDistribution).forEach(([status, count]) => {
        combined.statistics.statusDistribution[status] = 
          (combined.statistics.statusDistribution[status] || 0) + count;
      });
      
      // Combine company data
      stats.topCompanies.forEach(company => {
        const existing = companyMap.get(company._id) || 0;
        companyMap.set(company._id, existing + company.count);
      });
      
      // Combine event data
      stats.topEvents.forEach(event => {
        const existing = eventMap.get(event._id) || 0;
        eventMap.set(event._id, existing + event.count);
      });
      
      // Combine selector data
      stats.topSelectors.forEach(selector => {
        const existing = selectorMap.get(selector._id) || 0;
        selectorMap.set(selector._id, existing + selector.count);
      });
      
      // Combine trends data
      stats.registrationTrends.forEach(trend => {
        const existing = trendsMap.get(trend.date) || 0;
        trendsMap.set(trend.date, existing + trend.count);
      });
    });

    // Convert maps back to arrays and sort
    combined.statistics.topCompanies = Array.from(companyMap.entries())
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    combined.statistics.topEvents = Array.from(eventMap.entries())
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    combined.statistics.topSelectors = Array.from(selectorMap.entries())
      .map(([name, count]) => ({ _id: name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    combined.statistics.registrationTrends = Array.from(trendsMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return combined;
  };

  const handleEventChange = (selectedOptions) => {
    setSelectedEvents(selectedOptions || []);
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '42px',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #d1d5db'
      },
      '&:focus-within': {
        border: '2px solid #3b82f6',
        boxShadow: '0 0 0 1px #3b82f6'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#eff6ff',
      borderRadius: '0.375rem'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#dc2626',
        color: 'white'
      }
    })
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

  const { statistics } = dashboardData;

  // Prepare data for charts
  const companyChartData = statistics.topCompanies.map((company, index) => ({
    name: company._id,
    value: company.count,
    fill: COLORS[index % COLORS.length]
  }));

  const eventChartData = statistics.topEvents.map((event, index) => ({
    name: event._id,
    value: event.count,
    fill: COLORS[index % COLORS.length]
  }));

  const statusChartData = Object.entries(statistics.statusDistribution).map(([status, count], index) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: COLORS[index % COLORS.length]
  }));

  const trendData = statistics.registrationTrends.map(trend => ({
    date: trend.date,
    registrations: trend.count
  }));

  const selectorData = statistics.topSelectors.map((selector, index) => ({
    name: selector._id,
    count: selector.count,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
        <div className="flex gap-4 items-center">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>

          {/* Event Multiselect */}
          <div className="min-w-[300px]">
            <Select
              isMulti
              value={selectedEvents}
              onChange={handleEventChange}
              options={eventOptions}
              isLoading={eventsLoading}
              placeholder="Select events to filter..."
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customSelectStyles}
              isClearable
              isSearchable
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                IndicatorSeparator: () => null
              }}
            />
          </div>
        </div>
      </div>

      {/* Selected Events Display */}
      {selectedEvents.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">Filtered by events:</span>
            <div className="flex flex-wrap gap-1">
              {selectedEvents.map((event, index) => (
                <span key={event.value} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {event.label}
                </span>
              ))}
            </div>
            <button
              onClick={() => setSelectedEvents([])}
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gifts Collected</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.giftsCollected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status Summary</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(statistics.statusDistribution).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-xs text-gray-500">
                {Object.entries(statistics.statusDistribution).map(([status, count]) => 
                  `${count} ${status}`
                ).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Company Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Top Companies Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={companyChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {companyChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Events Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Top Events</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {eventChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Registration Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Registration Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
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

        {/* Status Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
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
        </div>
      </div>

   
    </div>
  );
};

export default DashboardStats;