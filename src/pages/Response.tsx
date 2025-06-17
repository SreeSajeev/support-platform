{/*
  import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X, Send } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Response: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const [issueNumber, setIssueNumber] = useState<string>("ITSK-2023-001");
  const [status, setStatus] = useState<string>("In Progress");
  const [startDate, setStartDate] = useState<string>("2023-09-15T10:00");
  const [targetDate, setTargetDate] = useState<string>("2023-09-18T18:00");
  const [owner, setOwner] = useState<string>("Alice Johnson");
  const [ccAddress, setCcAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const responseThread = `
[2023-09-15 10:30] John Doe: I'm unable to log into the system. It shows "Invalid credentials" even though I'm sure my password is correct.
[2023-09-15 11:15] Alice Johnson (IT): Hi John, I'll look into this right away. Can you confirm when you last successfully logged in?
[2023-09-15 11:45] John Doe: I was able to log in yesterday afternoon without any issues.
[2023-09-15 14:20] Alice Johnson (IT): I've checked the logs and there seems to be an issue with the authentication server. We're working on a fix.
[2023-09-16 09:10] Alice Johnson (IT): The authentication server has been restarted. Please try logging in now and let me know if you still encounter issues.
  `;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);

    const payload = {
      
      IssueNumber: issueNumber,
      Status: status,
      Owner: owner,
      StartDateTime: new Date(startDate).toISOString(),
      TargetDateTime: new Date(targetDate).toISOString(),

      CCAddress: ccAddress,
      Message: message,
      AttachmentFileName: attachments.map(file => file.name).join(', '),
      CreatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://sg9w2ksj-5000.inc1.devtunnels.ms/api/ticket-responses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      toast.success("Response sent to user successfully");
      navigate('/it-helpdesk-view');
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="RESPONSE" />

      <div className="container mx-auto p-6 flex-grow">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/ticket-details')}
            className="text-lt-grey hover:text-lt-brightBlue flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back to Ticket Details</span>
          </button>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lt-darkBlue">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">Issue Number</label>
                <Input value={issueNumber} readOnly className="w-full" />
              </div>
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">Status</label>
                <Input value={status} onChange={(e) => setStatus(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">Owner</label>
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">Start Date/Time</label>
                <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">Target Date/Time</label>
                <Input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full" />
              </div>
              <div>
                <label className="block font-medium text-lt-darkBlue mb-2">CC Address</label>
                <Input type="email" value={ccAddress} onChange={(e) => setCcAddress(e.target.value)} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lt-darkBlue">Your Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-lt-darkBlue mb-2">Type your Message</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-32" />
                </div>
                <div>
                  <label className="block font-medium text-lt-darkBlue mb-2">Attachment Upload</label>
                  <label className="cursor-pointer inline-flex items-center text-lt-brightBlue">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Upload Files
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                  {attachments.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lt-darkBlue">Issue and Response Thread</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={responseThread} readOnly className="w-full h-64 bg-lt-offWhite/50" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="lt-button-primary flex items-center gap-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Reply to User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
*/}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X, Send } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Response: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [issueNumber, setIssueNumber] = useState("ITSK-2023-001");
  const [status, setStatus] = useState("In Progress");
  const [startDate, setStartDate] = useState("2023-09-15T10:00");
  const [targetDate, setTargetDate] = useState("2023-09-18T18:00");
  const [owner, setOwner] = useState("Alice Johnson");
  const [ccAddress, setCcAddress] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [responseThread, setResponseThread] = useState("");

  const fetchThread = async () => {
    try {
      const res = await fetch(`https://sg9w2ksj-5000.inc1.devtunnels.ms/api/ticket-responses/${issueNumber}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch thread");
      const formatted = data.map((entry: any) =>
        `[${new Date(entry.CreatedAt).toLocaleString()}] ${entry.Owner}: ${entry.Message}`
      ).join("\n");
      setResponseThread(formatted);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [issueNumber]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setLoading(true);

    const payload = {
      IssueNumber: issueNumber,
      Status: status,
      Owner: owner,
      StartDateTime: new Date(startDate).toISOString(),
      TargetDateTime: new Date(targetDate).toISOString(),
      CCAddress: ccAddress,
      Message: message,
      AttachmentFileName: attachments.map(f => f.name).join(', '),
      CreatedAt: new Date().toISOString()
    };

    try {
      const res = await fetch("https://sg9w2ksj-5000.inc1.devtunnels.ms/api/ticket-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      toast.success("Response sent successfully");
      setMessage("");
      setAttachments([]);
      await fetchThread();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-lt-offWhite">
      <Header title="RESPONSE" />
      <div className="container mx-auto p-6 flex-grow">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/ticket-details')} className="text-lt-grey hover:text-lt-brightBlue flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" /> Back to Ticket Details
          </button>
        </div>

        <div className="grid gap-6">
          {/* Ticket Info */}
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lt-darkBlue">Ticket Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input readOnly value={issueNumber} placeholder="Issue Number" />
              <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
              <Input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner" />
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              <Input type="email" value={ccAddress} onChange={(e) => setCcAddress(e.target.value)} placeholder="CC Address" />
            </CardContent>
          </Card>

          {/* Message Box */}
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lt-darkBlue">Your Message</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-32" />
              <label className="block mt-4 text-lt-brightBlue cursor-pointer">
                <Paperclip className="inline w-4 h-4 mr-1" /> Upload Files
                <input type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>
              {attachments.map((file, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-100 p-2 mt-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeAttachment(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Response Thread */}
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-lt-darkBlue">Issue and Response Thread</CardTitle></CardHeader>
            <CardContent>
              <Textarea readOnly value={responseThread} className="w-full h-64 bg-lt-offWhite/50" />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="lt-button-primary flex items-center gap-2" onClick={handleSubmit} disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Reply to User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Response;
