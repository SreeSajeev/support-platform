import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const TicketDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    ticketId = '',
    requestedBy = '',
    date = '',
    status = '',
    age = '',
    domain = '',
    type = '',
    issueType = '',
    category = '',
    searchItem = '',
    transaction = '',
    taskStatus = '',
    responseThread = ''
  } = location.state || {};

  const [problemStatement, setProblemStatement] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [previousReview, setPreviousReview] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
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
    setTimeout(() => {
      setLoading(false);
      toast.success('Ticket details sent successfully');
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
            className="text-lt-grey hover:text-lt-brightBlue flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Ticket Summary</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div className="bg-white rounded-lg shadow-lg p-6" variants={itemVariants}>
              <h2 className="text-2xl font-light text-lt-darkBlue mb-6">Analyse and Propose</h2>

              <div className="space-y-6">
                {[{
                  label: 'Problem Statement/Requirement',
                  value: problemStatement,
                  onChange: setProblemStatement,
                  placeholder: 'Enter the problem statement or requirement in detail',
                }, {
                  label: 'Root Cause & Objective',
                  value: rootCause,
                  onChange: setRootCause,
                  placeholder: 'Describe the root cause and the objective',
                }, {
                  label: 'Review Remarks',
                  value: reviewRemarks,
                  onChange: setReviewRemarks,
                  placeholder: 'Add your review remarks',
                }, {
                  label: 'Previous Review',
                  value: previousReview,
                  onChange: setPreviousReview,
                  placeholder: 'Enter previous review details if any',
                }, {
                  label: 'Additional Notes',
                  value: additionalNotes,
                  onChange: setAdditionalNotes,
                  placeholder: 'Add any additional notes or observations',
                }].map(({ label, value, onChange, placeholder }, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <label className="block text-lt-darkBlue font-medium mb-2">{label}</label>
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full h-32 resize-none focus:ring-2 focus:ring-lt-brightBlue"
                      placeholder={placeholder}
                    />
                  </motion.div>
                ))}

                <motion.div variants={itemVariants}>
                  <label className="block text-lt-darkBlue font-medium mb-2">Attachment Upload</label>
                  <label className="lt-button-secondary inline-flex items-center cursor-pointer mb-3">
                    <Paperclip className="w-4 h-4 mr-2" /> Upload Files
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                  </label>

                  {attachments.length > 0 && attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-lt-offWhite p-2 rounded mb-2">
                      <span className="text-sm text-lt-grey truncate">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-lt-darkBlue font-medium mb-2">Time Spent</label>
                  <div className="flex items-center">
                    <Input type="number" value={timeSpent} onChange={(e) => setTimeSpent(e.target.value)} className="max-w-[200px]" min="0" />
                    <span className="ml-2 text-lt-grey">Minutes</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-end space-x-4">
                  <Button className="lt-button-secondary" onClick={() => navigate('/response')}>Response</Button>
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                    <Button className="lt-button-primary" disabled={loading} onClick={handleSubmit}>
                      {loading ? 'Sending...' : 'Send'}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div className="bg-white rounded-lg shadow-lg p-6 sticky top-6" variants={itemVariants}>
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-4">Ticket Information</h3>
              <div className="space-y-4">
                {[{
                  label: 'Date', value: date
                }, {
                  label: 'Issue Type', value: issueType
                }, {
                  label: 'Category', value: category
                }, {
                  label: 'Search Item', value: searchItem
                }, {
                  label: 'Transaction', value: transaction
                }, {
                  label: 'Task Status', value: taskStatus
                }, {
                  label: 'Age', value: age
                }, {
                  label: 'Response Thread', value: responseThread
                }].map(({ label, value }, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-lt-darkBlue">{label}</p>
                    <p className="text-sm text-lt-grey">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketDetails;
