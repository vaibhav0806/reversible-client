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
  from_wallet: string;
  to_wallet: string;
  created_at: string;
  state: string;
}

type Props = {
  params: {
    id: string;
  };
};

const DisputePage = ({ params }: Props) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [isJudge, setIsJudge] = useState<boolean>(false);
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

  // Voting data (mock for now)
  const [votingData, setVotes] = useState({
    "status": "success",
    "data": {
      "yes": 0,
      "no": 0
    }
  });

  const isVotingPeriodComplete = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const oneDayLater = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
    return new Date() > oneDayLater;
  };

  useEffect(() => {
    const fetchSenderTransactionHistory = async () => {
      if (transaction?.from_wallet) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-sent-transactions/${transaction?.from_wallet}`
        );
        const responseWait = await response.json();
        const data = responseWait.data.slice(0, 5);

        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-received-transactions/${transaction?.from_wallet}`
        );
        const responseWait2 = await response2.json();
        const data2 = responseWait2.data.slice(0, 5);

        setSenderTransactions([...data, ...data2]);
      }
    };

    const fetchReceiverTransactionHistory = async () => {
      if (transaction?.to_wallet) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-sent-transactions/${transaction?.to_wallet}`
        );
        const responseWait = await response.json();
        const data = responseWait.data.slice(0, 5);

        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-user-received-transactions/${transaction?.to_wallet}`
        );
        const responseWait2 = await response2.json();
        const data2 = responseWait2.data.slice(0, 5);

        setReceiverTransactions([...data, ...data2]);
      }
    };

    if (transaction) {
      fetchSenderTransactionHistory();
      fetchReceiverTransactionHistory();
    }
  }, [transaction]);

  useEffect(() => {
    const fetchDispute = async () => {
      if (params.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/disputes/get-dispute/${params.id}`
          );
          const responseWait = await response.json();
          const data = responseWait.data[0];

          if (response.ok) {
            setDispute(data);
          } else {
            console.error("Error fetching dispute:", data);
          }
        } catch (error) {
          console.error("Error fetching dispute data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDispute();
  }, [params.id]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (dispute?.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/disputes/getVotes/${dispute?.id}`
          );
          const responseWait = await response.json();
          const data = responseWait.data[0];

          if (response.ok) {
            setVotes(data);
          } else {
            console.error("Error fetching votes:", data);
          }
        } catch (error) {
          console.error("Error fetching votes data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchVotes();
  }, [dispute]);

  const vote = async () => {
    try {
      const payload = {
        wallet: {
          address_id: JSON.parse(localStorage.getItem("walletData")!).address_id,
          wallet_id: JSON.parse(localStorage.getItem("walletData")!).wallet_id,
          network_id: JSON.parse(localStorage.getItem("walletData")!).network_id,
        },
        request: {
          dispute_id: dispute?.id,
          vote: voteDecision,
        },
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/judges/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const responseWait = await response.json();

      if (!response.ok) {
        console.error("Error fetching vote:", responseWait);
      }
    } catch (error) {
      console.error("Error fetching vote data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (dispute?.transactionId) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/get-transactions/${dispute?.transactionId}`
          );
          const responseWait = await response.json();
          const data = responseWait.data[0];

          if (response.ok) {
            setTransaction(data);
          } else {
            console.error("Error fetching dispute:", data);
          }
        } catch (error) {
          console.error("Error fetching dispute data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransaction();
  }, [dispute]);

  useEffect(() => {
    const fetchIsJudge = async () => {
      try {
        const payload = {
          address_id: JSON.parse(localStorage.getItem("walletData")!).address_id,
          wallet_id: JSON.parse(localStorage.getItem("walletData")!).wallet_id,
          network_id: JSON.parse(localStorage.getItem("walletData")!).network_id,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/isJudge`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const responseWait = await response.json();
        console.log("judge is :", responseWait);
        setIsJudge(responseWait.data)

        if (response.ok && responseWait.data === true) {
          setIsJudge(true);
        } else {
          console.error("Error checking judge status:", responseWait);
        }
      } catch (error) {
        console.error("Error fetching judge data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (transaction) {
      fetchIsJudge();
    }
  }, [transaction]);

  const formatWalletAddress = (address: string) => {
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return "";
  };

  const renderTransactionHistory = (transactions: Transaction[]) => {
    return transactions.map((tx: any) => (
      <Card key={tx.id} className="mb-2">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">
                {formatWalletAddress(tx.from_wallet)} →{" "}
                {formatWalletAddress(tx.to_wallet)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${tx.amount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  // Show a nice loader screen when data is fetching, now on a white background
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-emerald-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-emerald-500 border-r-emerald-500 border-b-emerald-300 border-l-emerald-300 animate-spin rounded-full"></div>
          </div>
          <div className="text-emerald-700 font-semibold">Loading dispute...</div>
          <div className="text-gray-600 text-sm">
            Please hold on while we gather the necessary information.
          </div>
        </div>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <h2 className="text-center text-gray-600">No dispute found.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="grid grid-cols-2 gap-8">
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              {transaction ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{transaction?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span>
                      {transaction?.from_wallet.slice(0, 6) +
                        "..." +
                        transaction?.from_wallet.slice(
                          transaction?.from_wallet.length - 5,
                          transaction?.from_wallet.length
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span>
                      {transaction?.to_wallet.slice(0, 6) +
                        "..." +
                        transaction?.to_wallet.slice(
                          transaction?.to_wallet.length - 5,
                          transaction?.to_wallet.length
                        )}
                    </span>
                  </div>
                </div>
              ) : (
                <>No transaction details found</>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Approve</span>
                    {isVotingPeriodComplete(dispute.created_at) && (
                      <span>{votingData.data.yes}</span>
                    )}
                  </div>
                  <Progress
                    value={
                      isVotingPeriodComplete(dispute.created_at)
                        ? votingData.data.yes
                        : 0
                    }
                    className={`h-2 ${
                      !isVotingPeriodComplete(dispute.created_at)
                        ? "bg-gray-300"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Reject</span>
                    {isVotingPeriodComplete(dispute.created_at) && (
                      <span>{votingData.data.no}</span>
                    )}
                  </div>
                  <Progress
                    value={
                      isVotingPeriodComplete(dispute.created_at)
                        ? votingData.data.no
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

                  {senderTransactions.length > 0 && (
                    <TabsContent value="sender-history">
                      <div className="max-h-[400px] overflow-y-auto">
                        {renderTransactionHistory(senderTransactions)}
                      </div>
                    </TabsContent>
                  )}

                  {receiverTransactions.length > 0 && (
                    <TabsContent value="receiver-history">
                      <div className="max-h-[400px] overflow-y-auto">
                        {renderTransactionHistory(receiverTransactions)}
                      </div>
                    </TabsContent>
                  )}

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

                      <Button onClick={vote} className="w-full">
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
