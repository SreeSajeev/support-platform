
import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Paperclip, ArrowRight,ArrowLeft, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface TicketHistory {
  ticketId: string;
  updatedBy: string;
  oldStatus: string;
  newStatus: string;
  comment: string;
  updatedAt: string;
}

interface Problem {
  id: string;
  problemDescription: string;
  domain: string;
  inputDetails: string;
  systemMessage: string;
  systemNumber: string;
  attachment?: string;
  createdAt: string;
  psNumber: string;
  currentStatus: string;
  history: TicketHistory[];
}

const PreviouslySubmittedTickets: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'psNumber'>('latest');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');
  const [expandedTickets, setExpandedTickets] = useState<Set<string>>(new Set());

  // Mock data - to be replaced with actual API call
  const mockTickets: Problem[] = [
    {
      id: "TKT-2024-001",
      problemDescription: "Email configuration not working properly",
      domain: "Email & Communication",
      inputDetails: "Unable to send emails from Outlook. Getting authentication errors.",
      systemMessage: "Authentication failed for SMTP server",
      systemNumber: "SYS-001",
      attachment: "error_screenshot.png",
      createdAt: "2024-01-15T09:30:00Z",
      psNumber: "PS001234",
      currentStatus: "Resolved",
      history: [
        {
          ticketId: "TKT-2024-001",
          updatedBy: "Sarah Johnson",
          oldStatus: "Open",
          newStatus: "In Progress",
          comment: "Ticket assigned to IT team. Investigating SMTP configuration.",
          updatedAt: "2024-01-15T10:15:00Z"
        },
        {
          ticketId: "TKT-2024-001",
          updatedBy: "Mike Chen",
          oldStatus: "In Progress",
          newStatus: "Resolved",
          comment: "SMTP settings updated. Email configuration fixed.",
          updatedAt: "2024-01-15T14:45:00Z"
        }
      ]
    },
    {
      id: "TKT-2024-002",
      problemDescription: "Software installation request for Adobe Creative Suite",
      domain: "Software & Applications",
      inputDetails: "Need Adobe Creative Suite installed for design work. License available.",
      systemMessage: "Installation pending approval",
      systemNumber: "SYS-002",
      createdAt: "2024-01-18T11:20:00Z",
      psNumber: "PS001234",
      currentStatus: "In Progress",
      history: [
        {
          ticketId: "TKT-2024-002",
          updatedBy: "David Wilson",
          oldStatus: "Open",
          newStatus: "In Progress",
          comment: "License verification in progress. Installation scheduled for next business day.",
          updatedAt: "2024-01-18T15:30:00Z"
        }
      ]
    },
    {
      id: "TKT-2024-003",
      problemDescription: "Network connectivity issues in conference room",
      domain: "Network & Infrastructure",
      inputDetails: "WiFi connection drops frequently during meetings. Multiple devices affected.",
      systemMessage: "Network diagnostics required",
      systemNumber: "SYS-003",
      attachment: "network_logs.txt",
      createdAt: "2024-01-20T08:45:00Z",
      psNumber: "PS001234",
      currentStatus: "Open",
      history: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return '✅';
      case 'in progress': return '⏳';
      case 'open': return '🔴';
      case 'closed': return '✅';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleTicketExpansion = (ticketId: string) => {
    const newExpanded = new Set(expandedTickets);
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId);
    } else {
      newExpanded.add(ticketId);
    }
    setExpandedTickets(newExpanded);
  };

  const filteredAndSortedTickets = mockTickets
    .filter(ticket => filterStatus === 'all' || ticket.currentStatus.toLowerCase().replace(' ', '-') === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'psNumber':
          return a.psNumber.localeCompare(b.psNumber);
        default:
          return 0;
      }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="IT HELPDESK" />
      
      <motion.div 
        className="container mx-auto py-6 px-4 flex-grow max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <div className="relative w-full h-full">
            <motion.button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center z-50"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.97 }}
                variants={itemVariants}
            >
                <ArrowLeft className="w-6 h-6 mr-1" />
                <span className="text-sm font-medium">Back to Helpdesk</span>
            </motion.button>
        </div>
      <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-light text-blue-900 mb-2">My Previously Submitted Tickets</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track all your reported issues and their history here
          </p>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div 
          className="bg-white rounded-lg shadow-sm p-4 mb-6"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-input text-sm py-1"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="psNumber">PS Number</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="form-input text-sm py-1"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredAndSortedTickets.length} ticket{filteredAndSortedTickets.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </motion.div>

        {/* Tickets List */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
        >
          {filteredAndSortedTickets.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow-sm p-8 text-center"
              variants={itemVariants}
            >
              <div className="text-gray-400 text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tickets found</h3>
              <p className="text-gray-600">You haven't submitted any tickets yet, or no tickets match your current filter.</p>
              <Button 
                onClick={() => navigate('/')} 
                className="lt-button-primary mt-4"
              >
                Submit Your First Ticket
              </Button>
            </motion.div>
          ) : (
            filteredAndSortedTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTicketExpansion(ticket.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-blue-600">{ticket.id}</span>
                          <Badge className={`text-xs ${getStatusColor(ticket.currentStatus)}`}>
                            {getStatusIcon(ticket.currentStatus)} {ticket.currentStatus}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {ticket.problemDescription}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{ticket.domain}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(ticket.createdAt)}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>PS: {ticket.psNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {ticket.attachment && (
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        )}
                        {expandedTickets.has(ticket.id) ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="border-t border-gray-100">
                    <div className="p-6 space-y-6">
                      {/* Ticket Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Problem Details</h4>
                          <p className="text-gray-700 mb-3">{ticket.inputDetails}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">System Message:</span>
                              <span className="ml-2 text-gray-600">{ticket.systemMessage}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">System Number:</span>
                              <span className="ml-2 text-gray-600">{ticket.systemNumber}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Ticket Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Created:</span>
                              <span className="ml-2 text-gray-600">{formatDate(ticket.createdAt)}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">PS Number:</span>
                              <span className="ml-2 text-gray-600">{ticket.psNumber}</span>
                            </div>
                            {ticket.attachment && (
                              <div>
                                <span className="font-medium text-gray-700">Attachment:</span>
                                <button className="ml-2 text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                                  <Paperclip className="w-3 h-3" />
                                  {ticket.attachment}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ticket History */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Ticket History</h4>
                        {ticket.history.length === 0 ? (
                          <div className="text-gray-500 text-sm bg-gray-50 rounded-lg p-4">
                            No updates yet. Your ticket is in the queue for review.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ticket.history.map((update, index) => (
                              <div key={index} className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0">
                                <div className="absolute left-0 top-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1.5"></div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(update.oldStatus)}`}>
                                        {update.oldStatus}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-gray-400" />
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(update.newStatus)}`}>
                                        {update.newStatus}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <User className="w-3 h-3" />
                                      {update.updatedBy}
                                      <span>•</span>
                                      <Clock className="w-3 h-3" />
                                      {formatDate(update.updatedAt)}
                                    </div>
                                  </div>
                                  {update.comment && (
                                    <p className="text-gray-700 text-sm">{update.comment}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>
      
      <footer className="bg-white py-4 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">
            © 2023 L&T Valves IT Helpdesk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PreviouslySubmittedTickets;