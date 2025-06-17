
import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const EscalationMatrix: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const escalationData = {
    coimbatorePlant: {
      hardware: {
        level1: { name: "Rajasekar R", mobile: "98429 11945", email: "MP.rajasekar@lntvalves.com" },
        level2: { name: "Sachin PM", mobile: "72595 83461", email: "Ya.sachin@lntvalves.com" },
        level3: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        sla: { hardware: "Response – 2 Hrs*, Troubleshooting – 6 Hrs*, Replacement– 7 to 21 Days" }
      },
      remoteSupport: {
        level1: "Intercom: 5296 & 5284",
        level2: { name: "Kesavan R", mobile: "81100 45803", email: "Kesavan.R@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: { remote: "Response – 2 Hrs*, Resolution – 4 Hrs*" }
      },
      pm: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" }
    },
    kancheepuramPlant: {
      hardware: {
        level1: { name: "Chandramohan T", mobile: "99406 91916", email: "MP.CMohan@lntvalves.com" },
        level2: { name: "Shivaganesh S", mobile: "88709 77736", email: "MP.Shiva@lntvalves.com" },
        level3: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        sla: { hardware: "Response – 2 Hrs*, Troubleshooting – 6 Hrs*, Replacement– 7 to 21 Days" }
      },
      remoteSupport: {
        level1: "Landline: 044 - 27285212",
        level2: { name: "Kesavan R", mobile: "81100 45803", email: "Kesavan.R@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: { remote: "Response – 2 Hrs*, Resolution – 4 Hrs*" }
      },
      pm: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" }
    },
    infrastructure: {
      network: {
        fpr: { name: "Kesavan R", mobile: "81100 45803", email: "Kesavan.R@lntvalves.com" },
        level2: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 4 to 16 Hrs*"
      },
      domain: {
        spr: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" },
        level2: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" }
      },
      antivirus: {
        fpr: { name: "Kesavan R", mobile: "81100 45803", email: "Kesavan.R@lntvalves.com" },
        level2: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 3 to 6 Hrs*"
      },
      vpn: {
        spr: { name: "Elangovan M", mobile: "97915 01194", email: "Elangovan.M@lntvalves.com" },
        level2: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 3 to 6 Hrs*"
      }
    },
    applications: {
      omniDocs: {
        level1: { name: "Kesavan R", mobile: "81100 45803", email: "Kesavan.R@lntvalves.com" },
        level2: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 3 to 6 Hrs*"
      },
      sap: {
        level1: { name: "Prasanthi S", mobile: "04226685264", email: "Prasanthi.S@lntvalves.com" },
        level2: { name: "Palani Kumar KB", mobile: "98844 57769", email: "PalaniK.KB@lntvalves.com" },
        level3: { name: "Natarajan K", mobile: "97903 31856", email: "Natarajan.K@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 4 to 16 Hrs*"
      },
      crm: {
        level1: { name: "Bharathi G", mobile: "97394 33347", email: "Bharathi.G@lntvalves.com" },
        level2: { name: "Ramesh S (AGM-IT)", mobile: "98405 90170", email: "Ramesh.Seran@lntvalves.com" },
        level3: { name: "Ramesh Srinivasan (Head-Comml & IT)", mobile: "90030 18964", email: "Ramesh.S@lntvalves.com" },
        sla: "Response – 2 Hrs*, Resolution – 3 to 6 Hrs*"
      }
    }
  };


  const renderContactCard = (person: any, level: string, description?: string) => (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="font-semibold text-lt-darkBlue mb-1 text-sm">{level}</div>
      {description && <div className="text-xs text-lt-grey mb-1">{description}</div>}
      <div className="space-y-1">
        <div className="font-medium text-sm">{person.name}</div>
        {person.mobile && (
          <div className="flex items-center text-xs">
            <Phone className="w-3 h-3 mr-1 text-lt-grey" />
            <span>{person.mobile}</span>
          </div>
        )}
        {person.email && (
          <div className="flex items-center text-xs">
            <Mail className="w-3 h-3 mr-1 text-lt-grey" />
            <a href={`mailto:${person.email}`} className="text-lt-brightBlue hover:underline">
              {person.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="IT HELPDESK" />
      
      <motion.div 
        className="container mx-auto py-6 px-4 flex-grow"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Button 
            onClick={() => navigate('/index')}
            variant="ghost" 
            className="mb-4 text-lt-darkBlue hover:text-lt-brightBlue"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Helpdesk
          </Button>
        </motion.div>

        <motion.div 
          className="text-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-light text-lt-darkBlue mb-3">IT Escalation Matrix</h1>
          <p className="text-lg text-lt-grey max-w-3xl mx-auto">
            Complete escalation contacts for all IT support areas
          </p>
        </motion.div>

        {/* Plant Support Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          {/* Coimbatore Plant */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-3">Coimbatore Plant - Hardware Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {renderContactCard(escalationData.coimbatorePlant.hardware.level1, "Level 1", "Hardware Troubleshooting")}
                {renderContactCard(escalationData.coimbatorePlant.hardware.level2, "Level 2", "Advanced Support")}
                {renderContactCard(escalationData.coimbatorePlant.hardware.level3, "Level 3", "Management Escalation")}
              </div>
              <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                  <span className="text-xs text-lt-grey">{escalationData.coimbatorePlant.hardware.sla.hardware}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-3">Coimbatore Plant - Remote Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-lt-darkBlue mb-1 text-sm">Level 1</div>
                  <div className="text-xs text-lt-grey mb-1">First Contact</div>
                  <div className="font-medium text-sm">{escalationData.coimbatorePlant.remoteSupport.level1}</div>
                </div>
                {renderContactCard(escalationData.coimbatorePlant.remoteSupport.level2, "Level 2", "Technical Support")}
                {renderContactCard(escalationData.coimbatorePlant.remoteSupport.level3, "Level 3 (Head-IT)", "Final Escalation")}
              </div>
              <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                  <span className="text-xs text-lt-grey">{escalationData.coimbatorePlant.remoteSupport.sla.remote}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kancheepuram Plant */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-3">Kancheepuram Plant - Hardware Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {renderContactCard(escalationData.kancheepuramPlant.hardware.level1, "Level 1", "Hardware Troubleshooting")}
                {renderContactCard(escalationData.kancheepuramPlant.hardware.level2, "Level 2", "Advanced Support")}
                {renderContactCard(escalationData.kancheepuramPlant.hardware.level3, "Level 3", "Management Escalation")}
              </div>
              <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                  <span className="text-xs text-lt-grey">{escalationData.kancheepuramPlant.hardware.sla.hardware}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-3">Kancheepuram Plant - Remote Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-lt-darkBlue mb-1 text-sm">Level 1</div>
                  <div className="text-xs text-lt-grey mb-1">First Contact</div>
                  <div className="font-medium text-sm">{escalationData.kancheepuramPlant.remoteSupport.level1}</div>
                </div>
                {renderContactCard(escalationData.kancheepuramPlant.remoteSupport.level2, "Level 2", "Technical Support")}
                {renderContactCard(escalationData.kancheepuramPlant.remoteSupport.level3, "Level 3 (Head-IT)", "Final Escalation")}
              </div>
              <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                  <span className="text-xs text-lt-grey">{escalationData.kancheepuramPlant.remoteSupport.sla.remote}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Infrastructure & Applications Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
          variants={containerVariants}
        >
          {/* IT Infrastructure */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-4">IT Infrastructure Support</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lt-darkBlue mb-2 text-sm">Network & Email Support</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    {renderContactCard(escalationData.infrastructure.network.fpr, "FPR (Network)", "LAN/WAN/MS365")}
                    {renderContactCard(escalationData.infrastructure.network.level2, "Level 2", "Advanced Network")}
                    {renderContactCard(escalationData.infrastructure.network.level3, "Level 3 (Head-IT)", "Final Escalation")}
                  </div>
                  <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                      <span className="text-xs text-lt-grey">{escalationData.infrastructure.network.sla}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lt-darkBlue mb-2 text-sm">Security & Access</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {renderContactCard(escalationData.infrastructure.antivirus.fpr, "FPR (Antivirus)", "Security")}
                    {renderContactCard(escalationData.infrastructure.vpn.spr, "SPR (VPN)", "VPN Access")}
                    {renderContactCard(escalationData.infrastructure.domain.spr, "SPR (Domain)", "Domain/Files")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* IT Applications */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-lt-darkBlue mb-4">IT Applications Support</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lt-darkBlue mb-2 text-sm">SAP ERP</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    {renderContactCard(escalationData.applications.sap.level1, "Level 1", "User ID & Auth")}
                    {renderContactCard(escalationData.applications.sap.level2, "Level 2", "Advanced SAP")}
                    {renderContactCard(escalationData.applications.sap.level3, "Level 3 (Head-IT)", "Final Escalation")}
                  </div>
                  <div className="bg-lt-lightBlue bg-opacity-20 rounded-lg p-2">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-lt-darkBlue" />
                      <span className="text-xs text-lt-grey">{escalationData.applications.sap.sla}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lt-darkBlue mb-2 text-sm">Document Management & CRM</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {renderContactCard(escalationData.applications.omniDocs.level1, "OmniDocs Support", "Document Mgmt")}
                    {renderContactCard(escalationData.applications.crm.level1, "CRM Support", "Customer Portal")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
      
      <footer className="bg-white py-4 border-t border-lt-lightGrey mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-lt-mutedGrey">
            © 2023 L&T Valves IT Helpdesk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EscalationMatrix;
