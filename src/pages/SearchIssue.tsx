import React, { useState } from 'react';
import { ArrowLeft, Search, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SearchIssue: React.FC = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState('');
  const [year, setYear] = useState('');
  const [psNumber, setPsNumber] = useState('');

  const [searchAreas, setSearchAreas] = useState({
    subject: true,
    transaction: true,
    inputData: true,
    systemError: true,
    responseThread: true,
    issueNumber: true,
  });

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!problemDescription.trim()) {
      toast.error('Please fill in the required Problem Description field.');
      return;
    }

    try {
      const response = await fetch('https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-5000.app.github.dev/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          problemDescription,
          year,
          psNumber,
          searchAreas,
        })
      });

      const result = await response.json();
      console.log('Search results:', result);
      toast.success('Search completed successfully!');
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    }
  };

  const handleCheckboxChange = (field: keyof typeof searchAreas) => {
    setSearchAreas((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      toast.info(`File "${e.target.files[0].name}" selected.`);
    }
  };

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
              initial={{ width: '0%', x: '-50%' }}
              animate={{ width: '60%', x: '-50%' }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </h2>
        </motion.div>

        <motion.div 
          className="form-container w-full p-8 relative bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/index')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-6 h-6 mr-1" /> Back to Helpdesk
          </button>

          <form onSubmit={handleSearchSubmit} className="pt-12 space-y-6">
            <div>
              <label htmlFor="problemDescription" className="block mb-1 text-lt-darkBlue">
                Problem Description <span className="text-red-500">*</span>
              </label>
              <input
                id="problemDescription"
                type="text"
                required
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                onFocus={() => setActiveField('problemDescription')}
                onBlur={() => setActiveField(null)}
                className="form-input w-full"
                placeholder="Enter problem description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block mb-1 text-lt-darkBlue">Year</label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  onFocus={() => setActiveField('year')}
                  onBlur={() => setActiveField(null)}
                  className="form-input w-full"
                >
                  <option value="">Select Year</option>
                  {[2025, 2024, 2023, 2022, 2021].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="psNumber" className="block mb-1 text-lt-darkBlue">PS Number</label>
                <input
                  id="psNumber"
                  type="text"
                  value={psNumber}
                  onChange={(e) => setPsNumber(e.target.value)}
                  onFocus={() => setActiveField('psNumber')}
                  onBlur={() => setActiveField(null)}
                  className="form-input w-full"
                  placeholder="Enter PS Number"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lt-darkBlue text-xl mb-2">Areas to Search</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.keys(searchAreas).map((key) => (
                  <label key={key} className="flex items-center text-lt-darkBlue">
                    <input
                      type="checkbox"
                      className="mr-2 accent-lt-brightBlue"
                      checked={searchAreas[key as keyof typeof searchAreas]}
                      onChange={() => handleCheckboxChange(key as keyof typeof searchAreas)}
                    />
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="attachment" className="block mb-1 text-lt-darkBlue">Attachment</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded flex items-center">
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                  <input type="file" id="attachment" className="hidden" onChange={handleFileChange} />
                </label>
                <span>{fileName || 'No File Chosen'}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button type="submit" className="bg-lt-brightBlue text-white px-6 py-2 rounded shadow hover:bg-blue-600 flex items-center">
                <Search className="w-5 h-5 mr-2" /> Search
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchIssue;
