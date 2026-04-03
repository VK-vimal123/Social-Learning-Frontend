import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Download, 
  Star, 
  BookOpen, 
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    charts: {}
  });

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const COLORS = ['#667eea', '#764ba2', '#48bb78', '#f6ad55', '#fc8181'];

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        overview: {
          totalViews: 3421,
          totalDownloads: 1876,
          averageRating: 4.8,
          activeUsers: 89,
          engagementRate: 78.5,
          growthRate: 23.4
        },
        charts: {
          viewsOverTime: [
            { date: 'Mon', views: 120, downloads: 45 },
            { date: 'Tue', views: 145, downloads: 52 },
            { date: 'Wed', views: 189, downloads: 67 },
            { date: 'Thu', views: 234, downloads: 89 },
            { date: 'Fri', views: 278, downloads: 123 },
            { date: 'Sat', views: 312, downloads: 145 },
            { date: 'Sun', views: 342, downloads: 167 }
          ],
          subjectDistribution: [
            { subject: 'Mathematics', value: 35, color: '#667eea' },
            { subject: 'Physics', value: 25, color: '#764ba2' },
            { subject: 'Chemistry', value: 20, color: '#48bb78' },
            { subject: 'Computer Science', value: 15, color: '#f6ad55' },
            { subject: 'Biology', value: 5, color: '#fc8181' }
          ],
          userActivity: [
            { time: '00:00', activeUsers: 12 },
            { time: '04:00', activeUsers: 8 },
            { time: '08:00', activeUsers: 45 },
            { time: '12:00', activeUsers: 78 },
            { time: '16:00', activeUsers: 89 },
            { time: '20:00', activeUsers: 67 },
            { time: '23:59', activeUsers: 34 }
          ],
          ratingDistribution: [
            { rating: '5 Stars', count: 145 },
            { rating: '4 Stars', count: 89 },
            { rating: '3 Stars', count: 34 },
            { rating: '2 Stars', count: 12 },
            { rating: '1 Star', count: 5 }
          ],
          topNotes: [
            { title: 'Advanced Calculus', downloads: 456, rating: 4.8 },
            { title: 'Physics Lab Manual', downloads: 234, rating: 4.6 },
            { title: 'Chemistry Formula Sheet', downloads: 189, rating: 4.9 },
            { title: 'Data Structures', downloads: 167, rating: 4.7 },
            { title: 'Biology Notes', downloads: 123, rating: 4.5 }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className="text-white" size={24} />
        </div>
        <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'} bg-green-50 px-2 py-1 rounded`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading text-4xl text-primary mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        md: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        marginBottom: '24px',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Analytics Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280'
          }}>
            Track your performance and engagement metrics
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Activity size={24} />
            </div>
            <span style={{
              fontSize: '12px',
              color: '#059669',
              fontWeight: '500'
            }}>
              +{analyticsData.overview.growthRate}%
            </span>
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {analyticsData.overview.totalViews.toLocaleString()}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Total Views
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Download size={24} />
            </div>
            <span style={{
              fontSize: '12px',
              color: '#059669',
              fontWeight: '500'
            }}>
              +18.2%
            </span>
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {analyticsData.overview.totalDownloads.toLocaleString()}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Total Downloads
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Star size={24} />
            </div>
            <span style={{
              fontSize: '12px',
              color: '#059669',
              fontWeight: '500'
            }}>
              +2.3%
            </span>
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {analyticsData.overview.averageRating}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Average Rating
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <span style={{
              fontSize: '12px',
              color: '#059669',
              fontWeight: '500'
            }}>
              +12.5%
            </span>
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {analyticsData.overview.activeUsers.toLocaleString()}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Active Users
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Views Over Time */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Views Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.charts.viewsOverTime}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#667eea" 
                strokeWidth={2}
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Downloads by Subject */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Downloads by Subject
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.charts.subjectDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Top Notes */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Top Performing Notes
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {analyticsData.charts.topNotes.map((note, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    {note.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    {note.subject}
                  </p>
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#667eea',
                    marginBottom: '2px'
                  }}>
                    {note.downloads.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    downloads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f3f4f6'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }}>
            User Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.charts.userActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.charts.ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        
      </div>

      {/* Top Performing Notes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Notes</h3>
          <TrendingUp className="text-gray-500" size={20} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Note Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.charts.topNotes.map((note, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="avatar avatar-sm bg-primary text-white">{index + 1}</div>
                      <span className="font-medium">{note.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Download size={16} className="text-gray-500" />
                      <span>{note.downloads}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span>{note.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        style={{ width: `${(note.downloads / 456) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Engagement Rate</h3>
            <Users size={24} />
          </div>
          <div className="text-3xl font-bold mb-2">{analyticsData.overview.engagementRate}%</div>
          <p className="text-white/80 text-sm">Users interacting with your content</p>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${analyticsData.overview.engagementRate}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Growth Rate</h3>
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-bold mb-2">{analyticsData.overview.growthRate}%</div>
          <p className="text-white/80 text-sm">Monthly growth in engagement</p>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${analyticsData.overview.growthRate}%` }}></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Avg. Session</h3>
            <Calendar size={24} />
          </div>
          <div className="text-3xl font-bold mb-2">12m 34s</div>
          <p className="text-white/80 text-sm">Average time spent on your notes</p>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
