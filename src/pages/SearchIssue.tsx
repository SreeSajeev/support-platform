import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SearchIssue: React.FC = () => {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    Domain: '',
    Type: '',
    RaisedBy: '',
    Status: '',
    Date: '',
    AssignedTo: '',
    Priority: '',
    ResolutionDate: '',
  });

  const [results, setResults] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://sg9w2ksj-5000.inc1.devtunnels.ms/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to fetch tickets.');
        return;
      }

      setResults(data);
      toast.success(`${data.length} ticket(s) found.`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while searching.');
    }
  };

  return (
    <div className="lt-bg min-h-screen w-full flex flex-col items-center bg-lt-offWhite">
      <Header title="Search Issue" />
      <div className="max-w-[1366px] w-full px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[30pt] font-light text-lt-darkBlue">Search Issue</h2>
        </motion.div>

        <motion.div
          className="form-container w-full p-8 relative bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/index')}
            className="absolute top-6 left-6 text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-6 h-6 mr-1" /> Back to Helpdesk
          </button>

          <form onSubmit={handleSearch} className="pt-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(fields).map(([key, val]) => (
                <div key={key}>
                  <label className="block mb-1 text-lt-darkBlue">{key}</label>
                  <input
                    type={key.toLowerCase().includes('date') ? 'date' : 'text'}
                    name={key}
                    value={val}
                    onChange={handleChange}
                    className="form-input w-full"
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-lt-brightBlue text-white px-6 py-2 rounded shadow hover:bg-blue-600 flex items-center"
              >
                <Search className="w-5 h-5 mr-2" /> Search
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-10 bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold text-lt-darkBlue mb-4">Search Results</h3>
              <ul className="divide-y divide-gray-200">
                {results.map((ticket, idx) => (
                  <li key={idx} className="py-2">
                    <p><strong>Domain:</strong> {ticket.Domain}</p>
                    <p><strong>Type:</strong> {ticket.Type}</p>
                    <p><strong>Status:</strong> {ticket.Status}</p>
                    <p><strong>Raised By:</strong> {ticket.RaisedBy}</p>
                    <p><strong>Date:</strong> {new Date(ticket.Date).toLocaleDateString()}</p>
                    <p><strong>Assigned To:</strong> {ticket.AssignedTo}</p>
                    <p><strong>Priority:</strong> {ticket.Priority}</p>
                    <p><strong>Resolution Date:</strong> {ticket.ResolutionDate ? new Date(ticket.ResolutionDate).toLocaleDateString() : 'N/A'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchIssue;
