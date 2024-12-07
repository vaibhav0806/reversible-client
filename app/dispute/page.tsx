'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter, useParams } from 'next/navigation';

interface DisputeData {
  status: 'active' | 'closed';
  title: string;
  walletAddress: string;
  claimContent: string;
  startDate: Date;
  endDate: Date;
  transactionAmount: number;
  voting: {
    yes: number;
    no: number;
  };
}

const DisputePage: React.FC = () => {
  const [dispute, setDispute] = useState<DisputeData | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Retrieve dispute data from localStorage
    const storedDispute = localStorage.getItem('currentDispute');
    
    if (storedDispute) {
      const parsedDispute = JSON.parse(storedDispute);
      // Convert date strings back to Date objects
      parsedDispute.startDate = new Date(parsedDispute.startDate);
      parsedDispute.endDate = new Date(parsedDispute.endDate);
      
      setDispute(parsedDispute);
    } else {
      // If no dispute data in localStorage, redirect back to disputes page
      router.push('/disputes');
    }

    // Clean up localStorage after retrieving the data
    return () => {
      localStorage.removeItem('currentDispute');
    };
  }, [router]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isVotingClosed = useMemo(() => {
    return dispute ? new Date() > dispute.endDate : false;
  }, [dispute]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (!dispute) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-4">
          <Badge 
            variant={dispute.status === 'active' ? 'default' : 'secondary'}
            className="text-sm capitalize"
          >
            {dispute.status}
          </Badge>

          <h1 className="text-2xl font-bold text-gray-900">
            {dispute.title}
          </h1>

          <p className="text-sm text-gray-600">
            Raised by: {formatWalletAddress(dispute.walletAddress)}
          </p>

          <p className="text-gray-700 mt-4">
            {dispute.claimContent}
          </p>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {/* Dispute Details Box */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span>{formatDate(dispute.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <span>{formatDate(dispute.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Amount:</span>
                  <span>${dispute.transactionAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {isVotingClosed && (
            <Card>
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Yes Votes</span>
                      <span>{dispute.voting.yes}</span>
                    </div>
                    <Progress value={(dispute.voting.yes / (dispute.voting.yes + dispute.voting.no)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>No Votes</span>
                      <span>{dispute.voting.no}</span>
                    </div>
                    <Progress value={(dispute.voting.no / (dispute.voting.yes + dispute.voting.no)) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputePage;