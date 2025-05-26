
import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Clarification: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form states
  const [problemDescription, setProblemDescription] = useState('');
  const [transactionPath, setTransactionPath] = useState('');
  const [problemStatement, setProblemStatement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemDescription) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }
    
    toast.success('Your clarification request has been submitted successfully!');
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
      <Header title="ASK FOR CLARIFICATION" />
      
      <div className="max-w-[1366px] w-full px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[30pt] font-light text-lt-darkBlue relative inline-block">
            Clarification
            <motion.span
              className="absolute -bottom-2 left-1/2 h-1 bg-lt-brightBlue rounded-full"
              initial={{ width: "0%", x: "-50%" }}
              animate={{ width: "60%", x: "-50%" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </h2>
        </motion.div>
        
        <motion.div 
          className="form-container w-full p-8 relative hover-card bg-white shadow-lg rounded-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button 
            onClick={() => navigate('/')}
            className="back-button absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
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
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="problemDescription" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'problemDescription' ? 'text-lt-brightBlue' : ''}`}>
                Problem Description <span className="text-red-500 required-indicator">*</span>
              </label>
              <input 
                type="text" 
                id="problemDescription" 
                className="form-input border border-lt-lightGrey rounded-md px-4 py-2 w-full" 
                placeholder="Enter problem description" 
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => handleFocus('problemDescription')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'problemDescription' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="transactionPath" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'transactionPath' ? 'text-lt-brightBlue' : ''}`}>
                Transaction/Menupath/Hardware
              </label>
              <input 
                type="text" 
                id="transactionPath" 
                className="form-input border border-lt-lightGrey rounded-md px-4 py-2 w-full" 
                placeholder="Enter transaction, menu path or hardware details"
                value={transactionPath}
                onChange={(e) => setTransactionPath(e.target.value)}
                onFocus={() => handleFocus('transactionPath')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'transactionPath' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="problemStatement" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'problemStatement' ? 'text-lt-brightBlue' : ''}`}>
                Problem Statement / Change Reason
              </label>
              <textarea 
                id="problemStatement" 
                className="form-input border border-lt-lightGrey rounded-md px-4 py-2 w-full min-h-32" 
                placeholder="Enter text here"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                onFocus={() => handleFocus('problemStatement')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'problemStatement' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <motion.div className="mb-8 relative" variants={itemVariants}>
              <label htmlFor="attachment" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button bg-lt-lightGrey hover:bg-lt-lightGrey/80 text-lt-darkBlue transition-colors flex items-center px-4 py-2 rounded-md cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input 
                      type="file" 
                      id="attachment" 
                      className="file-input hidden" 
                      onChange={handleFileChange}
                      onFocus={() => handleFocus('attachment')}
                      onBlur={handleBlur}
                    />
                  </label>
                </div>
                <span className="file-name text-lt-grey">{fileName || "No File Chosen"}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-10"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button 
                type="submit" 
                className="lt-button-primary bg-lt-primary hover:bg-lt-primary/90 text-white font-medium py-2 px-6 rounded-md min-w-[180px] w-full max-w-xs flex items-center justify-center"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Send to IT Helpdesk
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Clarification;
