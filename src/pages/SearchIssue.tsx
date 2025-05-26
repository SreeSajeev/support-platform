
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, CheckCircle, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SearchIssue: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form states
  const [problemDescription, setProblemDescription] = useState('');
  const [year, setYear] = useState('');
  const [reporterId, setReporterId] = useState('');
  
  // Checkbox states
  const [searchAreas, setSearchAreas] = useState({
    subject: true,
    transaction: true,
    inputData: true,
    systemError: true,
    responseThread: true,
    issueNumber: true
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemDescription) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }
    
    toast.success('Search request submitted!');
    // Here would be the search submission logic
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

  const handleCheckboxChange = (area: keyof typeof searchAreas) => {
    setSearchAreas({
      ...searchAreas,
      [area]: !searchAreas[area]
    });
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

  // Updated to match Report Issue page background
  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center bg-lt-offWhite">
      <Header title="SEARCH ISSUE" />
      
      <div className="max-w-[1366px] w-full px-4 py-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[30pt] font-light text-lt-darkBlue relative inline-block">
            Search Issue
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
          
          <form onSubmit={handleSearchSubmit} className="pt-12">
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label htmlFor="problemDescription" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'problemDescription' ? 'text-lt-brightBlue' : ''}`}>
                Problem Description <span className="text-red-500 required-indicator">*</span>
              </label>
              <input 
                type="text" 
                id="problemDescription" 
                className="form-input" 
                placeholder="Enter problem description" 
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => handleFocus('problemDescription')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'problemDescription' ? 'w-full' : 'w-0'}`}></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="year" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'year' ? 'text-lt-brightBlue' : ''}`}>
                  Year
                </label>
                <select 
                  id="year" 
                  className="form-input form-select" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  onFocus={() => handleFocus('year')}
                  onBlur={handleBlur}
                >
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </motion.div>
              
              <motion.div className="relative" variants={itemVariants}>
                <label htmlFor="reporterId" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'reporterId' ? 'text-lt-brightBlue' : ''}`}>
                  Reporter ID
                </label>
                <input 
                  type="text" 
                  id="reporterId" 
                  className="form-input" 
                  placeholder="Enter reporter ID" 
                  value={reporterId}
                  onChange={(e) => setReporterId(e.target.value)}
                  onFocus={() => handleFocus('reporterId')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'reporterId' ? 'w-full' : 'w-0'}`}></div>
              </motion.div>
            </div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <h3 className="text-lt-darkBlue text-xl mb-4">Recommended Areas to Search</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="subject" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.subject}
                    onChange={() => handleCheckboxChange('subject')}
                  />
                  <label htmlFor="subject" className="text-lt-darkBlue cursor-pointer">Subject</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="transaction" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.transaction}
                    onChange={() => handleCheckboxChange('transaction')}
                  />
                  <label htmlFor="transaction" className="text-lt-darkBlue cursor-pointer">Transaction</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="inputData" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.inputData}
                    onChange={() => handleCheckboxChange('inputData')}
                  />
                  <label htmlFor="inputData" className="text-lt-darkBlue cursor-pointer">Input Data</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="systemError" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.systemError}
                    onChange={() => handleCheckboxChange('systemError')}
                  />
                  <label htmlFor="systemError" className="text-lt-darkBlue cursor-pointer">System Error</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="responseThread" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.responseThread}
                    onChange={() => handleCheckboxChange('responseThread')}
                  />
                  <label htmlFor="responseThread" className="text-lt-darkBlue cursor-pointer">Response Thread</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="issueNumber" 
                    className="w-4 h-4 mr-2 accent-lt-brightBlue"
                    checked={searchAreas.issueNumber}
                    onChange={() => handleCheckboxChange('issueNumber')}
                  />
                  <label htmlFor="issueNumber" className="text-lt-darkBlue cursor-pointer">Issue Number</label>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="mb-8 relative" variants={itemVariants}>
              <label htmlFor="attachment" className={`form-label block mb-2 text-lt-darkBlue ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button bg-lt-lightGrey hover:bg-gray-300 text-lt-darkBlue transition-colors flex items-center">
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
                <span className="file-name text-lt-darkBlue">{fileName || "No File Chosen"}</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center mt-12"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button 
                type="submit" 
                className="lt-button-primary btn-ripple min-w-[180px] w-full max-w-xs flex items-center justify-center bg-lt-brightBlue"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Issue
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchIssue;
