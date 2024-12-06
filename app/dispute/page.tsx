'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  const [dispute, setDispute] = useState<DisputeData>({
    status: new Date() <= new Date('2024-08-15') ? 'active' : 'closed',
    title: 'Unauthorized Transaction Dispute',
    walletAddress: '0x1234567890abcdef1234567890abcdef',
    claimContent: 'I noticed an unauthorized transaction on my account on July 15th. The transaction was for $500 and I did not authorize this purchase.',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-08-15'),
    transactionAmount: 500,
    voting: {
      yes: 65,
      no: 35
    }
  });

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isVotingClosed = useMemo(() => {
    return new Date() > dispute.endDate;
  }, [dispute.endDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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