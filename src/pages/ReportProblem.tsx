{/*}
import React, { useState } from 'react';
import { ArrowLeft, Upload, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const ReportProblem: React.FC = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form states
  const [description, setProblemDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!description) {
    toast.error('Please fill in the required Problem Description field.');
    return;
  }

  try {
    const response = await fetch('https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-5000.app.github.dev/api/report-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        domain,
        inputDetails,
        systemMessage,
      }),
    });

    if (response.ok) {
      toast.success('Your problem has been reported successfully!');
      // Reset form fields
      setProblemDescription('');
      setDomain('');
      setInputDetails('');
      setSystemMessage('');
      setFileName('');
    } else {
      const errorData = await response.json();
      toast.error(errorData.error || 'Failed to report problem.');
    }
  } catch (err) {
    toast.error('Something went wrong.');
    console.error(err);
    console.error('❌ Error inserting problem:', err);
  }
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

  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center">
      <Header />
      
      <div className="max-w-[1366px] w-full px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-[30pt] font-light text-lt-darkBlue">Report Issue</h2>
        </div>
        
        <div className="form-container w-full p-8 relative hover-card">
          <button 
            onClick={() => navigate('/')}
            className="back-button absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1 text-sm font-medium">Back to Helpdesk</span>
          </button>
          
          <form onSubmit={handleSubmit} className="pt-12">
            <div className="mb-6 relative">
              <label htmlFor="description" className={`form-label block mb-2 ${activeField === 'description' ? 'text-lt-brightBlue' : ''}`}>
                Problem Description <span className="text-red-500 required-indicator">*</span>
              </label>
              <input 
                type="text" 
                id="description" 
                className="form-input" 
                placeholder="Enter problem description" 
                required
                value={description}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'description' ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="mb-6 relative">
              <label htmlFor="domain" className={`form-label block mb-2 ${activeField === 'domain' ? 'text-lt-brightBlue' : ''}`}>
                Domain
              </label>
              <div className="relative">
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
                  <option value="Applcation">Application</option>
                  
                </select>
              </div>
              <div className={`input-focus-indicator ${activeField === 'domain' ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="mb-6 relative">
              <label htmlFor="inputDetails" className={`form-label block mb-2 ${activeField === 'inputDetails' ? 'text-lt-brightBlue' : ''}`}>
                Input Details
              </label>
              <textarea 
                id="inputDetails" 
                className="form-input min-h-32" 
                placeholder="Enter details here" 
                value={inputDetails}
                onChange={(e) => setInputDetails(e.target.value)}
                onFocus={() => handleFocus('inputDetails')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'inputDetails' ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="mb-6 relative">
              <label htmlFor="systemMessage" className={`form-label block mb-2 ${activeField === 'systemMessage' ? 'text-lt-brightBlue' : ''}`}>
                System Message & Number
              </label>
              <textarea 
                id="systemMessage" 
                className="form-input min-h-32" 
                placeholder="Enter system message and number" 
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                onFocus={() => handleFocus('systemMessage')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'systemMessage' ? 'w-full' : 'w-0'}`}></div>
            </div>
            
            <div className="mb-8 relative">
              <label htmlFor="attachment" className={`form-label block mb-2 ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button hover:bg-gray-200 transition-colors flex items-center">
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
                <span className="file-name">{fileName || "No File Chosen"}</span>
              </div>
            </div>
            
            <motion.div 
              className="flex justify-center mt-10"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
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
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;

*/}
import React, { useState } from 'react';
import { ArrowLeft, Upload, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ReportProblem: React.FC = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Form states
  const [description, setProblemDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [psNumber, setPsNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }

    try {
      const response = await fetch('https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-5000.app.github.dev/api/report-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          domain,
          inputDetails,
          systemMessage,
          reportedBy,
          psNumber,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Your problem has been reported successfully!');
        alert(`Thank you for reporting an issue. Your ProblemID is ${data.problemID}!`);

        // Reset form fields
        setProblemDescription('');
        setDomain('');
        setInputDetails('');
        setSystemMessage('');
        setReportedBy('');
        setPsNumber('');
        setEmail('');
        setFileName('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to report problem.');
      }
    } catch (err) {
      toast.error('Something went wrong.');
      console.error(err);
      console.error('❌ Error inserting problem:', err);
    }
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

  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center">
      <Header />

      <div className="max-w-[1366px] w-full px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-[30pt] font-light text-lt-darkBlue">Report Issue</h2>
        </div>

        <div className="form-container w-full p-8 relative hover-card">
          <button 
            onClick={() => navigate('/')}
            className="back-button absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1 text-sm font-medium">Back to Helpdesk</span>
          </button>

          <form onSubmit={handleSubmit} className="pt-12">
            
            {/* New Field: Reported By */}
            <div className="mb-6 relative">
              <label htmlFor="reportedBy" className={`form-label block mb-2 ${activeField === 'reportedBy' ? 'text-lt-brightBlue' : ''}`}>
                Name (Reported By)
              </label>
              <input 
                type="text" 
                id="reportedBy" 
                className="form-input" 
                placeholder="Enter your name" 
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                onFocus={() => handleFocus('reportedBy')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'reportedBy' ? 'w-full' : 'w-0'}`}></div>
            </div>

            {/* New Field: PS Number */}
            <div className="mb-6 relative">
              <label htmlFor="psNumber" className={`form-label block mb-2 ${activeField === 'psNumber' ? 'text-lt-brightBlue' : ''}`}>
                PS Number
              </label>
              <input 
                type="text" 
                id="psNumber" 
                className="form-input" 
                placeholder="Enter your PS number" 
                value={psNumber}
                onChange={(e) => setPsNumber(e.target.value)}
                onFocus={() => handleFocus('psNumber')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'psNumber' ? 'w-full' : 'w-0'}`}></div>
            </div>

            {/* New Field: Email */}
            <div className="mb-6 relative">
              <label htmlFor="email" className={`form-label block mb-2 ${activeField === 'email' ? 'text-lt-brightBlue' : ''}`}>
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'email' ? 'w-full' : 'w-0'}`}></div>
            </div>

            <div className="mb-6 relative">
              <label htmlFor="description" className={`form-label block mb-2 ${activeField === 'description' ? 'text-lt-brightBlue' : ''}`}>
                Problem Description <span className="text-red-500 required-indicator">*</span>
              </label>
              <input 
                type="text" 
                id="description" 
                className="form-input" 
                placeholder="Enter problem description" 
                required
                value={description}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => handleFocus('description')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'description' ? 'w-full' : 'w-0'}`}></div>
            </div>

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

            <div className="mb-6 relative">
              <label htmlFor="inputDetails" className={`form-label block mb-2 ${activeField === 'inputDetails' ? 'text-lt-brightBlue' : ''}`}>
                Input Details
              </label>
              <textarea 
                id="inputDetails" 
                className="form-input min-h-32" 
                placeholder="Enter details here" 
                value={inputDetails}
                onChange={(e) => setInputDetails(e.target.value)}
                onFocus={() => handleFocus('inputDetails')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'inputDetails' ? 'w-full' : 'w-0'}`}></div>
            </div>

            <div className="mb-6 relative">
              <label htmlFor="systemMessage" className={`form-label block mb-2 ${activeField === 'systemMessage' ? 'text-lt-brightBlue' : ''}`}>
                System Message & Number
              </label>
              <textarea 
                id="systemMessage" 
                className="form-input min-h-32" 
                placeholder="Enter system message and number" 
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                onFocus={() => handleFocus('systemMessage')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'systemMessage' ? 'w-full' : 'w-0'}`}></div>
            </div>

            <div className="mb-8 relative">
              <label htmlFor="attachment" className={`form-label block mb-2 ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button hover:bg-gray-200 transition-colors flex items-center">
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
                <span className="file-name">{fileName || "No File Chosen"}</span>
              </div>
            </div>

            <motion.div 
              className="flex justify-center mt-10"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
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
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;
