// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Correct imports
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { format } from 'date-fns';

// interface Dispute {
//   id: number;
//   created_at: string;
//   updated_at: string;
//   to_wallet: string;
//   proof_title: string;
//   transactionId: number;
//   verdict: boolean;
//   proof_content: string;
//   dispute_count: string;
// }

// const DisputeDetailPage = () => {
//   const router = useRouter();
//   const pathname = usePathname(); // Get the current pathname
//   const searchParams = useSearchParams(); // Get the query parameters
//   const id = searchParams.get('id'); // Extract 'id' from query params

//   const [dispute, setDispute] = useState<Dispute | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       const fetchDispute = async () => {
//         try {
//           const response = await fetch(`https://automatic-gavrielle-dhrupad-c45bfb75.koyeb.app/disputes/get-dispute/${id}`);
//           const responseWait = await response.json();
//           const data = responseWait.data[0];

//           if (response.ok) {
//             setDispute(data);
//             console.log(data)
//           } else {
//             console.error('Error fetching dispute:', data);
//           }
//         } catch (error) {
//           console.error('Error fetching dispute data:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchDispute();
//     }
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-12">
//         <p>Loading dispute data...</p>
//       </div>
//     );
//   }

//   if (!dispute) {
//     return (
//       <div className="container mx-auto px-4 py-12">
//         <p>Dispute not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-5xl">
//       <Card>
//         <CardContent>
//           <h1 className="text-2xl font-semibold mb-4">{dispute.proof_title}</h1>
//           <p className="text-gray-600 mb-4">{dispute.proof_content}</p>
//           <div className="mb-4">
//             <strong>Wallet Address:</strong> {dispute.to_wallet}
//           </div>
//           <div className="mb-4">
//             <strong>Transaction Amount:</strong> {dispute.dispute_count} ETH
//           </div>
//           <div className="mb-4">
//             <strong>Transaction ID:</strong> {dispute.transactionId}
//           </div>
//           <div className="flex justify-between items-center">
//             <Badge className={dispute.verdict ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
//               {dispute.verdict ? 'Resolved' : 'Active'}
//             </Badge>
//             <span className="text-sm text-gray-500">
//               {dispute.created_at}
//             </span>
//           </div>
//           <Button onClick={() => router.push('/dao')} className="mt-4">Back to Disputes</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DisputeDetailPage;

"use client";

import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Interfaces (kept from previous implementation)
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

interface Transaction {
  id: number;
  amount: number;
  fromAddress: string;
  toAddress: string;
  transactionTime: string;
}

interface DisputePageProps {
  isJudge?: boolean;
}

const DisputePage: React.FC<DisputePageProps> = ({ isJudge = true }) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [senderTransactions, setSenderTransactions] = useState<Transaction[]>(
    []
  );
  const [receiverTransactions, setReceiverTransactions] = useState<
    Transaction[]
  >([]);
  const [voteDecision, setVoteDecision] = useState<"approve" | "reject">(
    "approve"
  );
  const [activeTab, setActiveTab] = useState("sender-history");

  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const searchParams = useSearchParams(); // Get the query parameters
  const disputeId = searchParams.get("id"); // Extract 'id' from query params

  // Voting data (mock for now)
  const [votingData, setVotingData] = useState({
    yes: 65,
    no: 35,
  });

  // Function to check if voting period is over
  const isVotingPeriodComplete = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const oneDayLater = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayLater;
  };

  // Similar data fetching logic as before (kept for context)
  useEffect(() => {
    if (disputeId) {
      const fetchDispute = async () => {
        try {
          const response = await fetch(
            `https://automatic-gavrielle-dhrupad-c45bfb75.koyeb.app/disputes/get-dispute/${disputeId}`
          );
          const responseWait = await response.json();
          const data = responseWait.data[0];

          if (response.ok) {
            setDispute(data);
            console.log(data);
          } else {
            console.error("Error fetching dispute:", data);
          }
        } catch (error) {
          console.error("Error fetching dispute data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDispute();
    }
    
  }, [disputeId]);

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const renderTransactionHistory = (transactions: Transaction[]) => {
    return transactions.map((tx) => (
      <Card key={tx.id} className="mb-2">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">
                {formatWalletAddress(tx.fromAddress)} →{" "}
                {formatWalletAddress(tx.toAddress)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(tx.transactionTime).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${tx.amount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const handleSubmitVote = () => {
    // TODO: Implement actual vote submission logic
    console.log(`Voting ${voteDecision} for dispute ${dispute?.id}`);
  };

  if (!dispute) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side - Previous implementation remains the same */}
        <div className="space-y-4">
          <Badge
            variant={
              !isVotingPeriodComplete(dispute.created_at)
                ? "default"
                : "secondary"
            }
            className="text-sm capitalize"
          >
            {!isVotingPeriodComplete(dispute.created_at) ? "Active" : "Closed"}
          </Badge>

          <h1 className="text-2xl font-bold text-gray-900">
            {dispute.proof_title}
          </h1>

          <p className="text-gray-700 mt-4">{dispute.proof_content}</p>
        </div>

        {/* Right Side - Updated with new voting bars */}
        <div className="space-y-4">
          {/* Transaction Details Card - Unchanged */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Previous transaction details content */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>$500</span>
                </div>
                <div className="flex justify-between">
                  <span>From:</span>
                  <span>0x1234...5678</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span>0x8765...4321</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Voting Bars Section */}
          <Card>
            <CardHeader>
              <CardTitle>Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Yes Votes Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Approve</span>
                    {isVotingPeriodComplete(dispute.created_at) && (
                      <span>{votingData.yes}</span>
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
                      <span>{votingData.no}</span>
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

          {/* Judge Vote Button */}
          {isJudge && !isVotingPeriodComplete(dispute.created_at) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Vote on Dispute</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Dispute Resolution</DialogTitle>
                </DialogHeader>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="sender-history">
                      Sender History
                    </TabsTrigger>
                    <TabsTrigger value="receiver-history">
                      Receiver History
                    </TabsTrigger>
                    <TabsTrigger value="vote-selection">Vote</TabsTrigger>
                  </TabsList>

                  {/* Sender Transaction History Tab */}
                  <TabsContent value="sender-history">
                    <div className="max-h-[400px] overflow-y-auto">
                      {renderTransactionHistory(senderTransactions)}
                    </div>
                  </TabsContent>

                  {/* Receiver Transaction History Tab */}
                  <TabsContent value="receiver-history">
                    <div className="max-h-[400px] overflow-y-auto">
                      {renderTransactionHistory(receiverTransactions)}
                    </div>
                  </TabsContent>

                  {/* Vote Selection Tab */}
                  <TabsContent value="vote-selection">
                    <div className="space-y-4">
                      <RadioGroup
                        defaultValue="approve"
                        onValueChange={(value) =>
                          setVoteDecision(value as "approve" | "reject")
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="approve" id="approve" />
                          <Label htmlFor="approve">
                            Approve Dispute Reversal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="reject" id="reject" />
                          <Label htmlFor="reject">
                            Reject Dispute Reversal
                          </Label>
                        </div>
                      </RadioGroup>

                      <Button onClick={handleSubmitVote} className="w-full">
                        Submit Vote
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisputePage;
