
import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Upload } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const UserIdRequest: React.FC = () => {
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  
  // Access Type checkboxes
  const [accessTypes, setAccessTypes] = useState({
    emailTeams: false,
    sapIdAuthorization: false,
    vpnId: false,
    internetAccess: false,
    stockitPortal: false,
    powerBi: false,
    omniDocs: false,
    omniFlow: false,
    kmPortal: false
  });
  
  // Form fields
  const [otherApplication, setOtherApplication] = useState('');
  const [username, setUsername] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [emailId, setEmailId] = useState('');
  const [department, setDepartment] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [reportingTo, setReportingTo] = useState('');
  const [authorizationDetails, setAuthorizationDetails] = useState('');

  const handleAccessTypeChange = (type: keyof typeof accessTypes) => {
    setAccessTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !employeeNumber || !emailId) {
      toast.error('Please fill in the required fields: Username, Employee ID, and Email ID.');
      return;
    }
    
    // Check if at least one access type is selected
    const hasAccessType = Object.values(accessTypes).some(value => value) || otherApplication;
    if (!hasAccessType) {
      toast.error('Please select at least one access type or specify other application.');
      return;
    }

    try {
      const response = await fetch('https://reimagined-space-eureka-q7qrj6xwwx6qcxpjr-5000.app.github.dev/api/user-id-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessTypes,
          otherApplication,
          username,
          employeeNumber,
          designation,
          emailId,
          department,
          mobileNumber,
          location,
          reportingTo,
          authorizationDetails,
        }),
      });

      if (response.ok) {
        toast.success('Your User ID request has been submitted successfully!');
        // Reset form
        setAccessTypes({
          emailTeams: false,
          sapIdAuthorization: false,
          vpnId: false,
          internetAccess: false,
          stockitPortal: false,
          powerBi: false,
          omniDocs: false,
          omniFlow: false,
          kmPortal: false
        });
        setOtherApplication('');
        setUsername('');
        setEmployeeNumber('');
        setDesignation('');
        setEmailId('');
        setDepartment('');
        setMobileNumber('');
        setLocation('');
        setReportingTo('');
        setAuthorizationDetails('');
        setFileName('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to submit User ID request.');
      }
    } catch (err) {
      toast.error('Something went wrong.');
      console.error('❌ Error submitting User ID request:', err);
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
          <h2 className="text-[30pt] font-light text-lt-darkBlue">User ID Creation & Authorization Request</h2>
        </div>
        
        <div className="form-container w-full p-8 relative hover-card">
          <button 
            onClick={() => navigate('/')}
            className="back-button absolute top-6 left-6"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="ml-1 text-sm font-medium">Back to Helpdesk</span>
          </button>
          
          <form onSubmit={handleSubmit} className="pt-12">
            {/* Access Types Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-lt-darkBlue mb-4 border-b border-lt-darkBlue pb-2">
                Access Types Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.emailTeams}
                    onChange={() => handleAccessTypeChange('emailTeams')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Email & Teams</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.sapIdAuthorization}
                    onChange={() => handleAccessTypeChange('sapIdAuthorization')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">SAP ID & Authorization</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.vpnId}
                    onChange={() => handleAccessTypeChange('vpnId')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">VPN ID</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.internetAccess}
                    onChange={() => handleAccessTypeChange('internetAccess')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Internet Access</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.stockitPortal}
                    onChange={() => handleAccessTypeChange('stockitPortal')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Stockit Portal</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.powerBi}
                    onChange={() => handleAccessTypeChange('powerBi')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Power BI</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.omniDocs}
                    onChange={() => handleAccessTypeChange('omniDocs')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">OmniDocs</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.omniFlow}
                    onChange={() => handleAccessTypeChange('omniFlow')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">OmniFlow</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessTypes.kmPortal}
                    onChange={() => handleAccessTypeChange('kmPortal')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">KM Portal</span>
                </label>
              </div>
              
              <div className="mt-4 relative">
                <label htmlFor="otherApplication" className={`form-label block mb-2 ${activeField === 'otherApplication' ? 'text-lt-brightBlue' : ''}`}>
                  Other Application
                </label>
                <input 
                  type="text" 
                  id="otherApplication" 
                  className="form-input" 
                  placeholder="Specify other application if needed" 
                  value={otherApplication}
                  onChange={(e) => setOtherApplication(e.target.value)}
                  onFocus={() => handleFocus('otherApplication')}
                  onBlur={handleBlur}
                />
                <div className={`input-focus-indicator ${activeField === 'otherApplication' ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>

            {/* User Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-lt-darkBlue mb-4 border-b border-lt-darkBlue pb-2">
                User Information <span className="text-sm font-normal">(To be filled by User)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="username" className={`form-label block mb-2 ${activeField === 'username' ? 'text-lt-brightBlue' : ''}`}>
                    Username <span className="required-indicator">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="username" 
                    className="form-input" 
                    placeholder="Enter username" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => handleFocus('username')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'username' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="employeeNumber" className={`form-label block mb-2 ${activeField === 'employeeNumber' ? 'text-lt-brightBlue' : ''}`}>
                    Employee ID / EX Number <span className="required-indicator">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="employeeNumber" 
                    className="form-input" 
                    placeholder="Enter employee ID" 
                    required
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    onFocus={() => handleFocus('employeeNumber')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'employeeNumber' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="designation" className={`form-label block mb-2 ${activeField === 'designation' ? 'text-lt-brightBlue' : ''}`}>
                    Grade / Designation
                  </label>
                  <input 
                    type="text" 
                    id="designation" 
                    className="form-input" 
                    placeholder="Enter designation" 
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    onFocus={() => handleFocus('designation')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'designation' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="emailId" className={`form-label block mb-2 ${activeField === 'emailId' ? 'text-lt-brightBlue' : ''}`}>
                    Email ID <span className="required-indicator">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="emailId" 
                    className="form-input" 
                    placeholder="Enter email address" 
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    onFocus={() => handleFocus('emailId')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'emailId' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="department" className={`form-label block mb-2 ${activeField === 'department' ? 'text-lt-brightBlue' : ''}`}>
                    Department
                  </label>
                  <input 
                    type="text" 
                    id="department" 
                    className="form-input" 
                    placeholder="Enter department" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    onFocus={() => handleFocus('department')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'department' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="mobileNumber" className={`form-label block mb-2 ${activeField === 'mobileNumber' ? 'text-lt-brightBlue' : ''}`}>
                    Mobile / Extn No
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
                </div>

                <div className="relative">
                  <label htmlFor="location" className={`form-label block mb-2 ${activeField === 'location' ? 'text-lt-brightBlue' : ''}`}>
                    Location
                  </label>
                  <input 
                    type="text" 
                    id="location" 
                    className="form-input" 
                    placeholder="Enter location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => handleFocus('location')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'location' ? 'w-full' : 'w-0'}`}></div>
                </div>

                <div className="relative">
                  <label htmlFor="reportingTo" className={`form-label block mb-2 ${activeField === 'reportingTo' ? 'text-lt-brightBlue' : ''}`}>
                    Reporting to
                  </label>
                  <input 
                    type="text" 
                    id="reportingTo" 
                    className="form-input" 
                    placeholder="Enter reporting manager" 
                    value={reportingTo}
                    onChange={(e) => setReportingTo(e.target.value)}
                    onFocus={() => handleFocus('reportingTo')}
                    onBlur={handleBlur}
                  />
                  <div className={`input-focus-indicator ${activeField === 'reportingTo' ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
            </div>

            {/* Authorization Details */}
            <div className="mb-6 relative">
              <label htmlFor="authorizationDetails" className={`form-label block mb-2 ${activeField === 'authorizationDetails' ? 'text-lt-brightBlue' : ''}`}>
                Details of Authorization / Role of Employee:
              </label>
              <textarea 
                id="authorizationDetails" 
                className="form-input min-h-32" 
                placeholder="Enter authorization details and role of employee" 
                value={authorizationDetails}
                onChange={(e) => setAuthorizationDetails(e.target.value)}
                onFocus={() => handleFocus('authorizationDetails')}
                onBlur={handleBlur}
              />
              <div className={`input-focus-indicator ${activeField === 'authorizationDetails' ? 'w-full' : 'w-0'}`}></div>
            </div>

            {/* File Upload */}
            <div className="mb-8 relative">
              <label htmlFor="attachment" className={`form-label block mb-2 ${activeField === 'attachment' ? 'text-lt-brightBlue' : ''}`}>
                Supporting Documents
              </label>
              <div className="flex gap-3 items-center">
                <div className="file-input-wrapper">
                  <label className="file-input-button hover:bg-gray-200 transition-colors">
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
                className="lt-button-primary min-w-[180px] w-full max-w-xs flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Submit User ID Request
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserIdRequest;