
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X, Send } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Response: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form fields state
  const [issueNumber, setIssueNumber] = useState<string>("ITSK-2023-001");
  const [status, setStatus] = useState<string>("In Progress");
  const [startDate, setStartDate] = useState<string>("2023-09-15T10:00");
  const [targetDate, setTargetDate] = useState<string>("2023-09-18T18:00");
  const [owner, setOwner] = useState<string>("Alice Johnson");
  const [ccAddress, setCcAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Mock response thread
  const responseThread = `
[2023-09-15 10:30] John Doe: I'm unable to log into the system. It shows "Invalid credentials" even though I'm sure my password is correct.

[2023-09-15 11:15] Alice Johnson (IT): Hi John, I'll look into this right away. Can you confirm when you last successfully logged in?

[2023-09-15 11:45] John Doe: I was able to log in yesterday afternoon without any issues.

[2023-09-15 14:20] Alice Johnson (IT): I've checked the logs and there seems to be an issue with the authentication server. We're working on a fix.

[2023-09-16 09:10] Alice Johnson (IT): The authentication server has been restarted. Please try logging in now and let me know if you still encounter issues.
`;

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
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Response sent to user successfully");
      navigate('/it-helpdesk-view');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="RESPONSE" />
      
      <motion.div 
        className="container mx-auto p-6 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/ticket-details')}
            className="back-button text-lt-grey hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Ticket Details</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lt-darkBlue">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Issue Number</label>
                    <Input 
                      type="text" 
                      value={issueNumber}
                      onChange={(e) => setIssueNumber(e.target.value)}
                      className="w-full"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Status</label>
                    <Input 
                      type="text" 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Owner</label>
                    <Input 
                      type="text" 
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Start Date/Time</label>
                    <Input 
                      type="datetime-local" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Target Date/Time</label>
                    <Input 
                      type="datetime-local" 
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">CC Address</label>
                    <Input 
                      type="email" 
                      value={ccAddress}
                      onChange={(e) => setCcAddress(e.target.value)}
                      className="w-full"
                      placeholder="Enter email addresses separated by commas" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lt-darkBlue">Your Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="block text-lt-darkBlue font-medium mb-2">Type your Message</label>
                    <Textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-32 resize-vertical focus:ring-2 focus:ring-lt-brightBlue transition-all"
                      placeholder="Type your response message here..."
                    />
                  </div>
                  
                  <div className="form-group">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lt-darkBlue">Issue and Response Thread</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={responseThread}
                  className="w-full h-64 resize-vertical bg-lt-offWhite/50"
                  readOnly
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                className="lt-button-primary flex items-center gap-2"
                disabled={loading}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Reply to User"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Response;
