import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Ticket {
  UniqueID: string;
  Type: string;
  Status: string;
  Date: string;
}

const AssignedTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'psNumber'>('latest');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const email = user?.email;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/previously-submitted-tickets?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch tickets');
        const data: Ticket[] = await res.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.Date).getTime() - new Date(a.Date).getTime();
    if (sortBy === 'oldest') return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    return a.UniqueID.localeCompare(b.UniqueID);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading tickets...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="IT HELPDESK" />

      <motion.div 
        className="container mx-auto py-6 px-4 flex-grow max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full h-full">
          <motion.button
            onClick={() => navigate('/index')}
            className="absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center z-50"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.97 }}
            variants={itemVariants}
          >
            <ArrowLeft className="w-6 h-6 mr-1" />
            <span className="text-sm font-medium">Back to Helpdesk</span>
          </motion.button>
        </div>

        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-light text-blue-900 mb-2">My Previously Submitted Tickets </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track all the issues you've raised
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              Sort by:
              <select className="border p-1 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="psNumber">PS Number</option>
              </select>
            </label>
          </div>
          <span className="text-sm text-gray-600">{sortedTickets.length} ticket(s)</span>
        </div>

        {sortedTickets.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No tickets found for "{email}".
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTickets.map(ticket => (
              <div key={ticket.UniqueID} className="bg-white p-4 rounded shadow border border-gray-200 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-blue-600">{ticket.UniqueID}</span>
                      <Badge className={`text-xs ${getStatusColor(ticket.Status)}`}>
                        {ticket.Status}
                      </Badge>
                    </div>
                    <div className="text-gray-800 font-semibold mb-1">{ticket.Type}</div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {formatDate(ticket.Date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignedTickets;
