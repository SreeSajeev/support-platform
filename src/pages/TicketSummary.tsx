{/*}
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Mock data for dropdowns
const issueTypes = ["Clarification", "Create Specification", "Other"];
const issueCategories = ["Software", "Hardware", "Infrastructure", "Application"];
const ownersList = ["Alice", "Bob", "Charlie", "David", "Emma"];
const reviewersList = ["Frank", "Grace", "Hannah", "Isaac", "Jane"];

// Mock rows data for the grid
const ticketData = [
  { id: 1, issueId: "ITSK-2023-001", title: "Windows Login Error" },
  { id: 2, issueId: "ITSK-2023-002", title: "Network Connectivity Issue" },
  { id: 3, issueId: "ITSK-2023-003", title: "Software Installation Request" },
  { id: 4, issueId: "ITSK-2023-004", title: "Hardware Replacement" },
  { id: 5, issueId: "ITSK-2023-005", title: "VPN Access Problem" },
];

const TicketSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTickets, setSelectedTickets] = useState<Record<number, boolean>>({});
  const ticketId = location.state?.ticketId;

  // Static form fields
  const [issueType, setIssueType] = useState<string>("");
  const [issueCategory, setIssueCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("Ask transport request");
  const [trApplicability, setTrApplicability] = useState<string>("Not Applicable");
  const [owner, setOwner] = useState<string>("");
  const [reviewer, setReviewer] = useState<string>("");

  // Conditional TR fields
  const [developConfigure, setDevelopConfigure] = useState<string>("");
  const [unitTest, setUnitTest] = useState<string>("");
  const [implementOAS, setImplementOAS] = useState<string>("");
  const [qualityTest, setQualityTest] = useState<string>("");
  const [implementPRD, setImplementPRD] = useState<string>("");

  React.useEffect(() => {
    // Pre-select ticket if ID was passed
    if (ticketId) {
      setSelectedTickets({ [ticketId]: true });
    }
  }, [ticketId]);

  const handleTicketSelection = (id: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Check if any ticket is selected
      const hasSelection = Object.values(selectedTickets).some(value => value);
      
      if (hasSelection) {
        toast.success("Analysis initiated for selected tickets");
        navigate('/ticket-details');
      } else {
        toast.error("Please select at least one ticket to analyse");
      }
    }, 1200);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const trFieldVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginBottom: "1.5rem",
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      height: 0,
      marginBottom: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="TICKET SUMMARY" />
      
      <motion.div 
        className="container mx-auto px-4 py-8 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost"
            onClick={() => navigate('/it-helpdesk-view')}
            className="back-button text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Helpdesk View</span>
          </Button>
        </div>
        
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h2 className="text-[30pt] font-light text-lt-darkBlue relative inline-block">
            Ticket Details Analysis
            <motion.span
              className="absolute -bottom-2 left-1/2 h-1 bg-lt-brightBlue rounded-full"
              initial={{ width: "0%", x: "-50%" }}
              animate={{ width: "60%", x: "-50%" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </h2>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium text-lt-darkBlue">Issue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="form-group">
                  <label htmlFor="issueType" className="block text-lt-darkBlue font-medium mb-2">Issue Type</label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="issueCategory" className="block text-lt-darkBlue font-medium mb-2">Issue Category</label>
                  <Select value={issueCategory} onValueChange={setIssueCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="searchTerm" className="block text-lt-darkBlue font-medium mb-2">Issue Search Term</label>
                  <Input 
                    type="text" 
                    id="searchTerm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full" 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="owner" className="block text-lt-darkBlue font-medium mb-2">Owner</label>
                  <Select value={owner} onValueChange={setOwner}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownersList.map((own) => (
                        <SelectItem key={own} value={own}>{own}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="reviewer" className="block text-lt-darkBlue font-medium mb-2">Reviewer</label>
                  <Select value={reviewer} onValueChange={setReviewer}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {reviewersList.map((rev) => (
                        <SelectItem key={rev} value={rev}>{rev}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                
                <div className="form-group col-span-1">
                  <label className="block text-lt-darkBlue font-medium mb-2">TR Applicability</label>
                  <ToggleGroup 
                    type="single" 
                    value={trApplicability} 
                    onValueChange={(value) => {
                      if (value) setTrApplicability(value);
                    }}
                    className="border rounded-md"
                  >
                    <ToggleGroupItem 
                      value="TR Applicable"
                      className={`flex-1 px-4 py-2 ${trApplicability === "TR Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}
                    >
                      TR Applicable
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="Not Applicable"
                      className={`flex-1 px-4 py-2 ${trApplicability === "Not Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}
                    >
                      Not Applicable
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              
            
              <AnimatePresence>
                {trApplicability === "TR Applicable" && (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="mt-6 border-t pt-6"
                  >
                    <h3 className="text-lg font-medium text-lt-darkBlue mb-4">TR-Specific Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div 
                        className="form-group"
                        variants={trFieldVariants}
                      >
                        <label htmlFor="developConfigure" className="block text-lt-darkBlue font-medium mb-2">Develop / Configure</label>
                        <Input 
                          type="text" 
                          id="developConfigure"
                          value={developConfigure}
                          onChange={(e) => setDevelopConfigure(e.target.value)}
                          className="w-full" 
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="form-group"
                        variants={trFieldVariants}
                      >
                        <label htmlFor="unitTest" className="block text-lt-darkBlue font-medium mb-2">Unit Test</label>
                        <Input 
                          type="text" 
                          id="unitTest"
                          value={unitTest}
                          onChange={(e) => setUnitTest(e.target.value)}
                          className="w-full" 
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="form-group"
                        variants={trFieldVariants}
                      >
                        <label htmlFor="implementOAS" className="block text-lt-darkBlue font-medium mb-2">Implement in OAS</label>
                        <Input 
                          type="text" 
                          id="implementOAS"
                          value={implementOAS}
                          onChange={(e) => setImplementOAS(e.target.value)}
                          className="w-full" 
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="form-group"
                        variants={trFieldVariants}
                      >
                        <label htmlFor="qualityTest" className="block text-lt-darkBlue font-medium mb-2">Quality Test</label>
                        <Input 
                          type="text" 
                          id="qualityTest"
                          value={qualityTest}
                          onChange={(e) => setQualityTest(e.target.value)}
                          className="w-full" 
                        />
                      </motion.div>
                      
                      <motion.div 
                        className="form-group"
                        variants={trFieldVariants}
                      >
                        <label htmlFor="implementPRD" className="block text-lt-darkBlue font-medium mb-2">Implement in PRD</label>
                        <Input 
                          type="text" 
                          id="implementPRD"
                          value={implementPRD}
                          onChange={(e) => setImplementPRD(e.target.value)}
                          className="w-full" 
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium text-lt-darkBlue">Selected Tickets</CardTitle>
              <p className="text-lt-grey text-sm">Select the tickets you want to analyse</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Select</TableHead>
                      <TableHead>Issue ID</TableHead>
                      <TableHead>Title</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketData.map((ticket) => (
                      <TableRow 
                        key={ticket.id} 
                        className="hover:bg-lt-offWhite/50 cursor-pointer"
                        onClick={() => handleTicketSelection(ticket.id)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={selectedTickets[ticket.id] || false}
                              onCheckedChange={() => handleTicketSelection(ticket.id)}
                              className="data-[state=checked]:bg-lt-brightBlue data-[state=checked]:border-lt-brightBlue"
                            />
                            {selectedTickets[ticket.id] && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{ticket.issueId}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          variants={itemVariants}
        >
          <Button 
            onClick={handleSubmit}
            className="bg-lt-primary hover:bg-lt-primary/90 text-white font-medium py-2 px-6 rounded-md min-w-[180px] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Processing..." : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;
{/*}
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const issueTypes = ["Change", "Clarification", "Issue"];
const issueCategories = ["Infrastructure", "Application"];

// Mock reviewers list
const reviewersList = ["Reviewer 1", "Reviewer 2", "Reviewer 3"];

const TicketSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract oldProblemData from location.state
  const oldProblemData = location.state?.oldProblemData || {};

  // ownersList is dynamic based on oldProblemData.requestedBy
  // requestedBy might be a string or array, handle both
  const [ownersList, setOwnersList] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // Static form fields with default values from oldProblemData
  const [issueType, setIssueType] = useState<string>(oldProblemData.issueType || "");
  const [issueCategory, setIssueCategory] = useState<string>(oldProblemData.issueCategory || "");
  const [searchTerm, setSearchTerm] = useState<string>(""); // empty so IT team can input
  const [requestedBy, setRequestedBy] = useState<string>(oldProblemData.requestedBy || "");

  const [reviewer, setReviewer] = useState<string>("");
  const [trApplicability, setTrApplicability] = useState<string>("Not Applicable");

  // TR-specific conditional fields remain unchanged
  const [developConfigure, setDevelopConfigure] = useState<string>("");
  const [unitTest, setUnitTest] = useState<string>("");
  const [implementOAS, setImplementOAS] = useState<string>("");
  const [qualityTest, setQualityTest] = useState<string>("");
  const [implementPRD, setImplementPRD] = useState<string>("");

  useEffect(() => {
    // On mount or oldProblemData change, set ownersList dynamically
    if (oldProblemData.requestedBy) {
      if (Array.isArray(oldProblemData.requestedBy)) {
        setOwnersList(oldProblemData.requestedBy);
      } else if (typeof oldProblemData.requestedBy === "string") {
        // If string, put it in array to populate the Select dropdown
        setOwnersList([oldProblemData.requestedBy]);
      } else {
        // fallback empty
        setOwnersList([]);
      }
    } else {
      setOwnersList([]);
    }

    // Also reset form fields from oldProblemData
    setIssueType(oldProblemData.issueType || "");
    setIssueCategory(oldProblemData.issueCategory || "");
    setRequestedBy(oldProblemData.requestedBy || "");
  }, [oldProblemData]);

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Form submitted successfully");
      // Navigate or submit form logic here
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="TICKET SUMMARY" />

      <div className="container mx-auto px-4 py-8 flex-grow">

       
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/it-helpdesk-view')}
            className="back-button text-lt-darkBlue hover:text-lt-brightBlue transition-colors flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Helpdesk View</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[30pt] font-light text-lt-darkBlue relative inline-block">
            Ticket Details Analysis
            <span
              className="absolute -bottom-2 left-1/2 h-1 bg-lt-brightBlue rounded-full"
              style={{ width: "60%", transform: "translateX(-50%)" }}
            />
          </h2>
        </div>

        <Card className="shadow-md mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-lt-darkBlue">Issue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             
              <div className="form-group">
                <label htmlFor="issueType" className="block text-lt-darkBlue font-medium mb-2">Issue Type</label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

           
              <div className="form-group">
                <label htmlFor="issueCategory" className="block text-lt-darkBlue font-medium mb-2">Issue Category</label>
                <Select value={issueCategory} onValueChange={setIssueCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              
              <div className="form-group">
                <label htmlFor="searchTerm" className="block text-lt-darkBlue font-medium mb-2">Issue Search Term</label>
                <Input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

             
              <div className="form-group">
                <label htmlFor="requestedBy" className="block text-lt-darkBlue font-medium mb-2">Requested By</label>
                <Select value={requestedBy} onValueChange={setRequestedBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select requester" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownersList.length > 0 ? (
                      ownersList.map((own) => (
                        <SelectItem key={own} value={own}>{own}</SelectItem>
                      ))
                    ) : (
                      <SelectItem key="none" value="">No requesters found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

            
              <div className="form-group">
                <label htmlFor="reviewer" className="block text-lt-darkBlue font-medium mb-2">Reviewer</label>
                <Select value={reviewer} onValueChange={setReviewer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewersList.map((rev) => (
                      <SelectItem key={rev} value={rev}>{rev}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

             
              <div className="form-group col-span-1">
                <label className="block text-lt-darkBlue font-medium mb-2">TR Applicability</label>
                <ToggleGroup
                  type="single"
                  value={trApplicability}
                  onValueChange={(value) => {
                    if (value) setTrApplicability(value);
                  }}
                  className="border rounded-md"
                >
                  <ToggleGroupItem
                    value="TR Applicable"
                    className={`flex-1 px-4 py-2 ${trApplicability === "TR Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}
                  >
                    TR Applicable
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Not Applicable"
                    className={`flex-1 px-4 py-2 ${trApplicability === "Not Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}
                  >
                    Not Applicable
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

          
            {trApplicability === "TR Applicable" && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-lt-darkBlue mb-4">TR-Specific Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="form-group">
                    <label htmlFor="developConfigure" className="block text-lt-darkBlue font-medium mb-2">Develop / Configure</label>
                    <Input
                      type="text"
                      id="developConfigure"
                      value={developConfigure}
                      onChange={(e) => setDevelopConfigure(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="unitTest" className="block text-lt-darkBlue font-medium mb-2">Unit Test</label>
                    <Input
                      type="text"
                      id="unitTest"
                      value={unitTest}
                      onChange={(e) => setUnitTest(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="implementOAS" className="block text-lt-darkBlue font-medium mb-2">Implement in OAS</label>
                    <Input
                      type="text"
                      id="implementOAS"
                      value={implementOAS}
                      onChange={(e) => setImplementOAS(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="qualityTest" className="block text-lt-darkBlue font-medium mb-2">Quality Test</label>
                    <Input
                      type="text"
                      id="qualityTest"
                      value={qualityTest}
                      onChange={(e) => setQualityTest(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="implementPRD" className="block text-lt-darkBlue font-medium mb-2">Implement in PRD</label>
                    <Input
                      type="text"
                      id="implementPRD"
                      value={implementPRD}
                      onChange={(e) => setImplementPRD(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-lt-primary hover:bg-lt-primary/90 text-white font-medium py-2 px-6 rounded-md min-w-[180px] flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Processing..." : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;


////latest working code 


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const reviewersList = ["Frank", "Grace", "Hannah", "Isaac", "Jane"];

const TicketSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure from location.state
  const {
    ticketId,
    requestedBy = "",
    date = "",
    status = "",
    age = "",
    domain = "",
    type = "",
  } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [trApplicability, setTrApplicability] = useState("Not Applicable");

  // Additional fields (empty by default)
  const [searchItem, setSearchItem] = useState("");
  const [transaction, setTransaction] = useState("");
  const [product, setProduct] = useState("");
  const [func, setFunc] = useState("");
  const [plant, setPlant] = useState("");
  const [mobile, setMobile] = useState("");
  const [external, setExternal] = useState("");

  // TR-specific fields
  const [developConfigure, setDevelopConfigure] = useState("");
  const [unitTest, setUnitTest] = useState("");
  const [implementOAS, setImplementOAS] = useState("");
  const [qualityTest, setQualityTest] = useState("");
  const [implementPRD, setImplementPRD] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Ticket summary saved!");
      navigate('/ticket-details', { state: { ticketId } });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="TICKET SUMMARY" />
      <motion.div
        className="container mx-auto px-4 py-8 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/it-helpdesk-view')}
            className="text-lt-darkBlue hover:text-lt-brightBlue flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Helpdesk View
          </Button>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-lt-darkBlue">Ticket Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            //Type (Prefilled & Readonly) 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Type</label>
              <Input value={type} readOnly />
            </div>

            //Domain (Prefilled & Readonly) 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Domain</label>
              <Input value={domain} readOnly />
            </div>

            //Search Term 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Search Term</label>
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            // Requested By 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Requested By</label>
              <Input value={requestedBy} readOnly />
            </div>

            //Reviewer 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Reviewer</label>
              <Select value={reviewer} onValueChange={setReviewer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {reviewersList.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            //TR Applicability 
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">TR Applicability</label>
              <ToggleGroup
                type="single"
                value={trApplicability}
                onValueChange={(val) => val && setTrApplicability(val)}
                className="border rounded-md"
              >
                <ToggleGroupItem value="TR Applicable" className={`${trApplicability === "TR Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}>
                  TR Applicable
                </ToggleGroupItem>
                <ToggleGroupItem value="Not Applicable" className={`${trApplicability === "Not Applicable" ? 'bg-lt-brightBlue text-white' : ''}`}>
                  Not Applicable
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            //Prefilled Fields 
            <div><label className="text-lt-darkBlue font-medium block mb-1">Date</label><Input value={date} readOnly /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Status</label><Input value={status} readOnly /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Age</label><Input value={age} readOnly /></div>

            // Additional Fields 
            
            <div><label className="text-lt-darkBlue font-medium block mb-1">Transaction</label><Input value={transaction} onChange={(e) => setTransaction(e.target.value)} /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Product</label><Input value={product} onChange={(e) => setProduct(e.target.value)} /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Function</label><Input value={func} onChange={(e) => setFunc(e.target.value)} /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Plant</label><Input value={plant} onChange={(e) => setPlant(e.target.value)} /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">Mobile Number</label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
            <div><label className="text-lt-darkBlue font-medium block mb-1">External Number</label><Input value={external} onChange={(e) => setExternal(e.target.value)} /></div>

            // TR Fields - Conditional 
            <AnimatePresence>
              {trApplicability === "TR Applicable" && (
                <>
                  <div><label>Develop / Configure</label><Input value={developConfigure} onChange={(e) => setDevelopConfigure(e.target.value)} /></div>
                  <div><label>Unit Test</label><Input value={unitTest} onChange={(e) => setUnitTest(e.target.value)} /></div>
                  <div><label>Implement in OAS</label><Input value={implementOAS} onChange={(e) => setImplementOAS(e.target.value)} /></div>
                  <div><label>Quality Test</label><Input value={qualityTest} onChange={(e) => setQualityTest(e.target.value)} /></div>
                  <div><label>Implement in PRD</label><Input value={implementPRD} onChange={(e) => setImplementPRD(e.target.value)} /></div>
                </>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-lt-primary hover:bg-lt-primary/90 text-white font-medium py-2 px-6 rounded-md min-w-[180px] flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : <>Next <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;







*/}
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const reviewersList = ["Frank", "Grace", "Hannah", "Isaac", "Jane"];

const TicketSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure from location.state
  const {
    ticketId,
    requestedBy = "",
    date = "",
    status = "",
    age = "",
    domain = "",
    type = "",
  } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [trApplicability, setTrApplicability] = useState("Not Applicable");

  // Additional fields
  const [searchItem, setSearchItem] = useState("");
  const [transaction, setTransaction] = useState("");
  const [product, setProduct] = useState("");
  const [func, setFunc] = useState("");
  const [plant, setPlant] = useState("");
  const [mobile, setMobile] = useState("");
  const [external, setExternal] = useState("");

  // TR-specific fields
  const [developConfigure, setDevelopConfigure] = React.useState(false);
  const [unitTest, setUnitTest] = React.useState(false);
  const [implementOAS, setImplementOAS] = React.useState(false);
  const [qualityTest, setQualityTest] = React.useState(false);
  const [implementPRD, setImplementPRD] = React.useState(false);


  const handleSubmit = async () => {
  if (!searchTerm.trim()) {
    toast.error("Please enter Search Term");
    return;
  }
  if (!reviewer.trim()) {
    toast.error("Please select Reviewer");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      ticketId,
      type,
      domain,
      searchTerm,
      requestedBy,
      reviewer,
      
      searchItem,
      transaction,
      product,
      func,
      plant,
      mobile,
      external,
      trApplicability: trApplicability || "Not Applicable",
      developConfigure: trApplicability === "TR Applicable" ? developConfigure : null,
      unitTest: trApplicability === "TR Applicable" ? unitTest : null,
      implementOAS: trApplicability === "TR Applicable" ? implementOAS : null,
      qualityTest: trApplicability === "TR Applicable" ? qualityTest : null,
      implementPRD: trApplicability === "TR Applicable" ? implementPRD : null,
      date,
      status,
      age,
    };
  console.log("Payload being sent:", payload);

  const response = await fetch('https://sg9w2ksj-5000.inc1.devtunnels.ms/api/ticket-summary/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let errorMessage = "";

    if (contentType.includes("application/json")) {
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || JSON.stringify(errorJson);
      } catch (jsonError) {
        errorMessage = "Failed to parse JSON error response.";
      }
    } else {
      try {
        errorMessage = await response.text();
      } catch (textError) {
        errorMessage = "Failed to read error response text.";
      }
    }

    throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
  }

  toast.success("Ticket summary saved successfully!");
  
  navigate('/ticket-details', {
  state: { ticketId, requestedBy, date, status, age, domain, type, searchTerm, transaction }
});

} catch (error: any) {
  console.error("Submission Error:", error);
  toast.error(error.message || "Error submitting ticket summary");
} finally {
  setLoading(false);
}
};

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="TICKET SUMMARY" />
      <motion.div
        className="container mx-auto px-4 py-8 flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/it-helpdesk-view')}
            className="text-lt-darkBlue hover:text-lt-brightBlue flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Helpdesk View
          </Button>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-lt-darkBlue">Ticket Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Type (Prefilled & Readonly) */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Type</label>
              <Input value={type} readOnly />
            </div>

            {/* Domain (Prefilled & Readonly) */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Domain</label>
              <Input value={domain} readOnly />
            </div>

            {/* Search Term */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Search Term</label>
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Requested By */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Requested By</label>
              <Input value={requestedBy} readOnly />
            </div>

            {/* Reviewer */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">Reviewer</label>
              <Select value={reviewer} onValueChange={setReviewer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {reviewersList.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TR Applicability */}
            <div>
              <label className="text-lt-darkBlue font-medium mb-1 block">TR Applicability</label>
              <ToggleGroup
                type="single"
                value={trApplicability}
                onValueChange={(val) => val && setTrApplicability(val)}
                className="border rounded-md"
              >
                <ToggleGroupItem
                  value="TR Applicable"
                  className={trApplicability === "TR Applicable" ? 'bg-lt-brightBlue text-white' : ''}
                >
                  TR Applicable
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Not Applicable"
                  className={trApplicability === "Not Applicable" ? 'bg-lt-brightBlue text-white' : ''}
                >
                  Not Applicable
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

          
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Date</label>
              <Input value={date} readOnly />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Status</label>
              <Input value={status} readOnly />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Age</label>
              <Input value={age} readOnly />
            </div>

            {/* Additional Fields */}
            
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Transaction</label>
              <Input value={transaction} onChange={(e) => setTransaction(e.target.value)} />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Product</label>
              <Input value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Function</label>
              <Input value={func} onChange={(e) => setFunc(e.target.value)} />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Plant</label>
              <Input value={plant} onChange={(e) => setPlant(e.target.value)} />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">Mobile Number</label>
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div>
              <label className="text-lt-darkBlue font-medium block mb-1">External Number</label>
              <Input value={external} onChange={(e) => setExternal(e.target.value)} />
            </div>

            {/* TR Fields - Conditional */}
            <AnimatePresence>
                {trApplicability === "TR Applicable" && (
                  <>
                    <div>
                      <label className="text-lt-darkBlue font-medium block mb-1">
                        <input
                          type="checkbox"
                          checked={developConfigure}
                          onChange={(e) => setDevelopConfigure(e.target.checked)}
                          className="mr-2"
                        />
                        Develop / Configure
                      </label>
                    </div>
                    <div>
                      <label className="text-lt-darkBlue font-medium block mb-1">
                        <input
                          type="checkbox"
                          checked={unitTest}
                          onChange={(e) => setUnitTest(e.target.checked)}
                          className="mr-2"
                        />
                        Unit Test
                      </label>
                    </div>
                    <div>
                      <label className="text-lt-darkBlue font-medium block mb-1">
                        <input
                          type="checkbox"
                          checked={implementOAS}
                          onChange={(e) => setImplementOAS(e.target.checked)}
                          className="mr-2"
                        />
                        Implement in OAS
                      </label>
                    </div>
                    <div>
                      <label className="text-lt-darkBlue font-medium block mb-1">
                        <input
                          type="checkbox"
                          checked={qualityTest}
                          onChange={(e) => setQualityTest(e.target.checked)}
                          className="mr-2"
                        />
                        Quality Test
                      </label>
                    </div>
                    <div>
                      <label className="text-lt-darkBlue font-medium block mb-1">
                        <input
                          type="checkbox"
                          checked={implementPRD}
                          onChange={(e) => setImplementPRD(e.target.checked)}
                          className="mr-2"
                        />
                        Implement in PRD
                      </label>
                    </div>
                  </>
                )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-lt-primary hover:bg-lt-primary/90 text-white font-medium py-2 px-6 rounded-md min-w-[180px] flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : <>Next <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketSummary;
