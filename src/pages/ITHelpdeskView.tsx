import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Upload } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

// Mock data for initial tickets (you can replace this with API data)
const mockTickets = [
  { id: 1, name: 'John Doe', ticketNumber: 'IT-2023-001', type: 'Software', psNumber: 'PNR001', status: 'Open', priority: 'High', assignedTo: 'Alice', dateCreated: '2023-05-10' },
  { id: 2, name: 'Jane Smith', ticketNumber: 'IT-2023-002', type: 'Hardware', psNumber: 'PNR002', status: 'In Progress', priority: 'Medium', assignedTo: 'Bob', dateCreated: '2023-05-11' },
  { id: 3, name: 'Mike Johnson', ticketNumber: 'IT-2023-003', type: 'Software', psNumber: 'PNR003', status: 'Closed', priority: 'Low', assignedTo: 'Charlie', dateCreated: '2023-05-12' },
  { id: 4, name: 'Sarah Williams', ticketNumber: 'IT-2023-004', type: 'Hardware', psNumber: 'PNR004', status: 'Open', priority: 'High', assignedTo: 'David', dateCreated: '2023-05-13' },
  { id: 5, name: 'David Brown', ticketNumber: 'IT-2023-005', type: 'Software', psNumber: 'PNR005', status: 'In Progress', priority: 'Medium', assignedTo: 'Emma', dateCreated: '2023-05-14' },
  { id: 6, name: 'Emily Davis', ticketNumber: 'IT-2023-006', type: 'Hardware', psNumber: 'PNR006', status: 'Closed', priority: 'Low', assignedTo: 'Frank', dateCreated: '2023-05-15' },
  { id: 7, name: 'Robert Wilson', ticketNumber: 'IT-2023-007', type: 'Software', psNumber: 'PNR007', status: 'Open', priority: 'High', assignedTo: 'Grace', dateCreated: '2023-05-16' },
  { id: 8, name: 'Lisa Moore', ticketNumber: 'IT-2023-008', type: 'Hardware', psNumber: 'PNR008', status: 'In Progress', priority: 'Medium', assignedTo: 'Henry', dateCreated: '2023-05-17' },
];

const ITHelpdeskView: React.FC = () => {
  const navigate = useNavigate();

  // State variables
  const [tickets, setTickets] = useState<typeof mockTickets>([]);
  const [filteredTickets, setFilteredTickets] = useState<typeof mockTickets>([]);
  const [issueType, setIssueType] = useState<string>('');
  const [psNumber, setPsNumber] = useState<string>('');
  const [isIssueTypeOpen, setIsIssueTypeOpen] = useState(false);
  const [isPnrOpen, setIsPnrOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // Fetch tickets from API or fallback to mock data
  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        // Uncomment and replace 'YOUR_API_ENDPOINT_HERE' with actual endpoint
        const response = await fetch('https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-8080.app.github.dev/helpdesk-view/');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setTickets(data);
        setFilteredTickets(data);

        // For now, using mock data
        setTickets(mockTickets);
        setFilteredTickets(mockTickets);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Filter handler
  const handleSearch = () => {
    let filtered = tickets;
    if (issueType) filtered = filtered.filter(t => t.type === issueType);
    if (psNumber) filtered = filtered.filter(t => t.psNumber === psNumber);
    setFilteredTickets(filtered);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0].name);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const header = ['Name', 'Ticket Number', 'Type', 'PS Number', 'Status', 'Priority', 'Assigned To', 'Date Created'];
    const data = filteredTickets.map(t =>
      [t.name, t.ticketNumber, t.type, t.psNumber, t.status, t.priority, t.assignedTo, t.dateCreated]
    );

    const csvContent = [header.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'tickets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigate to detailed ticket page
  const handleGoToTicket = (ticketId: number) => {
    navigate('/ticket-summary', { state: { ticketId } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="IT HELPDESK VIEW" />

      <motion.div
        className="container mx-auto p-6 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="back-button text-lt-grey hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Helpdesk</span>
          </button>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-[25pt] font-light text-lt-darkBlue mb-4 md:mb-0">Ticket Management</h2>
            <div className="text-lt-darkBlue font-semibold text-lg">Total Tickets: {filteredTickets.length}</div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Issue Type Filter */}
            <div className="flex-1 relative">
              <label className="form-label block mb-2">Filter by Issue Type</label>
              <button
                type="button"
                className="form-input form-select flex justify-between items-center w-full cursor-pointer"
                onClick={() => setIsIssueTypeOpen(prev => !prev)}
              >
                <span>{issueType || 'Select Issue Type'}</span>
              </button>
              {isIssueTypeOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg">
                  {['Software', 'Hardware', ''].map(type => (
                    <li
                      key={type || 'all'}
                      className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                      onClick={() => {
                        setIssueType(type);
                        setIsIssueTypeOpen(false);
                      }}
                    >
                      {type || 'All Types'}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PS Number Filter */}
            <div className="flex-1 relative">
              <label className="form-label block mb-2">Filter by PS Number</label>
              <button
                type="button"
                className="form-input form-select flex justify-between items-center w-full cursor-pointer"
                onClick={() => setIsPnrOpen(prev => !prev)}
              >
                <span>{psNumber || 'Select PS Number'}</span>
              </button>
              {isPnrOpen && (
                <ul className="absolute z-10 w-full mt-1 max-h-48 overflow-auto bg-white border border-lt-lightGrey rounded-md shadow-lg">
                  {[...new Set(tickets.map(t => t.psNumber))].map(pnr => (
                    <li
                      key={pnr}
                      className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                      onClick={() => {
                        setPsNumber(pnr);
                        setIsPnrOpen(false);
                      }}
                    >
                      {pnr}
                    </li>
                  ))}
                  <li
                    className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                    onClick={() => {
                      setPsNumber('');
                      setIsPnrOpen(false);
                    }}
                  >
                    Clear Filter
                  </li>
                </ul>
              )}
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Upload & Export */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-lt-lightGrey rounded hover:bg-lt-lightGrey transition"
            >
              <Upload className="w-5 h-5" />
              Upload File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />
            {fileUploaded && <span className="text-sm text-lt-darkBlue">{fileUploaded}</span>}

            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-lg shadow-md border border-lt-lightGrey overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-lt-darkBlue font-semibold">Loading tickets...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
          ) : (
            <Table>
              <TableCaption>List of IT Helpdesk Tickets</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>PS Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-lt-grey py-4">
                      No tickets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map(ticket => (
                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-lt-lightGrey" onClick={() => handleGoToTicket(ticket.id)}>
                      <TableCell>{ticket.name}</TableCell>
                      <TableCell>{ticket.ticketNumber}</TableCell>
                      <TableCell>{ticket.type}</TableCell>
                      <TableCell>{ticket.psNumber}</TableCell>
                      <TableCell>{ticket.status}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>{ticket.dateCreated}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={e => { e.stopPropagation(); handleGoToTicket(ticket.id); }}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ITHelpdeskView;
