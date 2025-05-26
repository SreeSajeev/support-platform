
import React, { useState } from 'react';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReportProblem: React.FC = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Form states
  const [problemDescription, setProblemDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!problemDescription) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }
    
    toast.success('Your problem has been reported successfully!');
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
                  <option value="option1">IT Infrastructure</option>
                  <option value="option2">Software</option>
                  <option value="option3">Hardware</option>
                  <option value="option4">Network</option>
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
            
            <div className="flex justify-center mt-8">
              <button 
                type="submit" 
                className="lt-button-primary btn-ripple max-w-[180px] w-full flex items-center justify-center"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Send to IT Helpdesk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;
