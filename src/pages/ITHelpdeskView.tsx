import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

interface Ticket {
  UniqueID: number | string;
  Domain: string;
  Type: string;
  RaisedBy: string;
  Status: string;
  Date: string;
  AssignedTo: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const ITHelpdeskView: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/helpdesk-view/tickets');
        if (!res.ok) throw new Error('Failed to fetch tickets');
        const data = await res.json();
        setTickets(data);
        setFilteredTickets(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleSearch = () => {
    let filtered = tickets;

    if (typeFilter) {
      filtered = filtered.filter(t => t.Type.toLowerCase() === typeFilter.toLowerCase());
    }
    if (statusFilter) {
      filtered = filtered.filter(t => t.Status === statusFilter);
    }
    if (domainFilter) {
      filtered = filtered.filter(t => t.Domain.toLowerCase().includes(domainFilter.toLowerCase()));
    }

    setFilteredTickets(filtered);
  };

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateAge = (dateStr: string) => {
    const createdDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} days`;
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Domain', 'Type', 'Raised By', 'Status', 'Date', 'Assigned To'];
    const data = filteredTickets.map(t => [
      t.UniqueID,
      t.Domain,
      t.Type,
      t.RaisedBy,
      t.Status,
      formatDate(t.Date),
      t.AssignedTo,
    ]);
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tickets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToTicket = (ticket: Ticket) => {
  const assignedBy = localStorage.getItem('userName') || 'Unknown';  // 👈 Add this

  navigate('/ticket-summary', {
    state: {
      ticketId: ticket.UniqueID,
      requestedBy: ticket.RaisedBy,
      date: ticket.Date,
      status: ticket.Status,
      age: calculateAge(ticket.Date),
      domain: ticket.Domain,
      type: ticket.Type,
      assignedBy  // 👈 Add this to pass to next screen
    },
  });
};


  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center bg-lt-offWhite">
      <Header title="TICKET MANAGEMENT" />

      <div className="max-w-[1366px] w-full px-4 py-8">
        <motion.div
          className="text-center mb-8 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.button
            onClick={() => navigate('/index')}
            className="absolute top-0 left-0 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.97 }}
            variants={itemVariants}
          >
            <ArrowLeft className="w-6 h-6 mr-1" />
            <span className="text-sm font-medium">Back to Helpdesk</span>
          </motion.button>

          <motion.h2
            className="text-[30pt] font-light text-lt-darkBlue relative inline-block"
            variants={itemVariants}
          >
            Ticket Management
            <motion.span
              className="absolute -bottom-2 left-1/2 h-1 bg-lt-brightBlue rounded-full"
              initial={{ width: '0%', x: '-50%' }}
              animate={{ width: '60%', x: '-50%' }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </motion.h2>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-col md:flex-row gap-4 mb-6" variants={itemVariants}>
            <div className="flex-1">
              <label className="form-label block mb-2">Filter by Type</label>
              <select
                className="form-input w-full"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Issue">Issue</option>
                <option value="Clarification">Clarification</option>
                <option value="Change Request">Change Request</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="form-label block mb-2">Filter by Status</label>
              <select
                className="form-input w-full"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="form-label block mb-2">Filter by Domain</label>
              <select
                className="form-input w-full"
                value={domainFilter}
                onChange={e => setDomainFilter(e.target.value)}
              >
                <option value="">All Domains</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Application">Application</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="gap-2" onClick={handleSearch}>
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </motion.div>

          <motion.div className="flex justify-end gap-2" variants={itemVariants}>
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => navigate('/it-performance-dashboard')}
            >
              IT Performance Dashboard
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md border border-lt-lightGrey overflow-x-auto"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <p className="p-6 text-center text-lt-darkBlue font-semibold">
              🔄 Loading tickets...
            </p>
          ) : error ? (
            <p className="p-6 text-center text-red-600 font-semibold">❌ {error}</p>
          ) : filteredTickets.length === 0 ? (
            <p className="p-6 text-center text-lt-grey">No tickets found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Raised By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map(ticket => (
                  <TableRow key={ticket.UniqueID} className="hover:bg-lt-lightGrey">
                    <TableCell>{ticket.UniqueID}</TableCell>
                    <TableCell>{ticket.Domain}</TableCell>
                    <TableCell>{ticket.Type}</TableCell>
                    <TableCell>{ticket.RaisedBy}</TableCell>
                    <TableCell>{ticket.Status}</TableCell>
                    <TableCell>{formatDate(ticket.Date)}</TableCell>
                    <TableCell className="flex gap-2">
                      {!ticket.AssignedTo || ticket.AssignedTo.trim() === '' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGoToTicket(ticket)}
                        >
                          Take Ticket
                        </Button>
                      ) : (
                        <span>{ticket.AssignedTo}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGoToTicket(ticket)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ITHelpdeskView;
