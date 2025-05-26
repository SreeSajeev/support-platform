
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
const issueCategories = ["Critical", "High", "Medium", "Low"];
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
                {/* Static Fields (Always Visible) */}
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
                
                {/* TR Applicability Toggle */}
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
              
              {/* Conditional Fields (Only Visible when TR Applicable is selected) */}
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
