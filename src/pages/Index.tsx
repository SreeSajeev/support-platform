
import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, HelpCircle, Search, User, Download, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const navigate = useNavigate();

  {/* Start Previously Submitted Tickets Section */}

  const previousTickets = [
    {
      id: "TKT-2024-001",
      title: "Email configuration issue",
      date: "2024-01-15",
      status: "Resolved"
    },
    {
      id: "TKT-2024-002", 
      title: "Software installation request",
      date: "2024-01-18",
      status: "In Progress"
    },
    {
      id: "TKT-2024-003",
      title: "Network connectivity problem",
      date: "2024-01-20",
      status: "Open"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Open': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  {/* End of Previously Submitted Tickets Section */}


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

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="IT HELPDESK" />
      
      <motion.div 
        className="container mx-auto py-10 px-4 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-5xl font-light text-lt-darkBlue mb-4">Welcome to IT Support</h1>
          <p className="text-xl text-lt-grey max-w-2xl mx-auto">
            Please select from the options below to submit a request or view existing tickets
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-8 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Report a Problem</h3>
            <p className="text-lt-grey mb-6">
              Submit a ticket for any technical issues you are experiencing
            </p>
            <Button 
              onClick={() => navigate('/report-problem')} 
              className="lt-button-primary w-full"
            >
              Report Problem
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-8 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Ask for Clarification</h3>
            <p className="text-lt-grey mb-6">
              Request clarification on a process, system or application
            </p>
            <Button 
              onClick={() => navigate('/clarification')} 
              className="lt-button-primary w-full"
            >
              Request Clarification
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-8 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Change Request</h3>
            <p className="text-lt-grey mb-6">
              Submit a request for a change to an existing system or application
            </p>
            <Button 
              onClick={() => navigate('/change-request')} 
              className="lt-button-primary w-full"
            >
              Request Change
            </Button>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-6 text-center flex-col h-full"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search Issues</h3>
            <p className="text-lt-grey mb-4 flex-grow">
              Search for existing tickets and view their status
            </p>
            <Button 
              onClick={() => navigate('/search-issue')} 
              className="lt-button-primary w-full mt-auto"
            >
              Search Issues
            </Button>
          </motion.div>

          {/* New Card: Download UserID Form */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-8 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <Download className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Download UserID Form</h3>
            <p className="text-lt-grey mb-6">
              Access and download the official company UserID form
            </p>
            <Button 
              onClick={() => {
                // This would typically download a file
                alert('UserID form download initiated');
              }} 
              className="lt-button-primary w-full"
            >
              Download Now
            </Button>
          </motion.div>

          {/* New Card: IT Escalation Matrix */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg hover-card p-8 text-center"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
                <GitBranch className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">IT Escalation Matrix</h3>
            <p className="text-lt-grey mb-6">
              Check who to contact for issue escalations across functions
            </p>
            <Button 
              onClick={() => {
                // This would typically open the escalation flow view
                alert('Escalation matrix view will open');
              }} 
              className="lt-button-primary w-full"
            >
              View Escalation Flow
            </Button>
          </motion.div>
        </motion.div>

        {/* Previously Submitted Tickets Section */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-lt-darkBlue">Previously Submitted Tickets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {previousTickets.map((ticket) => (
                <div key={ticket.id} className="border border-lt-lightGrey rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lt-darkBlue text-sm">{ticket.id}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-lt-grey mb-2 line-clamp-2">{ticket.title}</p>
                  <p className="text-xs text-lt-mutedGrey mb-3">Submitted: {ticket.date}</p>
                  <Button 
                    onClick={() => alert(`Viewing ticket ${ticket.id}`)}
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button 
                onClick={() => alert('View all tickets')}
                variant="ghost" 
                className="text-lt-brightBlue hover:text-lt-darkBlue"
              >
                View All Tickets →
              </Button>
            </div>
          </div>
        </motion.div>

        {/*End of  Previously Submitted Tickets Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-4">IT Staff Access</h3>
            <p className="text-lt-grey mb-6">
              For IT staff members only. Access ticket management system and performance dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/login-page')} 
                className="lt-button-secondary flex items-center justify-center"
              >
                <User className="w-5 h-5 mr-2" />
                IT Staff Login
              </Button>
              
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-8"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-lt-grey mb-4">
              Contact the IT support team for immediate assistance:
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center">
                <span className="font-semibold w-24">Email:</span>
                <a href="mailto:itsupport@ltvalves.com" className="text-lt-brightBlue hover:underline">
                  itsupport@ltvalves.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Phone:</span>
                <span>+91 xxxxxxxxxx</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Hours:</span>
                <span>9:00 AM - 6:00 PM (IST), Mon-Fri</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <footer className="bg-white py-4 border-t border-lt-lightGrey mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-lt-mutedGrey">
            © 2023 L&T Valves IT Helpdesk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
