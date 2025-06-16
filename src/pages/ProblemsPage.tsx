// src/pages/ProblemsPage.tsx

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '../components/Header';

interface Problem {
  id: number;
  description: string;  // instead of name
  psNumber: string;
  status: string;
  priority: string;
  assigned_to: string;  // instead of assignedTo
  created_at: string;
}


const ProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://sg9w2ksj-5000.inc1.devtunnels.ms/api/problems');

        if (!response.ok) throw new Error('Failed to fetch problems');
        const data = await response.json();
        setProblems(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-lt-offWhite p-8">
      <Header title="Problems Dashboard" />

      {loading && (
        <p className="text-gray-600 mt-4 text-center text-lg">🔄 Loading problems...</p>
      )}

      {error && (
        <p className="text-red-600 mt-4 text-center text-lg">❌ {error}</p>
      )}

      {!loading && !error && problems.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No problems found.</p>
      )}

      {!loading && !error && problems.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>PS Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>{problem.description}</TableCell>
                  <TableCell>{problem.psNumber}</TableCell>
                  <TableCell>{problem.status}</TableCell>
                  <TableCell>{problem.priority}</TableCell>
                  <TableCell>{problem.assigned_to}</TableCell>
                  <TableCell>{formatDate(problem.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
