import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, ArrowRightLeft, HelpCircle, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HelpDeskForm: React.FC = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [hoverButton, setHoverButton] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form field state
  const [psNumber] = useState("Prefilled Based on Login Details");
  const [reportedBy] = useState("Prefilled");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [externalNumber, setExternalNumber] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("prefilled");
  const [product, setProduct] = useState("");

  const handleReportProblem = () => {
    navigate('/report-problem');
  };

  const handleSearchIssue = () => {
    navigate('/search-issue');
  };

  const handleChangeRequest = () => {
    navigate('/change-request');
  };

  const handleClarification = () => {
    navigate('/clarification');
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 120 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      className="form-container w-full max-w-[1366px] p-8 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <form onSubmit={handleFormSubmit}>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          layout
        >
          {/* Row 1 */}
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="psNumber" className={`form-label block mb-2 ${activeField === 'psNumber' ? 'text-lt-brightBlue' : ''}`}>
              PS Number <span className="text-red-500 required-indicator">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="psNumber" 
                className="form-input pr-8" 
                value={psNumber} 
                readOnly 
                onFocus={() => handleFocus('psNumber')}
                onBlur={handleBlur}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-lt-mutedGrey">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className={`input-focus-indicator ${activeField === 'psNumber' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="reportedBy" className={`form-label block mb-2 ${activeField === 'reportedBy' ? 'text-lt-brightBlue' : ''}`}>
              Reported By
            </label>
            <div className="relative">
              <input 
                type="text" 
                id="reportedBy" 
                className="form-input pr-8" 
                value={reportedBy}
                readOnly 
                onFocus={() => handleFocus('reportedBy')}
                onBlur={handleBlur}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-lt-mutedGrey">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className={`input-focus-indicator ${activeField === 'reportedBy' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>

          {/* Row 2 */}
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="function" className={`form-label block mb-2 ${activeField === 'function' ? 'text-lt-brightBlue' : ''}`}>
              Function <span className="text-red-500 required-indicator">*</span>
            </label>
            <div className="relative overflow-hidden">
              <select 
                id="function" 
                className="form-input form-select cursor-pointer" 
                value={selectedFunction}
                onChange={(e) => setSelectedFunction(e.target.value)}
                onFocus={() => handleFocus('function')}
                onBlur={handleBlur}
              >
                <option value="">Select Function</option>
                <option value="option1">Finance</option>
                <option value="option2">Human Resources</option>
                <option value="option3">Engineering</option>
                <option value="option4">Operations</option>
              </select>
              <div className={`input-focus-indicator ${activeField === 'function' ? 'w-full' : 'w-0'}`}></div>
            </div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="mobileNumber" className={`form-label block mb-2 ${activeField === 'mobileNumber' ? 'text-lt-brightBlue' : ''}`}>
              Mobile Number
            </label>
            <input 
              type="text" 
              id="mobileNumber" 
              className="form-input" 
              placeholder="Enter mobile number" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onFocus={() => handleFocus('mobileNumber')}
              onBlur={handleBlur}
            />
            <div className={`input-focus-indicator ${activeField === 'mobileNumber' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>

          {/* Row 3 */}
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="externalNumber" className={`form-label block mb-2 ${activeField === 'externalNumber' ? 'text-lt-brightBlue' : ''}`}>
              External Number <span className="text-red-500 required-indicator">*</span>
            </label>
            <input 
              type="text" 
              id="externalNumber" 
              className="form-input" 
              placeholder="Enter external number"
              value={externalNumber}
              onChange={(e) => setExternalNumber(e.target.value)}
              onFocus={() => handleFocus('externalNumber')}
              onBlur={handleBlur}
            />
            <div className={`input-focus-indicator ${activeField === 'externalNumber' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants}>
            <label htmlFor="plant" className={`form-label block mb-2 ${activeField === 'plant' ? 'text-lt-brightBlue' : ''}`}>
              Plant
            </label>
            <div className="relative overflow-hidden">
              <select 
                id="plant" 
                className="form-input form-select cursor-pointer" 
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                onFocus={() => handleFocus('plant')}
                onBlur={handleBlur}
              >
                <option value="prefilled">Prefilled Plant</option>
                <option value="plant1">Plant 1</option>
                <option value="plant2">Plant 2</option>
              </select>
              <div className={`input-focus-indicator ${activeField === 'plant' ? 'w-full' : 'w-0'}`}></div>
            </div>
          </motion.div>

          {/* Row 4 - Full Width */}
          <motion.div className="col-span-1 md:col-span-2 relative" variants={itemVariants}>
            <label htmlFor="product" className={`form-label block mb-2 ${activeField === 'product' ? 'text-lt-brightBlue' : ''}`}>
              Product
            </label>
            <input 
              type="text" 
              id="product" 
              className="form-input" 
              placeholder="Enter product details"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onFocus={() => handleFocus('product')}
              onBlur={handleBlur}
            />
            <div className={`input-focus-indicator ${activeField === 'product' ? 'w-full' : 'w-0'}`}></div>
          </motion.div>
        </motion.div>

        {/* Form submission confirmation */}
        {formSubmitted && (
          <motion.div 
            className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            <span>Information updated successfully!</span>
          </motion.div>
        )}

        {/* Action Buttons - First Row */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10"
          variants={containerVariants}
        >
          <motion.button 
            type="button"
            className="lt-button-primary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onClick={handleReportProblem}
            onMouseEnter={() => setHoverButton('report')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <AlertCircle className={`w-5 h-5 mr-2 ${hoverButton === 'report' ? 'animate-pulse' : ''}`} />
            Report A Problem
          </motion.button>
          <motion.button 
            type="button"
            className="lt-button-secondary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onClick={handleSearchIssue}
            onMouseEnter={() => setHoverButton('search')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Search className={`w-5 h-5 mr-2 ${hoverButton === 'search' ? 'animate-pulse' : ''}`} />
            Search Issues
          </motion.button>
          <motion.button 
            type="button"
            className="lt-button-primary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onClick={handleChangeRequest}
            onMouseEnter={() => setHoverButton('change')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowRightLeft className={`w-5 h-5 mr-2 ${hoverButton === 'change' ? 'animate-pulse' : ''}`} />
            Change Request
          </motion.button>
        </motion.div>

        {/* Action Buttons - Second Row */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 mb-4"
          variants={containerVariants}
        >
          <motion.button 
            type="button"
            className="lt-button-secondary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onClick={handleClarification}
            onMouseEnter={() => setHoverButton('clarification')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <HelpCircle className={`w-5 h-5 mr-2 ${hoverButton === 'clarification' ? 'animate-pulse' : ''}`} />
            Ask for Clarification
          </motion.button>
          <motion.button 
            type="button"
            className="lt-button-primary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onMouseEnter={() => setHoverButton('download')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FileText className={`w-5 h-5 mr-2 ${hoverButton === 'download' ? 'animate-pulse' : ''}`} />
            Download UserID Form
          </motion.button>
          <motion.button 
            type="button"
            className="lt-button-secondary flex items-center justify-center max-w-[180px] w-full mx-auto"
            onMouseEnter={() => setHoverButton('escalation')}
            onMouseLeave={() => setHoverButton(null)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <BarChart3 className={`w-5 h-5 mr-2 ${hoverButton === 'escalation' ? 'animate-pulse' : ''}`} />
            IT Escalation Matrix
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default HelpDeskForm;
