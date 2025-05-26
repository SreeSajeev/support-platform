
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from 'framer-motion';

// Mock ticket data
const ticketData = {
  date: "2023-09-15",
  issueType: "Software",
  category: "Critical",
  searchItem: "Login Error",
  transaction: "System Access",
  taskStatus: "In Progress",
  age: "3 days",
  responseThread: "2 responses",
  reporter: "John Doe",
  product: "Windows 10",
  function: "IT Infrastructure",
  plant: "Headquarters",
  mobileNumber: "+91 9876543210",
  externalNumber: "EXT-12345"
};

const TicketDetails: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form fields state
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [rootCause, setRootCause] = useState<string>("");
  const [reviewRemarks, setReviewRemarks] = useState<string>("");
  const [previousReview, setPreviousReview] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [timeSpent, setTimeSpent] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Ticket details sent successfully");
      navigate('/response');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="TICKET DETAILS" />
      
      <motion.div 
        className="container mx-auto p-6 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/ticket-summary')}
            className="back-button text-lt-grey hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Ticket Summary</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Editable IT Input Area */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
              variants={itemVariants}
            >
              <h2 className="text-[25pt] font-light text-lt-darkBlue mb-6">Analyse and Propose</h2>
              
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Problem Statement/Requirement</label>
                  <Textarea 
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    className="w-full h-32 resize-none focus:ring-2 focus:ring-lt-brightBlue transition-all"
                    placeholder="Enter the problem statement or requirement in detail"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Root Cause & Objective</label>
                  <Textarea 
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    className="w-full h-32 resize-none focus:ring-2 focus:ring-lt-brightBlue transition-all"
                    placeholder="Describe the root cause and the objective"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Review Remarks</label>
                  <Textarea 
                    value={reviewRemarks}
                    onChange={(e) => setReviewRemarks(e.target.value)}
                    className="w-full h-32 resize-none focus:ring-2 focus:ring-lt-brightBlue transition-all"
                    placeholder="Add your review remarks"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Previous Review</label>
                  <Textarea 
                    value={previousReview}
                    onChange={(e) => setPreviousReview(e.target.value)}
                    className="w-full h-32 resize-none focus:ring-2 focus:ring-lt-brightBlue transition-all"
                    placeholder="Enter previous review details if any"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Attachment Upload</label>
                  <div className="flex items-center mb-3">
                    <label className="lt-button-secondary cursor-pointer inline-flex items-center">
                      <Paperclip className="w-4 h-4 mr-2" />
                      <span>Upload Files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-lt-offWhite rounded">
                          <span className="text-sm text-lt-grey truncate">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Additional Notes</label>
                  <Textarea 
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full h-48 resize-vertical focus:ring-2 focus:ring-lt-brightBlue transition-all"
                    placeholder="Add any additional notes or observations"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="form-group">
                  <label className="block text-lt-darkBlue font-medium mb-2">Time Spent</label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      className="max-w-[200px]" 
                      min="0"
                    />
                    <span className="ml-2 text-lt-grey">Minutes</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="flex justify-end space-x-4"
                >
                  <Button 
                    className="lt-button-secondary"
                    onClick={() => navigate('/response')}
                  >
                    Response
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button 
                      className="lt-button-primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? "Sending..." : "Send"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Panel - Static Ticket Metadata */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6 sticky top-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-4">Ticket Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Date</p>
                    <p className="text-sm text-lt-grey">{ticketData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Issue Type</p>
                    <p className="text-sm text-lt-grey">{ticketData.issueType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Category</p>
                    <p className="text-sm text-lt-grey">{ticketData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Search Item</p>
                    <p className="text-sm text-lt-grey">{ticketData.searchItem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Transaction</p>
                    <p className="text-sm text-lt-grey">{ticketData.transaction}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Task Status</p>
                    <p className="text-sm text-lt-grey">{ticketData.taskStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Age</p>
                    <p className="text-sm text-lt-grey">{ticketData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Response Thread</p>
                    <p className="text-sm text-lt-grey">{ticketData.responseThread}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Reporter</p>
                    <p className="text-sm text-lt-grey">{ticketData.reporter}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Product</p>
                    <p className="text-sm text-lt-grey">{ticketData.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Function</p>
                    <p className="text-sm text-lt-grey">{ticketData.function}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Plant</p>
                    <p className="text-sm text-lt-grey">{ticketData.plant}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">Mobile Number</p>
                    <p className="text-sm text-lt-grey">{ticketData.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-lt-darkBlue">External Number</p>
                    <p className="text-sm text-lt-grey">{ticketData.externalNumber}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketDetails;
