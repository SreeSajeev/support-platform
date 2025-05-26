
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Upload, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from 'framer-motion';

// Mock data for the table
const mockTickets = [
  { id: 1, name: 'John Doe', ticketNumber: 'IT-2023-001', type: 'Software', pnrNumber: 'PNR001', status: 'Open', priority: 'High', assignedTo: 'Alice', dateCreated: '2023-05-10' },
  { id: 2, name: 'Jane Smith', ticketNumber: 'IT-2023-002', type: 'Hardware', pnrNumber: 'PNR002', status: 'In Progress', priority: 'Medium', assignedTo: 'Bob', dateCreated: '2023-05-11' },
  { id: 3, name: 'Mike Johnson', ticketNumber: 'IT-2023-003', type: 'Software', pnrNumber: 'PNR003', status: 'Closed', priority: 'Low', assignedTo: 'Charlie', dateCreated: '2023-05-12' },
  { id: 4, name: 'Sarah Williams', ticketNumber: 'IT-2023-004', type: 'Hardware', pnrNumber: 'PNR004', status: 'Open', priority: 'High', assignedTo: 'David', dateCreated: '2023-05-13' },
  { id: 5, name: 'David Brown', ticketNumber: 'IT-2023-005', type: 'Software', pnrNumber: 'PNR005', status: 'In Progress', priority: 'Medium', assignedTo: 'Emma', dateCreated: '2023-05-14' },
  { id: 6, name: 'Emily Davis', ticketNumber: 'IT-2023-006', type: 'Hardware', pnrNumber: 'PNR006', status: 'Closed', priority: 'Low', assignedTo: 'Frank', dateCreated: '2023-05-15' },
  { id: 7, name: 'Robert Wilson', ticketNumber: 'IT-2023-007', type: 'Software', pnrNumber: 'PNR007', status: 'Open', priority: 'High', assignedTo: 'Grace', dateCreated: '2023-05-16' },
  { id: 8, name: 'Lisa Moore', ticketNumber: 'IT-2023-008', type: 'Hardware', pnrNumber: 'PNR008', status: 'In Progress', priority: 'Medium', assignedTo: 'Henry', dateCreated: '2023-05-17' },
];

const ITHelpdeskView: React.FC = () => {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState<string>('');
  const [pnrNumber, setPnrNumber] = useState<string>('');
  const [isIssueTypeOpen, setIsIssueTypeOpen] = useState<boolean>(false);
  const [isPnrOpen, setIsPnrOpen] = useState<boolean>(false);
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleSearch = () => {
    let filtered = mockTickets;
    if (issueType) {
      filtered = filtered.filter(ticket => ticket.type === issueType);
    }
    if (pnrNumber) {
      filtered = filtered.filter(ticket => ticket.pnrNumber === pnrNumber);
    }
    setFilteredTickets(filtered);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUploaded(e.target.files[0].name);
    }
  };

  const handleExportCSV = () => {
    // Mock CSV export functionality
    const header = ['Name', 'Ticket Number', 'Type', 'PNR Number', 'Status', 'Priority', 'Assigned To', 'Date Created'];
    const data = filteredTickets.map(t => 
      [t.name, t.ticketNumber, t.type, t.pnrNumber, t.status, t.priority, t.assignedTo, t.dateCreated]
    );
    
    const csvContent = [
      header.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'tickets.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToTicket = (ticketId: number) => {
    navigate(`/ticket-summary`, { state: { ticketId } });
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
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="back-button text-lt-grey hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Helpdesk</span>
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-lt-lightGrey mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-[25pt] font-light text-lt-darkBlue mb-4 md:mb-0">Ticket Management</h2>
            <div className="text-lt-darkBlue font-semibold text-lg">
              Total Tickets: {filteredTickets.length}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="form-label block mb-2">Filter by Issue Type</label>
              <div className="relative">
                <button
                  type="button"
                  className="form-input form-select flex justify-between items-center w-full cursor-pointer"
                  onClick={() => setIsIssueTypeOpen(!isIssueTypeOpen)}
                >
                  <span>{issueType || 'Select Issue Type'}</span>
                </button>
                {isIssueTypeOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg">
                    <ul>
                      <li
                        className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                        onClick={() => {
                          setIssueType('Software');
                          setIsIssueTypeOpen(false);
                        }}
                      >
                        Software
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                        onClick={() => {
                          setIssueType('Hardware');
                          setIsIssueTypeOpen(false);
                        }}
                      >
                        Hardware
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                        onClick={() => {
                          setIssueType('');
                          setIsIssueTypeOpen(false);
                        }}
                      >
                        All Types
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <label className="form-label block mb-2">Filter by PNR Number</label>
              <div className="relative">
                <button
                  type="button"
                  className="form-input form-select flex justify-between items-center w-full cursor-pointer"
                  onClick={() => setIsPnrOpen(!isPnrOpen)}
                >
                  <span>{pnrNumber || 'Select PNR Number'}</span>
                </button>
                {isPnrOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg">
                    <ul>
                      {Array.from(new Set(mockTickets.map(t => t.pnrNumber))).map((pnr) => (
                        <li
                          key={pnr}
                          className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                          onClick={() => {
                            setPnrNumber(pnr);
                            setIsPnrOpen(false);
                          }}
                        >
                          {pnr}
                        </li>
                      ))}
                      <li
                        className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                        onClick={() => {
                          setPnrNumber('');
                          setIsPnrOpen(false);
                        }}
                      >
                        All PNR Numbers
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button 
              onClick={handleSearch} 
              className="lt-button-primary btn-ripple flex items-center justify-center px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Find Issue
            </Button>
            
            <div className="relative">
              <Button 
                className="lt-button-secondary btn-ripple flex items-center justify-center px-8"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Weekly Plan
              </Button>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
              />
            </div>
            
            <Button 
              onClick={() => navigate('/it-performance-dashboard')} 
              className="lt-button-primary btn-ripple flex items-center justify-center px-8"
            >
              Go to Performance Dashboard
            </Button>
          </div>
          
          {fileUploaded && (
            <div className="mb-4 p-2 bg-green-50 text-green-600 rounded-md flex justify-between">
              <span>File uploaded: {fileUploaded}</span>
              <button className="text-lt-brightBlue hover:underline" onClick={() => setFileUploaded(null)}>
                Clear
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-lt-lightGrey overflow-hidden">
          <div className="flex justify-end p-4 border-b border-lt-lightGrey">
            <button 
              onClick={handleExportCSV}
              className="flex items-center text-lt-brightBlue hover:text-lt-darkBlue transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export as CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-lt-lightGrey">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Ticket Number</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">PNR Number</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Assigned To</TableHead>
                  <TableHead className="font-semibold">Date Created</TableHead>
                  <TableHead className="font-semibold">Go to Ticket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id}
                    className="hover:bg-lt-offWhite/50 transition-colors border-b border-lt-lightGrey"
                  >
                    <TableCell>{ticket.name}</TableCell>
                    <TableCell>{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>{ticket.pnrNumber}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell>{ticket.dateCreated}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleGoToTicket(ticket.id)}
                        className="flex items-center justify-center text-lt-brightBlue hover:text-lt-darkBlue"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <span>Details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ITHelpdeskView;
