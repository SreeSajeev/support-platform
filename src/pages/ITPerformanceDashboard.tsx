
import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Button } from '@/components/ui/button';

// Mock data for charts
const ticketsOverTimeData = [
  { name: 'Jan', tickets: 65 },
  { name: 'Feb', tickets: 59 },
  { name: 'Mar', tickets: 80 },
  { name: 'Apr', tickets: 81 },
  { name: 'May', tickets: 56 },
  { name: 'Jun', tickets: 55 },
  { name: 'Jul', tickets: 40 },
];

const ticketTypeData = [
  { name: 'Application', value: 45 },
  { name: 'Infrastructure', value: 30 },
  { name: 'Network', value: 25 },
];

const priorityData = [
  { name: 'High', value: 15, color: '#de3618' },
  { name: 'Medium', value: 25, color: '#f59e0b' },
  { name: 'Low', value: 10, color: '#10b981' },
];

// New chart data
const ticketsByAgentData = [
  { name: 'Alice', tickets: 45, color: '#0370c0' },
  { name: 'Bob', tickets: 32, color: '#024d87' },
  { name: 'Charlie', tickets: 38, color: '#10b981' },
  { name: 'David', tickets: 27, color: '#3b82f6' },
  { name: 'Emma', tickets: 42, color: '#8b5cf6' },
];

const slaComplianceData = [
  { name: 'Jan', compliance: 92 },
  { name: 'Feb', compliance: 89 },
  { name: 'Mar', compliance: 93 },
  { name: 'Apr', compliance: 97 },
  { name: 'May', compliance: 94 },
  { name: 'Jun', compliance: 95 },
  { name: 'Jul', compliance: 98 },
];

const ticketAgingData = [
  { name: '1-3 Days', tickets: 42 },
  { name: '4-7 Days', tickets: 28 },
  { name: '8-14 Days', tickets: 15 },
  { name: '15-30 Days', tickets: 8 },
  { name: '30+ Days', tickets: 5 },
];

const chartConfig = {
  tickets: { label: 'Tickets', color: '#0370c0' },
  compliance: { label: 'Compliance %', color: '#10b981' },
  application: { label: 'Application', color: '#0370c0' },
  infrastructure: { label: 'Infrastructure', color: '#024d87' },
  network: { label: 'Network', color: '#10b981' },
  high: { label: 'High', color: '#de3618' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low: { label: 'Low', color: '#10b981' },
};

const ITPerformanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [timeRange, setTimeRange] = useState('weekly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const COLORS = ['#0370c0', '#024d87', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="IT PERFORMANCE DASHBOARD" />
      
      <motion.div 
        className="container mx-auto p-6 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/it-helpdesk-view')}
            className="back-button text-lt-grey hover:text-lt-brightBlue transition-colors flex items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ArrowLeft className={`w-5 h-5 mr-1 ${isHovering ? 'transform -translate-x-1 transition-transform' : 'transition-transform'}`} />
            <span>Back to Helpdesk View</span>
          </button>
        </div>
        
        <motion.h1 
          className="text-[30pt] font-light text-center mb-8"
          variants={itemVariants}
        >
          IT Team Performance Dashboard
        </motion.h1>
        
        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey hover-card">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-2">Total Tickets Resolved</h3>
            <div className="flex justify-between items-end">
              <div className="text-4xl font-light text-lt-brightBlue">386</div>
              <div className="flex flex-col text-right">
                <span className="text-sm text-lt-grey">Today: 12</span>
                <span className="text-sm text-lt-grey">This Week: 73</span>
                <span className="text-sm text-lt-grey">This Month: 301</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey hover-card">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-2">Avg. Resolution Time</h3>
            <div className="text-4xl font-light text-lt-brightBlue">3.2 days</div>
            <div className="text-sm text-green-600 mt-2">↓ 0.5 days from last month</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey hover-card">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-2">SLA Compliance</h3>
            <div className="text-4xl font-light text-lt-brightBlue">94.2%</div>
            <div className="text-sm text-green-600 mt-2">↑ 2.1% from last month</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey hover-card">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-2">Most Active Member</h3>
            <div className="text-2xl font-light text-lt-brightBlue">Alice Johnson</div>
            <div className="text-sm text-lt-grey mt-2">42 tickets resolved this month</div>
          </div>
        </motion.div>
        
        {/* Charts - Middle Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">Ticket Volume Over Time</h3>
            <div className="flex justify-end mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button 
                  className={`px-4 py-2 text-sm font-medium border ${timeRange === 'daily' ? 'bg-lt-lightGrey' : 'bg-white'} rounded-l-lg hover:bg-gray-100 focus:z-10 focus:bg-lt-lightGrey`}
                  onClick={() => setTimeRange('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${timeRange === 'weekly' ? 'bg-lt-lightGrey' : 'bg-white'} hover:bg-gray-100 focus:z-10 focus:bg-lt-lightGrey`}
                  onClick={() => setTimeRange('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r ${timeRange === 'monthly' ? 'bg-lt-lightGrey' : 'bg-white'} rounded-r-lg hover:bg-gray-100 focus:z-10 focus:bg-lt-lightGrey`}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ticketsOverTimeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#0370c0"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name="Tickets"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">Ticket Distribution by Type</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ticketTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        {/* Tickets Solved by Agent */}
        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">Tickets Solved by Agent</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={ticketsByAgentData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" name="Tickets Resolved">
                    {ticketsByAgentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        {/* Priority Breakdown and SLA Compliance */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={itemVariants}
        >
          {/* Priority Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">Priority Breakdown of Pending Tickets</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={priorityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Tickets">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* SLA Compliance Over Time */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">SLA Compliance Over Time</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={slaComplianceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="compliance" stroke="#10b981" fill="#10b98180" name="SLA Compliance %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        {/* Ticket Aging Analysis */}
        <motion.div 
          className="grid grid-cols-1 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey">
            <h3 className="text-[20pt] font-normal text-lt-darkBlue mb-4">Ticket Aging Analysis</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={ticketAgingData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" name="Number of Tickets" fill="#0370c0" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <Button 
            className="lt-button-primary btn-ripple flex items-center justify-center px-8"
            onClick={() => {
              // Handle report download action
              const link = document.createElement('a');
              link.href = '#';
              link.setAttribute('download', 'IT_Performance_Full_Report.pdf');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="w-5 h-5 mr-2" />
            View Full Report
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ITPerformanceDashboard;
