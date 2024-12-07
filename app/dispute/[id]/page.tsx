'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Correct imports
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface Dispute {
  id: number;
  created_at: string;
  updated_at: string;
  to_wallet: string;
  proof_title: string;
  transactionId: number;
  verdict: boolean;
  proof_content: string;
  dispute_count: string;
}

const DisputeDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const searchParams = useSearchParams(); // Get the query parameters
  const id = searchParams.get('id'); // Extract 'id' from query params

  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchDispute = async () => {
        try {
          const response = await fetch(`https://automatic-gavrielle-dhrupad-c45bfb75.koyeb.app/disputes/get-dispute/${id}`);
          const responseWait = await response.json();
          const data = responseWait.data[0];

          if (response.ok) {
            setDispute(data);
            console.log(data)
          } else {
            console.error('Error fetching dispute:', data);
          }
        } catch (error) {
          console.error('Error fetching dispute data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDispute();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading dispute data...</p>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Dispute not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Card>
        <CardContent>
          <h1 className="text-2xl font-semibold mb-4">{dispute.proof_title}</h1>
          <p className="text-gray-600 mb-4">{dispute.proof_content}</p>
          <div className="mb-4">
            <strong>Wallet Address:</strong> {dispute.to_wallet}
          </div>
          <div className="mb-4">
            <strong>Transaction Amount:</strong> {dispute.dispute_count} ETH
          </div>
          <div className="mb-4">
            <strong>Transaction ID:</strong> {dispute.transactionId}
          </div>
          <div className="flex justify-between items-center">
            <Badge className={dispute.verdict ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {dispute.verdict ? 'Resolved' : 'Active'}
            </Badge>
            <span className="text-sm text-gray-500">
              {dispute.created_at}
            </span>
          </div>
          <Button onClick={() => router.push('/dao')} className="mt-4">Back to Disputes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeDetailPage;
