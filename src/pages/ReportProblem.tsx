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
  const [problemDescription, setProblemDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  
  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemDescription) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }
    
    toast.success('Your problem has been reported successfully!');
    // Here would be the submission logic
  };
  */
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!problemDescription) {
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
        problemDescription,
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
              <label htmlFor="problemDescription" className={`form-label block mb-2 ${activeField === 'problemDescription' ? 'text-lt-brightBlue' : ''}`}>
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
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Network">Network</option>
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

