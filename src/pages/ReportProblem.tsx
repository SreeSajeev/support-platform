import React, { useState, useEffect } from 'react';
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

  // Active field indicator
  const [activeField, setActiveField] = useState<string | null>(null);

  // Form fields
  const [description, setProblemDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [inputDetails, setInputDetails] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [fileName, setFileName] = useState('');

  // Autofilled user info
  const [reportedBy, setReportedBy] = useState('');
  const [psNumber, setPsNumber] = useState('');
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

    if (!description) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }

    try {
      const response = await fetch(
        'https://sg9w2ksj-5000.inc1.devtunnels.ms/api/report-problem',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description,
            domain,
            inputDetails,
            systemMessage,
            reportedBy,
            psNumber,
            email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success('Problem reported successfully!');
        alert(`Thank you for Submitting a ticket .Your Problem ID is ${data.problemID}`);

        // Reset form
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
      console.error(err);
      toast.error('Something went wrong.');
    }
  };

  const handleFocus = (field: string) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      toast.info(`File "${file.name}" selected.`);
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
            onClick={() => navigate('/index')}
            className="back-button absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1 text-sm font-medium">Back to Helpdesk</span>
          </button>

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
              <label className="form-label block mb-1">PS Number</label>
              <input
                type="text"
                className="form-input bg-gray-100 cursor-not-allowed"
                value={psNumber}
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

            {/* Problem Description */}
            <div className="mb-6 relative">
              <label
                htmlFor="description"
                className={`form-label block mb-2 ${activeField === 'description' ? 'text-lt-brightBlue' : ''}`}
              >
                Problem Description <span className="text-red-500">*</span>
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
            </div>

            {/* Domain */}
            <div className="mb-6 relative">
              <label
                htmlFor="domain"
                className={`form-label block mb-2 ${activeField === 'domain' ? 'text-lt-brightBlue' : ''}`}
              >
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
            </div>

            {/* Input Details */}
            <div className="mb-6 relative">
              <label
                htmlFor="inputDetails"
                className={`form-label block mb-2 ${activeField === 'inputDetails' ? 'text-lt-brightBlue' : ''}`}
              >
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
            </div>

            {/* System Message */}
            <div className="mb-6 relative">
              <label
                htmlFor="systemMessage"
                className={`form-label block mb-2 ${activeField === 'systemMessage' ? 'text-lt-brightBlue' : ''}`}
              >
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
            </div>

            {/* File Upload */}
            <div className="mb-8 relative">
              <label
                htmlFor="attachment"
                className={`form-label block mb-2 ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}
              >
                Attachment
              </label>
              <div className="flex gap-3 items-center">
                <label className="file-input-button flex items-center hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    id="attachment"
                    className="hidden"
                    onChange={handleFileChange}
                    onFocus={() => handleFocus('attachment')}
                    onBlur={handleBlur}
                  />
                </label>
                <span className="file-name">{fileName || 'No File Chosen'}</span>
              </div>
            </div>

            {/* Submit Button */}
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
