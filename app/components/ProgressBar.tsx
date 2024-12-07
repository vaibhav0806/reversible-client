'use client';

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VotingBarsProps {
  dispute: any
  votingData: {
    yes: number;
    no: number;
  };
}

const VotingBars: React.FC<VotingBarsProps> = ({ dispute, votingData }) => {
  // Function to calculate voting period end date
  const calculateVotingEndDate = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const oneDayLater = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    return oneDayLater.toLocaleString();
  };

  // Function to check if voting period is over
  const isVotingPeriodComplete = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const oneDayLater = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayLater;
  };

  const votingEndDate = calculateVotingEndDate(dispute.created_at);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Voting Status</CardTitle>
        {!isVotingPeriodComplete(dispute.created_at) && (
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">
              Voting Ends: {votingEndDate}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  All votes will be encrypted until the voting period has ended 
                  and the final score has been calculated.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Yes Votes Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Approve</span>
              {isVotingPeriodComplete(dispute.created_at) && (
                <span>{votingData.yes}%</span>
              )}
            </div>
            <Progress
              value={
                isVotingPeriodComplete(dispute.created_at)
                  ? votingData.yes
                  : 0
              }
              className={`h-2 ${
                !isVotingPeriodComplete(dispute.created_at)
                  ? "bg-gray-300"
                  : ""
              }`}
            />
          </div>

          {/* No Votes Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Reject</span>
              {isVotingPeriodComplete(dispute.created_at) && (
                <span>{votingData.no}%</span>
              )}
            </div>
            <Progress
              value={
                isVotingPeriodComplete(dispute.created_at)
                  ? votingData.no
                  : 0
              }
              className={`h-2 ${
                !isVotingPeriodComplete(dispute.created_at)
                  ? "bg-gray-300"
                  : ""
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VotingBars;
