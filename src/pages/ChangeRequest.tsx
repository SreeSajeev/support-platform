
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRightLeft, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ChangeRequest: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form states
  const [requestedBy, setRequestedBy] = useState('');
  const [date, setDate] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [email, setEmail] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [currentMethod, setCurrentMethod] = useState('');
  const [proposedProcess, setProposedProcess] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [benefits, setBenefits] = useState('');
  const [consequences, setConsequences] = useState('');
  const [functionHeadEmail, setFunctionHeadEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestedBy || !date || !problemStatement) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    toast.success('Change request submitted successfully!');
    // Here would be the submission logic
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      toast.info(`File "${e.target.files[0].name}" selected.`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center bg-lt-offWhite">
      <Header title="CHANGE REQUEST" />
      
      <div className="max-w-[1366px] w-full px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[30pt] font-light text-lt-darkBlue relative inline-block">
            Change Request
            <motion.span
              className="absolute -bottom-2 left-1/2 h-1 bg-lt-brightBlue rounded-full"
              initial={{ width: "0%", x: "-50%" }}
              animate={{ width: "60%", x: "-50%" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </h2>
        </motion.div>
        
        <motion.div 
          className="form-container w-full p-8 relative hover-card bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button 
            onClick={() => navigate('/')}
            className="back-button absolute top-6 left-6 text-white hover:text-lt-brightBlue transition-colors flex items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.97 }}
            variants={itemVariants}
          >
            <ArrowLeft className={`w-6 h-6 ${isHovering ? 'transform -translate-x-1 transition-transform' : 'transition-transform'}`} />
            <span className="ml-1 text-sm font-medium">Back to Helpdesk</span>
          </motion.button>
          
          <form onSubmit={handleSubmit} className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="requestedBy" className={`form-label block mb-2 text-white ${activeField === 'requestedBy' ? 'text-lt-brightBlue' : ''}`}>
                  Requested By <span className="text-red-500 required-indicator">*</span>
                </label>
                <input 
                  type="text" 
                  id="requestedBy" 
                  className="form-input" 
                  placeholder="Enter your name" 
                  required
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  onFocus={() => handleFocus('requestedBy')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'requestedBy' ? 'w-full' : 'w-0'}`}></div>
              </motion.div>
              
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="date" className={`form-label block mb-2 text-white ${activeField === 'date' ? 'text-lt-brightBlue' : ''}`}>
                  Date <span className="text-red-500 required-indicator">*</span>
                </label>
                <input 
                  type="date" 
                  id="date" 
                  className="form-input" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onFocus={() => handleFocus('date')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'date' ? 'w-full' : 'w-0'}`}></div>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="contactDetails" className={`form-label block mb-2 text-white ${activeField === 'contactDetails' ? 'text-lt-brightBlue' : ''}`}>
                  Contact Details
                </label>
                <input 
                  type="text" 
                  id="contactDetails" 
                  className="form-input" 
                  placeholder="Enter contact details"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  onFocus={() => handleFocus('contactDetails')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'contactDetails' ? 'w-full' : 'w-0'}`}></div>
              </motion.div>
              
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="email" className={`form-label block mb-2 text-white ${activeField === 'email' ? 'text-lt-brightBlue' : ''}`}>
                  Email
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'email' ? 'w-full' : 'w-0'}`}></div>
              </motion.div>
            </div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="attachment" className={`form-label block mb-2 text-white ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input 
                      type="file" 
                      id="attachment" 
                      className="file-input" 
                      onChange={handleFileChange}
                      onFocus={() => handleFocus('attachment')}
                      onBlur={handleBlur}
                    />
                  </label>
                </div>
                <span className="file-name text-white">{fileName || "No File Chosen"}</span>
              </div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="problemStatement" className={`form-label block mb-2 text-white ${activeField === 'problemStatement' ? 'text-lt-brightBlue' : ''}`}>
                Problem Statement / Change Reason <span className="text-red-500 required-indicator">*</span>
              </label>
              <textarea 
                id="problemStatement" 
                className="form-input min-h-32" 
                placeholder="Enter problem statement or change reason" 
                required
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                onFocus={() => handleFocus('problemStatement')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'problemStatement' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="currentMethod" className={`form-label block mb-2 text-white ${activeField === 'currentMethod' ? 'text-lt-brightBlue' : ''}`}>
                Current Method / Process
              </label>
              <textarea 
                id="currentMethod" 
                className="form-input min-h-32" 
                placeholder="Describe current method or process"
                value={currentMethod}
                onChange={(e) => setCurrentMethod(e.target.value)}
                onFocus={() => handleFocus('currentMethod')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'currentMethod' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="proposedProcess" className={`form-label block mb-2 text-white ${activeField === 'proposedProcess' ? 'text-lt-brightBlue' : ''}`}>
                Proposed New Process
              </label>
              <textarea 
                id="proposedProcess" 
                className="form-input min-h-32" 
                placeholder="Describe proposed new process"
                value={proposedProcess}
                onChange={(e) => setProposedProcess(e.target.value)}
                onFocus={() => handleFocus('proposedProcess')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'proposedProcess' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="expectedOutcome" className={`form-label block mb-2 text-white ${activeField === 'expectedOutcome' ? 'text-lt-brightBlue' : ''}`}>
                Expected Outcome
              </label>
              <textarea 
                id="expectedOutcome" 
                className="form-input min-h-32" 
                placeholder="Describe expected outcome"
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                onFocus={() => handleFocus('expectedOutcome')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'expectedOutcome' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="benefits" className={`form-label block mb-2 text-white ${activeField === 'benefits' ? 'text-lt-brightBlue' : ''}`}>
                Benefits
              </label>
              <textarea 
                id="benefits" 
                className="form-input min-h-32" 
                placeholder="Describe benefits of the change"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                onFocus={() => handleFocus('benefits')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'benefits' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="consequences" className={`form-label block mb-2 text-white ${activeField === 'consequences' ? 'text-lt-brightBlue' : ''}`}>
                Consequences of Not Changing
              </label>
              <textarea 
                id="consequences" 
                className="form-input min-h-32" 
                placeholder="Describe consequences of not implementing change"
                value={consequences}
                onChange={(e) => setConsequences(e.target.value)}
                onFocus={() => handleFocus('consequences')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'consequences' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-8 relative" variants={itemVariants}>
              <label htmlFor="functionHeadEmail" className={`form-label block mb-2 text-white ${activeField === 'functionHeadEmail' ? 'text-lt-brightBlue' : ''}`}>
                Function Head Email
              </label>
              <input 
                type="email" 
                id="functionHeadEmail" 
                className="form-input" 
                placeholder="Enter function head email address"
                value={functionHeadEmail}
                onChange={(e) => setFunctionHeadEmail(e.target.value)}
                onFocus={() => handleFocus('functionHeadEmail')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'functionHeadEmail' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-10"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button 
                type="submit" 
                className="lt-button-primary btn-ripple min-w-[180px] w-full max-w-xs flex items-center justify-center"
              >
                Send to IT Helpdesk
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangeRequest;
