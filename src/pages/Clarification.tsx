import React, { useState,useEffect } from 'react';
import { ArrowLeft, HelpCircle, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Clarification: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Form states
  const [problemDescription, setProblemDescription] = useState('');
  const [transactionPath, setTransactionPath] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [psNumber, setPsNumber] = useState('');
  const [problemID, setProblemID] = useState('');
  const [email, setEmail] = useState('');

   // Fetch user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setReportedBy(user.name || '');
        setPsNumber(user.psNumber || '');
        setEmail(user.email || '');
      } catch (err) {
        console.error('Invalid user data in localStorage', err);
        toast.error('User data could not be loaded.');
      }
    } else {
      toast.error('You are not logged in.');
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!problemDescription || !domain ||!problemID) {
    toast.error('Please fill in all required fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/clarification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        problemDescription,
        domain,
        problemStatement,
        fileName,
        reportedBy,
        psNumber,
        email,
        problemID,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      toast.success('clarification reported successfully!');
      alert(`Thank you for Submitting the clarification. `);
      // Optionally reset form
      setProblemDescription('');
      setDomain('');
      setProblemStatement('');
      setReportedBy('');
      setPsNumber('');
      setEmail('');
      setFileName('');
      setProblemID('');

    }
     else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to report ');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
};

  const handleFocus = (fieldName: string) => setActiveField(fieldName);
  const handleBlur = () => setActiveField(null);

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
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
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
              initial={{ width: '0%', x: '-50%' }}
              animate={{ width: '60%', x: '-50%' }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
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
            onClick={() => navigate('/index')}
            className="back-button absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.97 }}
            variants={itemVariants}
          >
            <ArrowLeft className="w-6 h-6 mr-1" />
            <span className="text-sm font-medium">Back to Helpdesk</span>
          </motion.button>

          <form onSubmit={handleSubmit} className="pt-12">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="form-label block mb-1">Name (Reported By)</label>
              <input
                type="text"
                className="form-input bg-gray-100 cursor-not-allowed"
                value={reportedBy}
                readOnly
              />
            </div>
          
            <div>
              <label className="form-label block mb-1">Email</label>
              <input
                type="email"
                className="form-input bg-gray-100 cursor-not-allowed"
                value={email}
                readOnly
              />
            </div>
          </div>
            
            {/* New Field: ProblemID */}
            <div className="mb-6 relative">
              <label htmlFor="problemID" className={`form-label block mb-2 ${activeField === 'problemID' ? 'text-lt-brightBlue' : ''}`}>
                Problem ID
              </label>
              <input 
                type="text" 
                id="problemID" 
                className="form-input" 
                placeholder="Enter your Problem ID" 
                value={problemID}
                onChange={(e) => setProblemID(e.target.value)}
                onFocus={() => handleFocus('problemID')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'psNumber' ? 'w-full' : 'w-0'}`}></div>
            </div>
          
            {/* Problem Description */}
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label
                htmlFor="problemDescription"
                className={`form-label block mb-2 text-lt-darkBlue ${
                  activeField === 'problemDescription' ? 'text-lt-brightBlue' : ''
                }`}
              >
                Clarification Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="problemDescription"
                className="form-input border border-lt-lightGrey rounded-md px-4 py-2 w-full"
                placeholder="Enter problem description"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => handleFocus('problemDescription')}
                onBlur={handleBlur}
                required
              />
            </motion.div>
            <div className="mb-6 relative">
              <label htmlFor="domain" className={`form-label block mb-2 ${activeField === 'domain' ? 'text-lt-brightBlue' : ''}`}>
                Domain
              </label>
              <select 
                id="domain" 
                className="form-input form-select" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onFocus={() => handleFocus('domain')}
                onBlur={handleBlur}
              >
                <option value="">Select Domain</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Application">Application</option>
              </select>
              <div className={`input-focus-indicator ${activeField === 'domain' ? 'w-full' : 'w-0'}`}></div>
            </div>

           

            {/* Problem Statement */}
            <motion.div className="mb-6 relative" variants={itemVariants}>
              <label
                htmlFor="problemStatement"
                className={`form-label block mb-2 text-lt-darkBlue ${
                  activeField === 'problemStatement' ? 'text-lt-brightBlue' : ''
                }`}
              >
                Clarification Statement 
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
            </motion.div>

            {/* File Attachment */}
            <motion.div className="mb-8 relative" variants={itemVariants}>
              <label
                htmlFor="attachment"
                className={`form-label block mb-2 text-lt-darkBlue ${
                  activeField === 'attachment' ? 'text-lt-brightBlue' : ''
                }`}
              >
                Attachment
              </label>
              <div className="flex gap-3 items-center">
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
                <span className="file-name text-lt-grey">{fileName || 'No File Chosen'}</span>
              </div>
            </motion.div>

            {/* Submit Button */}
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
